import React from 'react';
import { X, Link, Facebook, Twitter, Linkedin, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleUrl: string;
  articleTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, articleUrl, articleTitle }) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(articleUrl)
      .then(() => toast.success('Enlace copiado al portapapeles!'))
      .catch(() => toast.error('Error al copiar el enlace.'));
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${articleTitle}: ${articleUrl}`)}`, '_blank');
  };

  const shareViaWebShareApi = () => {
    if (navigator.share) {
      navigator.share({
        title: articleTitle,
        url: articleUrl,
      })
      .catch((error) => console.error('Error sharing:', error));
    } else {
      toast.error('Tu navegador no soporta la API Web Share.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col transform transition-all duration-300 scale-95 animate-fade-in-scale">
        <header className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Compartir Artículo</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 space-y-4">
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium"
          >
            <Link className="w-5 h-5" />
            Copiar Enlace
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={shareOnFacebook} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <Facebook className="w-5 h-5" /> Facebook
            </button>
            <button onClick={shareOnTwitter} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-400 hover:bg-blue-500 text-white font-medium">
              <Twitter className="w-5 h-5" /> Twitter
            </button>
            <button onClick={shareOnLinkedIn} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium">
              <Linkedin className="w-5 h-5" /> LinkedIn
            </button>
            <button onClick={shareOnWhatsApp} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium">
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </button>
          </div>
          {navigator.share && typeof navigator.share === 'function' && (
            <button
              onClick={shareViaWebShareApi}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-medium"
            >
              <Share2 className="w-5 h-5" />
              Compartir (Nativo)
            </button>
          )}
        </main>
      </div>
    </div>
  );
};
