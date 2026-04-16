import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Upload, ZoomIn, ZoomOut, Grid, List, FileX } from 'lucide-react';
import { Button } from './ui/button';
import { useDocument } from '../contexts/DocumentContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  onTextExtracted?: (text: string) => void;
}

export function PDFViewer({ onTextExtracted }: PDFViewerProps) {
  const { pendingFile, setPendingFile, setDocumentName } = useDocument();
  const [file, setFile] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('single');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showNameDialog, setShowNameDialog] = useState<boolean>(false);
  const [tempFileName, setTempFileName] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');

  // Check for pending file from context (e.g., dropped on sidebar)
  useEffect(() => {
    if (pendingFile) {
      handleFile(pendingFile);
      setPendingFile(null); // Clear the pending file
    }
  }, [pendingFile, setPendingFile]);

  // Pre-fill input name when dialog opens
  useEffect(() => {
    if (showNameDialog && tempFileName) {
      // Remove .pdf extension if it exists
      const nameWithoutExt = tempFileName.replace(/\.pdf$/i, '');
      setInputName(nameWithoutExt);
    }
  }, [showNameDialog, tempFileName]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function handleFile(selectedFile: File) {
    setError(null);
    
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      const errorMsg = 'Please upload a valid PDF file';
      setError(errorMsg);
      toast.error('Invalid file type', {
        description: errorMsg,
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      const errorMsg = 'File size exceeds 50MB limit';
      setError(errorMsg);
      toast.error('File too large', {
        description: errorMsg,
      });
      return;
    }

    const fileURL = URL.createObjectURL(selectedFile);
    setFile(fileURL);
    setTempFileName(selectedFile.name);
    setShowNameDialog(true);
    
    // Show success toast
    toast.success('PDF loaded successfully', {
      description: `${selectedFile.name} is ready to view`,
    });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set isDragging to false if we're leaving the container
    // Check if the related target is outside this component
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => Math.min(Math.max(prevPageNumber + offset, 1), numPages));
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prev => Math.min(prev + 0.2, 3));
  }

  function zoomOut() {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  }

  function saveName() {
    if (inputName.trim() === '') {
      toast.error('Name cannot be empty');
      return;
    }
    setDocumentName(inputName);
    setShowNameDialog(false);
  }

  return (
    <div 
      className="flex flex-col h-full"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b flex items-center justify-between gap-2 bg-background">
        <div className="flex items-center gap-2">
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {file && (
            <div className="flex items-center gap-1 ml-2 border rounded-md">
              <Button
                variant={viewMode === 'single' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('single')}
                title="Single page view"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'continuous' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('continuous')}
                title="Continuous scroll view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {file && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {file && numPages > 0 && viewMode === 'single' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[80px] text-center">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {file && numPages > 0 && viewMode === 'continuous' && (
          <span className="text-sm text-muted-foreground">
            {numPages} pages
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className={`p-4 min-h-full ${!file ? 'flex items-center justify-center' : ''}`}>
          {!file ? (
            <div 
              className={`
                text-center text-muted-foreground border-2 border-dashed rounded-lg p-12
                transition-all duration-200
                ${isDragging 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-muted-foreground/30 hover:border-muted-foreground/50'
                }
              `}
            >
              {isDragging ? (
                <>
                  <Upload className="h-16 w-16 mx-auto mb-4 text-primary animate-bounce" />
                  <p className="text-lg font-medium text-primary">Drop your PDF here</p>
                  <p className="text-sm mt-2">Release to upload</p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Drag and drop a PDF file here</p>
                  <p className="text-xs mt-2">or click the Upload button above</p>
                  <p className="text-xs mt-4 text-muted-foreground/60">
                    Supports single page and continuous scroll modes • Max 50MB
                  </p>
                </>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2 justify-center">
                  <FileX className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className={`
              inline-block
              ${isDragging ? 'opacity-50 pointer-events-none' : ''}
            `}>
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {viewMode === 'single' ? (
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                ) : (
                  <div className="space-y-4">
                    {Array.from(new Array(numPages), (_, index) => (
                      <div key={`page_${index + 1}`} className="border rounded shadow-sm">
                        <Page
                          pageNumber={index + 1}
                          scale={scale}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                        />
                        <div className="text-center py-2 bg-muted/30 text-sm text-muted-foreground border-t">
                          Page {index + 1} of {numPages}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Document>
            </div>
          )}
        </div>
      </div>
      
      {/* Drag overlay when file is already loaded */}
      {file && isDragging && (
        <div className="absolute inset-0 bg-primary/10 border-4 border-primary border-dashed rounded-lg flex items-center justify-center pointer-events-none z-50">
          <div className="text-center">
            <Upload className="h-16 w-16 mx-auto mb-4 text-primary animate-bounce" />
            <p className="text-lg font-medium text-primary">Drop to replace current PDF</p>
          </div>
        </div>
      )}

      {/* Name dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your PDF</DialogTitle>
            <DialogDescription>
              Give this document a name to help you find it later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputName.trim() !== '') {
                  saveName();
                }
              }}
              placeholder={tempFileName}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNameDialog(false);
                setInputName('');
              }}
            >
              Skip
            </Button>
            <Button
              type="button"
              onClick={saveName}
              disabled={inputName.trim() === ''}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}