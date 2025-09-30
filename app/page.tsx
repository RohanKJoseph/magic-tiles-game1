'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SongSelector from './components/SongSelector';
import { Song } from './game/config/songs';

// Dynamically import the GameCanvas component with SSR turned off
const GameCanvas = dynamic(() => import('./components/GameCanvas'), {
    ssr: false, // This is the crucial part that fixes the error
});

export default function HomePage() {
    const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    const handleSongSelect = (song: Song) => {
        setSelectedSong(song);
        setGameState('playing');
    };

    const handleGameEnd = (score: number) => {
        console.log('Game ended with score:', score);
        setGameState('menu');
        setSelectedSong(null);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
            <div className="relative w-[375px] h-[667px] max-w-full max-h-full border-2 border-gray-700 rounded-lg overflow-hidden shadow-2xl">
                {gameState === 'menu' ? (
                    <SongSelector onSongSelect={handleSongSelect} />
                ) : (
                    <GameCanvas
                        selectedSong={selectedSong}
                        onGameEnd={handleGameEnd}
                    />
                )}
            </div>
        </main>
    );
}