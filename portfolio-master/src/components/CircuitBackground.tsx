import React, { useEffect, useRef } from 'react';

interface CircuitBackgroundProps {
  className?: string;
}

const CircuitBackground: React.FC<CircuitBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Circuit animation parameters
    let animationId: number;
    const circuits: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      opacity: number;
      direction: number;
    }> = [];

    // Initialize circuits
    for (let i = 0; i < 8; i++) {
      circuits.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 300 + 100,
        height: Math.random() * 200 + 50,
        opacity: Math.random() * 0.3 + 0.1,
        direction: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      circuits.forEach((circuit, index) => {
        // Update circuit position
        circuit.x += Math.cos(circuit.direction) * 0.5;
        circuit.y += Math.sin(circuit.direction) * 0.5;
        
        // Wrap around screen
        if (circuit.x > canvas.width + circuit.width) circuit.x = -circuit.width;
        if (circuit.x < -circuit.width) circuit.x = canvas.width + circuit.width;
        if (circuit.y > canvas.height + circuit.height) circuit.y = -circuit.height;
        if (circuit.y < -circuit.height) circuit.y = canvas.height + circuit.height;

        // Draw circuit lines
        ctx.strokeStyle = `rgba(2, 56, 89, ${circuit.opacity})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 10]);
        
        ctx.beginPath();
        // Horizontal lines
        for (let i = 0; i < 3; i++) {
          const y = circuit.y + (circuit.height / 3) * i;
          ctx.moveTo(circuit.x, y);
          ctx.lineTo(circuit.x + circuit.width, y);
        }
        
        // Vertical lines
        for (let i = 0; i < 4; i++) {
          const x = circuit.x + (circuit.width / 4) * i;
          ctx.moveTo(x, circuit.y);
          ctx.lineTo(x, circuit.y + circuit.height);
        }
        
        ctx.stroke();
        
        // Draw connection nodes
        ctx.fillStyle = `rgba(5, 22, 26, ${circuit.opacity * 2})`;
        for (let i = 0; i < 5; i++) {
          const nodeX = circuit.x + Math.random() * circuit.width;
          const nodeY = circuit.y + Math.random() * circuit.height;
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-60 ${className}`}
    />
  );
};

export default CircuitBackground;