"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import styles from './page.module.css';

type Question = {
  id: string;
  type: 'multiple_choice' | 'written';
  text: string;
  options?: string[]; // For multiple choice
};

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const materia = searchParams.get('materia');

  const [studentName, setStudentName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    if (!name || !materia) {
      router.push('/');
      return;
    }
    setStudentName(name);

    // Fetch dynamic questions
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ materia })
        });
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [materia, router]);

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestionIndex];
    setAnswers({ ...answers, [question.id]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit quiz: save data for results page
      sessionStorage.setItem('lastQuizData', JSON.stringify({ questions, answers }));
      router.push(`/resultado?materia=${materia}`);
    }
  };

  if (loading) {
    return (
      <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className={styles.loading}>
          <div className="animate-float" style={{ fontSize: '3rem' }}>🤔</div>
          <h2>O Pin está a preparar as perguntas...</h2>
        </div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="container"><h2>Oops, não conseguimos gerar as perguntas!</h2></main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="container animate-fade-in">
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}></div>
      </div>
      
      <div className={styles.quizCard}>
        <span className={styles.questionCounter}>
          Pergunta {currentQuestionIndex + 1} de {questions.length}
        </span>
        <h2 className={styles.questionText}>{currentQuestion.text}</h2>

        {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
          <div className={styles.optionsGrid}>
            {currentQuestion.options.map((option, idx) => (
              <button 
                key={idx}
                className={`${styles.optionBtn} ${answers[currentQuestion.id] === option ? styles.selected : ''}`}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'written' && (
          <textarea 
            className={styles.textArea}
            rows={4}
            placeholder="Escreve aqui a tua resposta..."
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        )}

        <div className={styles.actionRow}>
          <button 
            className="btn-primary" 
            onClick={nextQuestion}
            disabled={!answers[currentQuestion.id]}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Teste'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Quiz() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{textAlign: 'center', marginTop: '5rem'}}>A carregar...</div>}>
        <QuizContent />
      </Suspense>
    </>
  );
}
