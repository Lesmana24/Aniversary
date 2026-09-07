import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, Trophy, RefreshCw, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizGame({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const quizList = questions && questions.length > 0 ? questions : [
    {
      id: 'q-1',
      question: "Kapan tanggal resmi kita jadian?",
      options: ["8 September 2024", "10 Oktober 2024", "14 Februari 2024", "8 Agustus 2024"],
      answer: 0,
      explanation: "Pintar! Tanggal 8 September 2024 adalah awal mula perjalanan indah kita!"
    }
  ];

  const currentQ = quizList[currentIndex];

  const handleSelect = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.answer) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < quizList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsAnswered(false);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / quizList.length) * 100);

    return (
      <div className="bg-white rounded-3xl p-8 shadow-scrapbook border-2 border-dashed border-pastel-lavender max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-pastel-pink/20 text-pastel-pink-dark mx-auto flex items-center justify-center mb-4 border border-pastel-pink/40 shadow-sticker">
          <Trophy className="w-8 h-8 text-pastel-pink" />
        </div>

        <h3 className="font-headline font-extrabold text-2xl text-pastel-lavender-dark mb-2">
          Kuis Trivia Cinta Selesai! 🎉
        </h3>

        <div className="text-4xl font-headline font-black text-pastel-pink-dark my-4">
          Skor: {score} / {quizList.length} ({percentage}%)
        </div>

        <p className="text-sm text-pastel-text leading-relaxed font-medium mb-6">
          {percentage === 100
            ? "Luar Biasa! Bebe benar-benar ingat semua kenangan dan momen spesial kita berdua ❤️!"
            : "Hebat banget! Hubungan 2 tahun ini emang penuh warna dan kenangan manis!"}
        </p>

        <button
          onClick={restartQuiz}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-pastel-lavender text-white font-headline font-bold text-sm shadow-squish hover:scale-[1.02] active:scale-95 transition-all btn-squish"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Mainkan Kuis Lagi</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-dashed border-pastel-lavender/60 max-w-xl mx-auto">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-dashed border-pastel-lavender/40 pb-4 mb-6">
        <span className="bg-pastel-surface text-pastel-lavender-dark text-xs font-headline font-bold px-3 py-1 rounded-full border border-pastel-lavender/30 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pastel-pink" />
          Soal {currentIndex + 1} dari {quizList.length}
        </span>

        <span className="text-xs font-mono font-bold text-pastel-pink-dark">
          Skor Sementara: {score}
        </span>
      </div>

      {/* Question */}
      <h3 className="font-headline font-extrabold text-lg sm:text-xl text-pastel-text mb-6">
        {currentQ.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((opt, idx) => {
          let btnClass = "bg-pastel-canvas text-pastel-text border-pastel-pink/20 hover:border-pastel-lavender hover:bg-pastel-surface";
          
          if (isAnswered) {
            if (idx === currentQ.answer) {
              btnClass = "bg-emerald-50 text-emerald-800 border-emerald-400 font-bold";
            } else if (selectedOption === idx) {
              btnClass = "bg-rose-50 text-rose-800 border-rose-400";
            } else {
              btnClass = "bg-gray-50 text-gray-400 border-gray-200 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-sm font-medium ${btnClass}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === currentQ.answer && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              {isAnswered && selectedOption === idx && idx !== currentQ.answer && (
                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Explanation */}
      {isAnswered && (
        <div className="p-4 rounded-2xl bg-pastel-surface border border-pastel-lavender/30 text-xs text-pastel-lavender-dark font-medium mb-6 animate-fadeIn">
          💡 {currentQ.explanation}
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <button
          onClick={nextQuestion}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white font-headline font-bold text-sm shadow-squish hover:scale-[1.02] active:scale-95 transition-all btn-squish"
        >
          {currentIndex < quizList.length - 1 ? 'Soal Berikutnya ➔' : 'Lihat Hasil Kuis 🏆'}
        </button>
      )}
    </div>
  );
}
