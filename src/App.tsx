import React, { useState, useEffect } from 'react';
import './App.css';
import { KoreanWord, QuizType, StudyFilter, UserProgress } from './types';
import { loadVocabulary, generateQuiz, getAvailableCategories, getAvailableLevels, filterVocabulary } from './services/vocabularyService';
import { initializeProgress, loadProgress, recordWordLearned } from './services/progressService';
import Quiz from './components/Quiz';
import ProgressDashboard from './components/ProgressDashboard';
import StudyFilterComponent from './components/StudyFilter';

// GitHubページ用のベースURLを取得（ルートディレクトリまたはサブディレクトリ）
const basename = process.env.PUBLIC_URL || '';

function App() {
  const [vocabulary, setVocabulary] = useState<KoreanWord[]>([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState<KoreanWord[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<any[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [filter, setFilter] = useState<StudyFilter>({
    categories: [],
    levels: []
  });

  // 単語データの読み込み
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const data = await loadVocabulary();
        setVocabulary(data);
        
        // カテゴリとレベルの取得
        const categories = getAvailableCategories(data);
        const levels = getAvailableLevels(data);
        
        setAvailableCategories(categories);
        setAvailableLevels(levels);
        
        // デフォルトのフィルター設定
        setFilter({
          categories: [...categories],
          levels: [...levels]
        });
        
        // フィルタリング
        setFilteredVocabulary(data);
        
        // 進捗データの初期化
        let progress = loadProgress();
        if (!progress) {
          progress = initializeProgress(data);
        }
        setUserProgress(progress);
      } catch (err) {
        setError('単語データの読み込みに失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  // フィルター変更時に単語をフィルタリング
  useEffect(() => {
    if (vocabulary.length > 0) {
      const filtered = filterVocabulary(vocabulary, filter);
      setFilteredVocabulary(filtered);
    }
  }, [filter, vocabulary]);

  const handleStartQuiz = (type: QuizType) => {
    if (filteredVocabulary.length < 4) {
      setError('フィルターされた単語リストが短すぎます。少なくとも4単語が必要です。');
      return;
    }
    
    setQuizType(type);
    setQuizCompleted(false);
    setCurrentQuiz(generateQuiz(filteredVocabulary, type, 5));
    setError(null);
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setQuizCompleted(true);
    
    // 正解した単語の進捗を更新
    if (userProgress && currentQuiz.length > 0) {
      let updatedProgress = { ...userProgress };
      
      // 各クイズ問題について正解した単語の進捗を更新
      currentQuiz.forEach((question, index) => {
        if (index < finalScore) {
          const word = question.word as KoreanWord;
          if (word) {
            updatedProgress = recordWordLearned(word);
          }
        }
      });
      
      setUserProgress(updatedProgress);
    }
  };

  const handleBackToMenu = () => {
    setQuizType(null);
    setCurrentQuiz([]);
    setQuizCompleted(false);
  };

  const handleFilterChange = (newFilter: StudyFilter) => {
    setFilter(newFilter);
  };

  const toggleProgressDisplay = () => {
    setShowProgress(!showProgress);
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>韓国語学習アプリ</h1>
      </header>

      <main>
        {!quizType ? (
          <div className="home-screen">
            <button 
              className="progress-toggle-button"
              onClick={toggleProgressDisplay}
            >
              {showProgress ? '学習進捗を隠す' : '学習進捗を表示'}
            </button>
            
            {showProgress && userProgress && (
              <ProgressDashboard progress={userProgress} />
            )}
            
            <StudyFilterComponent
              availableCategories={availableCategories}
              availableLevels={availableLevels}
              initialFilter={filter}
              onFilterChange={handleFilterChange}
            />
            
            <div className="filtered-info">
              選択された単語: {filteredVocabulary.length}語
            </div>
            
            <div className="menu">
              <h2>クイズタイプを選択</h2>
              <button 
                onClick={() => handleStartQuiz(QuizType.MEANING)}
                disabled={filteredVocabulary.length < 4}
              >
                {QuizType.MEANING}
              </button>
              <button 
                onClick={() => handleStartQuiz(QuizType.READING)}
                disabled={filteredVocabulary.length < 4}
              >
                {QuizType.READING}
              </button>
            </div>
          </div>
        ) : quizCompleted ? (
          <div className="results">
            <h2>クイズ結果</h2>
            <p>
              スコア: {score} / {currentQuiz.length}
            </p>
            <button onClick={handleBackToMenu}>メニューに戻る</button>
          </div>
        ) : (
          <Quiz questions={currentQuiz} onComplete={handleQuizComplete} />
        )}
      </main>
    </div>
  );
}

export default App;
