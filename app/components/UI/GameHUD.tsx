'use client';

import { useEffect, useState } from 'react';  

interface GameHUDProps {
    gameScene?: any;  
}

interface GameStats {
    score: number;  
    combo: number;  
    accuracy: number;  
}

interface LetterProgress {
    collected: string[];
    target: string;  
}

export default function GameHUD({ gameScene }: GameHUDProps) {
    const [stats, setStats] = useState<GameStats>({
        score: 0,  
        combo: 0,  
        accuracy: 100,  
    });

    const [letterProgress, setLetterProgress] = useState<LetterProgress>({
        collected: [],  
        target: 'EXCEL',  
    });

    useEffect(() => {
        if (!gameScene) return;  

        const handleScoreUpdate = (data: GameStats) => {
            setStats(data);  
        };
        const handleLetterUpdate = (data: LetterProgress) => {
            setLetterProgress(data);  
        };

        gameScene.events.on('score-updated', handleScoreUpdate);  
        gameScene.events.on('ui-update-letters', handleLetterUpdate);  

        return () => {
            gameScene.events.off('score-updated', handleScoreUpdate);  
            gameScene.events.off('ui-update-letters', handleLetterUpdate);  
        };
    }, [gameScene]);  

    return (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent text-white">  
            <div className="flex justify-between items-start">  
                {/* Score Section */}
                <div className="flex flex-col items-start">  
                    <div className="text-2xl font-bold">{stats.score.toLocaleString()}</div>
                    <div className="text-sm text-gray-300">Score</div>  
                </div>

                {/* Combo Section */}
                <div className="flex flex-col items-center">  
                    <div
                        className={`text-xl font-bold ${
                            stats.combo > 10 ? 'text-yellow-400' : stats.combo > 5 ? 'text-blue-400' : 'text-white'
                        }`}
                    >
                        {stats.combo}x
                    </div>
                    <div className="text-sm text-gray-300">Combo</div>  
                </div>

                {/* Accuracy Section */}
                <div className="flex flex-col items-end">  
                    <div
                        className={`text-xl font-bold ${
                            stats.accuracy >= 95 ? 'text-green-400' : stats.accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'
                        }`}
                    >
                        {stats.accuracy}%  
                    </div>
                    <div className="text-sm text-gray-300">Accuracy</div>  
                </div>
            </div>

            {/* Word Collection Progress */}
            <div className="mt-4 flex justify-center">  
                <div className="bg-black/30 rounded-lg px-4 py-2">  
                    <div className="text-sm text-gray-300 mb-1 text-center">Collect: {letterProgress.target}</div>
                    <div className="flex space-x-1">  
                        {letterProgress.target.split('').map((letter, index) => {
                            const isCollected = letterProgress.collected.includes(letter);  
                            return (
                                <div
                                    key={index}
                                    className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm font-bold ${
                                        isCollected
                                            ? 'bg-yellow-500 border-yellow-400 text-black'
                                            : 'bg-transparent border-gray-500 text-gray-400'
                                    }`}
                                >
                                    {letter}  
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}