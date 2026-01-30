
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const PageLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{title}</h1>
    <div className="prose prose-indigo prose-lg text-slate-600 max-w-none">
      {children}
    </div>
  </div>
);

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formSubmitUrl = (import.meta as any).env?.VITE_FORM_SUBMIT_URL;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = formSubmitUrl;
    if (!url) {
      console.error('VITE_FORM_SUBMIT_URL is not set');
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Send the form data to formsubmit.co (URL sourced from env)
    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(() => {
        setTimeout(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);
          // Reset success message after 3 seconds
          setTimeout(() => setIsSubmitted(false), 3000);
          // Reset form
          e.currentTarget.reset();
        }, 1500);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsSubmitting(false);
        setIsSubmitted(false);
      });
  };

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-slate-600 mb-12">
              Have questions about our licensing or want to contribute? We'd love to hear from you.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Email Us</h3>
                  <p className="text-slate-500">aaaghafazal09@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Telegram</h3>
                  <p className="text-slate-500"><a href="https://t.me/aaaghafazal" className="hover:underline text-indigo-600">@AaghaFazal</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input type="text" name="name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" required onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter your name')} onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input type="email" name="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="mail@example.com" required onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter a valid email')} onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input type="text" name="subject" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="How can we help?" required onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter a subject')} onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea rows={6} name="message" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Tell us more..." required onInvalid={(e) => (e.target as HTMLTextAreaElement).setCustomValidity('Please enter your message')} onInput={(e) => (e.target as HTMLTextAreaElement).setCustomValidity('')}></textarea>
              </div>
              <div className="space-y-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg ${
                    isSubmitting
                      ? 'bg-indigo-500 scale-95 shadow-indigo-100'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" /> Send Message
                    </>
                  )}
                </button>
                {isSubmitted && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in duration-300">
                    <p className="text-green-700 font-medium text-center">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const About = () => (
  <PageLayout title="About PicVault">
    <p>Welcome to PicVault, the internet's source of freely-usable images. Powered by creators everywhere.</p>
    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Our Mission</h2>
    <p>PicVault was founded with a simple goal: to make high-quality visual content accessible to everyone. Whether you are building your first website, designing a presentation, or creating social media content, we believe that great photography shouldn't be a barrier.</p>
    <p className="mt-4">Every image on PicVault is carefully curated and shared by our community of photographers who believe in the open-source movement for visual arts.</p>
  </PageLayout>
);

const Privacy = () => (
  <PageLayout title="Privacy Policy">
    <p className="mb-4">Last updated: May 2024</p>
    <p>At PicVault, accessible from picvault.io, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by PicVault and how we use it.</p>
    <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">Information We Collect</h3>
    <p>We only collect information that is necessary for the core functionality of the site, such as download statistics and basic contact form details. We do not sell your personal information to third parties.</p>
  </PageLayout>
);

const Terms = () => (
  <PageLayout title="Terms & Conditions">
    <p className="mb-4">Last updated: May 2024</p>
    <p>By accessing the website at picvault.io, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
    <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">License</h3>
    <p>All images provided on PicVault are released under a custom license that allows for free commercial and non-commercial use. You do not need to ask permission from or provide credit to the photographer or PicVault, although it is appreciated when possible.</p>
  </PageLayout>
);

const Refund = () => (
  <PageLayout title="Refund & Cancellation">
    <p>Since PicVault provides digital content that is free to download, we do not process typical "refunds" for our core services. However, if you have made a voluntary donation (Buy Me a Coffee) and wish to request a cancellation due to an error, please contact us within 24 hours of the transaction.</p>
    <p className="mt-4">For physical goods or premium services (if launched in the future), we offer a 14-day return window for faulty items.</p>
  </PageLayout>
);

export default { Contact, About, Privacy, Terms, Refund };
