import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

export function GlobalDragOverlay() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      // Only show overlay if files are being dragged
      if (e.dataTransfer?.types.includes('Files')) {
        setDragCounter(prev => prev + 1);
        setIsDragging(true);
      }
    };

    const handleDragLeave = () => {
      setDragCounter(prev => {
        const newCounter = prev - 1;
        if (newCounter === 0) {
          setIsDragging(false);
        }
        return newCounter;
      });
    };

    const handleDrop = () => {
      setDragCounter(0);
      setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // Prevent default to allow drop
    };

    // Add event listeners to document
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragover', handleDragOver);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] pointer-events-none flex items-center justify-center">
      <div className="border-4 border-primary border-dashed rounded-2xl p-12 bg-background/90 animate-in fade-in zoom-in duration-200">
        <Upload className="h-20 w-20 mx-auto mb-4 text-primary animate-bounce" />
        <p className="text-2xl font-semibold text-primary text-center">Drop PDF anywhere to upload</p>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Drop on sidebar or PDF viewer area
        </p>
      </div>
    </div>
  );
}
