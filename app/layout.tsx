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
  title: {
    default: "Muhammad Areeb Khan | Computer Science Student & DevOps Enthusiast",
    template: "%s | Muhammad Areeb Khan",
  },
  description:
    "Portfolio of Muhammad Areeb Khan — Computer Science student at UET Lahore, passionate about DevOps, Cloud Computing, Docker, Kubernetes, and building scalable applications. Currently seeking internship opportunities.",
  keywords: [
    "Muhammad Areeb Khan",
    "DevOps",
    "Cloud Computing",
    "Docker",
    "Kubernetes",
    "Computer Science",
    "UET Lahore",
    "Internship",
    "Portfolio",
    "Next.js",
    "CI/CD",
  ],
  authors: [{ name: "Muhammad Areeb Khan", url: "https://github.com/areebkh5618-boop" }],
  creator: "Muhammad Areeb Khan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://areebkhan.dev",
    siteName: "Muhammad Areeb Khan Portfolio",
    title: "Muhammad Areeb Khan | DevOps & Cloud Enthusiast",
    description:
      "Computer Science student passionate about DevOps, Cloud Computing, Docker, Kubernetes and Automation. Looking for Internship opportunities.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Areeb Khan Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Areeb Khan | DevOps & Cloud Enthusiast",
    description:
      "Computer Science student passionate about DevOps, Cloud Computing, Docker, Kubernetes and Automation.",
    images: ["/og-image.png"],
    creator: "@areebkhan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://areebkhan.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090B] text-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
