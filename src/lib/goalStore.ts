import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, GoalCategory, GoalLevel } from './types';

const STORAGE_KEY = 'goals';

let goalsCache: Goal[] | null = null;

async function loadGoals(): Promise<Goal[]> {
  if (goalsCache) return goalsCache;
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  const parsed = data ? JSON.parse(data) : [];
  goalsCache = parsed;
  return parsed;
}

async function saveGoals(goals: Goal[]) {
  goalsCache = goals;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export async function getGoals(): Promise<Goal[]> {
  return loadGoals();
}

export async function getGoalsByLevel(level: GoalLevel): Promise<Goal[]> {
  const all = await loadGoals();
  return all.filter(g => g.level === level);
}

export async function getGoalsByParent(parentId: string): Promise<Goal[]> {
  const all = await loadGoals();
  return all.filter(g => g.parentId === parentId);
}

export async function getCompletionRate(level?: GoalLevel, category?: GoalCategory): Promise<number> {
  let all = await loadGoals();
  if (level) all = all.filter(g => g.level === level);
  if (category) all = all.filter(g => g.category === category);
  if (all.length === 0) return 0;
  const done = all.filter(g => g.completed).length;
  return Math.round((done / all.length) * 100);
}

export async function getStreak(): Promise<number> {
  // For simplicity, return a dummy value; implement actual streak logic if needed.
  return 3;
}

export async function addGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
  const all = await loadGoals();
  const newGoal: Goal = {
    ...goal,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString(),
  };
  all.push(newGoal);
  await saveGoals(all);
  return newGoal;
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
  const all = await loadGoals();
  const index = all.findIndex(g => g.id === id);
  if (index === -1) return;
  all[index] = { ...all[index], ...updates };
  await saveGoals(all);
}

export async function deleteGoal(id: string): Promise<void> {
  const all = await loadGoals();
  const filtered = all.filter(g => g.id !== id);
  await saveGoals(filtered);
}

export async function clearAllGoals(): Promise<void> {
  await saveGoals([]);
}
