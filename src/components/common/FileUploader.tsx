import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { UploadIcon, XIcon, FileIcon, CheckCircleIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  uploadProgress?: number;
  isUploading?: boolean;
  className?: string;
}

/**
 * Drag & drop file uploader with progress tracking
 */
export function FileUploader({ 
  onFileSelect,
  accept = '*',
  maxSizeMB = 10,
  uploadProgress = 0,
  isUploading = false,
  className = '' 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  /**
   * Validate file size
   */
  const validateFile = useCallback((file: File): boolean => {
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }
    setError(null);
    return true;
  }, [maxSizeMB, maxSizeBytes]);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect, validateFile]);

  /**
   * Handle drag events
   */
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Handle file input change
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Clear selected file
   */
  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={className}>
      <Card 
        className={`p-8 border-2 border-dashed transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border bg-card'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <UploadIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Drop your file here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse (max {maxSizeMB}MB)
            </p>
            <input
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild>
                <span>Select File</span>
              </Button>
            </label>
            {error && (
              <p className="text-sm text-red-500 mt-4">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded">
                <FileIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 w-8 p-0"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-foreground font-medium">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadProgress === 100 && !isUploading && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Upload complete!</span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
