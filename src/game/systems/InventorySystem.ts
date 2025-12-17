import { InventorySlot, ITEMS } from '../types';

const MAX_INVENTORY_SIZE = 28; // 4x7 grid
const MAX_BANK_SIZE = 100;

export const addToInventory = (
  inventory: InventorySlot[],
  itemId: string,
  quantity: number = 1
): { success: boolean; inventory: InventorySlot[] } => {
  const item = ITEMS[itemId];
  if (!item) return { success: false, inventory };

  const newInv = [...inventory];

  if (item.stackable) {
    const existing = newInv.find(slot => slot.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
      return { success: true, inventory: newInv };
    }
  }

  if (newInv.length >= MAX_INVENTORY_SIZE) {
    return { success: false, inventory };
  }

  newInv.push({ itemId, quantity });
  return { success: true, inventory: newInv };
};

export const removeFromInventory = (
  inventory: InventorySlot[],
  itemId: string,
  quantity: number = 1
): { success: boolean; inventory: InventorySlot[] } => {
  const newInv = [...inventory];
  const idx = newInv.findIndex(slot => slot.itemId === itemId);
  
  if (idx === -1) return { success: false, inventory };
  
  if (newInv[idx].quantity <= quantity) {
    newInv.splice(idx, 1);
  } else {
    newInv[idx] = { ...newInv[idx], quantity: newInv[idx].quantity - quantity };
  }
  
  return { success: true, inventory: newInv };
};

export const getItemCount = (inventory: InventorySlot[], itemId: string): number => {
  const slot = inventory.find(s => s.itemId === itemId);
  return slot?.quantity ?? 0;
};

export const addToBank = (
  bank: InventorySlot[],
  itemId: string,
  quantity: number = 1
): { success: boolean; bank: InventorySlot[] } => {
  const item = ITEMS[itemId];
  if (!item) return { success: false, bank };

  const newBank = [...bank];
  const existing = newBank.find(slot => slot.itemId === itemId);
  
  if (existing) {
    existing.quantity += quantity;
    return { success: true, bank: newBank };
  }

  if (newBank.length >= MAX_BANK_SIZE) {
    return { success: false, bank };
  }

  newBank.push({ itemId, quantity });
  return { success: true, bank: newBank };
};

export const removeFromBank = (
  bank: InventorySlot[],
  itemId: string,
  quantity: number = 1
): { success: boolean; bank: InventorySlot[] } => {
  const newBank = [...bank];
  const idx = newBank.findIndex(slot => slot.itemId === itemId);
  
  if (idx === -1) return { success: false, bank };
  
  if (newBank[idx].quantity <= quantity) {
    newBank.splice(idx, 1);
  } else {
    newBank[idx] = { ...newBank[idx], quantity: newBank[idx].quantity - quantity };
  }
  
  return { success: true, bank: newBank };
};

export const depositToBank = (
  inventory: InventorySlot[],
  bank: InventorySlot[],
  itemId: string,
  quantity: number = 1
): { inventory: InventorySlot[]; bank: InventorySlot[]; success: boolean } => {
  const count = getItemCount(inventory, itemId);
  const toDeposit = Math.min(count, quantity);
  
  if (toDeposit <= 0) return { inventory, bank, success: false };
  
  const { success: removeSuccess, inventory: newInv } = removeFromInventory(inventory, itemId, toDeposit);
  if (!removeSuccess) return { inventory, bank, success: false };
  
  const { success: addSuccess, bank: newBank } = addToBank(bank, itemId, toDeposit);
  if (!addSuccess) return { inventory, bank, success: false };
  
  return { inventory: newInv, bank: newBank, success: true };
};

export const withdrawFromBank = (
  inventory: InventorySlot[],
  bank: InventorySlot[],
  itemId: string,
  quantity: number = 1
): { inventory: InventorySlot[]; bank: InventorySlot[]; success: boolean } => {
  const bankSlot = bank.find(s => s.itemId === itemId);
  if (!bankSlot) return { inventory, bank, success: false };
  
  const toWithdraw = Math.min(bankSlot.quantity, quantity);
  
  const { success: addSuccess, inventory: newInv } = addToInventory(inventory, itemId, toWithdraw);
  if (!addSuccess) return { inventory, bank, success: false };
  
  const { success: removeSuccess, bank: newBank } = removeFromBank(bank, itemId, toWithdraw);
  if (!removeSuccess) return { inventory, bank, success: false };
  
  return { inventory: newInv, bank: newBank, success: true };
};

export const getTotalItemCount = (inventory: InventorySlot[], itemIds: string[]): number => {
  return inventory
    .filter(slot => itemIds.includes(slot.itemId))
    .reduce((sum, slot) => sum + slot.quantity, 0);
};


