'use client';
import { useState } from 'react';
import { SONG_LIBRARY, Song } from '../game/config/songs';

interface SongSelectorProps {
    onSongSelect: (song: Song) => void;
    selectedSong?: Song;
}

function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
        case 'Easy': return 'bg-green-600 text-white';
        case 'Medium': return 'bg-yellow-600 text-white';
        case 'Hard': return 'bg-orange-600 text-white';
        case 'Expert': return 'bg-red-600 text-white';
        default: return 'bg-gray-600 text-white';
    }
}

export default function SongSelector({ onSongSelect, selectedSong }: SongSelectorProps) {
    const [filter, setFilter] = useState<string>('All');
    const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];
    const filteredSongs = SONG_LIBRARY.filter(song => filter === 'All' || song.difficulty === filter);

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Choose Your Song</h2>
            <div className="flex justify-center mb-6 space-x-2">
                {difficulties.map(diff => (
                    <button
                        key={diff}
                        onClick={() => setFilter(diff)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === diff ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {diff}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSongs.map(song => (
                    <div
                        key={song.id}
                        onClick={() => onSongSelect(song)}
                        className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
                            selectedSong?.id === song.id ? 'ring-2 ring-blue-500 bg-gray-700' : ''
                        }`}
                    >
                        <h3 className="text-white font-semibold text-lg mb-1 truncate">{song.title}</h3>
                        <p className="text-gray-400 text-sm mb-2 truncate">{song.artist}</p>
                        <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(song.difficulty)}`}>
                                {song.difficulty}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}