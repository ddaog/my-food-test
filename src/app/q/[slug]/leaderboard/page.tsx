"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Row = { nickname: string; score: number };

export default function LeaderboardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/quizzes/${slug}/leaderboard`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setRows(data.rows || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-[var(--color-gray-800)]">
      <header className="p-4 flex items-center gap-2">
        <Link
          href={`/q/${slug}`}
          className="text-[var(--color-gray-400)] hover:text-white"
        >
          ←
        </Link>
        <h1 className="text-lg font-bold text-white">리더보드</h1>
      </header>

      <main className="px-6 pb-12">
        {loading ? (
          <p className="text-[var(--color-gray-400)]">로딩 중...</p>
        ) : error ? (
          <p className="text-[var(--color-red-400)]">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-[var(--color-gray-400)]">
            아직 도전한 사람이 없어요. 첫 번째가 되어보세요!
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.map((row, i) => (
              <li
                key={`${row.nickname}-${i}`}
                className="flex items-center justify-between py-4 px-4 rounded-[var(--rounded-sm)] bg-[var(--color-gray-700)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 text-center font-bold ${
                      i === 0
                        ? "text-[var(--color-yellow-400)]"
                        : i === 1
                          ? "text-[var(--color-gray-400)]"
                          : i === 2
                            ? "text-amber-600"
                            : "text-[var(--color-gray-500)]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-white font-medium">{row.nickname}</span>
                </div>
                <span className="text-[var(--color-yellow-400)] font-bold">
                  {row.score}점
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <Link
            href={`/q/${slug}`}
            className="block w-full py-4 rounded-[var(--rounded-md)] bg-[var(--color-blue-400)] text-white font-bold text-center hover:bg-[var(--color-blue-500)]"
          >
            나도 도전하기
          </Link>
        </div>
      </main>
    </div>
  );
}
