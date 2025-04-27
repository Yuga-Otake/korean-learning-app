import React, { useState, useEffect } from 'react';
import './App.css';
import { KoreanWord, QuizType, StudyFilter, UserProgress } from './types';
import { loadVocabulary, generateQuiz, getAvailableCategories, getAvailableLevels, filterVocabulary } from './services/vocabularyService';
import { initializeProgress, loadProgress, recordWordLearned, getFrequentlyMistaken } from './services/progressService';
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
    levels: [],
    showMistakesOnly: false
  });
  const [mistakenWords, setMistakenWords] = useState<string[]>([]);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        setLoading(true);
        const vocabData = await loadVocabulary();
        
        setVocabulary(vocabData);
        setAvailableCategories(getAvailableCategories(vocabData));
        setAvailableLevels(getAvailableLevels(vocabData));
        
        // ユーザーの進捗を読み込み、なければ初期化
        let progress = loadProgress();
        if (!progress) {
          progress = initializeProgress(vocabData);
        }
        
        setUserProgress(progress);
        
        // 間違えた問題のリストを取得
        const mistaken = getFrequentlyMistaken(progress, 1);
        setMistakenWords(mistaken);
        
        setFilteredVocabulary(vocabData);
        setLoading(false);
      } catch (err) {
        setError('単語データの読み込みに失敗しました。');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchVocabulary();
  }, []);
  
  useEffect(() => {
    if (vocabulary.length > 0) {
      // フィルターに基づいて単語をフィルタリング
      const filtered = filterVocabulary(vocabulary, filter, mistakenWords);
      setFilteredVocabulary(filtered);
    }
  }, [vocabulary, filter, mistakenWords]);

  const startQuiz = (type: QuizType) => {
    try {
      if (filteredVocabulary.length < 4) {
        setError('選択された単語が少なすぎます。少なくとも4つの単語を選択してください。');
        return;
      }
      
      const questionCount = Math.min(10, filteredVocabulary.length);
      const quizQuestions = generateQuiz(filteredVocabulary, type, questionCount);
      
      setQuizType(type);
      setCurrentQuiz(quizQuestions);
      setQuizCompleted(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '問題の作成に失敗しました。');
    }
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
      
      // 間違えた問題のリストを更新
      const mistaken = getFrequentlyMistaken(updatedProgress, 1);
      setMistakenWords(mistaken);
      
      setUserProgress(updatedProgress);
    }
  };

  const handleBackToMenu = () => {
    setQuizType(null);
    setCurrentQuiz([]);
    setQuizCompleted(false);
    setShowProgress(false);
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
        
        {!quizType && !showProgress && (
          <button 
            className="progress-button"
            onClick={toggleProgressDisplay}
          >
            学習進捗を確認
          </button>
        )}
        
        {(quizType || showProgress) && (
          <button 
            className="back-button"
            onClick={handleBackToMenu}
          >
            メニューに戻る
          </button>
        )}
      </header>
      
      <main className="App-main">
        {!quizType && !showProgress && (
          <div className="menu-container">
            <StudyFilterComponent
              availableCategories={availableCategories}
              availableLevels={availableLevels}
              initialFilter={filter}
              onFilterChange={handleFilterChange}
              mistakesAvailable={mistakenWords.length > 0}
            />
            
            <div className="filtered-count">
              選択された単語: {filteredVocabulary.length} / {vocabulary.length}
            </div>
            
            <div className="quiz-types">
              <h2>学習を始める</h2>
              <div className="quiz-buttons">
                <button
                  onClick={() => startQuiz(QuizType.MEANING)}
                  disabled={filteredVocabulary.length < 4}
                  className="quiz-button"
                >
                  意味を学ぶ
                </button>
                <button
                  onClick={() => startQuiz(QuizType.READING)}
                  disabled={filteredVocabulary.length < 4}
                  className="quiz-button"
                >
                  読み方を学ぶ
                </button>
                <button
                  onClick={() => startQuiz(QuizType.PRONUNCIATION)}
                  disabled={filteredVocabulary.length < 4}
                  className="quiz-button"
                >
                  発音を学ぶ
                </button>
              </div>
            </div>
          </div>
        )}
        
        {quizType && !quizCompleted && (
          <Quiz
            questions={currentQuiz}
            onComplete={handleQuizComplete}
          />
        )}
        
        {quizType && quizCompleted && (
          <div className="results">
            <h2>学習結果</h2>
            <p>スコア: {score} / {currentQuiz.length}</p>
            <button onClick={handleBackToMenu}>メニューに戻る</button>
          </div>
        )}
        
        {showProgress && userProgress && (
          <ProgressDashboard progress={userProgress} />
        )}
      </main>
      
      <footer className="App-footer">
        <p>韓国語学習アプリ &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
