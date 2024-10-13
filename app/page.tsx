"use client"; // Indica que este é um Client Component
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

// Definindo o tipo das perguntas
type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export default function Simulado() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [results, setResults] = useState<{ question: string; answer: string | null; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const initialQuestions: Question[] = [
    {
        question: "Qual é o principal serviço de armazenamento de objetos da AWS?",
        options: ["S3", "EFS", "DynamoDB", "Glacier"],
        answer: "S3",
        explanation: "O Amazon S3 (Simple Storage Service) é um serviço de armazenamento de objetos que oferece escalabilidade, disponibilidade de dados e segurança.",
    },
    {
        question: "Qual serviço da AWS é utilizado para executar código sem provisionar servidores?",
        options: ["EC2", "Lambda", "Fargate", "RDS"],
        answer: "Lambda",
        explanation: "O AWS Lambda permite executar código sem provisionar ou gerenciar servidores, cobrando apenas pelo tempo de execução do código.",
    },
    {
        question: "Qual serviço é usado para enviar notificações em tempo real?",
        options: ["SNS", "SQS", "CloudWatch", "CloudTrail"],
        answer: "SNS",
        explanation: "O Amazon SNS (Simple Notification Service) é um serviço de gerenciamento de mensagens que permite o envio de notificações em tempo real.",
    },
    {
        question: "Qual serviço da AWS é utilizado para criar bancos de dados relacionais?",
        options: ["RDS", "DynamoDB", "Redshift", "Aurora"],
        answer: "RDS",
        explanation: "O Amazon RDS (Relational Database Service) facilita a configuração, operação e escalabilidade de bancos de dados relacionais na nuvem.",
    },
    {
        question: "O que é o AWS CloudFormation?",
        options: ["Um serviço de monitoramento", "Um serviço de banco de dados", "Um serviço de gerenciamento de recursos", "Um serviço de armazenamento"],
        answer: "Um serviço de gerenciamento de recursos",
        explanation: "O AWS CloudFormation permite criar e gerenciar recursos da AWS usando arquivos de configuração, facilitando o provisionamento em larga escala.",
    },
    {
        question: "Qual é a função do AWS IAM?",
        options: ["Gerenciar redes", "Gerenciar identidades e acessos", "Gerenciar armazenamento", "Gerenciar serviços de computação"],
        answer: "Gerenciar identidades e acessos",
        explanation: "O AWS IAM (Identity and Access Management) permite controlar o acesso aos recursos da AWS, gerenciando permissões de usuários e serviços.",
    },
    {
        question: "Qual serviço da AWS é usado para armazenar dados não estruturados?",
        options: ["S3", "EFS", "Glacier", "RDS"],
        answer: "S3",
        explanation: "O Amazon S3 é ideal para armazenar dados não estruturados, como imagens, vídeos e backups, devido à sua escalabilidade e durabilidade.",
    },
    {
        question: "Qual é a principal vantagem do AWS Lambda em relação ao EC2?",
        options: ["Menor custo", "Maior controle", "Gerenciamento de servidores", "Maior escalabilidade"],
        answer: "Menor custo",
        explanation: "O AWS Lambda cobra apenas pelo tempo de execução, enquanto o EC2 é baseado em instâncias em execução, o que pode resultar em custos mais altos.",
    },
    {
        question: "Qual é a principal função do AWS CloudWatch?",
        options: ["Gerenciar usuários", "Monitorar recursos", "Armazenar dados", "Criar redes"],
        answer: "Monitorar recursos",
        explanation: "O Amazon CloudWatch permite monitorar e coletar métricas dos recursos da AWS, oferecendo insights sobre a performance e a saúde do ambiente.",
    },
    {
        question: "Qual é a principal diferença entre SQS e SNS?",
        options: ["SQS é orientado a fila; SNS é orientado a publicação/inscrição", "SNS é mais rápido que SQS", "SQS é para notificações; SNS é para mensagens", "Não há diferença"],
        answer: "SQS é orientado a fila; SNS é orientado a publicação/inscrição",
        explanation: "O Amazon SQS (Simple Queue Service) é um serviço de fila que permite o armazenamento de mensagens, enquanto o SNS (Simple Notification Service) permite o envio de notificações em tempo real para múltiplos assinantes.",
    },
]

  // Função para embaralhar as perguntas
  const shuffleQuestions = (questions: Question[]): Question[] => {
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
