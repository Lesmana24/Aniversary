import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Sparkles, Star } from 'lucide-react';

export default function WishlistCard({ items, onToggle, onAdd }) {
  const [newTitle, setNewTitle] = useState('');
  const [category, setCategory] = useState('Outdoor');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAdd({ title: newTitle, category, priority: 'High' });
    setNewTitle('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-scrapbook border-2 border-dashed border-pastel-pink/40">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-pastel-pink/30">
        <div>
          <span className="text-xs font-mono font-bold text-pastel-pink-dark bg-pastel-pink/15 px-2.5 py-1 rounded-full border border-pastel-pink/30">
            YEAR 3 WISHLIST
          </span>
          <h3 className="font-headline font-extrabold text-xl text-pastel-lavender-dark mt-1">
            Impian Tahun Ke-3 Kita ✨
          </h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-pastel-custard flex items-center justify-center border border-amber-300">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
        </div>
      </div>

      {/* List items */}
      <div className="space-y-2.5 mb-5 max-h-64 overflow-y-auto pr-1">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                item.completed
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 line-through opacity-75'
                  : 'bg-pastel-canvas border-pastel-pink/20 text-pastel-text hover:border-pastel-lavender'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-pastel-lavender flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-pastel-lavender-dark">
                {item.category}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-pastel-text/60 italic text-center py-4">
            Belum ada impian tercatat. Tambahkan impian baru di bawah!
          </p>
        )}
      </div>

      {/* Add new wish form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Tulis impian baru berdua..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-pastel-surface border border-pastel-lavender/40 text-xs font-medium text-pastel-text focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-2xl bg-pastel-lavender text-white font-headline font-bold text-xs shadow-squish hover:scale-105 active:scale-95 transition-all btn-squish flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </form>
    </div>
  );
}
