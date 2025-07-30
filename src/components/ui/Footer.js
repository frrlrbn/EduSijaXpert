'use client';

import { motion } from 'framer-motion';
import { Github, Globe, Mail, Heart, Code, BookOpen, Zap, Smartphone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const links = [
    {
      category: "Platform",
      items: [
        { name: "Quiz Pancasila", href: "" },
        { name: "Leaderboard", href: "" },
        { name: "Statistik", href: "" },
        { name: "Tentang", href: "" }
      ]
    },
    {
      category: "Teknologi",
      items: [
        { name: "Next.js", href: "https://nextjs.org" },
        { name: "React.Js", href: "https://react.dev" },
        { name: "Tailwind CSS", href: "https://tailwindcss.com" },
        { name: "Framer Motion", href: "https://framer.com/motion" }
      ]
    },
    {
      category: "Kontak",
      items: [
        { name: "GitHub", href: "https://github.com/frrlrbn", icon: <Github size={16} /> }
      ]
    }
  ];

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="bg-surface-container border-t border-outline/30 mt-12 md:mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-on-primary" />
              </div>
              <h3 className="text-lg font-bold text-on-surface">edufrl.</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              Platform quiz interaktif untuk menguji dan meningkatkan pemahaman tentang nilai-nilai Pancasila. 
              Dibuat dengan teknologi modern untuk pembelajaran yang optimal tentang ideologi bangsa.
            </p>
          </motion.div>

          {/* Links Sections */}
          {links.map((section, index) => (
            <motion.div key={section.category} variants={itemVariants} className="lg:col-span-1">
              <h4 className="text-sm font-semibold text-on-surface mb-4 uppercase tracking-wider">
                {section.category}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                      target={item.href.startsWith('http') ? '_blank' : '_self'}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    >
                      {item.icon && (
                        <span className="group-hover:scale-110 transition-transform duration-200">
                          {item.icon}
                        </span>
                      )}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-primary-container rounded-xl p-4 md:p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg md:text-xl font-bold text-on-primary-container">15</div>
              <div className="text-xs md:text-sm text-on-primary-container/80">Soal Quiz</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-on-primary-container">100%</div>
              <div className="text-xs md:text-sm text-on-primary-container/80">Gratis</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-on-primary-container flex justify-center">
                <Zap size={20} className="text-on-primary-container" />
              </div>
              <div className="text-xs md:text-sm text-on-primary-container/80">Real-time</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-on-primary-container flex justify-center">
                <Smartphone size={20} className="text-on-primary-container" />
              </div>
              <div className="text-xs md:text-sm text-on-primary-container/80">Mobile Ready</div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          variants={itemVariants}
          className="pt-6 border-t border-outline/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-on-surface-variant text-center md:text-left">
              <span>© {currentYear} frrlverse. Semua hak dilindungi.</span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-on-surface-variant">
              <span>Versi BETA</span>
              <span>•</span>
              <a href="" className="hover:text-primary transition-colors">
                Kebijakan Privasi
              </a>
              <span>•</span>
              <a href="" className="hover:text-primary transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Badge */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-variant rounded-full text-xs text-on-surface-variant">
            <span>Made with 🤍 by frrlrbn</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
