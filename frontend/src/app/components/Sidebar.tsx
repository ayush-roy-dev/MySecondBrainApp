import { useState } from 'react';
import { Brain, Upload, FileText, Search, Plus, File, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Link, useNavigate } from 'react-router';
import { ThemeToggle } from './ThemeToggle';
import { useDocument } from '../contexts/DocumentContext';

interface Document {
  id: string;
  name: string;
  date: string;
}

export function Sidebar() {
  const navigate = useNavigate();
  const { setPendingFile } = useDocument();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Research Paper.pdf', date: '2026-03-15' },
    { id: '2', name: 'Meeting Notes.pdf', date: '2026-03-18' },
    { id: '3', name: 'Project Plan.pdf', date: '2026-03-19' },
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search');
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if dragged item contains files
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're leaving the sidebar
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0 && droppedFiles[0].type === 'application/pdf') {
      // Set the pending file in context
      setPendingFile(droppedFiles[0]);
      
      // Navigate to the main page where PDFViewer will pick it up
      navigate('/');
    }
  };

  return (
    <div 
      className={`
        flex flex-col h-full bg-muted/30 border-r transition-all duration-200
        ${isDragOver ? 'bg-primary/5 border-primary' : ''}
      `}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg flex items-center justify-center pointer-events-none z-50 m-2">
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto mb-2 text-primary animate-bounce" />
            <p className="text-sm font-medium text-primary">Drop to upload</p>
          </div>
        </div>
      )}

      {/* App Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-semibold">Second Brain App</h1>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="p-4 space-y-2">
        <Button variant="default" className="w-full justify-start" size="sm" onClick={() => navigate('/')}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
        <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => navigate('/new-note')}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Note
        </Button>
      </div>

      <Separator />

      {/* Global Search */}
      <div className="p-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search everything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigate('/search')}
              className="pl-8"
            />
          </div>
        </form>
      </div>

      <Separator />

      {/* Recent Documents */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Documents</h3>
        </div>
        <ScrollArea className="h-full px-2">
          <div className="space-y-1 pb-4">
            {documents
              .filter(doc => 
                searchQuery === '' || 
                doc.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((doc) => (
                <button
                  key={doc.id}
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left transition-colors"
                >
                  <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.date).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}