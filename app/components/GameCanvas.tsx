'use client';

import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { gameConfig } from '../game/config/gameConfig';
import { MenuScene } from '../game/scenes/MenuScene';
import { GameScene } from '../game/scenes/GameScene';
import { GameOverScene } from '../game/scenes/GameOverScene';

interface GameCanvasProps {
    selectedSong?: any;
    onGameEnd?: (score: number) => void;
}

export default function GameCanvas({ selectedSong, onGameEnd }: GameCanvasProps) {
    const gameRef = useRef<Phaser.Game | null>(null);
    // FIX: Add a state to track if the game instance is ready
    const [isGameReady, setIsGameReady] = useState(false);

    // Effect to initialize and destroy the game
    useEffect(() => {
        if (!gameRef.current) {
            const config: Phaser.Types.Core.GameConfig = {
                ...gameConfig,
                parent: 'game-container',
                scene: [MenuScene, GameScene, GameOverScene],
            };
            
            gameRef.current = new Phaser.Game(config);
            
            // FIX: Set the game as ready once the instance is created
            setIsGameReady(true);

            // Forward the game-end event to the parent component
            if (onGameEnd) {
                gameRef.current.events.on('game-end', onGameEnd);
            }
        }

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, [onGameEnd]);

    // Effect to start the game when a song is selected AND the game is ready
    useEffect(() => {
        // FIX: Check for isGameReady before trying to start a scene
        if (selectedSong && isGameReady && gameRef.current) {
            gameRef.current.scene.start('GameScene', { song: selectedSong });
        }
    }, [selectedSong, isGameReady]); // FIX: Add isGameReady to the dependency array

    return (
        <div id="game-container" className="w-full h-full" />
    );
}