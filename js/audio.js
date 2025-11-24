// Audio Manager for Pocket Rehab
class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.music = null;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.3;
        this.muted = false;
        this.initialized = false;

        // Load settings from localStorage
        this.loadSettings();
    }

    // Initialize audio context (must be called after user interaction)
    async init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('Audio system initialized');
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    // Generate procedural sound effects using Web Audio API
    createSound(type, frequency = 440, duration = 0.2) {
        if (!this.context || this.muted) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = frequency;
        gainNode.gain.value = this.sfxVolume;

        switch (type) {
            case 'sine':
            case 'square':
            case 'sawtooth':
            case 'triangle':
                oscillator.type = type;
                break;
            default:
                oscillator.type = 'sine';
        }

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);

        // Fade out
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.context.currentTime + duration
        );

        return { oscillator, gainNode };
    }

    // Play spin sound (mechanical reel)
    playSpin() {
        if (!this.context || this.muted) return;

        const duration = 0.3;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + duration);

        gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        osc.start();
        osc.stop(this.context.currentTime + duration);
    }

    // Play landing sound (thump)
    playLand() {
        if (!this.context || this.muted) return;

        const duration = 0.1;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.context.currentTime + duration);

        gain.gain.setValueAtTime(this.sfxVolume * 0.5, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        osc.start();
        osc.stop(this.context.currentTime + duration);
    }

    // Play win sound (chime)
    playWin(intensity = 1) {
        if (!this.context || this.muted) return;

        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        const baseDelay = 0.1;

        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.context.createOscillator();
                const gain = this.context.createGain();

                osc.connect(gain);
                gain.connect(this.context.destination);

                osc.type = 'sine';
                osc.frequency.value = freq;

                const volume = this.sfxVolume * 0.4 * intensity;
                gain.gain.setValueAtTime(volume, this.context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

                osc.start();
                osc.stop(this.context.currentTime + 0.5);
            }, i * baseDelay * 1000);
        });
    }

    // Play big win celebration
    playBigWin() {
        if (!this.context || this.muted) return;

        // Play ascending arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4-G5
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.createSound('sine', freq, 0.3);
            }, i * 80);
        });

        // Add bass thump
        setTimeout(() => {
            this.createSound('sine', 65.41, 0.5); // C2
        }, 200);
    }

    // Play infection sound (eerie)
    playInfection() {
        if (!this.context || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.context.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.context.currentTime + 0.5);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.context.currentTime);
        filter.Q.value = 10;

        gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

        osc.start();
        osc.stop(this.context.currentTime + 0.5);
    }

    // Play mutation sound (transformation)
    playMutation() {
        if (!this.context || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(100, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.8);

        gain.gain.setValueAtTime(this.sfxVolume * 0.4, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.8);

        osc.start();
        osc.stop(this.context.currentTime + 0.8);
    }

    // Play crash/explosion sound
    playCrash() {
        if (!this.context || this.muted) return;

        // White noise explosion
        const bufferSize = this.context.sampleRate * 0.5;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.context.createBufferSource();
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();

        noise.buffer = buffer;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.context.destination);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.context.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.3);

        gain.gain.setValueAtTime(this.sfxVolume * 0.6, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

        noise.start();
        noise.stop(this.context.currentTime + 0.5);
    }

    // Play scatter sound (magical)
    playScatter() {
        if (!this.context || this.muted) return;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const freq = 800 + Math.random() * 400;
                this.createSound('sine', freq, 0.2);
            }, i * 100);
        }
    }

    // Play button click
    playClick() {
        if (!this.context || this.muted) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.type = 'square';
        osc.frequency.value = 800;

        gain.gain.setValueAtTime(this.sfxVolume * 0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);

        osc.start();
        osc.stop(this.context.currentTime + 0.05);
    }

    // Play bonus trigger sound
    playBonusTrigger() {
        if (!this.context || this.muted) return;

        // Fanfare
        const notes = [392.00, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.context.createOscillator();
                const gain = this.context.createGain();

                osc.connect(gain);
                gain.connect(this.context.destination);

                osc.type = 'square';
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(this.sfxVolume * 0.5, this.context.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.8);

                osc.start();
                osc.stop(this.context.currentTime + 0.8);
            }, i * 150);
        });
    }

    // Play cascade/tumble sound
    playCascade() {
        if (!this.context || this.muted) return;

        const freq = 300 + Math.random() * 200;
        this.createSound('triangle', freq, 0.15);
    }

    // Set SFX volume
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    // Toggle mute
    toggleMute() {
        this.muted = !this.muted;
        this.saveSettings();
        return this.muted;
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('audio_settings', JSON.stringify({
            sfxVolume: this.sfxVolume,
            musicVolume: this.musicVolume,
            muted: this.muted
        }));
    }

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('audio_settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.sfxVolume = settings.sfxVolume || 0.7;
                this.musicVolume = settings.musicVolume || 0.3;
                this.muted = settings.muted || false;
            } catch (e) {
                console.error('Failed to load audio settings', e);
            }
        }
    }
}

// Create global audio manager
let audioManager;

// Initialize on first user interaction
function initAudio() {
    if (!audioManager) {
        audioManager = new AudioManager();
    }
    if (!audioManager.initialized) {
        audioManager.init();
    }
}

// Auto-initialize on any user interaction
window.addEventListener('DOMContentLoaded', () => {
    const events = ['click', 'touchstart', 'keydown'];
    const initOnce = () => {
        initAudio();
        events.forEach(event => {
            document.removeEventListener(event, initOnce);
        });
    };

    events.forEach(event => {
        document.addEventListener(event, initOnce, { once: true });
    });
});
