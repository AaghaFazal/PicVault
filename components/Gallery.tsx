
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye, Tag } from 'lucide-react';
import { ImageItem, Category } from '../types';

interface GalleryProps {
  images: ImageItem[];
  refreshImages: () => void;
}

const CATEGORIES = Object.values(Category);

export default function Gallery({ images }: GalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredImages = useMemo(() => {
    return images.filter(img => {
      const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [images, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl mb-6">
          The best free <span className="text-indigo-600">stock photos</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Over 1,000+ high quality images shared by our talented community.
        </p>

        <div className="max-w-3xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for mountains, neon, workspace..." 
            className="w-full pl-14 pr-6 py-5 rounded-2xl border-none bg-white shadow-xl focus:ring-2 focus:ring-indigo-500 text-lg transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            selectedCategory === 'All' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          {filteredImages.length} {filteredImages.length === 1 ? 'result' : 'results'}
          {searchQuery && <span> for "<span className="text-indigo-600">{searchQuery}</span>"</span>}
        </h2>
      </div>

      {/* Masonry Grid */}
      {filteredImages.length > 0 ? (
        <div className="masonry-grid">
          {filteredImages.map((image) => (
            <div key={image.id} className="masonry-item group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <Link to={`/image/${image.id}`} className="block relative aspect-auto overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                  <div className="flex items-center space-x-4 text-white/90 text-sm">
                    <span className="flex items-center"><Download className="h-4 w-4 mr-1" /> {image.downloads}</span>
                    <span className="px-2 py-1 bg-white/20 rounded backdrop-blur-sm text-xs font-medium uppercase tracking-wider">{image.category}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
          <p className="text-slate-500">We couldn't find any images matching your current filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-6 text-indigo-600 font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
