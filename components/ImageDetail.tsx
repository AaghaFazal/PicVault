
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Info, Tag, Calendar, User, Coffee, Check, ExternalLink, Share2, Shield, X } from 'lucide-react';
import { ImageItem } from '../types';
import { incrementDownloads } from '../services/storage';

interface ImageDetailProps {
  images: ImageItem[];
  refreshImages: () => void;
}

export default function ImageDetail({ images, refreshImages }: ImageDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  const image = images.find(img => img.id === id);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleDonation = async (amount: string) => {
    const amountInPaise = parseInt(amount.replace('₹', '')) * 100;
    
    const options = {
      key: (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || '',
      amount: amountInPaise,
      currency: 'INR',
      name: 'PicVault',
      description: 'Support the PicVault Community',
      handler: function(response: any) {
        setShowCoffeeModal(false);
        setSelectedAmount('');
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3500);
      },
      prefill: {
        name: 'PicVault Supporter',
        email: 'aaaghafazal09@gmail',
      },
      theme: {
        color: '#4f46e5'
      },
      modal: {
        ondismiss: function() {
          setProcessing(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setProcessing(false);
  };

  if (!image) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Image not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline">Return to gallery</Link>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    incrementDownloads(image.id);
    refreshImages();
    
    try {
      // Fetch the image
      const response = await fetch(image.url, { mode: 'cors' });
      const blob = await response.blob();
      
      // Create blob URL and download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        setDownloading(false);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(image.url, '_blank');
      setDownloading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-indigo-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Image Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img src={image.url} alt={image.title} className="w-full h-auto object-contain max-h-[80vh]" />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {image.tags.map(tag => (
                <span key={tag} className="flex items-center bg-white px-4 py-2 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                  <Tag className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                  {image.category}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{image.title}</h1>
                <p className="mt-4 text-slate-600 leading-relaxed">{image.description}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center text-slate-500 text-sm">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>Uploaded on {new Date(image.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-slate-500 text-sm">
                  <Info className="h-4 w-4 mr-3" />
                  <span>Source: {image.source}</span>
                </div>
                <div className="flex items-center text-slate-500 text-sm">
                  <Download className="h-4 w-4 mr-3" />
                  <span>{image.downloads} free downloads</span>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <button 
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`w-full flex items-center justify-center px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl ${
                    downloading 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  }`}
                >
                  {downloading ? (
                    <><Check className="h-6 w-6 mr-2" /> Downloading...</>
                  ) : (
                    <><Download className="h-6 w-6 mr-2" /> Free Download</>
                  )}
                </button>

                <button 
                  onClick={() => setShowCoffeeModal(true)}
                  className="w-full flex items-center justify-center px-8 py-4 bg-orange-50 text-orange-700 border-2 border-orange-100 rounded-2xl text-lg font-bold hover:bg-orange-100 transition-all"
                >
                  <Coffee className="h-6 w-6 mr-2" />
                  Buy Me a Coffee
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">PicVault License</h3>
                <p className="text-indigo-200 text-sm mb-4 leading-relaxed">
                  Free to use for commercial and non-commercial purposes. No attribution required (but always appreciated).
                </p>
                <Link to="/terms" className="text-sm font-semibold flex items-center hover:underline">
                  Read full license <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </div>
              {/* Fix: Imported Shield from lucide-react to resolve "Cannot find name Shield" */}
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Shield className="w-40 h-40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-[200] animate-in slide-in-from-right-4 fade-in">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <Check className="h-5 w-5" />
            <div>
              <p className="font-bold">Payment Successful!</p>
              <p className="text-sm text-emerald-50">Thank you for your support.</p>
            </div>
          </div>
        </div>
      )}

      {/* Coffee Modal */}
      {showCoffeeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCoffeeModal(false)}></div>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95">
            <button 
              onClick={() => setShowCoffeeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Support the Creator</h3>
              <p className="text-slate-500 mb-8">If you find these images useful, consider supporting our community with a small donation.</p>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {['₹25', '₹50', '₹100'].map(amount => (
                  <button 
                    key={amount} 
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 border-2 rounded-2xl font-bold transition-all ${
                      selectedAmount === amount
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                        : 'border-slate-100 hover:border-indigo-500 hover:text-indigo-600'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  if (selectedAmount) {
                    setProcessing(true);
                    handleDonation(selectedAmount);
                  }
                }}
                disabled={!selectedAmount || processing}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-lg ${
                  selectedAmount && !processing
                    ? 'bg-slate-900 text-white hover:bg-black'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {processing ? 'Processing...' : 'Donate via UPI / Card'}
              </button>
              <p className="mt-4 text-xs text-slate-400">Secure payments powered by Razorpay</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
