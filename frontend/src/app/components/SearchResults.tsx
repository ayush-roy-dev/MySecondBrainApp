import { FileText, Calendar, Tag, Star } from "lucide-react";

interface SearchResultsProps {
  query: string;
}

interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  snippet: string;
  relevance: number;
  tags: string[];
  isFavorite?: boolean;
}

export function SearchResults({ query }: SearchResultsProps) {
  // Mock search results based on the query
  const getMockResults = (searchQuery: string): Document[] => {
    const allDocuments: Document[] = [
      {
        id: "1",
        title: "Introduction to Machine Learning",
        type: "PDF",
        date: "2026-02-15",
        snippet: "Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data...",
        relevance: 98,
        tags: ["AI", "Machine Learning", "Tutorial"],
        isFavorite: true
      },
      {
        id: "2",
        title: "Neural Networks Deep Dive",
        type: "Note",
        date: "2026-03-01",
        snippet: "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information using a connectionist approach...",
        relevance: 95,
        tags: ["Neural Networks", "Deep Learning", "AI"]
      },
      {
        id: "3",
        title: "Supervised vs Unsupervised Learning",
        type: "PDF",
        date: "2026-01-20",
        snippet: "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data. Each approach has distinct use cases and applications...",
        relevance: 92,
        tags: ["Machine Learning", "Classification", "Clustering"]
      },
      {
        id: "4",
        title: "Agile Project Management Guide",
        type: "PDF",
        date: "2026-02-28",
        snippet: "Agile project management is an iterative approach to delivering a project throughout its life cycle. Iterative approaches are frequently used in software development projects...",
        relevance: 96,
        tags: ["Agile", "Project Management", "Software Development"]
      },
      {
        id: "5",
        title: "Sprint Planning Best Practices",
        type: "Note",
        date: "2026-03-10",
        snippet: "Effective sprint planning involves the entire team in defining sprint goals, selecting backlog items, and creating a realistic sprint plan. Key elements include capacity planning...",
        relevance: 89,
        tags: ["Agile", "Scrum", "Planning"]
      },
      {
        id: "6",
        title: "Climate Change: Global Impact Assessment",
        type: "PDF",
        date: "2026-01-15",
        snippet: "Climate change is causing significant impacts worldwide, affecting ecosystems, weather patterns, and human societies. Rising temperatures are leading to ice sheet melting...",
        relevance: 97,
        tags: ["Climate", "Environment", "Science"]
      },
      {
        id: "7",
        title: "Renewable Energy Solutions",
        type: "Note",
        date: "2026-02-20",
        snippet: "Transitioning to renewable energy is crucial for mitigating climate change. Solar, wind, and hydroelectric power offer sustainable alternatives to fossil fuels...",
        relevance: 90,
        tags: ["Climate", "Energy", "Sustainability"]
      },
      {
        id: "8",
        title: "Quantum Computing Fundamentals",
        type: "PDF",
        date: "2026-03-05",
        snippet: "Quantum computing harnesses quantum mechanical phenomena to process information. Unlike classical bits, quantum bits (qubits) can exist in superposition states...",
        relevance: 99,
        tags: ["Quantum", "Computing", "Physics"]
      },
      {
        id: "9",
        title: "Quantum Algorithms Overview",
        type: "Note",
        date: "2026-03-12",
        snippet: "Quantum algorithms like Shor's algorithm and Grover's algorithm demonstrate the potential of quantum computing to solve certain problems exponentially faster than classical computers...",
        relevance: 94,
        tags: ["Quantum", "Algorithms", "Computer Science"]
      }
    ];

    // Filter documents based on query
    const lowerQuery = searchQuery.toLowerCase();
    return allDocuments.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.snippet.toLowerCase().includes(lowerQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ).sort((a, b) => b.relevance - a.relevance);
  };

  const results = getMockResults(query);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-muted/30 border-b border-border">
        <h3 className="font-semibold text-foreground">
          Related Documents ({results.length})
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Sorted by relevance
        </p>
      </div>
      
      <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
        {results.length > 0 ? (
          results.map((doc) => (
            <div
              key={doc.id}
              className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <h4 className="font-medium text-foreground truncate">
                      {doc.title}
                    </h4>
                    {doc.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {doc.snippet}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {doc.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary">
                      {doc.relevance}%
                    </div>
                    <div className="text-xs text-muted-foreground">match</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No documents found for "{query}"</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try different search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}