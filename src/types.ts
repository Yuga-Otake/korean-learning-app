export interface KoreanWord {
  korean: string;
  japanese: string;
  pronunciation: string;
  category: string;
  level: string;
}

export enum QuizType {
  MEANING = '意味クイズ',
  READING = '読み方クイズ'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  questionType: QuizType;
  word?: KoreanWord;
  korean?: string;
  japanese?: string;
  pronunciation?: string;
  category?: string;
  level?: string;
}

export interface CategoryProgress {
  category: string;
  totalWords: number;
  correctWords: number;
  progressPercentage: number;
}

export interface LevelProgress {
  level: string;
  totalWords: number;
  correctWords: number;
  progressPercentage: number;
}

export interface UserProgress {
  categories: Record<string, CategoryProgress>;
  levels: Record<string, LevelProgress>;
  lastUpdated: string;
}

export interface StudyFilter {
  categories: string[];
  levels: string[];
} 