import { useState } from 'react';
import { api } from '../services/api.js';
import './ToolPanel.css';

export default function Quiz({ sources }) {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Intermediate');
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setQuizData(null);
    setScore(0);
    setCurrentQuestionIdx(0);
    setSelectedAnswer('');
    setShowExplanation(false);

    try {
      const data = await api.quiz(sources, count, difficulty);
      if (data.quiz && data.quiz.length > 0) {
        setQuizData(data.quiz);
      } else {
        setError('Failed to generate quiz. Try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setShowExplanation(true);
    if (selectedAnswer === quizData[currentQuestionIdx].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setShowExplanation(false);
    setCurrentQuestionIdx(i => i + 1);
  };

  if (!quizData) {
    return (
      <div className="tool-panel">
        <h2>Interactive Quiz</h2>
        <p>Test your knowledge based on the selected sources.</p>
        
        <div className="controls">
          <label>
            Questions:
            <input type="number" value={count} min={1} max={20} onChange={e => setCount(Number(e.target.value))} />
          </label>
          <label>
            Difficulty:
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>
          <button onClick={handleGenerate} disabled={loading} className="primary-button">
            {loading ? 'Generating...' : 'Start Quiz'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  const isFinished = currentQuestionIdx >= quizData.length;

  if (isFinished) {
    return (
      <div className="tool-panel center-content">
        <h2>Quiz Complete!</h2>
        <p className="score">You scored {score} out of {quizData.length}.</p>
        <button onClick={() => setQuizData(null)} className="primary-button">Restart Quiz</button>
      </div>
    );
  }

  const q = quizData[currentQuestionIdx];

  return (
    <div className="tool-panel">
      <div className="quiz-header">
        <h2>Question {currentQuestionIdx + 1} of {quizData.length}</h2>
        <span className="score-badge">Score: {score}</span>
      </div>
      
      <div className="question-card">
        <p className="question-text">{q.question}</p>
        
        <div className="options-list">
          {q.options.map((opt, idx) => {
            let className = "option-btn";
            if (showExplanation) {
              if (opt === q.correctAnswer) className += " correct";
              else if (opt === selectedAnswer) className += " incorrect";
              else className += " disabled";
            } else if (opt === selectedAnswer) {
              className += " selected";
            }
            return (
              <button 
                key={idx}
                className={className}
                onClick={() => !showExplanation && setSelectedAnswer(opt)}
                disabled={showExplanation}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation ? (
          <div className="explanation">
            <strong>Explanation:</strong> {q.explanation}
            <button onClick={handleNext} className="primary-button next-btn">
              {currentQuestionIdx === quizData.length - 1 ? 'See Results' : 'Next Question'}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleSubmitAnswer} 
            disabled={!selectedAnswer}
            className="primary-button submit-btn"
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
}
