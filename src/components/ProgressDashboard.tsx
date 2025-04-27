import React from 'react';
import { CategoryProgress, LevelProgress, UserProgress } from '../types';
import ProgressBar from './ProgressBar';
import { calculateOverallProgress } from '../services/progressService';

interface ProgressDashboardProps {
  progress: UserProgress;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress }) => {
  const overallProgress = calculateOverallProgress(progress);
  
  // カテゴリとレベルの進捗をソート
  const sortedCategories = Object.values(progress.categories)
    .filter(category => category && category.category) // nullやundefinedのカテゴリを除外
    .sort((a, b) => a.category.localeCompare(b.category));
    
  const sortedLevels = Object.values(progress.levels)
    .filter(level => level && level.level) // nullやundefinedのレベルを除外
    .sort((a, b) => {
      // レベルを優先度順にソート（初級、中級、上級）
      const levelOrder: Record<string, number> = {
        '初級': 1,
        '中級': 2,
        '上級': 3
      };
      return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
    });
  
  // 日付フォーマット
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('ja-JP');
    } catch (e) {
      return '不明';
    }
  };
  
  return (
    <div className="progress-dashboard">
      <h2 className="progress-title">学習進捗</h2>
      
      <div className="progress-section">
        <h3>全体進捗</h3>
        <ProgressBar 
          percentage={overallProgress} 
          label="全体の学習進捗" 
          color="#2979ff" 
          height={30}
        />
        <div className="last-updated">
          最終更新: {formatDate(progress.lastUpdated)}
        </div>
      </div>
      
      <div className="progress-section">
        <h3>レベル別進捗</h3>
        <div className="progress-grid">
          {sortedLevels.map(level => (
            <div className="progress-item" key={level.level}>
              <ProgressBar 
                percentage={level.progressPercentage} 
                label={`${level.level} (${level.correctWords}/${level.totalWords}単語)`}
                color={getLevelColor(level.level)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="progress-section">
        <h3>カテゴリ別進捗</h3>
        <div className="progress-grid">
          {sortedCategories.map(category => (
            <div className="progress-item" key={category.category}>
              <ProgressBar 
                percentage={category.progressPercentage} 
                label={`${category.category} (${category.correctWords}/${category.totalWords}単語)`}
                color={getCategoryColor(category.category)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// レベルに応じた色を返す関数
const getLevelColor = (level: string): string => {
  // レベルがundefinedの場合はデフォルト色を返す
  if (!level) {
    return '#2979ff'; // デフォルト青
  }
  
  switch (level) {
    case '初級': return '#4caf50'; // 緑
    case '中級': return '#ff9800'; // オレンジ
    case '上級': return '#f44336'; // 赤
    default: return '#2979ff'; // 青
  }
};

// カテゴリに応じた色を返す関数
const getCategoryColor = (category: string): string => {
  // カテゴリがundefinedの場合はデフォルト色を返す
  if (!category) {
    return '#2979ff'; // デフォルト青
  }

  const colors = [
    '#9c27b0', // 紫
    '#e91e63', // ピンク
    '#00bcd4', // シアン
    '#8bc34a', // ライトグリーン
    '#ffc107', // アンバー
    '#795548', // ブラウン
    '#607d8b', // ブルーグレー
    '#ff5722', // ディープオレンジ
    '#3f51b5', // インディゴ
    '#009688'  // ティール
  ];
  
  // カテゴリ名をハッシュ化して色を選択（同じカテゴリは常に同じ色になる）
  const hashCode = category.split('').reduce(
    (hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);
  const colorIndex = Math.abs(hashCode) % colors.length;
  
  return colors[colorIndex];
};

export default ProgressDashboard; 