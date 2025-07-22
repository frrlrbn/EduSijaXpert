'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Share2, Heart, RefreshCw } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const QuoteSection = () => {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleShare = () => {
    if (navigator.share && quote) {
      navigator.share({
        title: 'Programming Quote',
        text: `"${quote.text}" - ${quote.author}`,
        url: window.location.href
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-surface-variant rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-surface-variant rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!quote) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Quote size={64} />
        </div>

        <motion.div variants={itemVariants} className="relative z-10">
          {/* Quote text */}
          <blockquote className="text-lg sm:text-xl font-medium text-on-surface mb-4 leading-relaxed">
            "{quote.text}"
          </blockquote>

          {/* Author */}
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
            <cite className="text-on-surface-variant not-italic">
              — {quote.author}
            </cite>
            
            {/* Category badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {quote.category}
            </span>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <Button
              variant="text"
              size="small"
              icon={<Heart size={16} className={isLiked ? 'fill-current text-error' : ''} />}
              onClick={() => setIsLiked(!isLiked)}
              className="text-on-surface-variant"
            >
              {isLiked ? 'Liked' : 'Like'}
            </Button>

            <Button
              variant="text"
              size="small"
              icon={<Share2 size={16} />}
              onClick={handleShare}
              className="text-on-surface-variant"
            >
              Share
            </Button>

            <div className="flex-1"></div>

            <Button
              variant="tonal"
              size="small"
              icon={<RefreshCw size={16} />}
              onClick={fetchQuote}
              className="ml-auto"
            >
              New
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default QuoteSection;
