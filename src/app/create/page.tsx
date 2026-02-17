"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEFAULT_ITEMS = [
  "초밥",
  "라면",
  "떡볶이",
  "삼겹살",
  "피자",
  "치킨",
  "파스타",
  "김치찌개",
  "햄버거",
  "냉면",
];

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    setItems(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    const trimmed = items.map((i) => i.trim()).filter(Boolean);
    if (trimmed.length !== 10) {
      setError("음식 10개를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), items: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "생성 실패");
      const url = `${window.location.origin}/q/${data.slug}`;
      sessionStorage.setItem(`editToken_${data.slug}`, data.editToken);
      router.push(`/q/${data.slug}?created=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-800)]">
      <header className="p-4 flex items-center gap-2">
        <Link
          href="/"
          className="text-[var(--color-gray-400)] hover:text-white transition-colors"
        >
          ←
        </Link>
        <h1 className="text-lg font-bold text-white">문제지 만들기</h1>
      </header>

      <main className="px-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[var(--color-gray-400)] text-sm mb-2">
              퀴즈 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 태욱의 최애 음식 TOP10"
              className="w-full py-3 px-4 rounded-[var(--rounded-sm)] bg-[var(--color-gray-200)] border border-[var(--color-gray-300)] text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-400)]"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-[var(--color-gray-400)] text-sm mb-2">
              음식 10개 (1위 → 10위 순서로)
            </label>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-8 text-[var(--color-gray-500)] font-medium">
                    {i + 1}위
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(i, e.target.value)}
                    placeholder={`${i + 1}위 음식`}
                    className="flex-1 py-2.5 px-4 rounded-[var(--rounded-xs)] bg-[var(--color-gray-200)] border border-[var(--color-gray-300)] text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-400)]"
                    maxLength={50}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[var(--color-red-400)] text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-[var(--rounded-md)] bg-[var(--color-blue-400)] text-white font-bold text-lg disabled:opacity-60 hover:bg-[var(--color-blue-500)] transition-colors"
          >
            {loading ? "생성 중..." : "문제지 만들기"}
          </button>
        </form>
      </main>
    </div>
  );
}
