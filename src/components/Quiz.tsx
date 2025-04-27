import React, { useState } from 'react';
import { QuizQuestion } from '../types';

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
          <button onClick={handleNextQuestion} className="next-button">
            {currentQuestionIndex < questions.length - 1 ? '次の質問' : '結果を見る'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz; 