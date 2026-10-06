import React, { useEffect, useRef } from 'react';

interface GalaxyBackgroundProps {
  className?: string;
}

const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ className = '' }) => {
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

    // Star and shooting star parameters
    let animationId: number;
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }> = [];

    const shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }> = [];

    // Initialize stars
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Initialize shooting stars
    for (let i = 0; i < 3; i++) {
      shootingStars.push({
        x: -100,
        y: Math.random() * canvas.height,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 5,
        angle: Math.random() * Math.PI / 6 + Math.PI / 6, // 30-60 degrees
        opacity: 0,
        active: false,
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016; // ~60fps

      // Draw twinkling stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity + (twinkle * 0.3);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentOpacity)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect for larger stars
        if (star.size > 2) {
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          gradient.addColorStop(0, `rgba(129, 140, 248, ${currentOpacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(129, 140, 248, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw and animate shooting stars
      shootingStars.forEach(shootingStar => {
        // Randomly activate shooting stars
        if (!shootingStar.active && Math.random() < 0.002) {
          shootingStar.active = true;
          shootingStar.x = -100;
          shootingStar.y = Math.random() * canvas.height * 0.7; // Keep in upper portion
          shootingStar.opacity = 1;
        }

        if (shootingStar.active) {
          // Move shooting star
          shootingStar.x += shootingStar.speed * Math.cos(shootingStar.angle);
          shootingStar.y += shootingStar.speed * Math.sin(shootingStar.angle);

          // Fade out as it moves
          shootingStar.opacity -= 0.008;

          // Draw shooting star trail
          const gradient = ctx.createLinearGradient(
            shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle),
            shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle),
            shootingStar.x,
            shootingStar.y
          );
          
          gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
          gradient.addColorStop(0.6, `rgba(255, 255, 255, ${shootingStar.opacity * 0.6})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.opacity})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(
            shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle),
            shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle)
          );
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();

          // Reset when off screen or faded
          if (shootingStar.x > canvas.width + 100 || shootingStar.opacity <= 0) {
            shootingStar.active = false;
          }
        }
      });

      // Resize stars array if canvas size changed
      while (stars.length < (canvas.width * canvas.height) / 3000) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

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
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default GalaxyBackground;