# 🧠 Advanced Quiz App

Quiz App yang modern, responsif, dan interaktif yang dibangun dengan Next.js 15, Tailwind CSS v4, dan Framer Motion. Aplikasi ini menampilkan desain Material 3 Expressive dengan color palette monochrome yang elegan.

![Quiz App Demo](https://via.placeholder.com/800x400/2d2d2d/ffffff?text=Quiz+App+Demo)

## ✨ Fitur Utama

### 🎨 **Desain Modern**
- **Material 3 Expressive Design** - Mengikuti pedoman desain terbaru Google
- **Monochrome Color Palette** - Warna yang elegan dan profesional
- **Dark/Light Mode** - Switching theme otomatis dan manual
- **Responsive Design** - Optimal di desktop, tablet, dan mobile

### 🎯 **Fitur Quiz**
- **10 Pertanyaan Berkualitas** - Seputar web development dan programming
- **Multiple Choice** - 4 pilihan jawaban untuk setiap pertanyaan
- **Instant Feedback** - Penjelasan lengkap untuk setiap jawaban
- **Progress Tracking** - Bar progress real-time
- **Timer** - Tracking waktu pengerjaan tanpa batas waktu

### 🚀 **Interaktif & Animatif**
- **Smooth Animations** - Powered by Framer Motion
- **Keyboard Shortcuts** - Navigasi cepat dengan keyboard
- **Live Statistics** - Statistik real-time saat mengerjakan
- **Review Mode** - Review jawaban setelah selesai

### 📊 **Analytics & Results**
- **Detailed Scoring** - Persentase, grade (A-E), dan statistik lengkap
- **Time Analytics** - Total waktu dan rata-rata per pertanyaan
- **Streak Tracking** - Melacak jawaban benar berturut-turut
- **Share Results** - Bagikan hasil ke social media

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: JavaScript/JSX
- **State Management**: React Hooks (useState, useEffect, useCallback)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn atau pnpm

### Installation

1. **Clone repository**
```bash
git clone https://github.com/username/quiz-app.git
cd quiz-app
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. **Run development server**
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

4. **Open browser**
Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Struktur Project

```
quiz-app/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── dark-mode.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── quiz/
│   │   │   ├── QuizApp.js
│   │   │   ├── QuizWelcome.js
│   │   │   ├── QuizHeader.js
│   │   │   ├── QuizCard.js
│   │   │   ├── QuizNavigation.js
│   │   │   ├── QuizResults.js
│   │   │   └── QuizStats.js
│   │   └── ui/
│   │       ├── Button.js
│   │       ├── Card.js
│   │       ├── ProgressBar.js
│   │       ├── KeyboardShortcuts.js
│   │       └── KeyboardShortcutsHelp.js
│   ├── hooks/
│   │   └── useQuiz.js
│   └── data/
│       └── quizData.js
├── public/
├── package.json
└── README.md
```

## 🎮 Cara Bermain

### 🖱️ **Mouse/Touch**
1. **Mulai Quiz** - Klik tombol "Mulai Quiz" di halaman welcome
2. **Pilih Jawaban** - Klik salah satu dari 4 pilihan jawaban
3. **Navigasi** - Gunakan tombol "Sebelumnya" dan "Selanjutnya"
4. **Selesai** - Klik "Selesai" di pertanyaan terakhir

### ⌨️ **Keyboard Shortcuts**
- `←` `→` - Navigasi antar pertanyaan  
- `Space` - Lanjut ke pertanyaan berikutnya
- `Enter` - Selesai quiz (di pertanyaan terakhir)
- `1-4` - Pilih jawaban A-D *(coming soon)*

### 🌙 **Theme Toggle**
- Klik ikon matahari/bulan di pojok kanan atas
- Otomatis mengikuti system preference
- Setting tersimpan di local storage

## 🎯 Fitur Mendalam

### **Material 3 Design System**
- **Color Tokens** - Menggunakan design tokens untuk konsistensi
- **Elevation** - 5 level elevation dengan shadow yang sesuai
- **Typography** - Hierarki tipografi yang jelas
- **Motion** - Transisi dan animasi yang meaningful

### **Responsive Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### **Accessibility Features**
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - Semantic HTML dan ARIA labels
- **Color Contrast** - WCAG AA compliant
- **Focus Management** - Visible focus indicators

### **Performance Optimizations**
- **Code Splitting** - Lazy loading components
- **Image Optimization** - Next.js Image component
- **Bundle Optimization** - Tree shaking dan minification
- **Caching** - Browser caching dan service worker ready

## 🔧 Customization

### **Menambah Pertanyaan**
Edit file `src/data/quizData.js`:

```javascript
{
  id: 11,
  question: "Pertanyaan baru Anda?",
  options: [
    "Pilihan A",
    "Pilihan B", 
    "Pilihan C",
    "Pilihan D"
  ],
  correctAnswer: 0, // Index jawaban benar (0-3)
  explanation: "Penjelasan lengkap untuk jawaban ini..."
}
```

### **Mengubah Tema Warna**
Edit variabel CSS di `src/app/globals.css`:

```css
:root {
  --primary: #your-primary-color;
  --on-primary: #your-on-primary-color;
  /* dst... */
}
```

### **Menambah Kategori Quiz**
Extend `quizCategories` di `src/data/quizData.js` dan implementasikan filter logic.

## 📦 Build & Deploy

### **Build untuk Production**
```bash
npm run build
npm run start
```

### **Deploy ke Vercel**
```bash
npx vercel
```

### **Deploy ke Netlify**
```bash
npm run build
# Upload folder .next/ ke Netlify
```

### **Deploy ke GitHub Pages**
```bash
npm run build
npm run export
# Upload folder out/ ke GitHub Pages
```

## 🎨 Screenshots

### Light Mode
![Light Mode](https://via.placeholder.com/800x600/fefefe/2d2d2d?text=Light+Mode)

### Dark Mode  
![Dark Mode](https://via.placeholder.com/800x600/121212/e3e3e3?text=Dark+Mode)

### Mobile View
![Mobile View](https://via.placeholder.com/400x800/f0f0f0/2d2d2d?text=Mobile+View)

### Quiz Results
![Quiz Results](https://via.placeholder.com/800x600/e8e8e8/1a1a1a?text=Quiz+Results)

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

### **Guidelines Kontribusi**
- Ikuti code style yang ada
- Tambahkan tests untuk fitur baru
- Update dokumentasi jika diperlukan
- Gunakan conventional commits

## 🐛 Bug Reports

Jika menemukan bug, silakan buat issue dengan:
- **Environment** (OS, Browser, Node version)
- **Steps to reproduce** 
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (jika ada)

## 🔮 Roadmap

### **v2.0 - Coming Soon**
- [ ] **Multiple Quiz Categories** - Frontend, Backend, General
- [ ] **User Authentication** - Login dan save progress
- [ ] **Leaderboard** - Global rankings
- [ ] **Custom Quiz Creator** - Buat quiz sendiri
- [ ] **Social Features** - Share dan challenge friends

### **v2.1 - Future**
- [ ] **Offline Mode** - PWA dengan offline capability
- [ ] **Voice Commands** - Accessibility via voice
- [ ] **Multi-language** - i18n support
- [ ] **Advanced Analytics** - Detailed performance insights

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Prozy Dev** 
- GitHub: [@prozydev](https://github.com/prozydev)
- LinkedIn: [Prozy Dev](https://linkedin.com/in/prozydev)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Material Design 3](https://m3.material.io/) - Design system
- [Vercel](https://vercel.com/) - Deployment platform

---

⭐️ **Star this repository if you like it!** ⭐️

*Built with ❤️ by Prozy Dev*
