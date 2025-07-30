'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Card from './Card';

const QuoteSection = () => {
  const staticQuote = {
    text: "Pancasila merupakan pandangan hidup bangsa Indonesia yang berfungsi sebagai tata nilai dalam kehidupan berbangsa dan bernegara.",
    author: "Peraturan BPIP",
    category: "Pancasila"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="p-6 bg-gradient-to-br from-primary-container to-secondary-container">
        <div className="flex items-start gap-4">
          <Quote className="text-primary w-8 h-8 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <blockquote className="text-lg font-medium text-on-primary-container mb-3">
              "{staticQuote.text}"
            </blockquote>
            <div className="flex items-center justify-between">
              <cite className="text-on-primary-container/80 font-semibold">
                — {staticQuote.author}
              </cite>
              <span className="text-xs px-2 py-1 bg-primary/20 rounded-full text-on-primary-container">
                {staticQuote.category}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuoteSection;
