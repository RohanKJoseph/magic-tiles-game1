'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SongSelector from './components/SongSelector';
import { Song } from './game/config/songs';
import { Howler } from 'howler';
import * as Tone from 'tone';

const GameCanvas = dynamic(() => import('./components/GameCanvas'), {
    ssr: false,
});

export default function HomePage() {
    const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    const handleSongSelect = async (song: Song) => {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        if (Howler.ctx && Howler.ctx.state !== 'running') {
            await Howler.ctx.resume();
        }
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
                        // FIX: Convert null to undefined to match the expected prop type
                        selectedSong={selectedSong ?? undefined}
                        onGameEnd={handleGameEnd}
                    />
                )}
            </div>
        </main>
    );
}