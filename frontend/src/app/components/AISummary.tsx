import { Sparkles, Clock } from "lucide-react";

interface AISummaryProps {
  query: string;
}

export function AISummary({ query }: AISummaryProps) {
  // Mock AI summary based on the query
  const getMockSummary = (searchQuery: string): string => {
    const summaries: Record<string, string> = {
      "machine learning basics": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. Your knowledge base contains 12 documents covering fundamental concepts including supervised learning, unsupervised learning, neural networks, and practical applications. Key topics include data preprocessing, model training, evaluation metrics, and common algorithms like decision trees, random forests, and gradient boosting.",
      "project management": "Project management encompasses the planning, organizing, and managing of resources to achieve specific goals. Based on your documents, effective project management involves defining clear objectives, creating detailed timelines, managing team dynamics, and adapting to changes. Your knowledge base emphasizes agile methodologies, risk management strategies, stakeholder communication, and tools for tracking progress and deliverables.",
      "climate change impact": "Climate change refers to long-term shifts in global temperatures and weather patterns. Your knowledge base contains extensive research on the environmental, economic, and social impacts of climate change, including rising sea levels, extreme weather events, biodiversity loss, and effects on agriculture. Documents also cover mitigation strategies, renewable energy solutions, and international policy frameworks like the Paris Agreement.",
      "quantum computing": "Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to perform computations. Your documents explain how quantum computers differ fundamentally from classical computers, offering potential exponential speedups for specific problems. Topics include quantum bits (qubits), quantum gates, quantum algorithms (like Shor's and Grover's algorithms), error correction, and current limitations in quantum hardware development."
    };

    // Return matching summary or generate a generic one
    const lowerQuery = searchQuery.toLowerCase();
    for (const [key, summary] of Object.entries(summaries)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        return summary;
      }
    }

    return `Based on your search for "${searchQuery}", I found relevant information across multiple documents in your knowledge base. The content covers various aspects of this topic including theoretical foundations, practical applications, and recent developments. Key insights include methodologies, best practices, and important considerations for understanding and working with this subject matter.`;
  };

  const summary = getMockSummary(query);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-border rounded-lg p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">AI Summary</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Generated just now</span>
            </div>
          </div>
          <p className="text-foreground leading-relaxed">{summary}</p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <button className="text-primary hover:text-primary/80 font-medium">
              Ask follow-up question
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              Copy summary
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              Save to notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}