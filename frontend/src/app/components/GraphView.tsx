import { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Network } from 'lucide-react';
import { Button } from './ui/button';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: number;
  category: 'main' | 'secondary' | 'tertiary';
}

interface Link {
  source: string;
  target: string;
  strength: number;
}

// Mock data for document concepts nodal graph
const mockNodes: Omit<Node, 'x' | 'y' | 'vx' | 'vy'>[] = [
  { id: '1', label: 'Machine Learning', radius: 30, connections: 5, category: 'main' },
  { id: '2', label: 'Neural Networks', radius: 25, connections: 4, category: 'main' },
  { id: '3', label: 'Deep Learning', radius: 22, connections: 3, category: 'secondary' },
  { id: '4', label: 'Supervised Learning', radius: 20, connections: 3, category: 'secondary' },
  { id: '5', label: 'Unsupervised Learning', radius: 20, connections: 2, category: 'secondary' },
  { id: '6', label: 'CNN', radius: 18, connections: 2, category: 'tertiary' },
  { id: '7', label: 'RNN', radius: 18, connections: 2, category: 'tertiary' },
  { id: '8', label: 'Backpropagation', radius: 16, connections: 2, category: 'tertiary' },
  { id: '9', label: 'Gradient Descent', radius: 16, connections: 2, category: 'tertiary' },
  { id: '10', label: 'Classification', radius: 18, connections: 2, category: 'tertiary' },
  { id: '11', label: 'Regression', radius: 18, connections: 2, category: 'tertiary' },
  { id: '12', label: 'Clustering', radius: 16, connections: 1, category: 'tertiary' },
  { id: '13', label: 'Feature Extraction', radius: 16, connections: 2, category: 'tertiary' },
];

const mockLinks: Link[] = [
  { source: '1', target: '2', strength: 0.9 },
  { source: '1', target: '3', strength: 0.8 },
  { source: '1', target: '4', strength: 0.7 },
  { source: '1', target: '5', strength: 0.7 },
  { source: '2', target: '3', strength: 0.9 },
  { source: '2', target: '6', strength: 0.6 },
  { source: '2', target: '7', strength: 0.6 },
  { source: '2', target: '8', strength: 0.5 },
  { source: '3', target: '6', strength: 0.7 },
  { source: '3', target: '7', strength: 0.7 },
  { source: '2', target: '9', strength: 0.5 },
  { source: '4', target: '10', strength: 0.8 },
  { source: '4', target: '11', strength: 0.8 },
  { source: '5', target: '12', strength: 0.7 },
  { source: '1', target: '13', strength: 0.6 },
  { source: '5', target: '13', strength: 0.5 },
];

export function GraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const animationRef = useRef<number>();

  // Initialize nodes with random positions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const initialNodes: Node[] = mockNodes.map((node) => ({
      ...node,
      x: centerX + (Math.random() - 0.5) * 200,
      y: centerY + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
    }));

    setNodes(initialNodes);
  }, []);

  // Physics simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const simulate = () => {
      setNodes((prevNodes) => {
        const newNodes = [...prevNodes];
        const damping = 0.9;
        const repulsion = 5000;
        const attraction = 0.01;
        const centerForce = 0.001;

        const canvas = canvasRef.current;
        if (!canvas) return prevNodes;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Apply forces
        for (let i = 0; i < newNodes.length; i++) {
          const node = newNodes[i];

          // Reset forces
          let fx = 0;
          let fy = 0;

          // Repulsion between nodes
          for (let j = 0; j < newNodes.length; j++) {
            if (i === j) continue;
            const other = newNodes[j];
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = repulsion / (dist * dist);
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }

          // Attraction along links
          mockLinks.forEach((link) => {
            if (link.source === node.id) {
              const target = newNodes.find((n) => n.id === link.target);
              if (target) {
                const dx = target.x - node.x;
                const dy = target.y - node.y;
                fx += dx * attraction * link.strength;
                fy += dy * attraction * link.strength;
              }
            }
            if (link.target === node.id) {
              const source = newNodes.find((n) => n.id === link.source);
              if (source) {
                const dx = source.x - node.x;
                const dy = source.y - node.y;
                fx += dx * attraction * link.strength;
                fy += dy * attraction * link.strength;
              }
            }
          });

          // Center gravity
          fx += (centerX - node.x) * centerForce;
          fy += (centerY - node.y) * centerForce;

          // Update velocity
          node.vx = (node.vx + fx) * damping;
          node.vy = (node.vy + fy) * damping;

          // Update position
          node.x += node.vx;
          node.y += node.vy;
        }

        return newNodes;
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes.length]);

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Get theme color
      const isDark = document.documentElement.classList.contains('dark');
      const linkColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      const textColor = isDark ? '#e5e5e5' : '#171717';

      // Draw links
      mockLinks.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source);
        const target = nodes.find((n) => n.id === link.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = linkColor;
          ctx.lineWidth = link.strength * 2;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isSelected = selectedNode?.id === node.id;
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        
        // Color based on category
        let fillColor;
        if (node.category === 'main') {
          fillColor = isDark ? '#8b5cf6' : '#7c3aed';
        } else if (node.category === 'secondary') {
          fillColor = isDark ? '#3b82f6' : '#2563eb';
        } else {
          fillColor = isDark ? '#06b6d4' : '#0891b2';
        }
        
        ctx.fillStyle = fillColor;
        ctx.fill();
        
        if (isSelected) {
          ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = textColor;
        ctx.font = `${node.radius / 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y + node.radius + 12);
      });

      ctx.restore();

      requestAnimationFrame(draw);
    };

    draw();
  }, [nodes, zoom, pan, selectedNode]);

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    // Find clicked node
    const clickedNode = nodes.find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });

    setSelectedNode(clickedNode || null);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2>Document Analytics</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              title="Reset view"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Concept relationship graph from document
        </p>
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-move"
          onClick={handleCanvasClick}
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
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Concept Categories</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#7c3aed] dark:bg-[#8b5cf6]"></div>
              <span className="text-xs text-muted-foreground">Main Concepts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2563eb] dark:bg-[#3b82f6]"></div>
              <span className="text-xs text-muted-foreground">Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0891b2] dark:bg-[#06b6d4]"></div>
              <span className="text-xs text-muted-foreground">Related Terms</span>
            </div>
          </div>
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
            <h3 className="font-semibold mb-2">{selectedNode.label}</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Category: <span className="capitalize">{selectedNode.category}</span></p>
              <p>Connections: {selectedNode.connections}</p>
              <p>Mentioned: {Math.floor(Math.random() * 20 + 5)} times</p>
              <p>Pages: {Math.floor(Math.random() * 15 + 1)}-{Math.floor(Math.random() * 30 + 16)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="p-4 border-t border-border bg-muted/30">
        <h4 className="mb-2 font-medium">Document Insights</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• {mockNodes.length} key concepts identified</li>
          <li>• {mockLinks.length} relationships mapped</li>
          <li>• Most connected: {mockNodes[0].label} ({mockNodes[0].connections} connections)</li>
        </ul>
      </div>
    </div>
  );
}
