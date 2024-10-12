// Adicione a diretiva "use client" aqui
'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface Result {
  question: string;
  answer: string;
  correct: boolean;
}

const questions: Question[] = [
  {
    question: "Qual é a capital da França?",
    options: ["Londres", "Berlim", "Paris", "Madri"],
    answer: "Paris"
  },
  {
    question: "Qual é a maior montanha do mundo?",
    options: ["K2", "Kangchenjunga", "Everest", "Makalu"],
    answer: "Everest"
  },
  // Adicione mais perguntas aqui
];

const Simulado = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const isCorrect = selectedOption === questions[questionIndex].answer;
      setResults((prevResults) => [
        ...prevResults,
        {
          question: questions[questionIndex].question,
          answer: selectedOption,
          correct: isCorrect,
        },
      ]);
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setResults([]);
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
                  className={`${styles.option} ${selectedOption === option ? styles.selected : ''}`}
                  onClick={() => handleOptionSelect(option)}
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
          <>
            <h2 className={styles.results}>Resultados</h2>
            {results.map((result, index: number) => (
              <div key={index} className={styles.questionContainer}>
                <p>{result.question}</p>
                <p className={result.correct ? styles.correct : styles.wrong}>
                  Sua resposta: {result.answer} ({result.correct ? 'Correta' : 'Incorreta'})
                </p>
              </div>
            ))}
            <button className={styles.restartButton} onClick={handleRestart}>
              Reiniciar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Simulado;
