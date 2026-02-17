"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type Quiz = { title: string; items: string[] };

export default function QuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<string[]>([]);
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const created = searchParams.get("created") === "1";

  useEffect(() => {
    fetch(`/api/quizzes/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setQuiz(data);
        setOrder([...data.items].sort(() => Math.random() - 0.5));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const moveItem = (from: number, to: number) => {
    const next = [...order];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    setOrder(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const answers = order.map((name, i) => ({ name, rank: i + 1 }));
      const res = await fetch(`/api/quizzes/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "제출 실패");
      router.push(`/q/${slug}/result/${data.submissionId}?score=${data.score}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/q/${slug}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowShare(false);
    alert("링크가 복사되었습니다!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-gray-800)] flex items-center justify-center">
        <p className="text-[var(--color-gray-400)]">로딩 중...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-[var(--color-gray-800)] flex flex-col items-center justify-center px-6">
        <p className="text-[var(--color-red-400)] mb-4">{error}</p>
        <Link href="/" className="text-[var(--color-blue-400)]">
          홈으로
        </Link>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-[var(--color-gray-800)]">
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="text-[var(--color-gray-400)] hover:text-white">
          ←
        </Link>
        <button
          type="button"
          onClick={() => setShowShare(!showShare)}
          className="text-[var(--color-blue-400)] font-medium"
        >
          공유
        </button>
      </header>

      {showShare && (
        <div className="mx-4 mb-4 p-4 rounded-[var(--rounded-sm)] bg-[var(--color-gray-700)]">
          <p className="text-[var(--color-gray-400)] text-sm mb-2">공유 링크</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 py-2 px-3 rounded bg-[var(--color-gray-800)] text-white text-sm"
            />
            <button
              type="button"
              onClick={copyLink}
              className="py-2 px-4 rounded bg-[var(--color-blue-400)] text-white text-sm font-medium"
            >
              복사
            </button>
          </div>
        </div>
      )}

      {created && (
        <div className="mx-4 mb-4 p-4 rounded-[var(--rounded-sm)] bg-[var(--color-green-400)]/20 text-[var(--color-green-400)]">
          문제지가 생성되었어요! 링크를 친구에게 공유해보세요.
        </div>
      )}

      <main className="px-6 pb-12">
        <h1 className="text-xl font-bold text-white mb-6">{quiz.title}</h1>
        <p className="text-[var(--color-gray-400)] text-sm mb-4">
          아래 음식들을 1위~10위 순서로 드래그해서 정렬해주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ul className="space-y-2">
            {order.map((item, i) => (
              <li
                key={`${item}-${i}`}
                className="flex items-center gap-3 py-3 px-4 rounded-[var(--rounded-sm)] bg-[var(--color-gray-700)] text-white"
              >
                <span className="w-6 text-[var(--color-gray-500)]">{i + 1}</span>
                <span className="flex-1">{item}</span>
                <div className="flex gap-1">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveItem(i, i - 1)}
                      className="p-1 text-[var(--color-gray-400)] hover:text-white"
                    >
                      ▲
                    </button>
                  )}
                  {i < order.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveItem(i, i + 1)}
                      className="p-1 text-[var(--color-gray-400)] hover:text-white"
                    >
                      ▼
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div>
            <label className="block text-[var(--color-gray-400)] text-sm mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              className="w-full py-3 px-4 rounded-[var(--rounded-sm)] bg-[var(--color-gray-700)] border border-[var(--color-gray-500)] text-white placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-400)]"
              maxLength={50}
            />
          </div>

          {error && (
            <p className="text-[var(--color-red-400)] text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 rounded-[var(--rounded-md)] bg-[var(--color-blue-400)] text-white font-bold disabled:opacity-60 hover:bg-[var(--color-blue-500)]"
            >
              {submitting ? "채점 중..." : "제출하기"}
            </button>
            <Link
              href={`/q/${slug}/leaderboard`}
              className="flex-1 py-4 rounded-[var(--rounded-md)] bg-[var(--color-gray-700)] text-white font-bold text-center border border-[var(--color-gray-500)] hover:bg-[var(--color-gray-500)]"
            >
              리더보드
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
