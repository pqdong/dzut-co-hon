import { GhostTier, Reward } from '../store/useGameStore';

export const startGameSession = async (): Promise<{ sessionToken: string, success: boolean }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Mock simple session token
  return {
    sessionToken: `sess_${Math.random().toString(36).substring(7)}`,
    success: true
  };
};

export const submitGameResult = async (
  sessionToken: string,
  ghostId: string,
  tier: GhostTier
): Promise<{ success: boolean, reward: Reward }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const rand = Math.random();
  let reward: Reward;
  
  // Reward probabilities keeping original ratio:
  // Legendary / Item: 5%
  // Rare / Points 1000: 15%
  // Uncommon / Coupon 50k: 30%
  // Common / Coupon 20k: 50%
  if (rand < 0.05) {
    reward = { type: 'item', name: 'AirPods Pro 2' };
  } else if (rand < 0.20) {
    reward = { type: 'points', name: '1000 VIP Points', value: 1000 };
  } else if (rand < 0.50) {
    reward = { type: 'coupon', name: 'Coupon 50k', value: 50000 };
  } else {
    reward = { type: 'coupon', name: 'Coupon 20k', value: 20000 };
  }

  return {
    success: true,
    reward
  };
};
