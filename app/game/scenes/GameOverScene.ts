// src/game/scenes/GameOverScene.ts
import * as Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    private finalScore: number = 0;

    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data: { score: number }): void {
        this.finalScore = data.score;
    }

    create(): void {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.text(centerX, centerY - 80, 'Game Over', {
            fontSize: '48px',
            color: '#ff4444',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(centerX, centerY, `Final Score: ${this.finalScore.toLocaleString()}`, {
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const restartText = this.add.text(centerX, centerY + 80, 'Click to Play Again', {
            fontSize: '20px',
            color: '#aaddff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        
        // This makes the text interactive
        restartText.setInteractive({ useHandCursor: true });

        restartText.on('pointerdown', () => {
            // Reload the page to go back to the React song selector UI
            window.location.reload();
        });
    }
}