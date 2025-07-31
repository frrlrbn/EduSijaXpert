import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const figtree = localFont({
  src: "../../public/fonts/Figtree.ttf",
  variable: "--font-figtree",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "edufrl. - Quiz Pancasila Indonesia",
  description: "Uji pemahaman Anda tentang nilai-nilai Pancasila dengan quiz interaktif. 15 pertanyaan pilihan berganda yang dipilih acak dari 40 soal tentang filosofi, implementasi, dan pengamalan Pancasila dalam kehidupan berbangsa dan bernegara.",
  keywords: "quiz pancasila, nilai pancasila, pendidikan pancasila, ideologi indonesia, sila pancasila, quiz kebangsaan, pendidikan kewarganegaraan, filosofi pancasila",
  authors: [{ name: "edufrl" }],
  creator: "edufrl",
  publisher: "edufrl",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "edufrl. - Quiz Pancasila Indonesia",
    description: "Uji pemahaman Anda tentang nilai-nilai Pancasila dengan 15 pertanyaan pilihan berganda yang dipilih secara acak. Perkuat wawasan kebangsaan Anda!",
    siteName: "edufrl.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quiz Pancasila Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "edufrl. - Quiz Pancasila Indonesia",
    description: "Uji pemahaman Anda tentang nilai-nilai Pancasila dengan quiz interaktif. Mulai sekarang!",
    images: ["/og-image.png"],
    creator: "@edufrl",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fefefe" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="quiz-pancasila-verification" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${figtree.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-figtree`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
