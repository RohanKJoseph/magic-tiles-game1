// src/game/managers/AudioManager.ts
import { Howl} from 'howler';
import * as Tone from 'tone';
import { Song } from '../config/songs';

export class AudioManager {
    private scene: Phaser.Scene;
    private currentSong?: Howl;
    private soundEffects: Map<string, Howl> = new Map();
    private analyzer?: Tone.Analyser;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.loadSoundEffects();
        this.setupAudioAnalysis();
    }

    private loadSoundEffects(): void {
        const effects = [
            { key: 'tile-hit', path: '/sounds/tile-hit.wav' },
            { key: 'fire-effect', path: '/sounds/fire.wav' },
            { key: 'ice-effect', path: '/sounds/ice.wav' },
            { key: 'word-complete', path: '/sounds/word-complete.wav' },
            { key: 'game-over', path: '/sounds/game-over.wav' },
        ];
        effects.forEach(effect => {
            const sound = new Howl({
                src: [effect.path],
                volume: 0.7,
                preload: true,
            });
            this.soundEffects.set(effect.key, sound);
        });
    }

    private setupAudioAnalysis(): void {
        if (Tone.context.state !== 'running') {
            Tone.context.resume();
        }
        this.analyzer = new Tone.Analyser('fft', 512);
        Tone.Master.connect(this.analyzer);
    }
    
    public loadSong(song: Song): void {
        if (this.currentSong) {
            this.currentSong.stop();
        }
        this.currentSong = new Howl({
            src: [song.audioPath],
            loop: false,
            volume: 0.8,
            onload: () => {
                console.log('Song loaded:', song.title);
                this.playSong(); // Play the song once it's loaded
            },
            onplay: () => {
                this.scene.events.emit('song-started');
                // FIX: Removed the recursive call to this.playSong() from here
            },
            onend: () => {
                this.scene.events.emit('song-ended');
            },
        });
    }

    public playSong(): void {
        if (this.currentSong && !this.currentSong.playing()) {
            this.currentSong.play();
        }
    }

    public playSound(key: string): void {
        const sound = this.soundEffects.get(key);
        if (sound) {
            sound.play();
        }
    }
}