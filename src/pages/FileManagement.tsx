import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OptimizedFileUpload from '@/components/ui/OptimizedFileUpload';
import OptimizedDownload from '@/components/ui/OptimizedDownload';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Zap, Shield, Clock, CheckCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

const FileManagement: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Sample download items for demonstration
  const sampleDownloads = [
    {
      id: '1',
      name: 'shipping-manifest-december.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      size: 1024 * 500, // 500KB
      type: 'application/pdf',
      description: 'December 2024 shipping manifest with all international orders'
    },
    {
      id: '2',
      name: 'inventory-report-q4.xlsx',
      url: 'https://file-examples.com/storage/fe68c8fa6197127fd9c8832/2017/10/file_example_XLS_10.xls',
      size: 1024 * 1024 * 2, // 2MB
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      description: 'Q4 2024 inventory levels and stock analysis'
    },
    {
      id: '3',
      name: 'customs-documentation.zip',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip',
      size: 1024 * 1024 * 15, // 15MB
      type: 'application/zip',
      description: 'Complete customs documentation package for international shipments'
    }
  ];

  const handleUploadComplete = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    console.log('Upload completed:', files);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  const handleDownloadComplete = (item: any) => {
    console.log('Download completed:', item);
  };

  const handleDownloadError = (error: string, item: any) => {
    console.error('Download error:', error, item);
  };

  return (
    <PageLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Optimized File Management</h1>
          <p className="text-muted-foreground">
            Fast, reliable file uploads and downloads for your supply chain operations
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <Badge variant="secondary" className="gap-1">
              <Zap className="w-3 h-3" />
              High Performance
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Shield className="w-3 h-3" />
              Secure Transfer
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" />
              Progress Tracking
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              Reliable
            </Badge>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <CardTitle>Optimized Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm space-y-1">
                <li>• Chunked uploads for large files</li>
                <li>• Automatic image compression</li>
                <li>• Progress tracking with speed/ETA</li>
                <li>• Drag & drop interface</li>
                <li>• Resume failed uploads</li>
                <li>• Multiple file support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Download className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <CardTitle>Fast Downloads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm space-y-1">
                <li>• Parallel download processing</li>
                <li>• Resume interrupted downloads</li>
                <li>• Real-time progress tracking</li>
                <li>• Bulk download capabilities</li>
                <li>• Speed and ETA indicators</li>
                <li>• Error recovery mechanisms</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* File Management Interface */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="download" className="gap-2">
              <Download className="w-4 h-4" />
              Download Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload shipping manifests, invoices, customs documentation, and other files
                </p>
              </CardHeader>
              <CardContent>
                <OptimizedFileUpload
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  acceptedTypes={[
                    'application/pdf',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'text/csv',
                    'image/*',
                    'application/zip'
                  ]}
                  maxFileSize={50} // 50MB
                  maxFiles={10}
                  compress={true}
                  compressionQuality={0.8}
                  chunkSize={1024} // 1MB chunks
                  bucket="uploads"
                  folder="documents"
                />
              </CardContent>
            </Card>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recently Uploaded Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                          </p>
                        </div>
                        <Badge variant="secondary">Uploaded</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="download" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Downloads</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Download reports, documentation, and other business files
                </p>
              </CardHeader>
              <CardContent>
                <OptimizedDownload
                  items={sampleDownloads}
                  onDownloadComplete={handleDownloadComplete}
                  onDownloadError={handleDownloadError}
                  enableBulkDownload={true}
                  compressionEnabled={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Upload Optimizations</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Service Worker file processing</li>
                  <li>• Automatic image compression</li>
                  <li>• Chunked uploads for reliability</li>
                  <li>• Background retry mechanisms</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Download Optimizations</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Parallel processing</li>
                  <li>• Resume interrupted downloads</li>
                  <li>• Signed URLs for performance</li>
                  <li>• Progress tracking with ETA</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">App Performance</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Service Worker caching</li>
                  <li>• Lazy loading components</li>
                  <li>• Optimized bundle splitting</li>
                  <li>• PWA offline support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FileManagement;