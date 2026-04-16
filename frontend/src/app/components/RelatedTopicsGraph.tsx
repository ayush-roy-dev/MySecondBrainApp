import { useEffect, useRef, useState } from "react";
import { Network, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface RelatedTopicsGraphProps {
  query: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface Edge {
  from: string;
  to: string;
  strength: number;
}

export function RelatedTopicsGraph({ query }: RelatedTopicsGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Mock graph data based on the query
  const getMockGraphData = (searchQuery: string): { nodes: Node[]; edges: Edge[] } => {
    const graphData: Record<string, { nodes: Node[]; edges: Edge[] }> = {
      "machine learning": {
        nodes: [
          { id: "ml", label: "Machine Learning", x: 250, y: 200, size: 40, color: "#3B82F6" },
          { id: "nn", label: "Neural Networks", x: 150, y: 120, size: 30, color: "#8B5CF6" },
          { id: "sl", label: "Supervised Learning", x: 350, y: 120, size: 25, color: "#10B981" },
          { id: "ul", label: "Unsupervised Learning", x: 150, y: 280, size: 25, color: "#F59E0B" },
          { id: "dl", label: "Deep Learning", x: 350, y: 280, size: 30, color: "#EF4444" },
          { id: "dt", label: "Decision Trees", x: 450, y: 200, size: 20, color: "#6366F1" },
          { id: "cl", label: "Clustering", x: 50, y: 200, size: 20, color: "#EC4899" },
        ],
        edges: [
          { from: "ml", to: "nn", strength: 0.9 },
          { from: "ml", to: "sl", strength: 0.8 },
          { from: "ml", to: "ul", strength: 0.8 },
          { from: "ml", to: "dl", strength: 0.9 },
          { from: "nn", to: "dl", strength: 0.95 },
          { from: "sl", to: "dt", strength: 0.7 },
          { from: "ul", to: "cl", strength: 0.8 },
        ]
      },
      "project management": {
        nodes: [
          { id: "pm", label: "Project Management", x: 250, y: 200, size: 40, color: "#3B82F6" },
          { id: "ag", label: "Agile", x: 150, y: 120, size: 30, color: "#10B981" },
          { id: "sc", label: "Scrum", x: 350, y: 120, size: 25, color: "#8B5CF6" },
          { id: "kb", label: "Kanban", x: 150, y: 280, size: 25, color: "#F59E0B" },
          { id: "sp", label: "Sprint Planning", x: 350, y: 280, size: 25, color: "#EF4444" },
          { id: "rm", label: "Risk Management", x: 450, y: 200, size: 20, color: "#6366F1" },
          { id: "st", label: "Stakeholders", x: 50, y: 200, size: 20, color: "#EC4899" },
        ],
        edges: [
          { from: "pm", to: "ag", strength: 0.9 },
          { from: "pm", to: "rm", strength: 0.8 },
          { from: "pm", to: "st", strength: 0.7 },
          { from: "ag", to: "sc", strength: 0.95 },
          { from: "ag", to: "kb", strength: 0.85 },
          { from: "sc", to: "sp", strength: 0.9 },
        ]
      },
      "climate change": {
        nodes: [
          { id: "cc", label: "Climate Change", x: 250, y: 200, size: 40, color: "#3B82F6" },
          { id: "re", label: "Renewable Energy", x: 150, y: 120, size: 30, color: "#10B981" },
          { id: "gw", label: "Global Warming", x: 350, y: 120, size: 30, color: "#EF4444" },
          { id: "bd", label: "Biodiversity", x: 150, y: 280, size: 25, color: "#8B5CF6" },
          { id: "oc", label: "Ocean Acidification", x: 350, y: 280, size: 25, color: "#0EA5E9" },
          { id: "cr", label: "Carbon Reduction", x: 450, y: 200, size: 25, color: "#10B981" },
          { id: "po", label: "Policy", x: 50, y: 200, size: 20, color: "#F59E0B" },
        ],
        edges: [
          { from: "cc", to: "gw", strength: 0.95 },
          { from: "cc", to: "re", strength: 0.85 },
          { from: "cc", to: "bd", strength: 0.8 },
          { from: "cc", to: "oc", strength: 0.8 },
          { from: "cc", to: "cr", strength: 0.9 },
          { from: "cc", to: "po", strength: 0.75 },
          { from: "re", to: "cr", strength: 0.9 },
        ]
      },
      "quantum computing": {
        nodes: [
          { id: "qc", label: "Quantum Computing", x: 250, y: 200, size: 40, color: "#3B82F6" },
          { id: "qb", label: "Qubits", x: 150, y: 120, size: 30, color: "#8B5CF6" },
          { id: "qa", label: "Quantum Algorithms", x: 350, y: 120, size: 30, color: "#10B981" },
          { id: "sp", label: "Superposition", x: 150, y: 280, size: 25, color: "#F59E0B" },
          { id: "en", label: "Entanglement", x: 350, y: 280, size: 25, color: "#EF4444" },
          { id: "qe", label: "Quantum Error", x: 450, y: 200, size: 20, color: "#EC4899" },
          { id: "qg", label: "Quantum Gates", x: 50, y: 200, size: 20, color: "#6366F1" },
        ],
        edges: [
          { from: "qc", to: "qb", strength: 0.95 },
          { from: "qc", to: "qa", strength: 0.9 },
          { from: "qb", to: "sp", strength: 0.9 },
          { from: "qb", to: "en", strength: 0.9 },
          { from: "qa", to: "qg", strength: 0.85 },
          { from: "qc", to: "qe", strength: 0.8 },
        ]
      }
    };

    // Find matching graph data
    const lowerQuery = searchQuery.toLowerCase();
    for (const [key, data] of Object.entries(graphData)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        return data;
      }
    }

    // Return default generic graph
    return {
      nodes: [
        { id: "main", label: query, x: 250, y: 200, size: 40, color: "#3B82F6" },
        { id: "t1", label: "Topic A", x: 150, y: 120, size: 25, color: "#10B981" },
        { id: "t2", label: "Topic B", x: 350, y: 120, size: 25, color: "#8B5CF6" },
        { id: "t3", label: "Topic C", x: 150, y: 280, size: 25, color: "#F59E0B" },
        { id: "t4", label: "Topic D", x: 350, y: 280, size: 25, color: "#EF4444" },
      ],
      edges: [
        { from: "main", to: "t1", strength: 0.8 },
        { from: "main", to: "t2", strength: 0.85 },
        { from: "main", to: "t3", strength: 0.75 },
        { from: "main", to: "t4", strength: 0.8 },
      ]
    };
  };

  const graphData = getMockGraphData(query);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    graphData.edges.forEach((edge) => {
      const fromNode = graphData.nodes.find(n => n.id === edge.from);
      const toNode = graphData.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = `rgba(148, 163, 184, ${edge.strength})`;
        ctx.lineWidth = 2 * edge.strength;
        ctx.stroke();
      }
    });

    // Draw nodes
    graphData.nodes.forEach((node) => {
      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = "#1F2937";
      ctx.font = "12px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Background for text
      const textMetrics = ctx.measureText(node.label);
      const textWidth = textMetrics.width;
      const textHeight = 16;
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(
        node.x - textWidth / 2 - 4,
        node.y + node.size + 5,
        textWidth + 8,
        textHeight
      );
      
      // Text
      ctx.fillStyle = "#1F2937";
      ctx.fillText(node.label, node.x, node.y + node.size + 13);
    });

    ctx.restore();
  }, [graphData, zoom, pan]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Related Topics</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Knowledge graph visualization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-accent rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-accent rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-accent rounded transition-colors"
            title="Reset view"
          >
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-muted/20 h-[600px] flex items-center justify-center">
        <div className="relative w-full h-full bg-card rounded border border-border overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            onMouseDown={(e) => {
              const startX = e.clientX - pan.x;
              const startY = e.clientY - pan.y;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                setPan({
                  x: moveEvent.clientX - startX,
                  y: moveEvent.clientY - startY,
                });
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          />
          
          <div className="absolute bottom-4 left-4 bg-card px-3 py-2 rounded shadow-sm border border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span>{graphData.nodes.length} topics connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}