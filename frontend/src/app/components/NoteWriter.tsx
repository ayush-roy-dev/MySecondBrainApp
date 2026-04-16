import { useState, useRef, useEffect } from 'react';
import { Save, Download, FileText, Type, Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export function NoteWriter() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  const updateCounts = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      setCharCount(text.length);
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    updateCounts();
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateCounts();
  };

  const handleBold = () => applyFormat('bold');
  const handleItalic = () => applyFormat('italic');
  const handleUnorderedList = () => applyFormat('insertUnorderedList');
  const handleOrderedList = () => applyFormat('insertOrderedList');
  const handleHeading = () => applyFormat('formatBlock', 'h2');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        handleBold();
      } else if (e.key === 'i') {
        e.preventDefault();
        handleItalic();
      }
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = '';
    }
  }, []);

  const handleSave = () => {
    // Mock save functionality
    const htmlContent = editorRef.current?.innerHTML || '';
    console.log('Saving note:', { title, content: htmlContent });
    alert('Note saved successfully!');
  };

  const handleDownload = () => {
    // Create a downloadable HTML file
    const element = document.createElement('a');
    const htmlContent = editorRef.current?.innerHTML || '';
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title || 'Note'}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { margin-top: 1.5em; }
  </style>
</head>
<body>
  <h1>${title || 'Untitled Note'}</h1>
  ${htmlContent}
</body>
</html>`;
    const file = new Blob([fullHtml], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${title || 'note'}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg border-0 shadow-none focus-visible:ring-0 px-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleBold}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleItalic}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleUnorderedList}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleOrderedList}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleHeading}
            title="Heading"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            className="min-h-[500px] text-base leading-relaxed outline-none max-w-none
                       [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground
                       [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3
                       [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4
                       [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4
                       [&_li]:my-1
                       [&_b]:font-bold [&_strong]:font-bold
                       [&_i]:italic [&_em]:italic
                       [&_p]:my-2"
            data-placeholder="Start writing your note..."
            suppressContentEditableWarning
          />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Last saved: Never</span>
          </div>
        </div>
      </div>
    </div>
  );
}
