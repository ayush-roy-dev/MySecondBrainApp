import { useState } from "react";
import { Search, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your knowledge base..."
          className="w-full pl-12 pr-32 py-4 text-base border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Search
        </button>
      </div>
      
      {/* Quick suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Try:</span>
        {[
          "machine learning basics",
          "project management",
          "climate change impact",
          "quantum computing"
        ].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion);
            }}
            className="text-sm px-3 py-1 bg-card border border-border rounded-full hover:bg-accent transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </form>
  );
}