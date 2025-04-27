import { KoreanWord, CategoryProgress, LevelProgress, UserProgress } from '../types';

const PROGRESS_KEY = 'korean_learning_progress';

// 初期の進捗データを作成する
export const initializeProgress = (vocabulary: KoreanWord[]): UserProgress => {
  // すべてのカテゴリとレベルを抽出
  const categories = [...new Set(vocabulary.map(word => word.category))];
  const levels = [...new Set(vocabulary.map(word => word.level))];
  
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
  
  const progress: UserProgress = {
    categories: categoryProgress,
    levels: levelProgress,
    lastUpdated: new Date().toISOString()
  };
  
  // ローカルストレージに保存
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
    return JSON.parse(progressData) as UserProgress;
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

// 全体の進捗率を計算
export const calculateOverallProgress = (progress: UserProgress): number => {
  const totalWords = Object.values(progress.categories)
    .reduce((sum, category) => sum + category.totalWords, 0);
    
  const learnedWords = Object.values(progress.categories)
    .reduce((sum, category) => sum + category.correctWords, 0);
    
  return totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;
}; 