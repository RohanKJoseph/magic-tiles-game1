// src/game/scenes/GameScene.ts
import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';
import { WordCollectionManager } from '../objects/WordLetters';
import { AudioManager } from '../managers/AudioManager';
import { ScoreManager } from '../managers/ScoreManager';
import { TileType, SPECIAL_TILES } from '../config/tileTypes';

export class GameScene extends Phaser.Scene {
    private tiles: Tile[] = [];
    private lanes: number[] = [70, 150, 230, 310];
    private gameSpeed: number = 2;
    private scoreManager!: ScoreManager;
    private audioManager!: AudioManager;
    private wordManager!: WordCollectionManager;
    private currentSong?: any;
    private isFrozen: boolean = false;
    // FIX 1: Add a flag to control the game over state
    private isGameOver: boolean = false;

    constructor() {
        super({ key: 'GameScene' });
    }
    
    create(data: { song: any }): void {
        // Reset state for when the scene restarts
        this.isGameOver = false;
        this.isFrozen = false;
        this.gameSpeed = 2;
        this.tiles = [];

        this.currentSong = data.song;
        this.setupGame();
        this.setupEventListeners();
        this.startGameplay();
    }

    update(): void {
        // FIX 1: Halt all updates if the game is over
        if (this.isGameOver) return;

        if (!this.isFrozen) {
            this.updateTiles();
            this.wordManager.update();
        }
        this.checkGameOver();
    }

    private setupGame(): void {
        this.drawLanes();
        this.scoreManager = new ScoreManager(this);
        this.audioManager = new AudioManager(this);
        this.wordManager = new WordCollectionManager(this);
        if (this.currentSong) {
            this.audioManager.loadSong(this.currentSong);
        }
    }

    private drawLanes(): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x444444, 0.5);
        this.lanes.forEach(x => {
            graphics.moveTo(x - 40, 0);
            graphics.lineTo(x - 40, this.cameras.main.height);
            graphics.moveTo(x + 40, 0);
            graphics.lineTo(x + 40, this.cameras.main.height);
        });
        graphics.strokePath();
    }

    private setupEventListeners(): void {
        this.events.on('tile-hit', this.onTileHit, this);
        this.events.on('fire-tile-expired', this.onFireTileExpired, this);
        this.events.on('ice-tile-hit', this.onIceTileHit, this);
        this.events.on('freeze-tile-hit', this.onFreezeTileHit, this);
        this.events.on('word-completed', this.onWordCompleted, this);
        
        // FIX 2: Add listeners for all other special tiles
        this.events.on('teleport-tile-hit', this.onTeleportTileHit, this);
        this.events.on('hint-tile-hit', this.onHintTileHit, this);
        this.events.on('shuffle-tile-hit', this.onShuffleTileHit, this);
        this.events.on('swap-tile-hit', this.onSwapTileHit, this);
    }

    private startGameplay(): void {
        this.time.addEvent({
            delay: 800,
            callback: this.spawnTile,
            callbackScope: this,
            loop: true,
        });
        this.time.addEvent({
            delay: 10000,
            callback: () => { this.gameSpeed += 0.2; },
            callbackScope: this,
            loop: true,
        });
    }

    private spawnTile(): void {
        if (this.isFrozen) return;
        const rand = Math.random();
        let tileType = TileType.NORMAL;
        let cumulativeRate = 0;
        for (const [type, config] of Object.entries(SPECIAL_TILES)) {
            cumulativeRate += config.spawnRate;
            if (rand <= cumulativeRate) {
                tileType = type as TileType;
                break;
            }
        }
        const lane = Phaser.Math.Between(0, 3);
        const x = this.lanes[lane];
        const y = -60;
        const tile = new Tile(this, x, y, lane, tileType);
        this.tiles.push(tile);
        this.wordManager.spawnRandomLetter();
    }

private updateTiles(): void {
    for (let i = this.tiles.length - 1; i >= 0; i--) {
        const tile = this.tiles[i];

        // FIX: Check if the tile is still active before trying to update it.
        // This prevents errors on tiles that were destroyed by other means (e.g., a hit animation).
        if (!tile.active) {
            this.tiles.splice(i, 1); // Clean up the reference from the array
            continue; // Skip to the next tile
        }

        tile.moveDown(this.gameSpeed);

        if (tile.isOffScreen()) {
            // Game over is handled by checkGameOver, just destroy the tile
            tile.destroy();
            this.tiles.splice(i, 1);
        }
    }
}

    private onTileHit(tile: Tile): void {
        const config = SPECIAL_TILES[tile.tileType];
        this.scoreManager.addScore(100 * config.scoreMultiplier);
        // FIX 3: Simplified the audio call
        this.audioManager.playSound('tile-hit');
    }

    private onFireTileExpired(tile: Tile): void {
        this.scoreManager.addScore(-50);
    }
    
    // --- Special Tile Effect Handlers ---

    private onIceTileHit(tile: Tile): void { this.activateIceEffect(); }
    private onFreezeTileHit(tile: Tile): void { this.activateFreezeEffect(); }

    // FIX 2: Add placeholder methods for the new effects
    private onTeleportTileHit(tile: Tile): void { console.log('Teleport effect triggered!'); }
    private onHintTileHit(tile: Tile): void { console.log('Hint effect triggered!'); }
    private onShuffleTileHit(tile: Tile): void { console.log('Shuffle effect triggered!'); }
    private onSwapTileHit(tile: Tile): void { console.log('Swap effect triggered!'); }

    private activateIceEffect(): void {
        const iceOverlay = this.add.rectangle(
            this.cameras.main.centerX, this.cameras.main.centerY,
            this.cameras.main.width, this.cameras.main.height,
            0x87ceeb, 0.3
        );
        this.time.delayedCall(3000, () => iceOverlay.destroy());
    }

    private activateFreezeEffect(): void {
        this.isFrozen = true;
        this.cameras.main.setTint(0x4169e1);
        this.time.delayedCall(3000, () => {
            this.isFrozen = false;
            this.cameras.main.clearTint();
        });
    }

    private onWordCompleted(word: string): void {
        this.scoreManager.addScore(1000);
        this.audioManager.playSound('word-complete');
    }
    
    // FIX 4: Consolidated game over logic into one place
    private checkGameOver(): void {
        const missedTile = this.tiles.some(tile =>
            tile.y > this.cameras.main.height - 100 &&
            tile.isActive &&
            tile.tileType === TileType.NORMAL
        );
        if (missedTile) {
            this.gameOver();
        }
    }

    private gameOver(): void {
        // FIX 1: Use the flag to ensure this only runs once
        if (this.isGameOver) return;
        this.isGameOver = true;

        console.log("Game Over!");
        
        // FIX 1: Stop all timed events (like spawning tiles)
        this.time.removeAllEvents();
        this.audioManager.playSound('game-over');
        
        this.scene.start('GameOverScene', {
            score: this.scoreManager.getScore(),
            song: this.currentSong
        });
    }
}