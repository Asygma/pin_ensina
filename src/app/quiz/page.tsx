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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          throw new Error(response.status === 504 ? "O servidor demorou muito a responder (Timeout). Tente novamente." : "Resposta inválida do servidor.");
        }
        
        if (!response.ok || data.error) {
          throw new Error(data.details || data.error || 'Erro desconhecido');
        }
        
        setQuestions(data.questions || []);
      } catch (err: any) {
        console.error("Failed to load quiz:", err);
        setErrorMsg(`Oops, não conseguimos gerar as perguntas! Detalhes: ${err.message}`);
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

  if (errorMsg || questions.length === 0) {
    return (
      <main className="container">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2>{errorMsg || "Oops, não conseguimos gerar as perguntas!"}</h2>
          <button className="btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>
            Tentar Novamente
          </button>
        </div>
      </main>
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
