import React, { useState } from 'react';
import { QuizQuestion, QuizType } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      onComplete(score);
    }
  };

  if (!currentQuestion) {
    return <div>問題がありません</div>;
  }

  // 現在の問題の完全な情報を取得
  const currentWordInfo = currentQuestion as any;

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        質問 {currentQuestionIndex + 1} / {questions.length}
      </div>
      
      <div className="quiz-type">
        {currentQuestion.questionType}
      </div>
      
      <div className="question">
        <h2>{currentQuestion.question}</h2>
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
            ? '正解です！' 
            : `不正解です。正解は「${currentQuestion.correctAnswer}」です。`}

          {/* 追加情報の表示 */}
          <div className="additional-info">
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
          </div>

          <button onClick={handleNextQuestion} className="next-button">
            {currentQuestionIndex < questions.length - 1 ? '次の質問' : '結果を見る'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz; 