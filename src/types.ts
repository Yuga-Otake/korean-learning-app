export interface KoreanWord {
  korean: string;
  japanese: string;
  pronunciation: string;
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
} 