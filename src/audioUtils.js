// Debug flag for development logging
const DEBUG = process.env.NODE_ENV === 'development';

// Audio context singleton
let audioContext = null;

// Initialize audio context on first use
const getAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      if (DEBUG) console.error("Web Audio API not supported:", error);
      return null;
    }
  }

  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
};

// Voice loading state
let voicesLoaded = false;
let voiceLoadPromise = null;

/**
 * Warm up speech synthesis voices on app start.
 * Handles the async nature of getVoices() in Chrome.
 */
export const warmUpVoices = () => {
  if (!window.speechSynthesis) {
    if (DEBUG) console.warn("Speech synthesis not supported");
    return Promise.resolve([]);
  }

  if (voiceLoadPromise) return voiceLoadPromise;

  voiceLoadPromise = new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      voicesLoaded = true;
      if (DEBUG) console.log(`Voices loaded immediately: ${voices.length} voices`);
      resolve(voices);
    } else {
      // Chrome loads voices asynchronously
      const handleVoicesChanged = () => {
        const loadedVoices = window.speechSynthesis.getVoices();
        if (loadedVoices.length > 0) {
          voicesLoaded = true;
          if (DEBUG) console.log(`Voices loaded via event: ${loadedVoices.length} voices`);
          window.speechSynthesis.onvoiceschanged = null;
          resolve(loadedVoices);
        }
      };

      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

      // Fallback timeout in case event never fires
      setTimeout(() => {
        const fallbackVoices = window.speechSynthesis.getVoices();
        if (fallbackVoices.length > 0) {
          voicesLoaded = true;
          if (DEBUG) console.log(`Voices loaded via fallback: ${fallbackVoices.length} voices`);
        }
        resolve(fallbackVoices);
      }, 100);
    }
  });

  return voiceLoadPromise;
};

/**
 * Get the best available voice for speaking.
 * Prefers English voices, falls back to first available.
 */
const getPreferredVoice = () => {
  const voices = window.speechSynthesis.getVoices();

  // Prefer English voices
  const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
  if (englishVoice) return englishVoice;

  // Fallback to first available
  return voices[0] || null;
};

/**
 * Play an explosion sound effect using Web Audio API
 * Creates a satisfying "pop" with frequency sweep and noise
 */
export const playExplosionSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startTime = ctx.currentTime;
    const duration = 0.25;

    // Create oscillator for the main "boom"
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Frequency sweep from high to low (explosion effect)
    oscillator.frequency.setValueAtTime(400, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, startTime + 0.1);

    // Volume envelope - quick attack, exponential decay
    gainNode.gain.setValueAtTime(0.15, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    // Start and stop
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    // Add white noise burst for extra texture
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();

    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Noise envelope - shorter and quieter
    noiseGain.gain.setValueAtTime(0.08, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + 0.15);

  } catch (error) {
    console.error("Error playing explosion sound:", error);
  }
};

/**
 * Speak a number using Web Speech API.
 * MUST be called from a user gesture context (click handler) to work in Chrome.
 * Cancels any pending speech to avoid queue lockups.
 *
 * @param {number} number - The number to speak
 */
export const speakNumber = (number) => {
  if (!window.speechSynthesis) {
    if (DEBUG) console.warn("Speech synthesis not available");
    return;
  }

  try {
    // Cancel any pending speech to prevent queue lockups
    // This is safe even if nothing is speaking
    window.speechSynthesis.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(number.toString());
      utterance.rate = 1.0;
      utterance.pitch = 1.2;
      utterance.volume = 1.0;

      // Use preferred voice if available
      const voice = getPreferredVoice();
      if (voice) {
        utterance.voice = voice;
      }

      if (DEBUG) {
        utterance.onstart = () => console.log(`Speaking: ${number}`);
        utterance.onerror = (e) => console.error(`Speech error: ${e.error}`);
      }

      window.speechSynthesis.speak(utterance);
    };

    // If voices aren't loaded yet, retry with requestAnimationFrame
    // This keeps the call in the user gesture context
    if (!voicesLoaded) {
      if (DEBUG) console.log("Voices not ready, retrying...");
      requestAnimationFrame(() => {
        warmUpVoices().then(speak);
      });
    } else {
      speak();
    }
  } catch (error) {
    if (DEBUG) console.error("Error in speakNumber:", error);
  }
};
