'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const PancasilaQuote = () => {
  const staticQuote = {
    text: "Apa yang kukerjakan hanyalah menggali jauh ke dalam bumi kami, tradisi-tradisi kami sendiri, dan aku menemukan lima butir mutiara yang indah.",
    author: "Ir. Soekarno"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-center py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <Quote className="text-primary w-8 h-8 mx-auto mb-4 opacity-60" />
        <blockquote className="text-lg md:text-xl font-medium text-on-surface-variant mb-4 italic">
          "{staticQuote.text}"
        </blockquote>
        <cite className="text-on-surface-variant/80 font-semibold">
          — {staticQuote.author}
        </cite>
      </div>
    </motion.div>
  );
};

export default PancasilaQuote;
