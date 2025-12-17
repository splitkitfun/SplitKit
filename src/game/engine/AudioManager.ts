// Procedural audio generation for game sounds

export const generateChopSound = (audioCtx: AudioContext): AudioBuffer => {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.02));
  }
  return buffer;
};

export const generateLevelUpSound = (audioCtx: AudioContext): AudioBuffer => {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.4, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / audioCtx.sampleRate;
    // Rising arpeggio
    const freq1 = 440 * (1 + t * 0.5);
    const freq2 = 550 * (1 + t * 0.5);
    data[i] = (
      Math.sin(freq1 * 2 * Math.PI * t) * 0.3 +
      Math.sin(freq2 * 2 * Math.PI * t) * 0.2
    ) * Math.exp(-t * 3) * 0.6;
  }
  return buffer;
};

export const generateFishSplashSound = (audioCtx: AudioContext): AudioBuffer => {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / audioCtx.sampleRate;
    // Bubbly splash
    data[i] = (
      Math.sin(200 * 2 * Math.PI * t * (1 - t * 3)) * 0.3 +
      (Math.random() * 2 - 1) * 0.4
    ) * Math.exp(-t * 8);
  }
  return buffer;
};

export const generateCookSound = (audioCtx: AudioContext): AudioBuffer => {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / audioCtx.sampleRate;
    // Sizzle
    data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 6) * 0.3 *
      (1 + 0.5 * Math.sin(100 * 2 * Math.PI * t));
  }
  return buffer;
};

export const generateFootstepSound = (audioCtx: AudioContext): AudioBuffer => {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.01)) * 0.1;
  }
  return buffer;
};

export const generateQuestCompleteSound = (audioCtx: AudioContext): AudioBuffer => {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.6, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / audioCtx.sampleRate;
    // Triumphant fanfare
    const note1 = t < 0.2 ? 523 : t < 0.4 ? 659 : 784; // C5, E5, G5
    data[i] = Math.sin(note1 * 2 * Math.PI * t) * Math.exp(-t * 2) * 0.4;
  }
  return buffer;
};

