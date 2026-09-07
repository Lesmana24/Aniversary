import React from 'react';
import { MapPin, Calendar, Star, Trash2 } from 'lucide-react';

export default function PolaroidCard({ memory, rotateDegree = 'rotate-1', onDelete }) {
  const { title, date, location, category, photo, story, rating } = memory;

  return (
    <div className={`group relative bg-[#fffbf5] p-3 pb-5 rounded-xl shadow-scrapbook border border-[#e6e2dc] transition-all hover:scale-[1.02] hover:z-10 ${rotateDegree}`}>
      {/* Washi tape header decorator */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 washi-tape rotate-1 rounded-sm z-20 pointer-events-none flex items-center justify-center">
        <span className="text-[9px] font-headline font-bold text-amber-900/60 uppercase tracking-widest">
          {category || 'MEMORY'}
        </span>
      </div>

      {/* Delete button (visible on hover) */}
      {onDelete && (
        <button
          onClick={() => onDelete(memory.id)}
          title="Hapus kenangan ini"
          className="absolute top-2 right-2 z-30 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Image Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 mb-3 border border-amber-900/5">
        <img
          src={photo}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 text-pastel-pink" />
          <span>{location}</span>
        </div>
      </div>

      {/* Polaroid Caption Chin */}
      <div className="px-1">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[11px] font-bold text-pastel-lavender-dark flex items-center gap-1">
            <Calendar className="w-3 h-3 text-pastel-lavender" /> {date}
          </span>
          <div className="flex items-center text-amber-400">
            {[...Array(rating || 5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400" />
            ))}
          </div>
        </div>
        
        <h3 className="font-headline font-bold text-sm text-pastel-text mb-1 line-clamp-1 group-hover:text-pastel-lavender-dark transition-colors">
          {title}
        </h3>
        
        <p className="text-xs text-pastel-text/80 line-clamp-2 leading-relaxed italic">
          "{story}"
        </p>
      </div>
    </div>
  );
}
