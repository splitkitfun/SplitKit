import {
  generateChopSound,
  generateFishSplashSound,
  generateLevelUpSound,
  generateQuestCompleteSound,
} from '../engine/AudioManager';

// This file exports a factory function that creates the scene class
// Must be called after Phaser is loaded
export const createBootScene = (Phaser: typeof import('phaser')) => {
  return class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }

    preload() {
      // Generate procedural audio
      try {
        const audioCtx = new AudioContext();
        
        this.cache.audio.add('chop', generateChopSound(audioCtx));
        this.cache.audio.add('fish', generateFishSplashSound(audioCtx));
        this.cache.audio.add('lvlup', generateLevelUpSound(audioCtx));
        this.cache.audio.add('quest', generateQuestCompleteSound(audioCtx));
      } catch (e) {
        console.warn('Audio generation failed:', e);
      }
    }

    create() {
      // Don't auto-start MainScene - let React control it
    }
  };
};
