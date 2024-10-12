"use client"; // Indica que este é um Client Component

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function Simulado() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState([]); // Armazena as respostas selecionadas
  const [finished, setFinished] = useState(false); // Indica se o simulado foi finalizado
  const [questions, setQuestions] = useState([]); // Armazena as perguntas embaralhadas

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
  const shuffleQuestions = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  };

  useEffect(() => {
    // Embaralha as perguntas ao montar o componente
    const shuffledQuestions = shuffleQuestions([...initialQuestions]);
    setQuestions(shuffledQuestions);
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    // Armazena a resposta selecionada para a pergunta atual
    const isCorrect = selectedOption === questions[questionIndex].answer;

    setResults((prevResults) => [
      ...prevResults,
      { question: questions[questionIndex].question, answer: selectedOption, correct: isCorrect },
    ]);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null); // Limpar a seleção da opção ao mudar de pergunta
    } else {
      setFinished(true); // Finaliza o simulado se todas as perguntas forem respondidas
    }
  };

  // Resumo das respostas corretas e incorretas
  const renderResults = () => {
    const correctAnswers = results.filter(result => result.correct).length; // Conta respostas corretas
    const totalQuestions = questions.length;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2); // Calcula porcentagem de acertos
    const status = percentage >= 70 ? 'Aprovado' : 'Reprovado'; // Define status
  
    return (
      <div className={styles.results}>
        <h2 className={styles.percentage}>
          <span className={styles.percentageValue} 
            style={{ color: percentage >= 70 ? 'green' : 'red' }}>
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
    setResults([]); // Limpa os resultados ao recomeçar
    setFinished(false);
    // Embaralha as perguntas novamente ao recomeçar
    setQuestions(shuffleQuestions([...initialQuestions]));
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {questions.length > 0 && !finished ? ( // Verifica se há perguntas disponíveis
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
