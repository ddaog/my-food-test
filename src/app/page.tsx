import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--color-primary)] opacity-10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--color-success)] opacity-10 blur-[120px] rounded-full" />

      <div className="text-center max-w-md w-full z-10 space-y-8">
        <div className="space-y-3">
          {/* Marquee Container */}
          <div className="relative w-full max-w-lg mx-auto h-40 overflow-hidden mask-linear-fade mb-6">
            {/* Row 1: Left -> Right (Actually moving right means starting at -50% and going to 0) */}
            <div className="flex gap-4 absolute top-0 left-0 animate-scroll-right whitespace-nowrap w-max">
              {[...Array(2)].map((_, loop) => (
                <div key={loop} className="flex gap-4">
                  {["🍕", "🍔", "🍟", "🌭", "🍿", "🥓", "🥚", "🍳", "🧇", "🥞", "🍞", "🥐", "🥨", "🥖", "🧀", "🥗", "🥪", "🌮", "🌯", "🍖", "🍗", "🥩", "🍠", "🥟", "🥠", "🥡", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮"].map((emoji, i) => (
                    <div key={`${loop}-${i}`} className="text-4xl w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 shrink-0">
                      {emoji}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* Row 2: Right -> Left (Moving left means starting at 0 and going to -50%) */}
            <div className="flex gap-4 absolute top-16 left-0 animate-scroll-left whitespace-nowrap w-max">
              {[...Array(2)].map((_, loop) => (
                <div key={loop} className="flex gap-4">
                  {["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🥜", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯"].map((emoji, i) => (
                    <div key={`${loop}-${i}`} className="text-4xl w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 shrink-0">
                      {emoji}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            내 최애 음식<br />맞춰봐!
          </h1>
          <p className="text-[var(--text-secondary)] text-lg font-medium leading-relaxed">
            내가 좋아하는 음식 TOP 10을 나열하고,<br />친구들이 얼마나 나를 잘 아는지 확인해보세요!
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/create"
            className="w-full py-5 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-xl ios-button shadow-lg shadow-[var(--color-primary)]/20 text-center"
          >
            새 테스트 만들기
          </Link>
          <div className="p-6 rounded-3xl bg-[var(--secondary-bg)] border border-[var(--glass-border)] space-y-2">
            <p className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-widest">
              참여 방법
            </p>
            <p className="text-white/80 text-sm leading-relaxed">
              친구가 공유해준 링크로 접속하거나,<br />직접 테스트를 만들어 친구들에게 보내보세요.
            </p>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 text-[var(--text-tertiary)] text-xs font-medium">
        © 2026 my-food-test
      </footer>
    </div>
  );
}
