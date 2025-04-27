import Papa from 'papaparse';
import { KoreanWord, QuizQuestion, QuizType } from '../types';

export const loadVocabulary = async (): Promise<KoreanWord[]> => {
  const response = await fetch('./korean_vocabulary.csv');
  const csvText = await response.text();
  
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  
  return result.data as KoreanWord[];
};

export const generateQuiz = (
  vocabulary: KoreanWord[],
  quizType: QuizType,
  questionCount: number = 5
): QuizQuestion[] => {
  if (vocabulary.length < 4) {
    throw new Error('単語リストが短すぎます。少なくとも4単語が必要です。');
  }

  // 利用可能な単語からランダムに問題の数だけ選択
  const shuffledVocab = [...vocabulary].sort(() => 0.5 - Math.random());
  const selectedWords = shuffledVocab.slice(0, questionCount);
  
  return selectedWords.map(word => {
    // 各問題で正解以外の選択肢として3つの異なる単語を選択
    const otherOptions = shuffledVocab
      .filter(w => w !== word)
      .slice(0, 3);
    
    let question: string;
    let correctAnswer: string;
    let options: string[];
    
    if (quizType === QuizType.MEANING) {
      // 意味クイズ: 韓国語単語が表示され、正しい日本語の意味を選ぶ
      question = word.korean;
      correctAnswer = word.japanese;
      options = [word.japanese, ...otherOptions.map(w => w.japanese)];
    } else {
      // 読み方クイズ: 韓国語単語が表示され、正しい発音を選ぶ
      question = word.korean;
      correctAnswer = word.pronunciation;
      options = [word.pronunciation, ...otherOptions.map(w => w.pronunciation)];
    }
    
    // 選択肢をランダムに並べ替え
    options = options.sort(() => 0.5 - Math.random());
    
    return {
      question,
      options,
      correctAnswer,
      questionType: quizType,
      // 単語の完全な情報を含める
      word: word,
      korean: word.korean,
      japanese: word.japanese,
      pronunciation: word.pronunciation
    };
  });
}; 