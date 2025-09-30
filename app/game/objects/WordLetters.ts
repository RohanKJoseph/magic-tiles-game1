// src/game/objects/WordLetters.ts
// Correct
import * as Phaser from 'phaser';

 export class WordLetter extends Phaser.GameObjects.Container {  
     public letter: string;  
     public isCollected: boolean = false;  
     private background!: Phaser.GameObjects.Ellipse;  
     private text!: Phaser.GameObjects.Text;  
    
     constructor(scene: Phaser.Scene, x: number, y: number, letter: string) {  
        super(scene, x, y);
         this.letter = letter;  
         this.createLetterVisuals();  
         this.setupFloatingAnimation();  
         scene.add.existing(this);  
    }

     private createLetterVisuals(): void {  
         this.background = this.scene.add.ellipse(0, 0, 40, 40, 0xffd700);  
        this.background.setStrokeStyle(2, 0xffaa00);
         this.add(this.background);  

         this.text = this.scene.add.text(0, 0, this.letter, {  
             fontSize: '16px',  
             fontFamily: 'Arial Black',  
             color: '#000000',  
             align: 'center',  
        });
         this.text.setOrigin(0.5);  
         this.add(this.text);  

         this.setSize(40, 40);  
         this.setInteractive();  
         this.on('pointerdown', this.collectLetter, this);  
    }

     private setupFloatingAnimation(): void {  
         this.scene.tweens.add({  
             targets: this,  
             y: this.y - 10,  
             duration: 1000,  
             yoyo: true,  
             repeat: -1,  
             ease: 'Sine.easeInOut',  
        });
         this.scene.tweens.add({  
             targets: this,  
             rotation: 0.2,  
             duration: 2000,  
             yoyo: true,  
             repeat: -1,  
             ease: 'Sine.easeInOut',  
        });
    }

     private collectLetter(): void {  
         if (this.isCollected) return;  
         this.isCollected = true;  
         this.scene.events.emit('letter-collected', this.letter);  

         this.scene.tweens.add({  
             targets: this,  
             scaleX: 1.5,  
             scaleY: 1.5,  
             alpha: 0,  
             duration: 300,  
             ease: 'Back.easeIn',  
             onComplete: () => this.destroy(),  
        });
    }

     public moveLetterDown(speed: number): void {  
        this.y += speed * 0.3;  // Letters move slower  
    }
}

 export class WordCollectionManager {  
     private scene: Phaser.Scene;  
     private targetWord: string = 'EXCEL';  
     private collectedLetters: string[] = [];  
     private letters: WordLetter[] = [];  

     constructor(scene: Phaser.Scene) {  
         this.scene = scene;  
         this.setupEventListeners();  
    }

     private setupEventListeners(): void {  
         this.scene.events.on('letter-collected', this.onLetterCollected, this);  
    }

     public spawnRandomLetter(): void {  
         if (Math.random() < 0.05) { // 5% chance  
             const letterIndex = Math.floor(Math.random() * this.targetWord.length);  
             const letter = this.targetWord[letterIndex];  
             const x = Math.random() * (this.scene.cameras.main.width - 80) + 40;  
             const y = -50;  
             const wordLetter = new WordLetter(this.scene, x, y, letter);  
             this.letters.push(wordLetter);  
        }
    }

     private onLetterCollected(letter: string): void {  
         this.collectedLetters.push(letter);  
        
         if (this.isWordComplete()) {  
             this.scene.events.emit('word-completed', this.targetWord);  
             this.collectedLetters = [];  
        }
        
         this.scene.events.emit('letters-updated', {  
             collected: this.collectedLetters,  
             target: this.targetWord,  
        });
    }

     private isWordComplete(): boolean {  
         const neededLetters = this.targetWord.split('');  
         const availableLetters = [...this.collectedLetters];  
         for (const needed of neededLetters) {  
             const index = availableLetters.indexOf(needed);  
             if (index === -1) return false;  
             availableLetters.splice(index, 1);  
        }
         return true;  
    }

     public update(): void {  
         this.letters = this.letters.filter(letter => {  
             letter.moveLetterDown(2);  
             if (letter.y > this.scene.cameras.main.height + 50) {  
                 letter.destroy();  
                 return false;  
            }
             return true;  
        });
    }
}