 // src/game/objects/Tile.ts
import * as Phaser from 'phaser';
 import { TileType, SPECIAL_TILES } from '../config/tileTypes'; 

 export class Tile extends Phaser.GameObjects.Container { 
     public tileType: TileType; 
     public lane: number; 
     public isActive: boolean = true; 
     private background!: Phaser.GameObjects.Rectangle; 
     private emoji?: Phaser.GameObjects.Text; 
     private effectTimer?: Phaser.Time.TimerEvent; 

     constructor(scene: Phaser.Scene, x: number, y: number, lane: number, type: TileType = TileType.NORMAL) { 
        super(scene, x, y);
         this.lane = lane; 
         this.tileType = type; 

         this.createTileVisuals(); 
         this.setupInteraction(); 

         if (type === TileType.FIRE) { 
             this.addFireEffect(); 
        }
        
         scene.add.existing(this); 
    }

     private createTileVisuals(): void { 
         const tileConfig = SPECIAL_TILES[this.tileType]; 
         this.background = this.scene.add.rectangle(0, 0, 80, 120, tileConfig.color); 
         this.background.setStrokeStyle(2, 0xffffff, 0.5); 
         this.add(this.background); 

         if (tileConfig.emoji) { 
             this.emoji = this.scene.add.text(0, 0, tileConfig.emoji, { 
                 fontSize: '24px', 
                 align: 'center', 
            });
             this.emoji.setOrigin(0.5); 
             this.add(this.emoji); 
        }
    }

     private setupInteraction(): void { 
         this.setSize(80, 120); 
         this.setInteractive(); 
         this.on('pointerdown', this.onTileHit, this); 
    }

     private onTileHit(): void { 
         if (!this.isActive) return; 
         this.isActive = false; 
         this.triggerSpecialEffect(); 
         this.playHitAnimation(); 
         this.scene.events.emit('tile-hit', this); 
    }

     private triggerSpecialEffect(): void { 
         switch (this.tileType) { 
             case TileType.FIRE: this.scene.events.emit('fire-tile-hit', this); break;  
             case TileType.ICE: this.scene.events.emit('ice-tile-hit', this); break;   
             case TileType.TELEPORT: this.scene.events.emit('teleport-tile-hit', this); break;   
             case TileType.HINT: this.scene.events.emit('hint-tile-hit', this); break; 
             case TileType.SHUFFLE: this.scene.events.emit('shuffle-tile-hit', this); break; 
             case TileType.FREEZE: this.scene.events.emit('freeze-tile-hit', this); break;   
             case TileType.SWAP: this.scene.events.emit('swap-tile-hit', this); break;   
        }
    }

     private addFireEffect(): void { 
         const config = SPECIAL_TILES[TileType.FIRE]; 
         this.effectTimer = this.scene.time.delayedCall(config.duration!, () => { 
             if (this.isActive) { 
                 this.scene.events.emit('fire-tile-expired', this); 
                 this.destroy(); 
            }
        });
         this.scene.tweens.add({ 
             targets: this.background, 
             alpha: { from: 1, to: 0.3 }, 
             duration: 200, 
             yoyo: true, 
             repeat: -1, 
        });
    }

     private playHitAnimation(): void { 
         this.scene.tweens.add({ 
             targets: this, 
             scaleX: 1.2, 
             scaleY: 1.2, 
             alpha: 0, 
             duration: 200, 
             ease: 'Power2', 
             onComplete: () => { 
                 this.destroy(); 
            }
        });
    }

    public moveDown(speed: number): void { 
    this.y += speed; 
    console.log(`Tile moving, new Y coordinate: ${this.y}`);
}

     public isOffScreen(): boolean { 
         return this.y > this.scene.cameras.main.height + 60; 
    }

     destroy(fromScene?: boolean): void { 
         if (this.effectTimer) { 
             this.effectTimer.destroy(); 
        }
         super.destroy(fromScene); 
    }
}