"use client"; // Indica que este é um Client Component
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function Simulado() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [results, setResults] = useState<{ question: string; answer: string | null; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState<{ question: string; options: string[]; answer: string; explanation: string }[]>([]);
  
  const initialQuestions = [
    {
      question: "Qual é o principal serviço de armazenamento da AWS?",
      options: ["S3", "EC2", "Lambda", "DynamoDB"],
      answer: "S3",
      explanation: "O Amazon S3 (Simple Storage Service) é um serviço de armazenamento de objetos que oferece escalabilidade, disponibilidade de dados e segurança.",
    },
    {
      question: "Qual serviço da AWS é usado para computação serverless?",
      options: ["EC2", "RDS", "Lambda", "Redshift"],
      answer: "Lambda",
      explanation: "O AWS Lambda é um serviço de computação serverless que permite executar código sem provisionar ou gerenciar servidores.",
    },
    // Adicione mais perguntas aqui
  ];

  // Função para embaralhar as perguntas
  const shuffleQuestions = (questions: any[]) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  };

  useEffect(() => {
    const shuffledQuestions = shuffleQuestions([...initialQuestions]);
    setQuestions(shuffledQuestions);
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    const isCorrect = selectedOption === questions[questionIndex].answer;
    setResults((prevResults) => [
      ...prevResults,
      { question: questions[questionIndex].question, answer: selectedOption, correct: isCorrect },
    ]);
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
    }
  };

  const renderResults = () => {
    const correctAnswers = results.filter(result => result.correct).length;
    const totalQuestions = questions.length;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    const status = parseFloat(percentage) >= 70 ? 'Aprovado' : 'Reprovado';

    return (
      <div className={styles.results}>
        <h2 className={styles.percentage}>
          <span className={styles.percentageValue}
            style={{ color: parseFloat(percentage) >= 70 ? 'green' : 'red' }}>
            {percentage}% - {status}
          </span>
        </h2>
        {results.map((result, index) => (
          <div key={index} className={styles.questionContainer}>
            <h3>{result.question}</h3>
            <ul>
              {questions[index].options.map((option, idx) => (
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
      </div>
    );
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setResults([]);
    setFinished(false);
    setQuestions(shuffleQuestions([...initialQuestions]));
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {questions.length > 0 && !finished ? (
          <>
            <h1 className={styles.question}>{questions[questionIndex].question}</h1>
            <ul>
              {questions[questionIndex].options.map((option, idx) => (
                <li
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`${styles.option} ${selectedOption === option ? styles.selected : ''}`}
                >
                  {option}
                </li>
              ))}
            </ul>
            <button onClick={handleNext} className={styles.nextButton}>Próxima Pergunta</button>
          </>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
}
