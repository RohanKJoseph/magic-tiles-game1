import * as Phaser from 'phaser';
import { Tile } from '../objects/Tile';
import { WordCollectionManager } from '../objects/WordLetters';
import { AudioManager } from '../managers/AudioManager';
import { ScoreManager } from '../managers/ScoreManager';
import { TileType, SPECIAL_TILES } from '../config/tileTypes';
import { Song } from '../config/songs';

export class GameScene extends Phaser.Scene {
    private tiles: Tile[] = [];
    private lanes: number[] = [70, 150, 230, 310];
    private gameSpeed: number = 2;
    private scoreManager!: ScoreManager;
    private audioManager!: AudioManager;
    private wordManager!: WordCollectionManager;
    private currentSong?: Song;
    private isFrozen: boolean = false;
    private isGameOver: boolean = false;
    // FIX: Add a property to hold the freeze overlay object
    private freezeOverlay?: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(data: { song: Song }): void {
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
            if (!tile.active) {
                this.tiles.splice(i, 1);
                continue;
            }
            tile.scrollDown(this.gameSpeed);
            if (tile.isOffScreen()) {
                tile.destroy();
                this.tiles.splice(i, 1);
            }
        }
    }

    private onTileHit(tile: Tile): void {
        const config = SPECIAL_TILES[tile.tileType];
        this.scoreManager.addScore(100 * config.scoreMultiplier);
        this.audioManager.playSound('tile-hit');
    }

    private onFireTileExpired(): void {
        this.scoreManager.addScore(-50);
    }

    private onIceTileHit(): void { this.activateIceEffect(); }
    private onFreezeTileHit(): void { this.activateFreezeEffect(); }
    private onTeleportTileHit(): void { console.log('Teleport effect triggered!'); }
    private onHintTileHit(): void { console.log('Hint effect triggered!'); }
    private onShuffleTileHit(): void { console.log('Shuffle effect triggered!'); }
    private onSwapTileHit(): void { console.log('Swap effect triggered!'); }

    private activateIceEffect(): void {
        const iceOverlay = this.add.rectangle(
            this.cameras.main.centerX, this.cameras.main.centerY,
            this.cameras.main.width, this.cameras.main.height,
            0x87ceeb, 0.3
        );
        this.time.delayedCall(3000, () => iceOverlay.destroy());
    }

    // FIX: Rewrote this entire method to use a Rectangle overlay
    private activateFreezeEffect(): void {
        this.isFrozen = true;
        
        // Create a blue, semi-transparent rectangle that covers the screen
        this.freezeOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x4169e1
        );
        this.freezeOverlay.setAlpha(0.3);
        this.freezeOverlay.setDepth(100); // Ensure it's on top of other game objects

        // After 3 seconds, unfreeze the game and destroy the overlay
        this.time.delayedCall(3000, () => {
            this.isFrozen = false;
            this.freezeOverlay?.destroy();
        });
    }

    private onWordCompleted(): void {
        this.scoreManager.addScore(1000);
        this.audioManager.playSound('word-complete');
    }

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
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.time.removeAllEvents();
        this.audioManager.playSound('game-over');
        this.scene.start('GameOverScene', {
            score: this.scoreManager.getScore(),
            song: this.currentSong
        });
    }
}