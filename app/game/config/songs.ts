// src/game/config/songs.ts
import { TileType } from './tileTypes';

// BeatPattern describes a single note or tile in the song
export interface BeatPattern {
    time: number; // Time in milliseconds
    lane: number; // Which lane (0-3)
    type: TileType;
    duration?: number; // For hold tiles
}

// Song describes the metadata and beatmap for a song
export interface Song {
    id: string;
    title: string;
    artist: string;
    duration: number;
    bpm: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    audioPath: string;
    coverImage: string;
    beatMap: BeatPattern[];
}

export const SONG_LIBRARY: Song[] = [
    {
        id: 'shape-of-you',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        duration: 240000,
        bpm: 96,
        difficulty: 'Medium',
        audioPath: '/audio/songs/shape-of-you.mp3',
        coverImage: '/images/covers/shape-of-you.jpg',
        beatMap: [], // Will be generated or imported
    },
    {
        id: 'despacito',
        title: 'Despacito',
        artist: 'Luis Fonsi',
        duration: 229000,
        bpm: 89,
        difficulty: 'Easy',
        audioPath: '/audio/songs/despacito.mp3',
        coverImage: '/images/covers/despacito.jpg',
        beatMap: [],
    }
    // Add more songs...
];