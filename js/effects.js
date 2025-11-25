// Particle System and Visual Effects
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.init();
    }

    init() {
        // Create canvas for particle effects
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '150';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, type = 'sparkle', config = {}) {
        const particle = {
            x, y,
            vx: (Math.random() - 0.5) * (config.velocityX || 10),
            vy: (Math.random() - 0.5) * (config.velocityY || 10),
            life: config.life || 1,
            maxLife: config.life || 1,
            size: config.size || 4,
            color: config.color || '#ffff00',
            type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            gravity: config.gravity || 0.2,
            fade: config.fade !== false
        };
        this.particles.push(particle);
    }

    createBurst(x, y, count = 20, config = {}) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = config.velocity || 5;
            this.createParticle(x, y, 'burst', {
                ...config,
                velocityX: Math.cos(angle) * velocity * 2,
                velocityY: Math.sin(angle) * velocity * 2
            });
        }
    }

    createConfetti(x, y, count = 30) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, 'confetti', {
                color: colors[Math.floor(Math.random() * colors.length)],
                velocityX: 15,
                velocityY: 15,
                gravity: 0.5,
                life: 2,
                size: 8
            });
        }
    }

    createWinExplosion(x, y, intensity = 1) {
        // Sparks
        this.createBurst(x, y, 30 * intensity, {
            color: '#ffff00',
            velocity: 8 * intensity,
            life: 1.5,
            size: 6
        });

        // Stars
        for (let i = 0; i < 10 * intensity; i++) {
            this.createParticle(x, y, 'star', {
                color: '#ffffff',
                velocityX: 12,
                velocityY: 12,
                life: 2,
                size: 10,
                gravity: 0.1
            });
        }
    }

    createInfectionParticles(x, y) {
        for (let i = 0; i < 20; i++) {
            this.createParticle(x, y, 'glow', {
                color: '#00ff00',
                velocityX: 4,
                velocityY: 4,
                life: 1,
                size: 6,
                gravity: -0.1
            });
        }
    }

    createMutationEffect(x, y) {
        // Swirling effect
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const radius = 50;
            this.createParticle(
                x + Math.cos(angle) * radius,
                y + Math.sin(angle) * radius,
                'spiral',
                {
                    color: i % 2 === 0 ? '#00ff00' : '#88ff00',
                    velocityX: -Math.cos(angle) * 3,
                    velocityY: -Math.sin(angle) * 3,
                    life: 1.5,
                    size: 8,
                    gravity: 0
                }
            );
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Apply gravity
            p.vy += p.gravity;

            // Apply friction
            p.vx *= 0.98;
            p.vy *= 0.98;

            // Update rotation
            p.rotation += p.rotationSpeed;

            // Update life
            p.life -= 0.016; // ~60fps

            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);

            const alpha = p.fade ? p.life / p.maxLife : 1;
            this.ctx.globalAlpha = alpha;

            switch (p.type) {
                case 'sparkle':
                case 'burst':
                case 'glow':
                    // Circle
                    this.ctx.fillStyle = p.color;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    this.ctx.fill();

                    // Glow
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = p.color;
                    break;

                case 'confetti':
                    // Rectangle
                    this.ctx.fillStyle = p.color;
                    this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
                    break;

                case 'star':
                    // Star shape
                    this.ctx.fillStyle = p.color;
                    this.ctx.shadowBlur = 15;
                    this.ctx.shadowColor = p.color;
                    this.drawStar(p.size);
                    break;

                case 'spiral':
                    // Circle with trail
                    this.ctx.fillStyle = p.color;
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowColor = p.color;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
            }

            this.ctx.restore();
        }
    }

    drawStar(size) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * (size / 2);
            const innerY = Math.sin(innerAngle) * (size / 2);
            this.ctx.lineTo(innerX, innerY);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    animate() {
        this.update();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    clear() {
        this.particles = [];
    }

    destroy() {
        cancelAnimationFrame(this.animationFrame);
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Animation Controller
class AnimationController {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
    }

    // Animate symbol spin
    animateSymbolSpin(cellElement) {
        cellElement.classList.add('spinning');
        setTimeout(() => {
            cellElement.classList.remove('spinning');
            cellElement.classList.add('landing');
            setTimeout(() => {
                cellElement.classList.remove('landing');
            }, 400);
        }, 300);
    }

    // Animate winning cells
    animateWin(cells, isHuge = false) {
        cells.forEach(cell => {
            cell.classList.add('winning');

            const rect = cell.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            if (isHuge) {
                this.particleSystem.createWinExplosion(x, y, 2);
            } else {
                this.particleSystem.createBurst(x, y, 15, {
                    color: '#ffff00',
                    velocity: 5,
                    life: 1
                });
            }
        });

        // Shake grid on big win
        if (isHuge) {
            const grid = document.getElementById('game-grid');
            grid.classList.add('big-win');
            setTimeout(() => {
                grid.classList.remove('big-win');
            }, 500);
        }
    }

    // Animate symbol removal
    animateRemoval(cells) {
        cells.forEach(cell => {
            cell.classList.add('disappearing');
            const rect = cell.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            this.particleSystem.createBurst(x, y, 10, {
                color: '#ffffff',
                velocity: 3,
                life: 0.5,
                size: 3
            });
        });

        setTimeout(() => {
            cells.forEach(cell => {
                cell.classList.remove('disappearing', 'winning');
            });
        }, 300);
    }

    // Animate infection
    animateInfection(cells) {
        cells.forEach(cell => {
            cell.classList.add('infecting');
            const rect = cell.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            this.particleSystem.createInfectionParticles(x, y);

            setTimeout(() => {
                cell.classList.remove('infecting');
            }, 500);
        });
    }

    // Animate mutation
    animateMutation(cells) {
        cells.forEach(cell => {
            cell.classList.add('mutating');
            const rect = cell.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            this.particleSystem.createMutationEffect(x, y);

            setTimeout(() => {
                cell.classList.remove('mutating');
            }, 800);
        });
    }

    // Animate crash/multiplier
    animateCrash(cells) {
        cells.forEach(cell => {
            cell.classList.add('crashing');
            const rect = cell.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            this.particleSystem.createWinExplosion(x, y, 1.5);

            setTimeout(() => {
                cell.classList.remove('crashing');
            }, 600);
        });
    }

    // Animate scatter trigger
    animateScatter(cells) {
        cells.forEach(cell => {
            cell.classList.add('scatter-trigger');
            const rect = cell.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Create star burst
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.particleSystem.createBurst(x, y, 20, {
                        color: '#ff00ff',
                        velocity: 8,
                        life: 1.5,
                        size: 8
                    });
                }, i * 300);
            }

            setTimeout(() => {
                cell.classList.remove('scatter-trigger');
            }, 2400);
        });
    }

    // Big win confetti
    triggerBigWinCelebration() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Confetti bursts from multiple points
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * width;
                this.particleSystem.createConfetti(x, 0, 40);
            }, i * 200);
        }
    }

    // Add button ripple effect
    addButtonRipple(button, event) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.className = 'button-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Tolerance Meter Bubble System
class BubbleSystem {
    constructor(meterElement) {
        this.meterElement = meterElement;
        this.bubblesContainer = document.getElementById('meter-bubbles');
        this.bubbleInterval = null;
    }

    start() {
        this.stop(); // Clear any existing interval
        this.bubbleInterval = setInterval(() => {
            this.createBubble();
        }, 500);
    }

    stop() {
        if (this.bubbleInterval) {
            clearInterval(this.bubbleInterval);
            this.bubbleInterval = null;
        }
    }

    createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'meter-bubble';
        bubble.style.left = Math.random() * 60 + 10 + 'px';
        bubble.style.animationDuration = (Math.random() * 2 + 2) + 's';
        bubble.style.animationDelay = Math.random() * 0.5 + 's';

        this.bubblesContainer.appendChild(bubble);

        // Remove after animation
        setTimeout(() => {
            bubble.remove();
        }, 4000);
    }
}

// Initialize on page load
let particleSystem;
let animationController;
let bubbleSystem;

window.addEventListener('DOMContentLoaded', () => {
    particleSystem = new ParticleSystem();
    animationController = new AnimationController(particleSystem);

    // Expose globally
    window.particleSystem = particleSystem;
    window.animationController = animationController;

    const meterBubbles = document.getElementById('meter-bubbles');
    if (meterBubbles) {
        bubbleSystem = new BubbleSystem(meterBubbles);
        bubbleSystem.start();
        window.bubbleSystem = bubbleSystem;
    }

    // Add ripple effect to all buttons
    document.querySelectorAll('button, .control-btn, .vomit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            animationController.addButtonRipple(button, e);
        });
    });
});
