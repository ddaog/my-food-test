import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-800)] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          🍜 내 최애 음식을 맞춰봐
        </h1>
        <p className="text-[var(--color-gray-400)] mb-10">
          내가 좋아하는 음식 TOP10을 만들고, 친구들이 순위를 맞춰보세요!
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/create"
            className="w-full py-4 rounded-[var(--rounded-md)] bg-[var(--color-blue-400)] text-white font-bold text-lg text-center hover:bg-[var(--color-blue-500)] transition-colors"
          >
            문제지 만들기
          </Link>
          <p className="text-[var(--color-gray-500)] text-sm">
            친구에게 링크를 받았다면? 링크로 접속해서 도전해보세요!
          </p>
        </div>
      </div>
    </div>
  );
}
