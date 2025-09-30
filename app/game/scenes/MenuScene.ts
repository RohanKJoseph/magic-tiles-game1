// src/game/scenes/MenuScene.ts
import * as Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create(): void {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.text(centerX, centerY - 50, 'Magic Tiles Enhanced', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(centerX, centerY + 20, 'Select a song in the menu to begin!', {
            fontSize: '16px',
            color: '#dddddd',
        }).setOrigin(0.5);
    }
}