// Sound effect file paths
const SOUND_FILES = {
  CLICK: ['/click1.mp3', '/click2.mp3', '/click3.mp3'],
  PURCHASE: '/onPurchase.mp3',
  LEVEL_UP: '/levelup.mp3',
  UPGRADE: '/upgrade.mp3'
};

// AudioManager singleton for handling all game audio
class AudioManager {
  private soundEnabled: boolean = true;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private lastClickIndex: number = -1;
  private initialized: boolean = false;

  // Volume levels for different sound types
  private readonly VOLUMES = {
    CLICK: 0.4,
    PURCHASE: 0.5,
    LEVEL_UP: 0.7,
    UPGRADE: 0.6
  };

  constructor() {
    this.preloadSounds();
  }

  // Initialize audio context - must be called on user interaction
  public init(): void {
    console.log('Initializing AudioManager...');
    
    if (this.initialized) {
      console.log('AudioManager already initialized');
      return;
    }
    
    try {
      // Create AudioContext if possible (will only work after user interaction)
      if (window.AudioContext || (window as any).webkitAudioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      }
      
      // Play a silent sound to unlock audio on iOS/Safari
      const silentSound = new Audio();
      silentSound.play().catch(e => console.log('Silent sound failed to play:', e));
      
      // Mark as initialized
      this.initialized = true;
      console.log('AudioManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
    }
  }

  // Preload all sound effects
  private preloadSounds(): void {
    try {
      // Preload click sounds
      SOUND_FILES.CLICK.forEach((path, index) => {
        const audio = new Audio(path);
        this.sounds.set(`click_${index}`, audio);
        audio.load(); // Begin loading
      });
      
      // Preload level up sound
      const levelUpAudio = new Audio(SOUND_FILES.LEVEL_UP);
      this.sounds.set('level_up', levelUpAudio);
      levelUpAudio.load();
      
      // Preload purchase sound
      const purchaseAudio = new Audio(SOUND_FILES.PURCHASE);
      this.sounds.set('purchase', purchaseAudio);
      purchaseAudio.load();
      
      // Preload upgrade sound
      const upgradeAudio = new Audio(SOUND_FILES.UPGRADE);
      this.sounds.set('upgrade', upgradeAudio);
      upgradeAudio.load();
      
      console.log("All sounds preloaded");
    } catch (error) {
      console.error("Error preloading sounds:", error);
    }
  }

  // Play a specific sound file
  private playSound(key: string, volume: number): void {
    if (!this.soundEnabled) {
      console.log('Sound is disabled, not playing', key);
      return;
    }
    
    // Try to initialize audio if not already done
    if (!this.initialized) {
      this.init();
    }
    
    try {
      const sound = this.sounds.get(key);
      
      if (sound) {
        console.log(`Playing sound: ${key}`);
        
        // Clone the audio to allow overlapping sounds
        const clonedSound = sound.cloneNode() as HTMLAudioElement;
        clonedSound.volume = volume;
        
        clonedSound.play().catch(error => {
          console.error(`Error playing sound ${key}:`, error);
          
          // If the first attempt failed due to interaction policy, 
          // try again after a slight delay
          if (error.name === 'NotAllowedError') {
            console.log('Attempting to play after delay due to browser restrictions');
            setTimeout(() => {
              const retrySound = new Audio(sound.src);
              retrySound.volume = volume;
              retrySound.play().catch(e => console.error('Retry failed:', e));
            }, 100);
          }
        });
      } else {
        console.warn(`Sound not found: ${key}`);
      }
    } catch (error) {
      console.error(`Error playing sound ${key}:`, error);
    }
  }

  // Play a random click sound
  public playClickSound(): void {
    console.log('Playing click sound...');
    
    // Get a random index that's different from the last one
    let index;
    do {
      index = Math.floor(Math.random() * SOUND_FILES.CLICK.length);
    } while (index === this.lastClickIndex && SOUND_FILES.CLICK.length > 1);
    
    this.lastClickIndex = index;
    this.playSound(`click_${index}`, this.VOLUMES.CLICK);
  }

  // Play the purchase sound
  public playPurchaseSound(): void {
    console.log('Playing purchase sound...');
    this.playSound('purchase', this.VOLUMES.PURCHASE);
  }

  // Play the level up sound
  public playLevelUpSound(): void {
    console.log('Playing level up sound...');
    this.playSound('level_up', this.VOLUMES.LEVEL_UP);
  }

  // Play the upgrade sound
  public playUpgradeSound(): void {
    console.log('Playing upgrade sound...');
    this.playSound('upgrade', this.VOLUMES.UPGRADE);
  }

  // Toggle sound on/off
  public toggleSound(state?: boolean): boolean {
    if (typeof state === 'boolean') {
      this.soundEnabled = state;
    } else {
      this.soundEnabled = !this.soundEnabled;
    }
    
    console.log(`Sound is now ${this.soundEnabled ? 'enabled' : 'disabled'}`);
    return this.soundEnabled;
  }

  // Check if sound is enabled
  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }
}

// Create a singleton instance
const audioManager = new AudioManager();

// Export the functions to use throughout the application
export const initAudio = () => audioManager.init();
export const playClickSound = () => audioManager.playClickSound();
export const playPurchaseSound = () => audioManager.playPurchaseSound();
export const playLevelUpSound = () => audioManager.playLevelUpSound();
export const playUpgradeSound = () => audioManager.playUpgradeSound();
export const toggleSound = (state?: boolean) => audioManager.toggleSound(state);
export const isSoundEnabled = () => audioManager.isSoundEnabled(); 