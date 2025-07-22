'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Shuffle, Heart, Share2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ProgrammingQuote = ({ className = '' }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quotes?random=true');
      const data = await response.json();
      
      if (data.success) {
        setQuote(data.data);
        setLiked(false);
      }
    } catch (err) {
      console.error('Failed to fetch quote:', err);
    } finally {
      setLoading(false);
    }
  };

  const shareQuote = async () => {
    if (!quote) return;

    const text = `"${quote.quote}" - ${quote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Programming Quote',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Quote copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy quote');
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'learning': 'bg-blue-100 text-blue-800',
      'clean-code': 'bg-green-100 text-green-800',
      'problem-solving': 'bg-purple-100 text-purple-800',
      'mindset': 'bg-orange-100 text-orange-800',
      'debugging': 'bg-red-100 text-red-800',
      'humor': 'bg-yellow-100 text-yellow-800',
      'action': 'bg-indigo-100 text-indigo-800',
      'design': 'bg-pink-100 text-pink-800',
      'truth': 'bg-gray-100 text-gray-800',
      'purpose': 'bg-teal-100 text-teal-800',
      'innovation': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Quote className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-on-surface">Daily Programming Wisdom</h3>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-on-surface-variant mt-2">Loading wisdom...</p>
        </div>
      ) : quote ? (
        <motion.div
          key={quote.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <blockquote className="text-on-surface italic text-lg leading-relaxed">
            "{quote.quote}"
          </blockquote>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-on-surface-variant font-medium">
                — {quote.author}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(quote.category)}`}>
                {quote.category.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline">
            <div className="flex items-center gap-2">
              <Button
                variant="text"
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-on-surface-variant'}`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              
              <Button
                variant="text"
                onClick={shareQuote}
                className="flex items-center gap-2 text-on-surface-variant"
              >
                <Share2 size={16} />
                Share
              </Button>
            </div>

            <Button
              variant="outlined"
              onClick={fetchRandomQuote}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Shuffle size={16} />
              Quote
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-on-surface-variant">
          Failed to load quote. Please try again.
        </div>
      )}
    </Card>
  );
};

export default ProgrammingQuote;
