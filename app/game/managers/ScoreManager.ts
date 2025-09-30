// src/game/managers/ScoreManager.ts
 export class ScoreManager {  
     private scene: Phaser.Scene;  
     private score: number = 0;  
     private combo: number = 0;  
     private maxCombo: number = 0;  
     private accuracy: number = 100;  
     private totalTiles: number = 0;  
     private hitTiles: number = 0;  

     constructor(scene: Phaser.Scene) {  
         this.scene = scene;  
    }

     public addScore(points: number): void {  
         this.totalTiles++;  
         if (points > 0) {  
             this.combo++;  
             this.hitTiles++;  
             const comboMultiplier = Math.min(1 + (this.combo * 0.1), 3);  
             points = Math.floor(points * comboMultiplier);  
        } else {
             this.combo = 0;  
        }

         this.score += points;  
         this.maxCombo = Math.max(this.maxCombo, this.combo);  
         this.updateAccuracy();  

         this.scene.events.emit('score-updated', {  
             score: this.score,  
             combo: this.combo,  
             accuracy: Math.round(this.accuracy),  
        });
    }

     private updateAccuracy(): void {  
        this.accuracy = this.totalTiles > 0 ? (this.hitTiles / this.totalTiles)  * 100 : 100;  
    }

     public getScore(): number {  
         return this.score;  
    }
}   