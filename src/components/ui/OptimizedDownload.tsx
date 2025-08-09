import React, { useState, useCallback } from 'react';
import { Download, File, Loader2, CheckCircle, AlertCircle, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface DownloadItem {
  id: string;
  name: string;
  url: string;
  size?: number;
  type?: string;
  description?: string;
}

interface OptimizedDownloadProps {
  items: DownloadItem[];
  onDownloadComplete?: (item: DownloadItem) => void;
  onDownloadError?: (error: string, item: DownloadItem) => void;
  enableBulkDownload?: boolean;
  compressionEnabled?: boolean;
  className?: string;
}

interface DownloadState {
  item: DownloadItem;
  progress: number;
  status: 'idle' | 'downloading' | 'paused' | 'completed' | 'error';
  error?: string;
  abortController?: AbortController;
  downloadedBytes?: number;
  totalBytes?: number;
  speed?: number; // bytes per second
  eta?: number; // seconds
}

const OptimizedDownload: React.FC<OptimizedDownloadProps> = ({
  items,
  onDownloadComplete,
  onDownloadError,
  enableBulkDownload = true,
  compressionEnabled = false,
  className = ''
}) => {
  const [downloads, setDownloads] = useState<Record<string, DownloadState>>({});
  const [bulkDownloadInProgress, setBulkDownloadInProgress] = useState(false);

  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`;
    if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
  };

  const formatETA = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const downloadWithProgress = async (
    item: DownloadItem,
    onProgress: (progress: number, downloadedBytes: number, totalBytes: number, speed: number) => void
  ): Promise<Blob> => {
    const abortController = new AbortController();
    
    // Update download state with abort controller
    setDownloads(prev => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        abortController,
        status: 'downloading'
      }
    }));

    try {
      // Try to get file info from Supabase storage first
      let finalUrl = item.url;
      let totalBytes = item.size || 0;

      // If it's a Supabase storage URL, get signed URL for better performance
      if (item.url.includes('supabase') && item.url.includes('/storage/')) {
        try {
          const pathMatch = item.url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
          if (pathMatch) {
            const [, bucket, path] = pathMatch;
            const { data } = await supabase.storage
              .from(bucket)
              .createSignedUrl(path, 3600); // 1 hour expiry

            if (data?.signedUrl) {
              finalUrl = data.signedUrl;
            }
          }
        } catch (error) {
          console.warn('Failed to get signed URL, using original URL:', error);
        }
      }

      const response = await fetch(finalUrl, {
        signal: abortController.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      totalBytes = contentLength ? parseInt(contentLength) : totalBytes;

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let downloadedBytes = 0;
      let lastProgressUpdate = Date.now();
      let lastDownloadedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        downloadedBytes += value.length;

        // Calculate speed and ETA
        const now = Date.now();
        const timeDiff = (now - lastProgressUpdate) / 1000; // seconds

        if (timeDiff >= 0.5) { // Update every 500ms
          const bytesDiff = downloadedBytes - lastDownloadedBytes;
          const speed = bytesDiff / timeDiff;

          lastProgressUpdate = now;
          lastDownloadedBytes = downloadedBytes;

          const progress = totalBytes > 0 ? (downloadedBytes / totalBytes) * 100 : 0;
          onProgress(progress, downloadedBytes, totalBytes, speed);
        }
      }

      // Final progress update
      const progress = 100;
      onProgress(progress, downloadedBytes, totalBytes, 0);

      // Combine chunks into single blob
      const blob = new Blob(chunks);
      return blob;

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Download cancelled');
      }
      throw error;
    }
  };

  const startDownload = async (item: DownloadItem) => {
    setDownloads(prev => ({
      ...prev,
      [item.id]: {
        item,
        progress: 0,
        status: 'downloading',
        downloadedBytes: 0,
        totalBytes: item.size || 0,
        speed: 0,
        eta: 0
      }
    }));

    try {
      const blob = await downloadWithProgress(
        item,
        (progress, downloadedBytes, totalBytes, speed) => {
          const eta = speed > 0 ? (totalBytes - downloadedBytes) / speed : 0;

          setDownloads(prev => ({
            ...prev,
            [item.id]: {
              ...prev[item.id],
              progress,
              downloadedBytes,
              totalBytes,
              speed,
              eta
            }
          }));
        }
      );

      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloads(prev => ({
        ...prev,
        [item.id]: {
          ...prev[item.id],
          status: 'completed',
          progress: 100
        }
      }));

      onDownloadComplete?.(item);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed';
      
      setDownloads(prev => ({
        ...prev,
        [item.id]: {
          ...prev[item.id],
          status: 'error',
          error: errorMessage
        }
      }));

      onDownloadError?.(errorMessage, item);
    }
  };

  const pauseDownload = (itemId: string) => {
    const download = downloads[itemId];
    if (download?.abortController) {
      download.abortController.abort();
      setDownloads(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          status: 'paused'
        }
      }));
    }
  };

  const resumeDownload = (itemId: string) => {
    const download = downloads[itemId];
    if (download) {
      startDownload(download.item);
    }
  };

  const cancelDownload = (itemId: string) => {
    const download = downloads[itemId];
    if (download?.abortController) {
      download.abortController.abort();
    }
    
    setDownloads(prev => {
      const { [itemId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const downloadAll = async () => {
    if (bulkDownloadInProgress) return;

    setBulkDownloadInProgress(true);

    try {
      // Download all items sequentially to avoid overwhelming the browser
      for (const item of items) {
        if (!downloads[item.id] || downloads[item.id].status !== 'completed') {
          await startDownload(item);
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Bulk download error:', error);
    } finally {
      setBulkDownloadInProgress(false);
    }
  };

  const getStatusIcon = (status: DownloadState['status']) => {
    switch (status) {
      case 'downloading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: DownloadState['status']) => {
    const variants = {
      idle: 'secondary',
      downloading: 'default',
      paused: 'secondary',
      completed: 'secondary',
      error: 'destructive'
    } as const;

    const labels = {
      idle: 'Ready',
      downloading: 'Downloading',
      paused: 'Paused',
      completed: 'Completed',
      error: 'Error'
    };

    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with bulk download */}
      {items.length > 1 && enableBulkDownload && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Downloads ({items.length} files)</h3>
          <Button
            onClick={downloadAll}
            disabled={bulkDownloadInProgress}
            className="gap-2"
          >
            {bulkDownloadInProgress ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download All
          </Button>
        </div>
      )}

      {/* Download Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const download = downloads[item.id];
          
          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(download?.status || 'idle')}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      {getStatusBadge(download?.status || 'idle')}
                    </div>

                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}

                    {item.size && (
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(item.size)}
                      </p>
                    )}

                    {download?.status === 'downloading' && (
                      <div className="space-y-1">
                        <Progress value={download.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {download.downloadedBytes && download.totalBytes
                              ? `${formatFileSize(download.downloadedBytes)} / ${formatFileSize(download.totalBytes)}`
                              : `${download.progress.toFixed(1)}%`
                            }
                          </span>
                          {download.speed && download.speed > 0 && (
                            <span>
                              {formatSpeed(download.speed)}
                              {download.eta && download.eta > 0 && ` • ${formatETA(download.eta)}`}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {download?.error && (
                      <Alert className="mt-2 py-1">
                        <AlertDescription className="text-xs">
                          {download.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    {!download || download.status === 'idle' || download.status === 'error' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startDownload(item)}
                        className="gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    ) : download.status === 'downloading' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => pauseDownload(item.id)}
                        className="gap-1"
                      >
                        <Pause className="w-3 h-3" />
                        Pause
                      </Button>
                    ) : download.status === 'paused' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resumeDownload(item.id)}
                        className="gap-1"
                      >
                        <Play className="w-3 h-3" />
                        Resume
                      </Button>
                    ) : download.status === 'completed' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startDownload(item)}
                        className="gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Re-download
                      </Button>
                    ) : null}

                    {download && download.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => cancelDownload(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No files available for download</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedDownload;