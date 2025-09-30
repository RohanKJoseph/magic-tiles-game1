// src/game/config/tileTypes.ts
 export enum TileType {  
     NORMAL = 'normal',  
     FIRE = 'fire',  
     ICE = 'ice',  
     TELEPORT = 'teleport',  
     HINT = 'hint',  
     SHUFFLE = 'shuffle',  
     FREEZE = 'freeze',  
     SWAP = 'swap',  
}

 export interface SpecialTileConfig {  
     type: TileType;  
     emoji: string;  
     color: number;  
     duration?: number;  
     effect: string;  
     spawnRate: number;  
     scoreMultiplier: number;  
}

 export const SPECIAL_TILES: Record<TileType, SpecialTileConfig> = {  
    [TileType.NORMAL]: {
         type: TileType.NORMAL,  
         emoji: '',  
         color: 0x333333,  
         effect: 'none',  
         spawnRate: 0.7,  
         scoreMultiplier: 1,  
    },
    [TileType.FIRE]: {
         type: TileType.FIRE,  
         emoji: '🔥',  
         color: 0xff4500,  
         duration: 2000,  
         effect: 'Disappears if not tapped in time',  
         spawnRate: 0.1,  
         scoreMultiplier: 2,  
    },
    [TileType.ICE]: {
         type: TileType.ICE,  
         emoji: '🧊',  
         color: 0x87ceeb,  
         duration: 3000,  
         effect: 'Freezes part of board',  
         spawnRate: 0.05,  
         scoreMultiplier: 1.5,  
    },
    [TileType.TELEPORT]: {
         type: TileType.TELEPORT,  
         emoji: '🌀',  
         color: 0x9370db,  
         effect: 'Swaps two tiles randomly',  
         spawnRate: 0.05,  
         scoreMultiplier: 1.5,  
    },
    [TileType.HINT]: {
         type: TileType.HINT,  
         emoji: '💡',  
         color: 0xffd700,  
         effect: 'Highlights next tiles',  
         spawnRate: 0.08,  
         scoreMultiplier: 1.2,  
    },
    [TileType.SHUFFLE]: {
         type: TileType.SHUFFLE,  
         emoji: '🔀',  
         color: 0xff69b4,  
         effect: 'Rearranges upcoming tiles',  
         spawnRate: 0.05,  
         scoreMultiplier: 1.3,  
    },
    [TileType.FREEZE]: {
         type: TileType.FREEZE,  
         emoji: '❄️',  
         color: 0x4169e1,  
         duration: 3000,  
         effect: 'Pauses timer briefly',  
         spawnRate: 0.04,  
         scoreMultiplier: 2,  
    },
    [TileType.SWAP]: {
         type: TileType.SWAP,  
         emoji: '🔄',  
         color: 0x32cd32,  
         effect: 'Allows manual tile swap',  
         spawnRate: 0.03,  
         scoreMultiplier: 1.8,  
    },
};