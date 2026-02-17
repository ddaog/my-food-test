"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam, 10) : null;

  return (
    <div className="min-h-screen bg-[var(--color-gray-800)] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">🎉 채점 완료!</h1>
        <div className="my-8">
              <span className="text-6xl font-extrabold text-[var(--color-yellow-400)]">
                {score ?? "?"}
              </span>
              <span className="text-2xl text-[var(--color-gray-400)] ml-2">
                / 100점
              </span>
            </div>
            <p className="text-[var(--color-gray-400)] mb-8">
              {score !== null &&
                (score >= 90
                  ? "완벽해요! 🏆"
                  : score >= 70
                    ? "잘했어요! 👍"
                    : "다시 도전해보세요! 💪")}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/q/${slug}/leaderboard`}
                className="w-full py-4 rounded-[var(--rounded-md)] bg-[var(--color-blue-400)] text-white font-bold text-center hover:bg-[var(--color-blue-500)]"
              >
                리더보드 보기
              </Link>
              <Link
                href={`/q/${slug}`}
                className="w-full py-4 rounded-[var(--rounded-md)] bg-[var(--color-gray-700)] text-white font-bold text-center border border-[var(--color-gray-500)] hover:bg-[var(--color-gray-500)]"
              >
                다시 도전
              </Link>
              <Link href="/" className="text-[var(--color-gray-400)] text-sm">
                홈으로
              </Link>
              <div className="mt-8 pt-6 border-t border-[var(--color-gray-700)]">
                <a
                  href="https://link.coupang.com/a/dN5PtC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 rounded-[var(--rounded-sm)] bg-[var(--color-yellow-400)] text-[var(--color-gray-800)] font-bold text-center hover:opacity-90 transition-opacity"
                >
                  🛒 쿠팡에서 맛있는 음식 구경하기
                </a>
                <p className="mt-2 text-[11px] text-[var(--color-gray-500)] leading-relaxed">
                  위 링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
                  수수료를 제공받습니다.
                </p>
              </div>
        </div>
      </div>
    </div>
  );
}
