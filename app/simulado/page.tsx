import React, { useState } from 'react';
import styles from './styles.module.css';

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface Result {
  question: string;
  answer: string;
  correct: boolean;
}

const Simulado: React.FC<{ questions: Question[] }> = ({ questions }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const correct = selectedOption === questions[questionIndex].answer;
      setResults((prevResults) => [
        ...prevResults,
        { question: questions[questionIndex].question, answer: selectedOption, correct },
      ]);

      setSelectedOption(null);
      setQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    }
  };

  const calculatePercentage = () => {
    const correctAnswers = results.filter(result => result.correct).length;
    return ((correctAnswers / results.length) * 100).toFixed(2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {questionIndex < questions.length ? (
          <>
            <h1 className={styles.question}>{questions[questionIndex].question}</h1>
            <ul className={styles.ul}>
              {questions[questionIndex].options.map((option: string, idx: number) => (
                <li
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`${styles.option} ${selectedOption === option ? styles.selected : ''}`}
                >
                  {option}
                </li>
              ))}
            </ul>
            <button className={styles.nextButton} onClick={handleNextQuestion}>
              Próxima
            </button>
          </>
        ) : (
          <div className={styles.results}>
            <h3>Resultados</h3>
            {results.map((result, index: number) => (
              <div key={index} className={styles.questionContainer}>
                <h3>{result.question}</h3>
                <ul>
                  {questions[index].options.map((option: string, idx: number) => (
                    <li
                      key={idx}
                      className={`${styles.option} 
                        ${result.answer === option ? styles.selected : ''} 
                        ${result.correct && result.answer === option ? styles.correct : ''} 
                        ${!result.correct && questions[index].answer === option ? styles.correct : ''} 
                        ${!result.correct && result.answer === option ? styles.wrong : ''}`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                <p className={styles.explanation}>
                  {result.correct ? 'Correto!' : `Incorreto! A resposta certa é: ${questions[index].answer}`}
                </p>
                <p className={styles.explanation}>{!result.correct && questions[index].explanation}</p>
              </div>
            ))}
            <p className={styles.percentage}>
              Porcentagem de acertos: <span className={styles.percentageValue}>{calculatePercentage()}%</span>
            </p>
            <button className={styles.restartButton} onClick={() => window.location.reload()}>
              Reiniciar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulado;
