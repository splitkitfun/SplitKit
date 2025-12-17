import { 
  PlayerState, TreeObj, FishSpot, TREE_TYPES, FISH_TYPES
} from '../types';
import { AREAS, AREA_WIDTH, AREA_HEIGHT, TILE_SIZE } from '../engine/Areas';
import { saveGame, addXpToSkill, defaultPlayerState } from '../systems/SaveSystem';
import { addToInventory, getItemCount, depositToBank, withdrawFromBank, getTotalItemCount } from '../systems/InventorySystem';
import { updateQuestProgress, hasUnlock } from '../systems/QuestSystem';

export interface GameCallbacks {
  onStateChange: (state: PlayerState) => void;
  onOpenInventory: () => void;
  onOpenBank: () => void;
  onOpenQuests: () => void;
  onClosePanel: () => void;
  getMuted: () => boolean;
}

// Factory function that creates the MainScene class after Phaser is loaded
export const createMainScene = (Phaser: typeof import('phaser')) => {
  return class MainScene extends Phaser.Scene {
    // Player
    player!: Phaser.GameObjects.Container;
    playerHead!: Phaser.GameObjects.Rectangle;
    playerBody!: Phaser.GameObjects.Rectangle;
    playerArm!: Phaser.GameObjects.Rectangle;
    
    // World
    worldGroup!: Phaser.GameObjects.Group;
    trees: TreeObj[] = [];
    fishSpots: FishSpot[] = [];
    npcs: Map<string, Phaser.GameObjects.Container> = new Map();
    bankChest: Phaser.GameObjects.Container | null = null;
    campfire: Phaser.GameObjects.Container | null = null;
    
    // State
    state!: PlayerState;
    callbacks!: GameCallbacks;
    
    // Input
    keys!: {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
      SHIFT: Phaser.Input.Keyboard.Key;
      I: Phaser.Input.Keyboard.Key;
      B: Phaser.Input.Keyboard.Key;
      Q: Phaser.Input.Keyboard.Key;
      ESC: Phaser.Input.Keyboard.Key;
    };
    
    // Actions
    currentAction: 'idle' | 'chopping' | 'fishing' | 'cooking' = 'idle';
    actionTimer = 0;
    actionDuration = 2000;
    activeTree: TreeObj | null = null;
    activeFishSpot: FishSpot | null = null;
    cookingItem: string | null = null;
    
    // UI elements
    areaNameText!: Phaser.GameObjects.Text;
    actionBarBg!: Phaser.GameObjects.Rectangle;
    actionBar!: Phaser.GameObjects.Rectangle;
    msgText!: Phaser.GameObjects.Text;
    energyBar!: Phaser.GameObjects.Rectangle;
    energyBarBg!: Phaser.GameObjects.Rectangle;
    minimapBg!: Phaser.GameObjects.Rectangle;
    minimapPlayer!: Phaser.GameObjects.Rectangle;
    minimapDots: Phaser.GameObjects.Rectangle[] = [];
    
    // Audio
    chopSfx!: Phaser.Sound.BaseSound;
    fishSfx!: Phaser.Sound.BaseSound;
    lvlUpSfx!: Phaser.Sound.BaseSound;
    questSfx!: Phaser.Sound.BaseSound;
    
    // Timing
    lastFootstep = 0;
    saveTimer = 0;
    nearBank = false;

    constructor() {
      super('MainScene');
    }

    init(data: { state: PlayerState; callbacks: GameCallbacks }) {
      this.state = data.state || defaultPlayerState();
      this.callbacks = data.callbacks;
    }

    create() {
      this.cameras.main.setBackgroundColor('#3b7a1a');
      this.cameras.main.setBounds(0, 0, AREA_WIDTH, AREA_HEIGHT);
      this.physics.world.setBounds(0, 0, AREA_WIDTH, AREA_HEIGHT);

      // Audio
      this.chopSfx = this.sound.add('chop', { volume: 0.3 });
      this.fishSfx = this.sound.add('fish', { volume: 0.3 });
      this.lvlUpSfx = this.sound.add('lvlup', { volume: 0.4 });
      this.questSfx = this.sound.add('quest', { volume: 0.4 });

      this.worldGroup = this.add.group();
      this.loadArea(this.state.currentArea);

      // Area name
      this.areaNameText = this.add.text(160, 70, '', {
        fontSize: '10px',
        color: '#ffcc00',
        fontFamily: 'monospace',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(15).setAlpha(0);
      this.showAreaName();

      // Create player
      this.createPlayer();

      // Input
      this.keys = {
        W: this.input.keyboard!.addKey('W'),
        A: this.input.keyboard!.addKey('A'),
        S: this.input.keyboard!.addKey('S'),
        D: this.input.keyboard!.addKey('D'),
        SHIFT: this.input.keyboard!.addKey('SHIFT'),
        I: this.input.keyboard!.addKey('I'),
        B: this.input.keyboard!.addKey('B'),
        Q: this.input.keyboard!.addKey('Q'),
        ESC: this.input.keyboard!.addKey('ESC'),
      };

      // UI
      this.createUI();

      // Click handler
      this.input.on('pointerdown', this.handleClick, this);

      // Hotkey handlers
      this.input.keyboard!.on('keydown-I', () => this.callbacks.onOpenInventory());
      this.input.keyboard!.on('keydown-B', () => {
        if (this.nearBank) this.callbacks.onOpenBank();
      });
      this.input.keyboard!.on('keydown-Q', () => this.callbacks.onOpenQuests());
      this.input.keyboard!.on('keydown-ESC', () => this.callbacks.onClosePanel());
    }

    createPlayer() {
      this.playerHead = this.add.rectangle(0, -8, 10, 10, 0xffcc99);
      this.playerBody = this.add.rectangle(0, 2, 10, 12, 0x2255aa);
      this.playerArm = this.add.rectangle(6, 0, 4, 8, 0xffcc99);
      
      this.player = this.add.container(this.state.x, this.state.y, [
        this.playerBody,
        this.playerHead,
        this.playerArm,
      ]).setDepth(2);
      
      this.physics.world.enable(this.player);
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setSize(12, 20);
      body.setCollideWorldBounds(true);
      
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    createUI() {
      // Action progress bar
      this.actionBarBg = this.add.rectangle(160, 160, 60, 8, 0x222222)
        .setScrollFactor(0).setDepth(10).setVisible(false).setStrokeStyle(1, 0x444444);
      this.actionBar = this.add.rectangle(131, 156, 0, 6, 0xffcc00)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(10).setVisible(false);

      // Message text
      this.msgText = this.add.text(160, 140, '', {
        fontSize: '8px',
        color: '#ff6b6b',
        fontFamily: 'monospace',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(10);

      // Energy bar
      this.add.rectangle(5, 170, 50, 10, 0x111111, 0.7)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(9).setStrokeStyle(1, 0x333333);
      this.add.text(7, 161, 'Energy', { fontSize: '6px', color: '#888', fontFamily: 'monospace' })
        .setScrollFactor(0).setDepth(10);
      this.energyBarBg = this.add.rectangle(7, 172, 46, 6, 0x333333)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(10);
      this.energyBar = this.add.rectangle(7, 172, 46, 6, 0xffaa00)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(10);

      // Minimap
      this.minimapBg = this.add.rectangle(270, 40, 45, 45, 0x111111, 0.8)
        .setScrollFactor(0).setDepth(9).setStrokeStyle(1, 0x333333);
      this.minimapPlayer = this.add.rectangle(292, 62, 3, 3, 0x00ff88)
        .setScrollFactor(0).setDepth(11);
    }

    handleClick() {
      if (this.currentAction !== 'idle') return;

      // Check NPCs
      for (const [name, npc] of this.npcs) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
        if (dist < 50) {
          this.handleNPCInteraction(name);
          return;
        }
      }

      // Check bank
      if (this.bankChest) {
        const bankDist = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          this.bankChest.x, this.bankChest.y
        );
        if (bankDist < 50) {
          this.callbacks.onOpenBank();
          return;
        }
      }

      // Check campfire for cooking
      if (this.campfire) {
        const fireDist = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          this.campfire.x, this.campfire.y
        );
        if (fireDist < 50) {
          this.startCooking();
          return;
        }
      }

      // Check trees
      for (const tree of this.trees) {
        if (tree.depleted) continue;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, tree.x, tree.y);
        if (dist < 60) {
          this.startChopping(tree);
          return;
        }
      }

      // Check fish spots
      for (const spot of this.fishSpots) {
        if (spot.depleted) continue;
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, spot.x, spot.y);
        if (dist < 60) {
          this.startFishing(spot);
          return;
        }
      }
    }

    handleNPCInteraction(npcName: string) {
      // Simple dialogue - could be expanded
      this.showMessage(`${npcName}: Hello, adventurer!`);
    }

    startChopping(tree: TreeObj) {
      const wcLevel = this.state.skills.woodcutting.level;
      if (wcLevel < tree.type.lvl) {
        this.showMessage(`Need Woodcutting Lvl ${tree.type.lvl}`);
        return;
      }

      this.currentAction = 'chopping';
      this.activeTree = tree;
      this.actionDuration = hasUnlock(this.state, 'faster_chop') ? 1800 : 2000;
      this.actionTimer = this.actionDuration;
      this.actionBarBg.setVisible(true);
      this.actionBar.setVisible(true);
    }

    startFishing(spot: FishSpot) {
      const fishLevel = this.state.skills.fishing.level;
      if (fishLevel < spot.type.lvl) {
        this.showMessage(`Need Fishing Lvl ${spot.type.lvl}`);
        return;
      }

      this.currentAction = 'fishing';
      this.activeFishSpot = spot;
      this.actionDuration = 2500;
      this.actionTimer = this.actionDuration;
      this.actionBarBg.setVisible(true);
      this.actionBar.setVisible(true);
    }

    startCooking() {
      // Find raw fish in inventory
      const rawItems = ['raw_shrimp', 'raw_trout'];
      for (const itemId of rawItems) {
        if (getItemCount(this.state.inventory, itemId) > 0) {
          this.currentAction = 'cooking';
          this.cookingItem = itemId;
          this.actionDuration = 1500;
          this.actionTimer = this.actionDuration;
          this.actionBarBg.setVisible(true);
          this.actionBar.setVisible(true);
          return;
        }
      }
      this.showMessage('No raw fish to cook!');
    }

    completeAction() {
      this.actionBarBg.setVisible(false);
      this.actionBar.setVisible(false);
      this.actionBar.width = 0;

      if (this.currentAction === 'chopping' && this.activeTree) {
        this.completeChopping();
      } else if (this.currentAction === 'fishing' && this.activeFishSpot) {
        this.completeFishing();
      } else if (this.currentAction === 'cooking' && this.cookingItem) {
        this.completeCooking();
      }

      this.currentAction = 'idle';
      this.activeTree = null;
      this.activeFishSpot = null;
      this.cookingItem = null;
    }

    completeChopping() {
      const tree = this.activeTree!;
      const xpGain = tree.type.xp;
      
      // Add item
      const result = addToInventory(this.state.inventory, tree.type.itemId, 1);
      if (!result.success) {
        this.showMessage('Inventory full!');
        return;
      }
      this.state.inventory = result.inventory;

      // Add XP
      const { leveledUp, newLevel } = addXpToSkill(this.state.skills.woodcutting, xpGain);
      
      // SFX
      if (!this.callbacks.getMuted()) this.chopSfx.play();

      // Floating text
      this.showFloatingText(`+1 ${tree.type.name} Log +${xpGain} XP`);

      // Level up
      if (leveledUp) {
        this.showLevelUp('Woodcutting', newLevel);
      }

      // Update quest progress
      const logsCount = getTotalItemCount(this.state.inventory, ['logs', 'oak_logs', 'willow_logs']);
      const questResult = updateQuestProgress(this.state, 'tutorial', logsCount);
      if (questResult.completed) {
        this.showQuestComplete('Getting Started');
      }
      this.state = questResult.state;

      // Deplete tree
      tree.depleted = true;
      tree.canopy.setFillStyle(0x555555);
      tree.trunk.setFillStyle(0x333333);
      this.time.delayedCall(4000, () => {
        tree.depleted = false;
        tree.canopy.setFillStyle(tree.type.canopyColor);
        tree.trunk.setFillStyle(tree.type.trunkColor);
      });

      this.updateState();
    }

    completeFishing() {
      const spot = this.activeFishSpot!;
      const xpGain = spot.type.xp;

      // Add item
      const result = addToInventory(this.state.inventory, spot.type.itemId, 1);
      if (!result.success) {
        this.showMessage('Inventory full!');
        return;
      }
      this.state.inventory = result.inventory;

      // Add XP
      const { leveledUp, newLevel } = addXpToSkill(this.state.skills.fishing, xpGain);

      // SFX
      if (!this.callbacks.getMuted()) this.fishSfx.play();

      // Floating text
      this.showFloatingText(`+1 ${spot.type.name} +${xpGain} XP`);

      // Level up
      if (leveledUp) {
        this.showLevelUp('Fishing', newLevel);
      }

      // Update quest progress
      const shrimpCount = getItemCount(this.state.inventory, 'raw_shrimp') + 
                          getItemCount(this.state.inventory, 'cooked_shrimp');
      const questResult = updateQuestProgress(this.state, 'first_catch', shrimpCount);
      if (questResult.completed) {
        this.showQuestComplete('First Catch');
      }
      this.state = questResult.state;

      // Deplete spot temporarily
      spot.depleted = true;
      spot.sprite.setAlpha(0.3);
      this.time.delayedCall(5000, () => {
        spot.depleted = false;
        spot.sprite.setAlpha(1);
      });

      this.updateState();
    }

    completeCooking() {
      const rawItem = this.cookingItem!;
      const fishType = Object.values(FISH_TYPES).find(f => f.itemId === rawItem);
      if (!fishType) return;

      // Remove raw, add cooked
      const idx = this.state.inventory.findIndex(s => s.itemId === rawItem);
      if (idx !== -1) {
        if (this.state.inventory[idx].quantity <= 1) {
          this.state.inventory.splice(idx, 1);
        } else {
          this.state.inventory[idx].quantity--;
        }
      }

      const addResult = addToInventory(this.state.inventory, fishType.cookedItemId, 1);
      this.state.inventory = addResult.inventory;

      this.showFloatingText(`Cooked ${fishType.name}!`);
      this.updateState();
    }

    showMessage(text: string) {
      this.msgText.setText(text);
      this.time.delayedCall(2000, () => this.msgText.setText(''));
    }

    showFloatingText(text: string) {
      const floatText = this.add.text(this.player.x, this.player.y - 20, text, {
        fontSize: '8px',
        color: '#ffcc00',
        fontFamily: 'monospace',
      }).setOrigin(0.5).setDepth(20);
      
      this.tweens.add({
        targets: floatText,
        y: floatText.y - 30,
        alpha: 0,
        duration: 1000,
        onComplete: () => floatText.destroy(),
      });
    }

    showLevelUp(skill: string, level: number) {
      if (!this.callbacks.getMuted()) this.lvlUpSfx.play();
      
      const text = this.add.text(160, 90, `${skill} Level Up! Lvl ${level}`, {
        fontSize: '12px',
        color: '#00ff88',
        fontFamily: 'monospace',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
      
      this.tweens.add({
        targets: text,
        alpha: 0,
        duration: 2000,
        onComplete: () => text.destroy(),
      });
    }

    showQuestComplete(questName: string) {
      if (!this.callbacks.getMuted()) this.questSfx.play();
      
      const text = this.add.text(160, 110, `Quest Complete: ${questName}!`, {
        fontSize: '10px',
        color: '#ffaa00',
        fontFamily: 'monospace',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(20);
      
      this.tweens.add({
        targets: text,
        alpha: 0,
        delay: 2000,
        duration: 1000,
        onComplete: () => text.destroy(),
      });
    }

    showAreaName() {
      const area = AREAS[this.state.currentArea];
      this.areaNameText.setText(area.name);
      this.areaNameText.setAlpha(1);
      this.tweens.add({
        targets: this.areaNameText,
        alpha: 0,
        delay: 1500,
        duration: 1000,
      });
    }

    updateState() {
      this.state.x = this.player.x;
      this.state.y = this.player.y;
      this.callbacks.onStateChange({ ...this.state });
    }

    update(time: number, delta: number) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;

      // Handle actions
      if (this.currentAction !== 'idle') {
        body.setVelocity(0, 0);
        this.actionTimer -= delta;
        this.actionBar.width = (1 - this.actionTimer / this.actionDuration) * 58;

        // Animation
        if (this.currentAction === 'chopping') {
          const swing = Math.sin(time * 0.015) * 15;
          this.playerArm.setAngle(swing - 30);
          this.playerArm.setPosition(7, -2 + Math.abs(swing) * 0.1);
        } else if (this.currentAction === 'fishing') {
          const bob = Math.sin(time * 0.005) * 2;
          this.playerArm.setAngle(-45 + bob);
        }

        if (this.actionTimer <= 0) {
          this.completeAction();
        }
        return;
      }

      // Reset arm
      this.playerArm.setAngle(0);
      this.playerArm.setPosition(6, 0);

      // Movement
      const sprinting = this.keys.SHIFT.isDown && this.state.energy > 0;
      const speed = sprinting ? 180 : 120;
      let vx = 0, vy = 0;

      if (this.keys.W.isDown) vy = -speed;
      if (this.keys.S.isDown) vy = speed;
      if (this.keys.A.isDown) vx = -speed;
      if (this.keys.D.isDown) vx = speed;

      body.setVelocity(vx, vy);

      // Energy
      if (sprinting && (vx !== 0 || vy !== 0)) {
        this.state.energy = Math.max(0, this.state.energy - delta * 0.02);
      } else if (vx === 0 && vy === 0) {
        this.state.energy = Math.min(100, this.state.energy + delta * 0.01);
      } else {
        this.state.energy = Math.min(100, this.state.energy + delta * 0.005);
      }
      this.energyBar.width = (this.state.energy / 100) * 46;

      // Animation
      if (vx === 0 && vy === 0) {
        const bob = Math.sin(time * 0.003) * 0.5;
        this.playerHead.setPosition(0, -8 + bob);
      } else {
        const walk = Math.sin(time * 0.012) * 1.5;
        this.playerHead.setPosition(0, -8 + Math.abs(walk) * 0.3);
        this.playerBody.setPosition(0, 2 + Math.abs(walk) * 0.2);
      }

      // Area transitions
      this.checkAreaTransition();

      // Check if near bank
      this.nearBank = false;
      if (this.bankChest) {
        const bankDist = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          this.bankChest.x, this.bankChest.y
        );
        this.nearBank = bankDist < 60;
      }

      // Update minimap
      this.minimapPlayer.setPosition(
        270 + (this.player.x / AREA_WIDTH) * 45,
        40 + (this.player.y / AREA_HEIGHT) * 45
      );

      // Auto-save
      this.saveTimer += delta;
      if (this.saveTimer > 5000) {
        this.saveTimer = 0;
        this.state.x = this.player.x;
        this.state.y = this.player.y;
        saveGame(this.state);
      }
    }

    checkAreaTransition() {
      const area = AREAS[this.state.currentArea];
      
      if (this.player.x > AREA_WIDTH - 20 && area.connections.right !== undefined) {
        this.transitionToArea(area.connections.right, 40, this.player.y);
      } else if (this.player.x < 20 && area.connections.left !== undefined) {
        this.transitionToArea(area.connections.left, AREA_WIDTH - 40, this.player.y);
      }
    }

    transitionToArea(newAreaId: number, newX: number, newY: number) {
      this.state.currentArea = newAreaId;
      this.player.x = newX;
      this.player.y = newY;
      this.loadArea(newAreaId);
      this.showAreaName();
      this.updateState();
    }

    loadArea(areaIndex: number) {
      this.worldGroup.clear(true, true);
      this.trees = [];
      this.fishSpots = [];
      this.npcs.clear();
      this.bankChest = null;
      this.campfire = null;
      this.minimapDots.forEach(d => d.destroy());
      this.minimapDots = [];

      const area = AREAS[areaIndex];
      const grassColors = area.grassColors;
      const borderColor = area.borderColor;

      // Draw tiles
      for (let x = 0; x < AREA_WIDTH; x += TILE_SIZE) {
        for (let y = 0; y < AREA_HEIGHT; y += TILE_SIZE) {
          const edgeY = y === 0 || y >= AREA_HEIGHT - TILE_SIZE;
          const edgeLeft = x === 0 && area.connections.left === undefined;
          const edgeRight = x >= AREA_WIDTH - TILE_SIZE && area.connections.right === undefined;
          const edge = edgeY || edgeLeft || edgeRight;

          const color = edge ? borderColor : grassColors[Math.floor(Math.random() * grassColors.length)];
          const tile = this.add.rectangle(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, color);
          this.worldGroup.add(tile);

          // Ground noise
          if (!edge && Math.random() < 0.3) {
            const dot = this.add.rectangle(
              x + 4 + Math.random() * 24,
              y + 4 + Math.random() * 24,
              2, 2,
              grassColors[0] - 0x101010
            ).setAlpha(0.5);
            this.worldGroup.add(dot);
          }
        }
      }

      // Water for riverbank
      if (area.id === 2) {
        for (let x = 0; x < AREA_WIDTH; x += TILE_SIZE) {
          for (let y = AREA_HEIGHT - TILE_SIZE * 2; y < AREA_HEIGHT; y += TILE_SIZE) {
            const water = this.add.rectangle(
              x + TILE_SIZE / 2, y + TILE_SIZE / 2,
              TILE_SIZE, TILE_SIZE,
              0x2266aa
            ).setAlpha(0.8);
            this.worldGroup.add(water);
          }
        }
      }

      // Spawn trees
      for (const pos of area.trees) {
        const type = TREE_TYPES[pos.type];
        if (!type) continue;
        
        const scale = 0.9 + Math.random() * 0.25;
        const shadow = this.add.ellipse(pos.x + 3, pos.y + 20, 40 * scale, 12, 0x000000, 0.35);
        const trunk = this.add.rectangle(pos.x, pos.y + 6, 14 * scale, 32 * scale, type.trunkColor).setDepth(3);
        const layer1 = this.add.ellipse(pos.x - 10 * scale, pos.y - 14 * scale, 30 * scale, 26 * scale, type.canopyColor - 0x151515).setDepth(4);
        const layer2 = this.add.ellipse(pos.x + 10 * scale, pos.y - 12 * scale, 28 * scale, 24 * scale, type.canopyColor - 0x0a0a0a).setDepth(4);
        const canopy = this.add.ellipse(pos.x, pos.y - 18 * scale, 36 * scale, 30 * scale, type.canopyColor).setDepth(4);
        
        this.worldGroup.add(shadow);
        this.worldGroup.add(trunk);
        this.worldGroup.add(layer1);
        this.worldGroup.add(layer2);
        this.worldGroup.add(canopy);
        
        this.trees.push({ x: pos.x, y: pos.y, type, trunk, canopy, depleted: false });

        // Minimap dot
        const dot = this.add.rectangle(
          270 + (pos.x / AREA_WIDTH) * 45,
          40 + (pos.y / AREA_HEIGHT) * 45,
          2, 2, 0x228822
        ).setScrollFactor(0).setDepth(10);
        this.minimapDots.push(dot);
      }

      // Spawn fish spots
      for (const pos of area.fishSpots) {
        const type = FISH_TYPES[pos.type];
        if (!type) continue;

        const sprite = this.add.ellipse(pos.x, pos.y, 30, 15, 0x4488cc, 0.6).setDepth(1);
        // Bubbles animation
        this.tweens.add({
          targets: sprite,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 1000,
          yoyo: true,
          repeat: -1,
        });
        
        this.worldGroup.add(sprite);
        this.fishSpots.push({ x: pos.x, y: pos.y, type, sprite, depleted: false });

        // Minimap dot
        const dot = this.add.rectangle(
          270 + (pos.x / AREA_WIDTH) * 45,
          40 + (pos.y / AREA_HEIGHT) * 45,
          2, 2, 0x4488cc
        ).setScrollFactor(0).setDepth(10);
        this.minimapDots.push(dot);
      }

      // Spawn landmarks
      for (const landmark of area.landmarks) {
        this.createLandmark(landmark);
      }
    }

    createLandmark(landmark: { type: string; x: number; y: number; props?: Record<string, unknown> }) {
      const { type, x, y, props } = landmark;

      switch (type) {
        case 'sign': {
          const post = this.add.rectangle(x, y, 6, 30, 0x5c3d2e).setDepth(0);
          const board = this.add.rectangle(x, y - 12, 40, 16, 0x6b5344).setDepth(0).setStrokeStyle(1, 0x4a3728);
          const text = this.add.text(x, y - 14, props?.text as string || '', {
            fontSize: '5px',
            color: '#222',
            fontFamily: 'monospace',
          }).setOrigin(0.5).setDepth(1);
          this.worldGroup.add(post);
          this.worldGroup.add(board);
          this.worldGroup.add(text);
          break;
        }

        case 'bank': {
          const chest = this.add.rectangle(x, y, 30, 24, 0x8b4513).setDepth(1).setStrokeStyle(2, 0xffd700);
          const lid = this.add.rectangle(x, y - 8, 32, 8, 0xa0522d).setDepth(1);
          const label = this.add.text(x, y - 20, 'Bank', {
            fontSize: '6px',
            color: '#ffd700',
            fontFamily: 'monospace',
          }).setOrigin(0.5).setDepth(2);
          
          this.bankChest = this.add.container(0, 0, []);
          this.bankChest.x = x;
          this.bankChest.y = y;
          
          this.worldGroup.add(chest);
          this.worldGroup.add(lid);
          this.worldGroup.add(label);

          // Minimap
          const dot = this.add.rectangle(
            270 + (x / AREA_WIDTH) * 45,
            40 + (y / AREA_HEIGHT) * 45,
            3, 3, 0xffd700
          ).setScrollFactor(0).setDepth(10);
          this.minimapDots.push(dot);
          break;
        }

        case 'campfire': {
          const logs1 = this.add.rectangle(x - 5, y + 3, 20, 6, 0x5c3d2e).setAngle(-20).setDepth(0);
          const logs2 = this.add.rectangle(x + 5, y + 3, 20, 6, 0x5c3d2e).setAngle(20).setDepth(0);
          const fire = this.add.ellipse(x, y - 5, 16, 20, 0xff6600, 0.8).setDepth(1);
          const label = this.add.text(x, y - 25, 'Campfire', {
            fontSize: '5px',
            color: '#ff6600',
            fontFamily: 'monospace',
          }).setOrigin(0.5).setDepth(2);

          // Fire flicker
          this.tweens.add({
            targets: fire,
            scaleX: 1.2,
            scaleY: 1.1,
            alpha: 0.9,
            duration: 200,
            yoyo: true,
            repeat: -1,
          });

          this.campfire = this.add.container(0, 0, []);
          this.campfire.x = x;
          this.campfire.y = y;

          this.worldGroup.add(logs1);
          this.worldGroup.add(logs2);
          this.worldGroup.add(fire);
          this.worldGroup.add(label);
          break;
        }

        case 'dock': {
          for (let i = 0; i < 5; i++) {
            const plank = this.add.rectangle(x - 40 + i * 20, y, 18, 60, 0x8b7355).setDepth(0);
            this.worldGroup.add(plank);
          }
          const post1 = this.add.rectangle(x - 35, y - 25, 8, 20, 0x5c3d2e).setDepth(1);
          const post2 = this.add.rectangle(x + 35, y - 25, 8, 20, 0x5c3d2e).setDepth(1);
          this.worldGroup.add(post1);
          this.worldGroup.add(post2);
          break;
        }

        case 'hut': {
          const base = this.add.rectangle(x, y, 50, 40, 0x8b7355).setDepth(0);
          const roof = this.add.triangle(x, y - 30, 0, 30, 30, -10, 60, 30, 0x5c3d2e).setDepth(1);
          const door = this.add.rectangle(x, y + 10, 14, 20, 0x3d2817).setDepth(1);
          this.worldGroup.add(base);
          this.worldGroup.add(roof);
          this.worldGroup.add(door);
          break;
        }

        case 'fence': {
          const length = (props?.length as number) || 100;
          for (let i = 0; i < length; i += 20) {
            const post = this.add.rectangle(x, y + i, 6, 24, 0x5c3d2e).setDepth(0);
            this.worldGroup.add(post);
          }
          break;
        }

        case 'npc': {
          const npcHead = this.add.rectangle(0, -10, 12, 12, 0xffcc99);
          const npcBody = this.add.rectangle(0, 4, 12, 16, (props?.color as number) || 0x44aa44);
          const npcLabel = this.add.text(0, -24, (props?.name as string) || 'NPC', {
            fontSize: '6px',
            color: '#ffcc00',
            fontFamily: 'monospace',
          }).setOrigin(0.5);
          
          const npc = this.add.container(x, y, [npcBody, npcHead, npcLabel]).setDepth(2);
          this.npcs.set((props?.name as string) || 'NPC', npc);

          // Minimap
          const dot = this.add.rectangle(
            270 + (x / AREA_WIDTH) * 45,
            40 + (y / AREA_HEIGHT) * 45,
            3, 3, 0xffcc00
          ).setScrollFactor(0).setDepth(10);
          this.minimapDots.push(dot);
          break;
        }
      }
    }

    // Public methods for React UI
    depositItem(itemId: string, quantity: number) {
      const result = depositToBank(this.state.inventory, this.state.bank, itemId, quantity);
      if (result.success) {
        this.state.inventory = result.inventory;
        this.state.bank = result.bank;
        
        // Check supply run quest
        const bankLogs = getTotalItemCount(this.state.bank, ['logs', 'oak_logs', 'willow_logs']);
        const questResult = updateQuestProgress(this.state, 'supply_run', bankLogs);
        if (questResult.completed) {
          this.showQuestComplete('Supply Run');
        }
        this.state = questResult.state;
        
        this.updateState();
      }
    }

    withdrawItem(itemId: string, quantity: number) {
      const result = withdrawFromBank(this.state.inventory, this.state.bank, itemId, quantity);
      if (result.success) {
        this.state.inventory = result.inventory;
        this.state.bank = result.bank;
        this.updateState();
      }
    }

    eatFood(itemId: string) {
      const foodEnergy: Record<string, number> = {
        cooked_shrimp: 20,
        cooked_trout: 40,
      };
      
      const energy = foodEnergy[itemId];
      if (!energy) return;

      const idx = this.state.inventory.findIndex(s => s.itemId === itemId);
      if (idx === -1) return;

      if (this.state.inventory[idx].quantity <= 1) {
        this.state.inventory.splice(idx, 1);
      } else {
        this.state.inventory[idx].quantity--;
      }

      this.state.energy = Math.min(100, this.state.energy + energy);
      this.showFloatingText(`+${energy} Energy`);
      this.updateState();
    }
  };
};

// Type export for the scene instance
export type MainSceneInstance = InstanceType<ReturnType<typeof createMainScene>>;
