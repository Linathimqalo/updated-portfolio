import React, { useEffect, useRef } from 'react';

interface FractalTreeProps {
  className?: string;
}

const FractalTree: React.FC<FractalTreeProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 500;

    let animationId: number;
    let angle1 = 0;
    let angle2 = 0;

    const drawTree = (startX: number, startY: number, len: number, angle: number, depth: number, time: number) => {
      if (depth === 0) return;

      const endX = startX + len * Math.cos(angle);
      const endY = startY + len * Math.sin(angle);

      // Dynamic branch thickness based on depth
      ctx.lineWidth = depth * 0.8;
      
      // Color gradient based on depth and time
      const opacity = (depth / 8) * 0.6;
      const hue = (time * 0.5 + depth * 20) % 60; // Cycles through blue-cyan
      ctx.strokeStyle = `hsla(${180 + hue}, 70%, 40%, ${opacity})`;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Add subtle glow effect for main branches
      if (depth > 4) {
        ctx.shadowColor = `hsla(${180 + hue}, 70%, 60%, ${opacity * 0.5})`;
        ctx.shadowBlur = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Recursive branching with dynamic angles
      const angleVariation = Math.sin(time * 0.01 + depth) * 0.3;
      const leftAngle = angle - Math.PI / 6 - angleVariation;
      const rightAngle = angle + Math.PI / 6 + angleVariation;
      
      const lengthReduction = 0.67 + Math.sin(time * 0.005) * 0.1;
      
      drawTree(endX, endY, len * lengthReduction, leftAngle, depth - 1, time);
      drawTree(endX, endY, len * lengthReduction, rightAngle, depth - 1, time);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001;
      
      // Main trunk starting position
      const startX = canvas.width / 2;
      const startY = canvas.height - 50;
      const initialLength = 120;
      const initialAngle = -Math.PI / 2; // Pointing upward
      
      // Draw multiple tree variations
      drawTree(startX, startY, initialLength, initialAngle, 8, time);
      
      // Add some floating particles for extra effect
      for (let i = 0; i < 15; i++) {
        const particleX = startX + Math.sin(time + i) * 100;
        const particleY = startY - 200 + Math.cos(time * 0.7 + i) * 50;
        const size = Math.sin(time * 2 + i) * 2 + 2;
        
        ctx.fillStyle = `hsla(${200 + i * 10}, 60%, 60%, ${0.3 + Math.sin(time * 3 + i) * 0.2})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ filter: 'blur(0.5px)' }}
    />
  );
};

export default FractalTree;