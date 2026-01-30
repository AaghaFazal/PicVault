
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LayoutDashboard, Image as ImageIcon, LogOut, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { ImageItem, Category } from '../types';
import { addImage, updateImage, deleteImage } from '../services/storage';

interface AdminProps {
  images: ImageItem[];
  refreshImages: () => void;
}

const CATEGORIES = Object.values(Category);

export default function AdminPanel({ images, refreshImages }: AdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified secure login simulation
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <p className="text-slate-500 mt-2">Access protected dashboard area</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>
            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Sign In
            </button>
          </form>
          <div className="mt-8 text-center">
             <Link to="/" className="text-sm text-slate-400 hover:text-indigo-600 transition-colors">Back to Public Site</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <div className="bg-slate-900 p-2.5 rounded-xl">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Admin Panel</h1>
            <p className="text-slate-500">Manage your vault and community uploads</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="add" className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Plus className="h-5 w-5 mr-2" /> Add Image
          </Link>
          <button onClick={() => setIsAuthenticated(false)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>

      <Routes>
        <Route index element={<Dashboard images={images} refreshImages={refreshImages} />} />
        <Route path="add" element={<ImageForm refreshImages={refreshImages} />} />
        <Route path="edit/:id" element={<ImageForm images={images} refreshImages={refreshImages} isEditing />} />
      </Routes>
    </div>
  );
}

function Dashboard({ images, refreshImages }: AdminProps) {
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      deleteImage(id);
      refreshImages();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Downloads</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {images.map(image => (
              <tr key={image.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="w-20 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-900 truncate max-w-xs">{image.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{image.tags.slice(0, 3).join(', ')}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold uppercase">{image.category}</span>
                </td>
                <td className="px-6 py-5 text-center font-semibold text-slate-700">
                  {image.downloads}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link to={`edit/${image.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(image.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {images.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400">No images found. Start by adding some.</p>
        </div>
      )}
    </div>
  );
}

function ImageForm({ refreshImages, images = [], isEditing = false }: { refreshImages: () => void, images?: ImageItem[], isEditing?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const existing = images.find(img => img.id === id);

  const [formData, setFormData] = useState({
    title: existing?.title || '',
    category: existing?.category || CATEGORIES[0],
    tags: existing?.tags.join(', ') || '',
    description: existing?.description || '',
    source: existing?.source || '',
    url: existing?.url || ''
  });
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    };

    if (isEditing && existing) {
      updateImage({ ...existing, ...payload });
    } else {
      addImage(payload);
    }

    setTimeout(() => {
      refreshImages();
      navigate('/admin');
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit' : 'Add New'} Image</h2>
        <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
      </div>
      <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
            <div>
              <input 
                required 
                type="url" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Descriptive title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma separated)</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="nature, wallpaper, highres"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Source / Credit</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g. Taken in Kyoto with Nikon D850"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea 
              required 
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write a brief story or technical details about the image..."
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-8 border-t border-slate-100 flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin')}
            className="px-8 py-3 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 border border-slate-200 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Entry' : 'Publish Image')}
          </button>
        </div>
      </form>
    </div>
  );
}

const useParams = () => {
  const path = window.location.hash.split('/');
  const id = path[path.length - 1];
  return { id };
};
