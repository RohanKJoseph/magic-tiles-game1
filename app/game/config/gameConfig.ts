// src/game/config/gameConfig.ts
import * as Phaser from 'phaser';

export const gameConfig: Phaser.Types.Core.GameConfig = {
    // Mobile-first design
    type: Phaser.AUTO,
    width: 375,
    height: 667,
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};