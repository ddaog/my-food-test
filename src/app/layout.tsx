import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 최애 음식을 맞춰봐 | my-food-test",
  description: "내가 좋아하는 음식 1위~10위 맞추기 테스트. 친구들과 순위를 맞춰보세요!",
  metadataBase: new URL("https://my-food-test.vercel.app"),
  openGraph: {
    title: "내 최애 음식을 맞춰봐",
    description: "내가 좋아하는 음식 1위~10위 맞추기 테스트",
    url: "https://my-food-test.vercel.app",
    siteName: "My Food Test",
    images: [
      {
        url: "/og-image-kakao.png",
        width: 800,
        height: 400,
        alt: "내 최애 음식을 맞춰봐",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "내 최애 음식을 맞춰봐",
    description: "내가 좋아하는 음식 1위~10위 맞추기 테스트",
    images: ["/og-image-kakao.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
