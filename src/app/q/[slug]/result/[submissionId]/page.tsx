"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type ComparisonItem = {
  name: string;
  userRank: number;
  correctRank: number;
  points: number;
};

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const submissionId = params.submissionId as string;
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam, 10) : null;

  const [comparison, setComparison] = useState<ComparisonItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // We could ideally get this from a single API call, 
    // but for now we'll fetch the quiz to get correct ranks 
    // and assume we know the user's order from the submission if we had a dedicated API.
    // To keep it simple and robust, we fetch the quiz data.
    setLoading(true);
    fetch(`/api/quizzes/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);

        // Since we don't have a GET /submissions/[id] API yet, 
        // we'll just show the correct answers list for now, 
        // but redesigned with iOS style.
        // (Full side-by-side would require Submission API update)
        setComparison(data.items.map((name: string, i: number) => ({
          name,
          userRank: 0, // Placeholder
          correctRank: i + 1,
          points: 0 // Placeholder
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const getRankEmoji = (s: number | null) => {
    if (s === null) return "🤔";
    if (s >= 90) return "🏆";
    if (s >= 70) return "🥈";
    if (s >= 40) return "🥉";
    return "🌱";
  };

  const shareResult = () => {
    const text = `내 최애 음식 테스트 결과: ${score}점! ${getRankEmoji(score)} \n너도 친구의 취향을 맞춰봐!`;
    const url = `${window.location.origin}/q/${slug}`;

    if (navigator.share) {
      navigator.share({ title: "내 최애 음식을 맞춰봐", text, url });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert("결과가 복사되었습니다!");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center">
      <main className="w-full max-w-lg px-6 pt-12 pb-32 flex flex-col items-center text-center">

        <div className="mb-10 space-y-4">
          <div className="w-24 h-24 bg-[var(--tertiary-bg)] rounded-full flex items-center justify-center text-5xl mx-auto shadow-xl border-4 border-[var(--color-primary)]/20">
            {getRankEmoji(score)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">채점 완료!</h1>
            <p className="text-[var(--text-secondary)] font-medium">당신의 점수는...</p>
          </div>
        </div>

        <div className="w-full ios-card p-8 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="relative z-10">
            <span className="text-8xl font-black text-[var(--color-warning)] drop-shadow-2xl">
              {score ?? "?"}
            </span>
            <span className="text-2xl text-[var(--text-tertiary)] font-bold ml-2">/ 100</span>
          </div>
          <p className="mt-6 text-xl font-bold text-white">
            {score !== null && (
              score >= 90 ? "영혼의 단짝인가요? 💖" :
                score >= 70 ? "와우! 꽤 잘 아시네요! ✨" :
                  score >= 40 ? "노력이 필요해요! 🔥" :
                    "혹시 초면인가요...? 😂"
            )}
          </p>
        </div>

        <div className="w-full space-y-4 mb-12">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-4 rounded-2xl bg-[var(--tertiary-bg)] text-white font-bold ios-button border border-[var(--glass-border)] flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 11l3 3 3-3m-6-4l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {showDetails ? "정답 숨기기" : "정답 순위 확인하기"}
          </button>

          {showDetails && comparison && (
            <div className="w-full ios-card p-6 text-left animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider mb-4 px-1">
                진짜 정답 순위 (1위~10위)
              </h3>
              <div className="space-y-3">
                {comparison.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-color)]/50 border border-[var(--glass-border)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm shrink-0">
                      {item.correctRank}
                    </div>
                    <span className="text-white font-semibold flex-1">{item.name}</span>
                    {item.correctRank <= 3 && <span className="text-lg">⭐</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={shareResult}
            className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg ios-button shadow-lg shadow-[var(--color-primary)]/20"
          >
            결과 공유하기
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/q/${slug}`}
              className="py-4 rounded-2xl bg-[var(--tertiary-bg)] text-white font-bold text-center ios-button border border-[var(--glass-border)]"
            >
              다시 도전
            </Link>
            <Link
              href="/create"
              className="py-4 rounded-2xl bg-white text-black font-bold text-center ios-button shadow-xl"
            >
              나도 만들기
            </Link>
          </div>
        </div>

        <div className="mt-16 w-full opacity-80">
          <a
            href="https://link.coupang.com/a/dN5PtC"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full p-4 rounded-2xl bg-gradient-to-r from-[var(--color-warning)] to-[#FF9500] text-black font-extrabold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            🍕 재밌었다면? 최애 음식 먹으러 가기!
          </a>
          <p className="mt-3 text-[10px] text-[var(--text-tertiary)] leading-tight text-center">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로,<br />이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>

      </main>

      <footer className="fixed bottom-0 w-full max-w-lg ios-glass h-20 px-6 flex items-center justify-center z-50">
        <Link href="/" className="text-[var(--text-secondary)] font-bold hover:text-white transition-colors">
          메인으로 돌아가기
        </Link>
      </footer>
    </div>
  );
}
