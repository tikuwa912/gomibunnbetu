class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy loaded context to satisfy browser autoplay policies
  }

  private init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn("Web Audio API not supported in this browser environment", e);
      }
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted() {
    return this.isMuted;
  }

  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      // Ignore audio failures
    }
  }

  // General-purpose sfxr synthesizer in pure Web Audio API
  playSfxr(params: {
    wave_type: number;
    p_env_attack: number;
    p_env_sustain: number;
    p_env_punch: number;
    p_env_decay: number;
    p_base_freq: number;
    p_freq_ramp: number;
    p_lpf_freq: number;
    p_lpf_resonance: number;
    p_hpf_freq: number;
    sound_vol: number;
  }) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Calculate frequency
      const baseFreqSq = params.p_base_freq * params.p_base_freq;
      const fperiod = 100.0 / (baseFreqSq * 8.0 + 0.001);
      const startFreq = 44100.0 / fperiod;

      // 2. Calculate envelope times (sfxr envelope is squared times 100000 samples)
      const attack = (params.p_env_attack * params.p_env_attack * 100000.0) / 44100.0;
      const sustain = (params.p_env_sustain * params.p_env_sustain * 100000.0) / 44100.0;
      const decay = (params.p_env_decay * params.p_env_decay * 100000.0) / 44100.0;
      const totalDuration = attack + sustain + decay;

      if (totalDuration <= 0) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      // Wave type mapping
      if (params.wave_type === 0) {
        osc.type = 'square';
      } else if (params.wave_type === 1) {
        osc.type = 'sawtooth';
      } else if (params.wave_type === 2) {
        osc.type = 'sine';
      } else {
        osc.type = 'triangle';
      }

      osc.frequency.setValueAtTime(startFreq, now);

      // Frequency slide / ramp
      if (params.p_freq_ramp !== 0) {
        const sampleCount = totalDuration * 44100;
        const multiplier = Math.pow(1.0 - params.p_freq_ramp * 0.00005, sampleCount);
        const endFreq = startFreq * multiplier;
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + totalDuration);
      }

      let lastNode: AudioNode = osc;

      // Highpass filter (sfxr HPF: p_hpf_freq^2 * 0.1 of sample rate)
      if (params.p_hpf_freq > 0) {
        const hpf = this.ctx.createBiquadFilter();
        hpf.type = 'highpass';
        const hpfCutoff = params.p_hpf_freq * params.p_hpf_freq * 0.1 * 44100.0;
        hpf.frequency.setValueAtTime(hpfCutoff, now);
        lastNode.connect(hpf);
        lastNode = hpf;
      }

      // Lowpass filter (sfxr LPF: p_lpf_freq^3 * 0.1 of sample rate)
      if (params.p_lpf_freq < 1) {
        const lpf = this.ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        const lpfCutoff = params.p_lpf_freq * params.p_lpf_freq * params.p_lpf_freq * 0.1 * 44100.0;
        lpf.frequency.setValueAtTime(Math.min(20000, lpfCutoff), now);
        if (params.p_lpf_resonance > 0) {
          lpf.Q.setValueAtTime(params.p_lpf_resonance * 10, now);
        }
        lastNode.connect(lpf);
        lastNode = lpf;
      }

      lastNode.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      // Volume envelope with sfxr parameters
      const maxVolume = params.sound_vol * 0.4; // Normalise gain to safe volume
      gainNode.gain.setValueAtTime(0, now);

      // Attack
      if (attack > 0) {
        gainNode.gain.linearRampToValueAtTime(maxVolume, now + attack);
      } else {
        gainNode.gain.setValueAtTime(maxVolume, now);
      }

      // Sustain & punch
      const sustainEnd = now + attack + sustain;
      if (params.p_env_punch > 0) {
        const punchVolume = maxVolume * (1.0 + params.p_env_punch * 2.0);
        gainNode.gain.setValueAtTime(punchVolume, now + attack);
        gainNode.gain.linearRampToValueAtTime(maxVolume, sustainEnd);
      } else {
        gainNode.gain.setValueAtTime(maxVolume, sustainEnd);
      }

      // Decay
      gainNode.gain.exponentialRampToValueAtTime(0.001, sustainEnd + decay);

      osc.start(now);
      osc.stop(sustainEnd + decay + 0.05);
    } catch (e) {
      console.warn("Failed to play sfxr synth", e);
    }
  }

  playClick() {
    // Play the custom sfxr parameters provided by the user
    this.playSfxr({
      wave_type: 0,
      p_env_attack: 0,
      p_env_sustain: 0.1548333081299967,
      p_env_punch: 0,
      p_env_decay: 0.019061842438680855,
      p_base_freq: 0.5354112079143551,
      p_freq_ramp: 0,
      p_lpf_freq: 1,
      p_lpf_resonance: 0,
      p_hpf_freq: 0.1,
      sound_vol: 0.25
    });
  }

  playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.type = 'sine';
      osc2.type = 'sine';

      const now = this.ctx.currentTime;
      // Beautiful major third chord (C5 - E5)
      osc1.frequency.setValueAtTime(523.25, now);
      osc2.frequency.setValueAtTime(659.25, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.start(now);
      osc1.stop(now + 0.25);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.25);
    } catch (e) {
      // Ignore
    }
  }

  playIncorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      // Ignore
    }
  }

  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Sparkly arpeggio C4 - E4 - G4 - C5 - E5
      const freqs = [261.63, 329.63, 392.00, 523.25, 659.25];
      freqs.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.06, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {
      // Ignore
    }
  }
}

export const sounds = new SoundEffects();
