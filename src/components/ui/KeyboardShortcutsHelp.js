'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const KeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: '← →', description: 'Navigasi antar pertanyaan' },
    { key: 'Space', description: 'Lanjut ke pertanyaan berikutnya' },
    { key: 'Enter', description: 'Selesai quiz (pertanyaan terakhir)' },
    { key: '1-4', description: 'Pilih jawaban A-D (segera hadir)' }
  ];

  return (
    <>
      <Button
        variant="text"
        size="medium"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full p-0 bg-surface-container border border-outline-variant hover:bg-surface-container-high"
        icon={<Keyboard size={20} />}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card elevation={4} className="p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-on-surface flex items-center gap-2">
                    <Keyboard size={24} />
                    Keyboard Shortcuts
                  </h3>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setIsOpen(false)}
                    icon={<X size={18} />}
                    className="w-8 h-8 p-0"
                  />
                </div>

                <div className="space-y-4">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-on-surface-variant">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded text-sm font-mono">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-sm text-on-surface-variant">
                  💡 Gunakan keyboard shortcuts untuk navigasi yang lebih cepat!
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcutsHelp;
