import Papa from 'papaparse';
import { KoreanWord, QuizQuestion, QuizType, StudyFilter, UserProgress } from '../types';
import { getFrequentlyMistaken } from './progressService';

export const loadVocabulary = async (): Promise<KoreanWord[]> => {
  const response = await fetch('./korean_vocabulary.csv');
  const csvText = await response.text();
  
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });
  
  return result.data as KoreanWord[];
};

// 重複を排除するユーティリティ関数
const getUniqueValues = (array: string[]): string[] => {
  return array.filter((value, index, self) => self.indexOf(value) === index);
};

// 利用可能なすべてのカテゴリを取得
export const getAvailableCategories = (vocabulary: KoreanWord[]): string[] => {
  return getUniqueValues(vocabulary.map(word => word.category)).sort();
};

// 利用可能なすべてのレベルを取得
export const getAvailableLevels = (vocabulary: KoreanWord[]): string[] => {
  const levels = getUniqueValues(vocabulary.map(word => word.level));
  
  // 優先順にソート（初級、中級、上級など）
  const levelOrder: Record<string, number> = {
    '初級': 1,
    '中級': 2,
    '上級': 3
  };
  
  return levels.sort((a, b) => {
    return (levelOrder[a] || 99) - (levelOrder[b] || 99);
  });
};

// フィルターに基づいて単語をフィルタリング
export const filterVocabulary = (
  vocabulary: KoreanWord[],
  filter: StudyFilter,
  mistakenWords: string[] = []
): KoreanWord[] => {
  // フィルターが空の場合は全てを返す
  if (filter.categories.length === 0 && 
      filter.levels.length === 0 && 
      !filter.showMistakesOnly) {
    return vocabulary;
  }
  
  return vocabulary.filter(word => {
    const categoryMatch = filter.categories.length === 0 || filter.categories.includes(word.category);
    const levelMatch = filter.levels.length === 0 || filter.levels.includes(word.level);
    
    // 間違えた問題のみを表示するフィルターが有効な場合
    if (filter.showMistakesOnly) {
      return mistakenWords.includes(word.korean) && categoryMatch && levelMatch;
    }
    
    return categoryMatch && levelMatch;
  });
};

// 発音クイズの生成
export const generatePronunciationQuiz = (
  vocabulary: KoreanWord[],
  questionCount: number = 5
): QuizQuestion[] => {
  if (vocabulary.length < 4) {
    throw new Error('単語リストが短すぎます。少なくとも4単語が必要です。');
  }

  // 利用可能な単語からランダムに問題の数だけ選択
  const shuffledVocab = [...vocabulary].sort(() => 0.5 - Math.random());
  // 問題数を5問に戻す
  const selectedWords = shuffledVocab.slice(0, questionCount);
  
  // ハングルの子音と母音の対応表
  const hangulComponents = [
    { character: 'ㄱ', pronunciation: 'k/g' },
    { character: 'ㄴ', pronunciation: 'n' },
    { character: 'ㄷ', pronunciation: 't/d' },
    { character: 'ㄹ', pronunciation: 'r/l' },
    { character: 'ㅁ', pronunciation: 'm' },
    { character: 'ㅂ', pronunciation: 'p/b' },
    { character: 'ㅅ', pronunciation: 's' },
    { character: 'ㅇ', pronunciation: 'ng' },
    { character: 'ㅈ', pronunciation: 'j' },
    { character: 'ㅊ', pronunciation: 'ch' },
    { character: 'ㅋ', pronunciation: 'k' },
    { character: 'ㅌ', pronunciation: 't' },
    { character: 'ㅍ', pronunciation: 'p' },
    { character: 'ㅎ', pronunciation: 'h' },
    { character: 'ㅏ', pronunciation: 'a' },
    { character: 'ㅑ', pronunciation: 'ya' },
    { character: 'ㅓ', pronunciation: 'eo' },
    { character: 'ㅕ', pronunciation: 'yeo' },
    { character: 'ㅗ', pronunciation: 'o' },
    { character: 'ㅛ', pronunciation: 'yo' },
    { character: 'ㅜ', pronunciation: 'u' },
    { character: 'ㅠ', pronunciation: 'yu' },
    { character: 'ㅡ', pronunciation: 'eu' },
    { character: 'ㅣ', pronunciation: 'i' }
  ];
  
  // ランダムにハングル部位を選択して問題を作成
  const questions: QuizQuestion[] = [];
  
  for (let i = 0; i < questionCount; i++) {
    // ランダムにハングル部位を選択
    const randomIndex = Math.floor(Math.random() * hangulComponents.length);
    const selectedComponent = hangulComponents[randomIndex];
    
    // 正解の発音
    const correctAnswer = selectedComponent.pronunciation;
    
    // 他の選択肢（他のハングル部位の発音）
    const otherOptions = hangulComponents
      .filter((comp) => comp.pronunciation !== correctAnswer)
      .sort(() => 0.5 - Math.random()) // シャッフル
      .slice(0, 3) // 3つ選ぶ
      .map(comp => comp.pronunciation);
    
    // 選択肢をランダムに並べ替え
    const options = [correctAnswer, ...otherOptions].sort(() => 0.5 - Math.random());
    
    // 関連する単語を選択（表示用）
    const relatedWord = selectedWords[i % selectedWords.length];
    
    questions.push({
      question: selectedComponent.character, // ハングルの部位を問題とする
      options,
      correctAnswer,
      questionType: QuizType.PRONUNCIATION,
      word: relatedWord, // 関連する単語情報を含める
      korean: relatedWord.korean,
      japanese: relatedWord.japanese,
      pronunciation: relatedWord.pronunciation,
      category: relatedWord.category,
      level: relatedWord.level
    });
  }
  
  return questions;
};

export const generateQuiz = (
  vocabulary: KoreanWord[],
  quizType: QuizType,
  questionCount: number = 5,
  userProgress?: UserProgress
): QuizQuestion[] => {
  if (vocabulary.length < 4) {
    throw new Error('単語リストが短すぎます。少なくとも4単語が必要です。');
  }

  // 発音クイズの場合は別の関数を使用
  if (quizType === QuizType.PRONUNCIATION) {
    return generatePronunciationQuiz(vocabulary, questionCount);
  }

  // 単語をレベル順にソート（初級→中級→上級）
  const sortedByLevel = [...vocabulary].sort((a, b) => {
    const levelOrder: Record<string, number> = {
      '初級': 1,
      '中級': 2,
      '上級': 3
    };
    return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
  });

  // 学習進捗があれば、正解回数の少ない単語を優先
  let prioritizedWords = sortedByLevel;
  if (userProgress && userProgress.wordStats) {
    prioritizedWords = sortedByLevel.sort((a, b) => {
      // まずレベルでソート
      const levelOrder: Record<string, number> = {
        '初級': 1,
        '中級': 2,
        '上級': 3
      };
      const levelDiff = (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
      if (levelDiff !== 0) return levelDiff;
      
      // 次に正解回数でソート（正解数が少ない単語を優先）
      const statsA = userProgress.wordStats[a.korean];
      const statsB = userProgress.wordStats[b.korean];
      
      // 正解しているかどうかを確認
      const isLearnedA = userProgress.categories[a.category]?.correctWords > 0;
      const isLearnedB = userProgress.categories[b.category]?.correctWords > 0;
      
      // 学習済みの単語は後ろに
      if (isLearnedA && !isLearnedB) return 1;
      if (!isLearnedA && isLearnedB) return -1;
      
      // 間違え回数が多い単語を優先
      return (statsB?.incorrectCount || 0) - (statsA?.incorrectCount || 0);
    });
  }
  
  // 問題数分の単語を選択
  const selectedWords = prioritizedWords.slice(0, questionCount);
  
  return selectedWords.map(word => {
    // 各問題で正解以外の選択肢として3つの異なる単語を選択
    const otherOptions = sortedByLevel
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
      pronunciation: word.pronunciation,
      category: word.category,
      level: word.level
    };
  });
}; 