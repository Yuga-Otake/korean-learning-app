import { KoreanWord, CategoryProgress, LevelProgress, UserProgress, WordStat } from '../types';

const PROGRESS_KEY = 'korean_learning_progress';

// 初期の進捗データを作成する
export const initializeProgress = (vocabulary: KoreanWord[]): UserProgress => {
  // すべてのカテゴリとレベルを抽出（Setを使わずに配列で重複を除去）
  const getUniqueValues = (array: string[]): string[] => {
    return array.filter((value, index, self) => self.indexOf(value) === index);
  };
  
  const categories = getUniqueValues(vocabulary.map(word => word.category)).sort();
  const levels = getUniqueValues(vocabulary.map(word => word.level));
  
  // レベルの順序を定義
  const levelOrder: Record<string, number> = {
    '初級': 1,
    '中級': 2,
    '上級': 3
  };
  
  // レベルをソート
  levels.sort((a, b) => (levelOrder[a] || 99) - (levelOrder[b] || 99));
  
  // カテゴリごとの進捗オブジェクトを作成
  const categoryProgress: Record<string, CategoryProgress> = {};
  categories.forEach(category => {
    const wordsInCategory = vocabulary.filter(word => word.category === category);
    categoryProgress[category] = {
      category,
      totalWords: wordsInCategory.length,
      correctWords: 0,
      progressPercentage: 0
    };
  });
  
  // レベルごとの進捗オブジェクトを作成
  const levelProgress: Record<string, LevelProgress> = {};
  levels.forEach(level => {
    const wordsInLevel = vocabulary.filter(word => word.level === level);
    levelProgress[level] = {
      level,
      totalWords: wordsInLevel.length,
      correctWords: 0,
      progressPercentage: 0
    };
  });
  
  // 単語ごとの統計情報を初期化
  const wordStats: Record<string, WordStat> = {};
  vocabulary.forEach(word => {
    wordStats[word.korean] = {
      korean: word.korean,
      incorrectCount: 0
    };
  });
  
  const progress: UserProgress = {
    categories: categoryProgress,
    levels: levelProgress,
    wordStats: wordStats,
    lastUpdated: new Date().toISOString()
  };
  
  // ローカルストレージに保存
  saveProgress(progress);
  
  return progress;
};

// 既存の進捗データを最新の単語リストで更新する
export const updateProgressWithVocabulary = (progress: UserProgress, vocabulary: KoreanWord[]): UserProgress => {
  // 単語がない場合はそのまま返す
  if (!vocabulary || vocabulary.length === 0) return progress;
  
  // すべてのカテゴリとレベルを抽出
  const getUniqueValues = (array: string[]): string[] => {
    return array.filter((value, index, self) => self.indexOf(value) === index);
  };
  
  const categories = getUniqueValues(vocabulary.map(word => word.category)).sort();
  const levels = getUniqueValues(vocabulary.map(word => word.level));
  
  // レベルの順序を定義
  const levelOrder: Record<string, number> = {
    '初級': 1,
    '中級': 2,
    '上級': 3
  };
  
  // レベルをソート
  levels.sort((a, b) => (levelOrder[a] || 99) - (levelOrder[b] || 99));
  
  // 新しいカテゴリがあれば追加
  categories.forEach(category => {
    if (!progress.categories[category]) {
      const wordsInCategory = vocabulary.filter(word => word.category === category);
      progress.categories[category] = {
        category,
        totalWords: wordsInCategory.length,
        correctWords: 0,
        progressPercentage: 0
      };
      console.log(`新しいカテゴリを追加しました: ${category}`);
    } else {
      // 既存のカテゴリは単語数を更新
      const wordsInCategory = vocabulary.filter(word => word.category === category);
      progress.categories[category].totalWords = wordsInCategory.length;
      // 正解数が単語数を超えないように調整
      if (progress.categories[category].correctWords > wordsInCategory.length) {
        progress.categories[category].correctWords = wordsInCategory.length;
      }
      // 進捗率を再計算
      progress.categories[category].progressPercentage = Math.round(
        (progress.categories[category].correctWords / wordsInCategory.length) * 100
      );
    }
  });
  
  // 新しいレベルがあれば追加
  levels.forEach(level => {
    if (!progress.levels[level]) {
      const wordsInLevel = vocabulary.filter(word => word.level === level);
      progress.levels[level] = {
        level,
        totalWords: wordsInLevel.length,
        correctWords: 0,
        progressPercentage: 0
      };
      console.log(`新しいレベルを追加しました: ${level}`);
    } else {
      // 既存のレベルは単語数を更新
      const wordsInLevel = vocabulary.filter(word => word.level === level);
      progress.levels[level].totalWords = wordsInLevel.length;
      // 正解数が単語数を超えないように調整
      if (progress.levels[level].correctWords > wordsInLevel.length) {
        progress.levels[level].correctWords = wordsInLevel.length;
      }
      // 進捗率を再計算
      progress.levels[level].progressPercentage = Math.round(
        (progress.levels[level].correctWords / wordsInLevel.length) * 100
      );
    }
  });
  
  // 単語の統計情報を更新
  vocabulary.forEach(word => {
    if (!progress.wordStats[word.korean]) {
      progress.wordStats[word.korean] = {
        korean: word.korean,
        incorrectCount: 0
      };
    }
  });
  
  progress.lastUpdated = new Date().toISOString();
  saveProgress(progress);
  
  return progress;
};

// 進捗を保存する
export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

// 進捗を読み込む
export const loadProgress = (): UserProgress | null => {
  const progressData = localStorage.getItem(PROGRESS_KEY);
  if (!progressData) return null;
  
  try {
    const progress = JSON.parse(progressData) as UserProgress;
    
    // 古いバージョンの進捗データを新しい形式に変換
    if (!progress.wordStats) {
      console.log('古い形式の進捗データを検出しました。新しい形式に変換します。');
      progress.wordStats = {};
      
      // カテゴリごとの単語を取得するためにvocabularyをロードする必要があるが、
      // 非同期関数内で行うことができないため、空のオブジェクトで初期化するだけにする
      
      // 変換したデータを保存
      saveProgress(progress);
    }
    
    return progress;
  } catch (error) {
    console.error('進捗データの読み込みに失敗しました', error);
    return null;
  }
};

// 単語の学習成功を記録
export const recordWordLearned = (word: KoreanWord): UserProgress => {
  let progress = loadProgress();
  if (!progress) {
    throw new Error('進捗データが見つかりません');
  }
  
  const { category, level } = word;
  
  // カテゴリの進捗を更新
  if (progress.categories[category]) {
    const categoryData = progress.categories[category];
    if (categoryData.correctWords < categoryData.totalWords) {
      categoryData.correctWords += 1;
      categoryData.progressPercentage = Math.round(
        (categoryData.correctWords / categoryData.totalWords) * 100
      );
    }
  }
  
  // レベルの進捗を更新
  if (progress.levels[level]) {
    const levelData = progress.levels[level];
    if (levelData.correctWords < levelData.totalWords) {
      levelData.correctWords += 1;
      levelData.progressPercentage = Math.round(
        (levelData.correctWords / levelData.totalWords) * 100
      );
    }
  }
  
  progress.lastUpdated = new Date().toISOString();
  saveProgress(progress);
  
  return progress;
};

// 単語の間違いを記録
export const recordWordMistake = (word: KoreanWord): UserProgress => {
  let progress = loadProgress();
  if (!progress) {
    throw new Error('進捗データが見つかりません');
  }
  
  const { korean } = word;
  
  // 単語の統計情報を更新または作成
  if (progress.wordStats[korean]) {
    progress.wordStats[korean].incorrectCount += 1;
  } else {
    progress.wordStats[korean] = {
      korean,
      incorrectCount: 1
    };
  }
  
  progress.lastUpdated = new Date().toISOString();
  saveProgress(progress);
  
  return progress;
};

// 単語の間違い回数をリセット
export const resetWordMistakeCount = (word: KoreanWord): UserProgress => {
  let progress = loadProgress();
  if (!progress) {
    throw new Error('進捗データが見つかりません');
  }
  
  const { korean } = word;
  
  // 単語の統計情報をリセット
  if (progress.wordStats[korean]) {
    progress.wordStats[korean].incorrectCount = 0;
  }
  
  progress.lastUpdated = new Date().toISOString();
  saveProgress(progress);
  
  return progress;
};

// 全体の進捗率を計算
export const calculateOverallProgress = (progress: UserProgress): number => {
  const totalWords = Object.values(progress.categories)
    .reduce((sum, category) => sum + category.totalWords, 0);
    
  const learnedWords = Object.values(progress.categories)
    .reduce((sum, category) => sum + category.correctWords, 0);
    
  return totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;
};

// よく間違える単語を取得
export const getFrequentlyMistaken = (progress: UserProgress, minMistakes: number = 1): string[] => {
  if (!progress) return [];
  
  // 古いバージョンの進捗データには wordStats がない場合がある
  if (!progress.wordStats) return [];
  
  // progress.wordStatsがオブジェクトであることを確認
  if (typeof progress.wordStats !== 'object' || progress.wordStats === null) {
    console.error('wordStatsがオブジェクトではありません:', progress.wordStats);
    return [];
  }
  
  // 間違い回数が指定回数以上の単語の韓国語のリストを取得
  try {
    const frequentlyMistakenWords = Object.values(progress.wordStats)
      .filter(stat => stat && stat.incorrectCount >= minMistakes)
      .map(stat => stat.korean);
    
    return frequentlyMistakenWords;
  } catch (error) {
    console.error('よく間違える単語の取得中にエラーが発生しました:', error);
    return [];
  }
}; 