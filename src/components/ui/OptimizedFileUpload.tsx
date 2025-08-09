import React, { useState, useCallback, useRef } from 'react';
import { Upload, File, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface OptimizedFileUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
  compress?: boolean;
  compressionQuality?: number;
  chunkSize?: number; // in KB
  bucket?: string;
  folder?: string;
  className?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

interface FileUploadState {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedFile?: UploadedFile;
  abortController?: AbortController;
}

const OptimizedFileUpload: React.FC<OptimizedFileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  acceptedTypes = ['*/*'],
  maxFileSize = 10, // 10MB default
  maxFiles = 5,
  compress = true,
  compressionQuality = 0.8,
  chunkSize = 1024, // 1MB chunks
  bucket = 'uploads',
  folder = 'documents',
  className = ''
}) => {
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // Initialize service worker for file processing
  React.useEffect(() => {
    // Register service worker if not already registered
    if ('serviceWorker' in navigator && !workerRef.current) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          workerRef.current = registration.active as any;
        }
      });
    }
  }, []);

  const generateFileId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type
    if (acceptedTypes.length > 0 && !acceptedTypes.includes('*/*')) {
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const compressFile = async (file: File): Promise<File> => {
    if (!compress || !file.type.startsWith('image/')) {
      return file;
    }

    try {
      // Use service worker for compression if available
      if (workerRef.current && 'MessageChannel' in window) {
        const channel = new MessageChannel();
        
        return new Promise((resolve, reject) => {
          channel.port1.onmessage = (event) => {
            if (event.data.type === 'OPTIMIZATION_COMPLETE') {
              resolve(new File([event.data.data], file.name, { type: 'image/jpeg' }));
            } else if (event.data.type === 'OPTIMIZATION_ERROR') {
              reject(new Error(event.data.error));
            }
          };

          workerRef.current?.postMessage({
            type: 'UPLOAD_OPTIMIZATION',
            fileData: file,
            options: { compress: true, quality: compressionQuality }
          }, [channel.port2]);
        });
      }

      // Fallback to main thread compression
      return await compressImageMainThread(file, compressionQuality);
    } catch (error) {
      console.warn('Compression failed, using original file:', error);
      return file;
    }
  };

  const compressImageMainThread = (file: File, quality: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate scaled dimensions (max 1920x1080)
        const maxWidth = 1920;
        const maxHeight = 1080;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          } else {
            reject(new Error('Compression failed'));
          }
        }, 'image/jpeg', quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadFileInChunks = async (file: File, fileId: string): Promise<UploadedFile> => {
    const filePath = `${folder}/${fileId}_${file.name}`;
    const abortController = new AbortController();

    // Update file state with abort controller
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, abortController } : f
    ));

    // For small files, upload directly
    if (file.size <= chunkSize * 1024) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        path: filePath
      };
    }

    // For large files, use chunked upload
    const chunks = Math.ceil(file.size / (chunkSize * 1024));
    let uploadedBytes = 0;

    for (let i = 0; i < chunks; i++) {
      if (abortController.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      const start = i * chunkSize * 1024;
      const end = Math.min(start + chunkSize * 1024, file.size);
      const chunk = file.slice(start, end);
      
      const chunkPath = `${filePath}.part${i}`;
      
      const { error } = await supabase.storage
        .from(bucket)
        .upload(chunkPath, chunk, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      uploadedBytes += chunk.size;
      const progress = Math.round((uploadedBytes / file.size) * 100);

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));
    }

    // Combine chunks (this would require a backend endpoint in a real implementation)
    // For now, we'll upload the complete file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Clean up chunk files
    for (let i = 0; i < chunks; i++) {
      const chunkPath = `${filePath}.part${i}`;
      await supabase.storage.from(bucket).remove([chunkPath]);
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: urlData.publicUrl,
      path: filePath
    };
  };

  const processFile = async (file: File) => {
    const fileId = generateFileId();
    const validation = validateFile(file);

    if (validation) {
      setFiles(prev => [...prev, {
        file,
        id: fileId,
        progress: 0,
        status: 'error',
        error: validation
      }]);
      return;
    }

    // Add file to state
    setFiles(prev => [...prev, {
      file,
      id: fileId,
      progress: 0,
      status: 'pending'
    }]);

    try {
      // Compress file if needed
      const processedFile = await compressFile(file);

      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'uploading' as const, progress: 1 } : f
      ));

      // Upload file
      const uploadedFile = await uploadFileInChunks(processedFile, fileId);

      // Update status to completed
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'completed' as const, 
          progress: 100,
          uploadedFile 
        } : f
      ));

      // Notify parent component
      onUploadComplete?.([uploadedFile]);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error' as const, 
          error: errorMessage 
        } : f
      ));

      onUploadError?.(errorMessage);
    }
  };

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    
    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Process each file
    fileArray.forEach(processFile);
  }, [files.length, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.abortController) {
        file.abortController.abort();
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const retryUpload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      processFile(file.file);
    }
  };

  const getStatusIcon = (status: FileUploadState['status']) => {
    switch (status) {
      case 'pending':
        return <File className="w-4 h-4 text-blue-500" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Upload className={`w-12 h-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-lg font-medium">
                {isDragging ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse files
                </Button>
              </p>
            </div>
            {acceptedTypes.length > 0 && !acceptedTypes.includes('*/*') && (
              <p className="text-xs text-muted-foreground">
                Accepted: {acceptedTypes.join(', ')} • Max {maxFileSize}MB
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.id} className="p-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(file.status)}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="mt-1 h-1" />
                  )}
                  
                  {file.error && (
                    <Alert className="mt-2 py-1">
                      <AlertDescription className="text-xs">
                        {file.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex space-x-1">
                  {file.status === 'error' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => retryUpload(file.id)}
                    >
                      Retry
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptimizedFileUpload;