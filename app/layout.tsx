import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://my-portfolio-eta-sandy-64.vercel.app"),

  title: {
    default: "Ashith B | Computer Science Engineer",
    template: "%s | Ashith B",
  },

  description:
    "Official portfolio of Ashith B, a Computer Science and Engineering student at Srinivas Institute of Technology, Mangaluru. Explore his projects, skills, certifications, achievements, and experience.",

  keywords: [
    "Ashith B",
    "Ashith B portfolio",
    "Ashith",
    "Computer Science Engineer",
    "CSE Student",
    "Srinivas Institute of Technology",
    "Mangaluru",
    "Software Engineer",
    "Web Developer",
    "Java Developer",
    "Python Developer",
    "Full Stack Developer",
  ],

  authors: [
    {
      name: "Ashith B",
    },
  ],

  creator: "Ashith B",
  publisher: "Ashith B",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Ashith B | Computer Science Engineer",
    description:
      "Official portfolio of Ashith B — Computer Science and Engineering student, developer, and project builder.",
    url: "https://my-portfolio-eta-sandy-64.vercel.app",
    siteName: "Ashith B Portfolio",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ashith B | Computer Science Engineer",
    description:
      "Official portfolio of Ashith B — Computer Science and Engineering student and developer.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}