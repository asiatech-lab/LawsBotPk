import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validation utilities
export function validateQuery(query: string, language: 'en' | 'ur' = 'en'): string | null {
  const trimmed = query.trim();
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 2000;
  
  if (!trimmed) {
    return language === 'en' 
      ? 'Please enter a legal query to analyze.'
      : 'براہ کرم تجزیہ کے لیے قانونی سوال درج کریں۔';
  }
  
  if (trimmed.length < MIN_LENGTH) {
    return language === 'en'
      ? `Query must be at least ${MIN_LENGTH} characters long.`
      : `سوال کم از کم ${MIN_LENGTH} حروف کا ہونا چاہیے۔`;
  }
  
  if (trimmed.length > MAX_LENGTH) {
    return language === 'en'
      ? `Query must be less than ${MAX_LENGTH} characters.`
      : `سوال ${MAX_LENGTH} حروف سے کم ہونا چاہیے۔`;
  }
  
  return null;
}

// Local storage utilities
export function saveQueryToStorage(query: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('justiceai-query', query);
  }
}

export function getQueryFromStorage(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('justiceai-query');
  }
  return null;
}

export function clearQueryFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('justiceai-query');
  }
}

// Format utilities
export function formatCharacterCount(current: number, max: number): string {
  return `${current}/${max}`;
}

export function isNearLimit(current: number, max: number, threshold: number = 0.9): boolean {
  return current > max * threshold;
}
