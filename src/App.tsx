import React, { useState, useEffect } from 'react';
import './App.css';
import { KoreanWord, QuizType } from './types';
import { loadVocabulary, generateQuiz } from './services/vocabularyService';
import Quiz from './components/Quiz';

// GitHubページ用のベースURLを取得（ルートディレクトリまたはサブディレクトリ）
const basename = process.env.PUBLIC_URL || '';

function App() {
  const [vocabulary, setVocabulary] = useState<KoreanWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<any[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const data = await loadVocabulary();
        setVocabulary(data);
      } catch (err) {
        setError('単語データの読み込みに失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  const handleStartQuiz = (type: QuizType) => {
    setQuizType(type);
    setQuizCompleted(false);
    setCurrentQuiz(generateQuiz(vocabulary, type, 5));
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setQuizCompleted(true);
  };

  const handleBackToMenu = () => {
    setQuizType(null);
    setCurrentQuiz([]);
    setQuizCompleted(false);
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
          <div className="menu">
            <h2>クイズタイプを選択</h2>
            <button onClick={() => handleStartQuiz(QuizType.MEANING)}>
              {QuizType.MEANING}
            </button>
            <button onClick={() => handleStartQuiz(QuizType.READING)}>
              {QuizType.READING}
            </button>
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
