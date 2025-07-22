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
  title: "edufrl. - Test Your Programming Knowledge",
  description: "Advanced interactive quiz app built with Next.js. Test your web development and programming skills with 25 challenging questions. Features Material 3 design, dark mode, and real-time statistics.",
  keywords: "quiz, programming, web development, javascript, react, nextjs, tailwind css, interactive quiz, coding test",
  authors: [{ name: "Prozy Dev" }],
  creator: "Prozy Dev",
  publisher: "Prozy Dev",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "edufrl. - Test Your Programming Knowledge",
    description: "Advanced interactive quiz app built with Next.js. Test your web development and programming skills with 10 challenging questions.",
    siteName: "edufrl.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quiz App Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "edufrl. - Test Your Programming Knowledge",
    description: "Advanced interactive quiz app built with Next.js. Test your programming skills now!",
    images: ["/og-image.png"],
    creator: "@prozydev",
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
        <meta name="google-site-verification" content="your-google-verification-code" />
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
