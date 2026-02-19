import { Metadata } from "next";
import QuizClient from "./QuizClient";

type Props = {
  params: Promise<{ slug: string }>;
};

// Fetch quiz data helper
async function getQuiz(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/quizzes/${slug}`, {
      cache: "no-store", // Always fetch fresh data
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("Failed to fetch quiz for metadata", e);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const quiz = await getQuiz(slug);

  if (!quiz) {
    return {
      title: "퀴즈를 찾을 수 없습니다",
    };
  }

  // Use the quiz title directly (e.g., "Sean's Favorite Food TOP 10")
  // Or force the format requested: "{Name}의 최애 음식을 맞춰봐"
  // Since quiz.title is usually "{Name}의 최애 음식 TOP 10", we can try to parse it or just use it.
  // The user requested: "'00의 최애 음식을 맞춰봐'라는 타이틀로 적용"

  // Let's try to adapt the title if it matches the standard pattern
  let ogTitle = quiz.title;
  if (quiz.title.includes("의 최애 음식 TOP 10")) {
    const name = quiz.title.split("의 최애 음식 TOP 10")[0];
    ogTitle = `${name}의 최애 음식을 맞춰봐`;
  }

  return {
    title: ogTitle,
    openGraph: {
      title: ogTitle,
      title: ogTitle,
      description: "친구의 음식 취향을 얼마나 잘 알고 있나요? 지금 도전해보세요!",
      images: ["/og-image-v3.png"], // Use the optimized image
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: "친구의 음식 취향을 얼마나 잘 알고 있나요? 지금 도전해보세요!",
      images: ["/og-image-v3.png"],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const quiz = await getQuiz(slug);

  return <QuizClient slug={slug} initialData={quiz} />;
}
