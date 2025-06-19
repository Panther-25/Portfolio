// JARVIS Particle System - Advanced particle effects for futuristic theme

class JarvisParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0, radius: 150 };
        this.animationId = null;
        
        this.config = {
            particleCount: 80,
            maxDistance: 120,
            particleSpeed: 0.5,
            particleSize: 2,
            connectionOpacity: 0.3,
            particleOpacity: 0.8,
            color: {
                r: 0, g: 188, b: 212 // Primary color
            },
            accentColor: {
                r: 0, g: 229, b: 255 // Accent color
            }
        };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.handleResize());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.handleMouseLeave());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    handleResize() {
        this.resizeCanvas();
        this.particles = [];
        this.createParticles();
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.mouse.x = touch.clientX - rect.left;
        this.mouse.y = touch.clientY - rect.top;
    }
    
    handleMouseLeave() {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
    }
    
    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height, this.config));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
            
            // Check connections with other particles
            for (let j = index + 1; j < this.particles.length; j++) {
                const distance = this.getDistance(particle, this.particles[j]);
                
                if (distance < this.config.maxDistance) {
                    this.drawConnection(particle, this.particles[j], distance);
                }
            }
            
            // Mouse interaction
            const mouseDistance = this.getDistance(particle, this.mouse);
            if (mouseDistance < this.mouse.radius) {
                this.drawMouseConnection(particle, mouseDistance);
                particle.attract(this.mouse, mouseDistance);
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    getDistance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    drawConnection(particle1, particle2, distance) {
        const opacity = (1 - distance / this.config.maxDistance) * this.config.connectionOpacity;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(${this.config.color.r}, ${this.config.color.g}, ${this.config.color.b}, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(particle1.x, particle1.y);
        this.ctx.lineTo(particle2.x, particle2.y);
        this.ctx.stroke();
    }
    
    drawMouseConnection(particle, distance) {
        const opacity = (1 - distance / this.mouse.radius) * 0.6;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(${this.config.accentColor.r}, ${this.config.accentColor.g}, ${this.config.accentColor.b}, ${opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
        
        // Add glow effect
        this.ctx.shadowColor = `rgba(${this.config.accentColor.r}, ${this.config.accentColor.g}, ${this.config.accentColor.b}, 0.5)`;
        this.ctx.shadowBlur = 10;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight, config) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * config.particleSpeed;
        this.vy = (Math.random() - 0.5) * config.particleSpeed;
        this.size = Math.random() * config.particleSize + 1;
        this.config = config;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.opacity = Math.random() * config.particleOpacity + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulse = 0;
        
        // Random color variation
        this.colorVariation = Math.random() * 0.3;
    }
    
    update(mouse) {
        // Base movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.vy *= -1;
        }
        
        // Keep particles in bounds
        this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        
        // Pulsing effect
        this.pulse += this.pulseSpeed;
        this.currentOpacity = this.opacity + Math.sin(this.pulse) * 0.2;
        this.currentSize = this.size + Math.sin(this.pulse) * 0.5;
    }
    
    attract(mouse, distance) {
        const force = (1 - distance / mouse.radius) * 0.02;
        const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
        
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
        
        // Limit velocity
        const maxVel = this.config.particleSpeed * 3;
        this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx));
        this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy));
    }
    
    draw(ctx) {
        // Main particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
        
        // Color with variation
        const r = Math.floor(this.config.color.r + this.colorVariation * 50);
        const g = Math.floor(this.config.color.g + this.colorVariation * 50);
        const b = Math.floor(this.config.color.b + this.colorVariation * 50);
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.currentOpacity})`;
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.shadowBlur = this.currentSize * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Inner bright core
        if (this.currentOpacity > 0.5) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.currentSize * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.config.accentColor.r}, ${this.config.accentColor.g}, ${this.config.accentColor.b}, ${this.currentOpacity * 0.8})`;
            ctx.fill();
        }
    }
}

// Constellation Effect - Creates constellation patterns
class ConstellationEffect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.constellations = [];
        this.createConstellations();
    }
    
    createConstellations() {
        // Create some predefined constellation patterns
        const patterns = [
            // Triangle
            [
                { x: 0.2, y: 0.3 },
                { x: 0.4, y: 0.2 },
                { x: 0.3, y: 0.5 }
            ],
            // Diamond
            [
                { x: 0.7, y: 0.3 },
                { x: 0.8, y: 0.4 },
                { x: 0.7, y: 0.5 },
                { x: 0.6, y: 0.4 }
            ],
            // Cross
            [
                { x: 0.5, y: 0.7 },
                { x: 0.4, y: 0.8 },
                { x: 0.6, y: 0.8 },
                { x: 0.5, y: 0.9 }
            ]
        ];
        
        patterns.forEach(pattern => {
            const constellation = pattern.map(point => ({
                x: point.x * this.canvas.width,
                y: point.y * this.canvas.height,
                originalX: point.x,
                originalY: point.y,
                opacity: Math.random() * 0.5 + 0.3,
                twinkle: Math.random() * 0.02 + 0.01
            }));
            
            this.constellations.push(constellation);
        });
    }
    
    update() {
        this.constellations.forEach(constellation => {
            constellation.forEach(star => {
                // Update position based on canvas size
                star.x = star.originalX * this.canvas.width;
                star.y = star.originalY * this.canvas.height;
                
                // Twinkling effect
                star.opacity += Math.sin(Date.now() * star.twinkle) * 0.01;
                star.opacity = Math.max(0.1, Math.min(0.8, star.opacity));
            });
        });
    }
    
    draw() {
        this.constellations.forEach(constellation => {
            // Draw connections
            this.ctx.strokeStyle = `rgba(0, 188, 212, 0.2)`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            
            constellation.forEach((star, index) => {
                if (index === 0) {
                    this.ctx.moveTo(star.x, star.y);
                } else {
                    this.ctx.lineTo(star.x, star.y);
                }
            });
            
            // Close the shape for some patterns
            if (constellation.length > 2) {
                this.ctx.lineTo(constellation[0].x, constellation[0].y);
            }
            
            this.ctx.stroke();
            
            // Draw stars
            constellation.forEach(star => {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 229, 255, ${star.opacity})`;
                this.ctx.fill();
                
                // Star glow
                this.ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
                this.ctx.shadowBlur = 8;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            });
        });
    }
    
    resize(width, height) {
        this.constellations.forEach(constellation => {
            constellation.forEach(star => {
                star.x = star.originalX * width;
                star.y = star.originalY * height;
            });
        });
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new JarvisParticleSystem('particles-canvas');
    
    // Add constellation effect
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    const constellationEffect = new ConstellationEffect(canvas, ctx);
    
    // Override the animate method to include constellation effect
    const originalAnimate = particleSystem.animate.bind(particleSystem);
    particleSystem.animate = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw constellation effect first (background)
        constellationEffect.update();
        constellationEffect.draw();
        
        // Then draw particles
        this.particles.forEach((particle, index) => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
            
            for (let j = index + 1; j < this.particles.length; j++) {
                const distance = this.getDistance(particle, this.particles[j]);
                
                if (distance < this.config.maxDistance) {
                    this.drawConnection(particle, this.particles[j], distance);
                }
            }
            
            const mouseDistance = this.getDistance(particle, this.mouse);
            if (mouseDistance < this.mouse.radius) {
                this.drawMouseConnection(particle, mouseDistance);
                particle.attract(this.mouse, mouseDistance);
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    };
    
    // Store references globally for cleanup
    window.jarvisParticleSystem = particleSystem;
    window.jarvisConstellationEffect = constellationEffect;
    
    // Handle resize for constellation effect
    window.addEventListener('resize', () => {
        constellationEffect.resize(canvas.width, canvas.height);
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.jarvisParticleSystem) {
        window.jarvisParticleSystem.destroy();
    }
});
