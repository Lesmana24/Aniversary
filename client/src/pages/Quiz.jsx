import React from 'react';
import QuizGame from '../components/QuizGame';
import { Sparkles, Trophy } from 'lucide-react';

export default function Quiz({ questions }) {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-scrapbook border-2 border-dashed border-pastel-pink/40 text-center max-w-2xl mx-auto">
        <span className="bg-pastel-pink/20 text-pastel-pink-dark text-xs font-headline font-bold px-3 py-1 rounded-full border border-pastel-pink/30 flex items-center gap-1 w-fit mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-pastel-pink" /> LOVE TRIVIA QUIZ
        </span>
        <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-pastel-lavender-dark mt-2">
          Kuis Trivia Cinta Kita 💡
        </h1>
        <p className="text-xs sm:text-sm text-pastel-text mt-1">
          Uji seberapa banyak Bebe mengingat momen kencan dan fakta-fakta manis perjalanan 2 tahun kita!
        </p>
      </div>

      {/* Quiz Container Component */}
      <section>
        <QuizGame questions={questions} />
      </section>
    </div>
  );
}
