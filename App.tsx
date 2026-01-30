
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Image as ImageIcon, LayoutGrid, Shield, Heart, Menu, X } from 'lucide-react';
import Gallery from './components/Gallery';
import ImageDetail from './components/ImageDetail';
import AdminPanel from './components/AdminPanel';
import StaticPages from './components/StaticPages';
import { getImages } from './services/storage';
import { ImageItem } from './types';

const Header = ({ isAdmin, onToggleAdmin }: { isAdmin: boolean, onToggleAdmin: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">PicVault</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>Gallery</Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-indigo-600">About</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Contact</Link>
            <Link to="/admin" className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-indigo-600">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-2">
          <Link to="/" className="block px-4 py-2 text-slate-600" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link to="/contact" className="block px-4 py-2 text-slate-600" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/admin" className="block px-4 py-2 text-slate-600 font-semibold" onClick={() => setIsOpen(false)}>Admin Panel</Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-indigo-500 p-1 rounded-md">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PicVault</span>
          </div>
          <p className="max-w-xs text-slate-400">
            Premium high-resolution images for creators, designers, and developers. Free to download and use for any project.
          </p>

        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Image Gallery</Link></li>
            <li><Link to="/admin" className="hover:text-white">Admin Dashboard</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/refund" className="hover:text-white">Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center">
        Made with ❤️ and ☕ By Aagha Fazal
      </div>
    </div>
  </footer>
);

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loaded = getImages();
    setImages(loaded);
  }, []);

  const refreshImages = () => {
    setImages(getImages());
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin(!isAdmin)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Gallery images={images} refreshImages={refreshImages} />} />
            <Route path="/image/:id" element={<ImageDetail images={images} refreshImages={refreshImages} />} />
            <Route path="/admin/*" element={<AdminPanel images={images} refreshImages={refreshImages} />} />
            <Route path="/contact" element={<StaticPages.Contact />} />
            <Route path="/privacy" element={<StaticPages.Privacy />} />
            <Route path="/terms" element={<StaticPages.Terms />} />
            <Route path="/refund" element={<StaticPages.Refund />} />
            <Route path="/about" element={<StaticPages.About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
