import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizType } from '../types';
import HangulTable from './HangulTable';
import { recordWordMistake, resetWordMistakeCount } from '../services/progressService';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<QuizQuestion[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  const [allCompleted, setAllCompleted] = useState(false);
  const [showHangulTable, setShowHangulTable] = useState(true);

  // 現在表示する問題を決定
  const currentQuestion = isReviewMode 
    ? incorrectQuestions[reviewQuestionIndex] 
    : questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      
      // レビューモードで正解した場合、間違い回数をリセット
      if (isReviewMode && currentQuestion.word) {
        resetWordMistakeCount(currentQuestion.word);
      }
    } else {
      // 間違えた場合、間違い回数を記録
      if (currentQuestion.word) {
        recordWordMistake(currentQuestion.word);
      }
      
      if (!isReviewMode) {
        // 通常モードで間違えた問題を記録
        setIncorrectQuestions(prev => [...prev, currentQuestion]);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    if (isReviewMode) {
      // レビューモードの場合
      if (reviewQuestionIndex < incorrectQuestions.length - 1) {
        setReviewQuestionIndex(prev => prev + 1);
      } else {
        // レビューが終了したら完了状態に
        setAllCompleted(true);
        onComplete(score);
      }
    } else {
      // 通常モードの場合
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // 通常問題が終了
        if (incorrectQuestions.length > 0) {
          // 間違えた問題があれば、レビューモードに移行
          setIsReviewMode(true);
          setReviewQuestionIndex(0);
        } else {
          // 間違いがなければ完了
          setAllCompleted(true);
          onComplete(score);
        }
      }
    }
  };

  const toggleHangulTable = () => {
    setShowHangulTable(prev => !prev);
  };

  if (!currentQuestion) {
    return <div>問題がありません</div>;
  }

  // 現在の問題の完全な情報を取得
  const currentWordInfo = currentQuestion as any;

  // 問題数とインデックスの表示を調整
  const totalQuestions = questions.length;
  const currentProgress = isReviewMode 
    ? `復習: ${reviewQuestionIndex + 1}/${incorrectQuestions.length}` 
    : `質問: ${currentQuestionIndex + 1}/${totalQuestions}`;

  // 問題文の生成
  let questionText = '';
  if (currentQuestion.questionType === QuizType.MEANING) {
    // 意味クイズ: 「韓国語（読み方）」の形式で表示
    questionText = `${currentQuestion.question} (${currentWordInfo.pronunciation})`;
  } else if (currentQuestion.questionType === QuizType.READING) {
    // 読み方クイズ: 「韓国語（意味）」の形式で表示
    questionText = `${currentQuestion.question} (${currentWordInfo.japanese})`;
  } else if (currentQuestion.questionType === QuizType.PRONUNCIATION) {
    // 発音クイズ: ハングル部位をそのまま表示
    questionText = `${currentQuestion.question}`;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        {currentProgress}
        {isReviewMode && <span className="review-badge">間違えた問題を復習中</span>}
      </div>
      
      <div className="quiz-type">
        {currentQuestion.questionType}
      </div>
      
      <div className="question">
        <h2>{questionText}</h2>
      </div>
      
      <div className="options">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`option-button ${
              isAnswered 
                ? option === currentQuestion.correctAnswer
                  ? 'correct'
                  : option === selectedAnswer
                    ? 'incorrect'
                    : ''
                : ''
            }`}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      
      {isAnswered && (
        <div className="feedback">
          {selectedAnswer === currentQuestion.correctAnswer 
            ? (isReviewMode ? '正解です！間違い回数がリセットされました。' : '正解です！') 
            : `不正解です。正解は「${currentQuestion.correctAnswer}」です。`}

          {/* 追加情報の表示 */}
          <div className="additional-info">
            {currentQuestion.questionType === QuizType.PRONUNCIATION ? (
              <div className="hangul-explanation">
                <div className="hangul-character">「{currentQuestion.question}」</div>
                <div>この文字の発音は「{currentQuestion.correctAnswer}」です。</div>
              </div>
            ) : (
              <div className="word-details">
                <div className="korean-word">{currentWordInfo.word?.korean || currentQuestion.question}</div>
                
                {/* 意味と読み方を表示 */}
                <div className="word-pronunciation">
                  <span className="label">読み方: </span>
                  <span>{currentWordInfo.word?.pronunciation || currentWordInfo.pronunciation}</span>
                </div>
                
                <div className="word-meaning">
                  <span className="label">意味: </span>
                  <span>{currentWordInfo.word?.japanese || currentWordInfo.japanese}</span>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleNextQuestion} className="next-button">
            {isReviewMode 
              ? (reviewQuestionIndex < incorrectQuestions.length - 1 ? '次の復習問題' : '結果を見る')
              : (currentQuestionIndex < questions.length - 1 ? '次の質問' : 
                 incorrectQuestions.length > 0 ? '間違えた問題を復習する' : '結果を見る')}
          </button>
        </div>
      )}

      {/* ハングル表の表示/非表示を切り替えるボタン */}
      <button onClick={toggleHangulTable} className="hangul-table-toggle">
        {showHangulTable ? 'ハングル音表を隠す' : 'ハングル音表を表示'}
      </button>

      {/* ハングル音表 */}
      {showHangulTable && <HangulTable />}
    </div>
  );
};

export default Quiz; 