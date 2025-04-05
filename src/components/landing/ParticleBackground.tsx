
import React, { useRef, useEffect } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Configuration
    const particleCount = 100;
    const maxDistance = 200;
    const mouseInfluence = 100;
    const particleColor = 'rgba(139, 92, 246, 0.7)'; // Purple color
    const lineColor = 'rgba(139, 92, 246, 0.2)'; // Purple lines
    
    let mousePosition = {
      x: width / 2,
      y: height / 2
    };
    
    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    });
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
      }
      
      update() {
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Handle boundaries
        if (this.x > width || this.x < 0) {
          this.speedX *= -1;
        }
        
        if (this.y > height || this.y < 0) {
          this.speedY *= -1;
        }
        
        // Mouse interaction
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseInfluence) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseInfluence - distance) / mouseInfluence;
          
          this.speedX += Math.cos(angle) * force * 0.05;
          this.speedY += Math.sin(angle) * force * 0.05;
        }
        
        // Max speed limiter
        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (currentSpeed > 2) {
          this.speedX = (this.speedX / currentSpeed) * 2;
          this.speedY = (this.speedY / currentSpeed) * 2;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }
    
    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect particles with lines
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5 * (1 - distance / maxDistance);
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', () => {});
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-40"
    />
  );
};

export default ParticleBackground;
