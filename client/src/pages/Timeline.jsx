import React, { useState } from 'react';
import PolaroidCard from '../components/PolaroidCard';
import RealFlipBook from '../components/RealFlipBook';
import { BookOpen, Plus, Filter, LayoutGrid, BookMarked } from 'lucide-react';

export default function Timeline({ memories, onDeleteMemory, onOpenAdmin }) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('flipbook'); // 'flipbook' or 'grid'

  const categories = ['ALL', 'Cafe', 'Outdoor', 'Trip', 'Movie'];

  const filteredMemories = filterCategory === 'ALL'
    ? memories
    : memories.filter(m => m.category?.toUpperCase() === filterCategory.toUpperCase());

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-scrapbook border-2 border-dashed border-pastel-pink/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-pastel-pink/20 text-pastel-pink-dark text-xs font-headline font-bold px-3 py-1 rounded-full border border-pastel-pink/30 flex items-center gap-1 w-fit">
            <BookOpen className="w-3.5 h-3.5" /> MEMORY FLIP BOOK
          </span>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-pastel-lavender-dark mt-2">
            Flip Book Kenangan Kencan 📖
          </h1>
          <p className="text-xs sm:text-sm text-pastel-text mt-1">
            Kumpulan lembar foto polaroid dan memo cerita manis kencan Lesmana & Nafla.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="px-5 py-3 rounded-2xl bg-pastel-lavender text-white font-headline font-bold text-xs shadow-squish hover:scale-105 active:scale-95 transition-all btn-squish flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Kenangan</span>
          </button>
        </div>
      </div>

      {/* Filter Pills & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <span className="text-xs font-headline font-bold text-pastel-text/70 flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5 text-pastel-lavender" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-headline text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-pastel-pink text-white shadow-squish-pink'
                  : 'bg-white text-pastel-text border border-pastel-pink/20 hover:bg-pastel-surface'
              }`}
            >
              {cat === 'ALL' ? '✨ Semua Kenangan' : cat}
            </button>
          ))}
        </div>

        {/* View Mode Toggle (3D Flipbook vs Grid Cards) */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-pastel-pink/30 shadow-sm w-fit self-end sm:self-auto">
          <button
            onClick={() => setViewMode('flipbook')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-headline text-xs font-bold transition-all ${
              viewMode === 'flipbook'
                ? 'bg-pastel-pink text-white shadow-squish-pink'
                : 'text-pastel-text hover:text-pastel-pink-dark'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Buku Real (3D)</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-headline text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-pastel-pink text-white shadow-squish-pink'
                : 'text-pastel-text hover:text-pastel-pink-dark'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid Card</span>
          </button>
        </div>
      </div>

      {/* VIEW DISPLAY */}
      {viewMode === 'flipbook' ? (
        <RealFlipBook memories={filteredMemories} onDelete={onDeleteMemory} />
      ) : (
        /* Grid of Memory Polaroids */
        filteredMemories && filteredMemories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredMemories.map((memory, idx) => {
              const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
              const rot = rotations[idx % rotations.length];
              return (
                <PolaroidCard
                  key={memory.id}
                  memory={memory}
                  rotateDegree={rot}
                  onDelete={onDeleteMemory}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
            <p className="text-sm font-medium text-pastel-text/70">
              Belum ada kenangan kencan pada kategori "{filterCategory}".
            </p>
            <button
              onClick={onOpenAdmin}
              className="mt-3 px-4 py-2 rounded-xl bg-pastel-lavender text-white font-headline text-xs font-bold"
            >
              + Tambah Kenangan Pertama
            </button>
          </div>
        )
      )}
    </div>
  );
}

