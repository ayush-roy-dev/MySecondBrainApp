import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Mock AI responses based on keywords
const getMockResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
    return "Based on the PDF, here's a summary: This document covers key concepts in data analysis, including statistical methods, visualization techniques, and best practices for interpreting results. The main sections focus on methodology, experimental design, and conclusions drawn from the research.";
  }
  
  if (lowerMessage.includes('key point') || lowerMessage.includes('main point')) {
    return "The key points from the document are:\n1. Statistical significance testing is crucial for validating hypotheses\n2. Proper data visualization enhances understanding\n3. Reproducibility requires clear documentation\n4. Sample size affects the reliability of results";
  }
  
  if (lowerMessage.includes('page') && /\d+/.test(lowerMessage)) {
    const pageNum = lowerMessage.match(/\d+/)?.[0];
    return `On page ${pageNum}, the document discusses specific methodological approaches, including data collection techniques and analytical frameworks used in the study.`;
  }
  
  if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
    return "This concept refers to a statistical or analytical approach used in the research. It's designed to provide insights into patterns and relationships within the data. Would you like me to elaborate on a specific aspect?";
  }
  
  return "I'd be happy to help you understand this document better. Could you be more specific about what you'd like to know? You can ask me to summarize sections, explain concepts, or find specific information.";
};

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m here to help you understand the PDF. You can ask me questions about the content, request summaries, or have me explain specific sections.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(userMessage.content),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(question),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background">
        <h2>Ask AI about PDF</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Get instant answers about your document
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about the PDF..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickQuestion("Summarize this document")}
            className="text-xs px-2 py-1 bg-muted rounded hover:bg-accent transition-colors"
          >
            Summarize document
          </button>
          <button
            onClick={() => handleQuickQuestion("What are the key points?")}
            className="text-xs px-2 py-1 bg-muted rounded hover:bg-accent transition-colors"
          >
            Key points
          </button>
          <button
            onClick={() => handleQuickQuestion("Explain the main concept")}
            className="text-xs px-2 py-1 bg-muted rounded hover:bg-accent transition-colors"
          >
            Main concept
          </button>
        </div>
      </div>
    </div>
  );
}