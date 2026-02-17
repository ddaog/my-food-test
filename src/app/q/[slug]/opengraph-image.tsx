import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "내 최애 음식을 맞춰봐";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let title = "내 최애 음식을 맞춰봐";

  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${base}/api/quizzes/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      title = data.title || title;
    }
  } catch {
    // use default
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #181818 0%, #303030 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          🍜 {title}
        </div>
        <div style={{ fontSize: 24, color: "#9b9b9b" }}>
          친구들의 순위를 맞춰보세요!
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
