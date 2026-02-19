import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import QuizClient from "./QuizClient";

type Props = {
  params: Promise<{ slug: string }>;
};

// Fetch directly from DB to avoid self-fetch issues during build/runtime
async function getQuizFromDB(slug: string) {
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("title, items") // items might be in a separate table or jsonb. Based on API route, it's separate.
    // Wait, the API route does a join explanation. Let's look at API route logic again.
    // API Route: fetches 'quizzes' then 'quiz_items'.
    // Here we need 'title' for metadata. 'items' are needed for Client Component.
    .eq("slug", slug)
    .single();

  if (!quiz) return null;

  // We actually need items for the client component to avoid double fetch.
  // But for metadata, we only need title.
  // Let's optimize: fetch title only for metadata? 
  // No, we pass data to Page too. So we need full data.
  // Let's implement full fetch here mirroring the API logic but with direct DB access.

  const { data: items } = await supabase
    .from("quiz_items")
    .select("name, rank")
    .eq("quiz_id", (quiz as any).id)
    .order("rank", { ascending: true });

  return {
    ...quiz,
    items: (items || []).map((i) => i.name)
  };
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  // Use direct DB access
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("title")
    .eq("slug", slug)
    .single();

  if (!quiz) {
    return {
      title: "퀴즈를 찾을 수 없습니다",
    };
  }

  let ogTitle = quiz.title;
  if (quiz.title.includes("의 최애 음식 TOP 10")) {
    const name = quiz.title.split("의 최애 음식 TOP 10")[0];
    ogTitle = `${name}의 최애 음식을 맞춰봐`;
  }

  return {
    title: ogTitle,
    openGraph: {
      title: ogTitle,
      description: "친구의 음식 취향을 얼마나 잘 알고 있나요? 지금 도전해보세요!",
      images: [
        {
          url: "/og-image-kakao.jpeg",
          width: 800,
          height: 400,
          alt: "내 최애 음식을 맞춰봐"
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: "친구의 음식 취향을 얼마나 잘 알고 있나요? 지금 도전해보세요!",
      images: ["/og-image-kakao.jpeg"],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const quiz = await getQuizFromDB(slug);

  return <QuizClient slug={slug} initialData={quiz} />;
}
