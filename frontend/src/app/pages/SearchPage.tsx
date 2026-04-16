import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { RelatedTopicsGraph } from "../components/RelatedTopicsGraph";
import { AISummary } from "../components/AISummary";
import { Search } from "lucide-react";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setHasSearched(true);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Search Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">
          Search across all your documents, notes, and knowledge
        </p>
      </div>

      {/* Search Bar Section */}
      <div className="px-6 py-6 border-b border-border bg-muted/30">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Results Section */}
      {!hasSearched ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Start Searching Your Knowledge Base
            </h2>
            <p className="text-muted-foreground max-w-md">
              Enter a query above to search across all your documents and notes. 
              Get instant results with AI-powered summaries.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* AI Summary */}
            <AISummary query={query} />

            {/* Two Column Layout for Results and Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Related Documents */}
              <SearchResults query={query} />

              {/* Related Topics Graph */}
              <RelatedTopicsGraph query={query} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}