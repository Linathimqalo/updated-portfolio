import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Server, Code, Cloud, Network, Database, Terminal, Globe } from 'lucide-react';

interface SkillNode {
  id: string;
  title: string;
  icon: any;
  color: string;
  skills: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

const SkillsMindmap: React.FC = () => {
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const skillCategories = [
    {
      icon: Shield,
      title: "SIEM & Monitoring",
      color: "from-red-500 to-orange-500",
      skills: ["Wazuh", "Security Onion", "PfSense", "TPOT", "PCAP Analysis", "Incident Response"]
    },
    {
      icon: Network,
      title: "Threat Detection",
      color: "from-purple-500 to-pink-500",
      skills: ["YARA Rules", "CVE Exploitation", "Vulnerability Scanning", "Nessus", "OpenVAS", "Malware Analysis"]
    },
    {
      icon: Code,
      title: "Penetration Testing",
      color: "from-blue-500 to-cyan-500",
      skills: ["Kali Linux", "Nmap", "Metasploit", "Burp Suite", "Enumeration", "Privilege Escalation"]
    },
    {
      icon: Server,
      title: "Security Tools",
      color: "from-green-500 to-teal-500",
      skills: ["Firewall Config", "VPNs", "Server Hardening", "DAC", "SSL/TLS"]
    },
    {
      icon: Database,
      title: "OS & Servers",
      color: "from-indigo-500 to-purple-500",
      skills: ["Windows Server 2022", "Ubuntu", "Active Directory", "MacOS"]
    },
    {
      icon: Cloud,
      title: "Cloud & Virtualization",
      color: "from-yellow-500 to-orange-500",
      skills: ["VMware", "VirtualBox", "Azure", "GCP", "Cloudflare"]
    },
    {
      icon: Terminal,
      title: "Development & Tools",
      color: "from-cyan-500 to-blue-500",
      skills: ["HTML", "CSS", "JavaScript", "Python", "Node.js", "React", "C#", "Git", "GitHub", "WordPress", "Plesk", "cPanel", "Vercel", "MySQL", "MongoDB", "REST APIs"]
    },
    {
      icon: Globe,
      title: "Networking & Infrastructure",
      color: "from-teal-500 to-green-500",
      skills: ["DNS", "DHCP", "VLANs", "TCP/IP", "Router/Switch Config", "Backup & Recovery", "Imaging", "DR Planning"]
    }
  ];

  // Initialize nodes with positions
  useEffect(() => {
    const centerX = 500;
    const centerY = 350;
    const radius = 220;

    const initialNodes: SkillNode[] = skillCategories.map((category, index) => {
      const angle = (index / skillCategories.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id: category.title,
        title: category.title,
        icon: category.icon,
        color: category.color,
        skills: category.skills,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0
      };
    });

    setNodes(initialNodes);

    // Create connections between related nodes
    const initialConnections: Connection[] = [
      { from: "SIEM & Monitoring", to: "Threat Detection", strength: 0.8 },
      { from: "Threat Detection", to: "Penetration Testing", strength: 0.9 },
      { from: "Penetration Testing", to: "Security Tools", strength: 0.7 },
      { from: "Security Tools", to: "OS & Servers", strength: 0.6 },
      { from: "OS & Servers", to: "Cloud & Virtualization", strength: 0.7 },
      { from: "Cloud & Virtualization", to: "SIEM & Monitoring", strength: 0.5 },
      { from: "SIEM & Monitoring", to: "Security Tools", strength: 0.6 },
      { from: "Threat Detection", to: "OS & Servers", strength: 0.5 },
      { from: "Development & Tools", to: "Penetration Testing", strength: 0.6 },
      { from: "Development & Tools", to: "Security Tools", strength: 0.5 },
      { from: "Networking & Infrastructure", to: "Security Tools", strength: 0.7 },
      { from: "Networking & Infrastructure", to: "Cloud & Virtualization", strength: 0.6 },
      { from: "Networking & Infrastructure", to: "OS & Servers", strength: 0.5 },
    ];

    setConnections(initialConnections);
  }, []);

  // Physics simulation
  const simulatePhysics = useCallback(() => {
    setNodes(prevNodes => {
      const newNodes = prevNodes.map(node => {
        if (node.id === draggedNode) return node;

        let fx = 0;
        let fy = 0;

        // Attraction to center (very weak - almost disabled)
        const centerX = 500;
        const centerY = 350;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distToCenter = Math.sqrt(dx * dx + dy * dy);
        fx += dx * 0.0001;
        fy += dy * 0.0001;

        // Repulsion between nodes (gentler)
        prevNodes.forEach(other => {
          if (other.id === node.id) return;
          const odx = node.x - other.x;
          const ody = node.y - other.y;
          const dist = Math.sqrt(odx * odx + ody * ody);
          if (dist < 250 && dist > 0) {
            const force = (250 - dist) * 0.005;
            fx += (odx / dist) * force;
            fy += (ody / dist) * force;
          }
        });

        // Spring forces for connections (much gentler)
        connections.forEach(conn => {
          if (conn.from === node.id) {
            const other = prevNodes.find(n => n.id === conn.to);
            if (other) {
              const odx = other.x - node.x;
              const ody = other.y - node.y;
              const dist = Math.sqrt(odx * odx + ody * ody);
              const targetDist = 220;
              if (dist > 0) {
                const force = (dist - targetDist) * 0.002 * conn.strength;
                fx += (odx / dist) * force;
                fy += (ody / dist) * force;
              }
            }
          } else if (conn.to === node.id) {
            const other = prevNodes.find(n => n.id === conn.from);
            if (other) {
              const odx = other.x - node.x;
              const ody = other.y - node.y;
              const dist = Math.sqrt(odx * odx + ody * ody);
              const targetDist = 220;
              if (dist > 0) {
                const force = (dist - targetDist) * 0.002 * conn.strength;
                fx += (odx / dist) * force;
                fy += (ody / dist) * force;
              }
            }
          }
        });

        // Apply velocity with higher damping for smoother coasting
        node.vx = (node.vx + fx) * 0.96;
        node.vy = (node.vy + fy) * 0.96;

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Boundary constraints
        node.x = Math.max(100, Math.min(900, node.x));
        node.y = Math.max(100, Math.min(600, node.y));

        return node;
      });

      return newNodes;
    });
  }, [connections, draggedNode]);

  // Draw connections on canvas
  const drawConnections = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);

      if (fromNode && toNode) {
        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)');

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 * conn.strength;
        ctx.stroke();

        // Draw animated particles along the line
        const time = Date.now() * 0.001;
        const particleCount = 3;
        for (let i = 0; i < particleCount; i++) {
          const t = ((time * 0.5 + i / particleCount) % 1);
          const px = fromNode.x + (toNode.x - fromNode.x) * t;
          const py = fromNode.y + (toNode.y - fromNode.y) * t;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${0.5 + Math.sin(time * 2 + i) * 0.3})`;
          ctx.fill();
        }
      }
    });
  }, [nodes, connections]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      simulatePhysics();
      drawConnections();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [simulatePhysics, drawConnections]);

  // Handle mouse events for dragging
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedNode(nodeId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedNode || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(node => {
      if (node.id === draggedNode) {
        return { ...node, x, y, vx: 0, vy: 0 };
      }
      return node;
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  return (
    <div className="relative w-full h-[700px]">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <h3 className="font-poppins font-semibold text-xl text-foreground">
          Interactive Skills Mindmap
        </h3>
      </div>

      {/* Canvas for connections */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={700}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Nodes */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              position: 'absolute',
              left: node.x - 80,
              top: node.y - 60,
              width: 160,
              height: 120,
            }}
            onMouseDown={(e) => handleMouseDown(node.id, e)}
            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            className="cursor-pointer"
          >
            {/* Node card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`card-elegant hover-luxury h-full flex flex-col items-center justify-center p-4 ${
                selectedNode === node.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${node.color} p-2.5 mb-3 shadow-glow`}>
                <node.icon className="w-full h-full text-white" />
              </div>
              <h4 className="font-poppins font-semibold text-sm text-foreground text-center">
                {node.title}
              </h4>
              <span className="text-xs text-muted-foreground mt-1">
                {node.skills.length} skills
              </span>
            </motion.div>

            {/* Skills popup */}
            <AnimatePresence>
              {selectedNode === node.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 card-elegant p-4 z-20"
                >
                  <div className="flex flex-wrap gap-2">
                    {node.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gradient-primary/10 text-primary rounded-lg text-xs font-medium font-open-sans"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
        Click nodes to view skills • Drag to reposition
      </div>
    </div>
  );
};

export default SkillsMindmap;
