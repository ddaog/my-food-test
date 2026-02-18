import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'My Food Test - 내 최애 음식 순위 테스트'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundImage: 'linear-gradient(to bottom right, #00C6FF, #0072FF)', // Vibrant blue gradient
                    position: 'relative',
                }}
            >
                {/* Background Emojis */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', fontSize: 100, opacity: 0.2 }}>🍕</div>
                <div style={{ position: 'absolute', top: '20%', right: '15%', fontSize: 120, opacity: 0.2 }}>🍔</div>
                <div style={{ position: 'absolute', bottom: '15%', left: '20%', fontSize: 90, opacity: 0.2 }}>🍣</div>
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', fontSize: 110, opacity: 0.2 }}>🍜</div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 40,
                        padding: '40px 80px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            color: 'white',
                            letterSpacing: '-0.02em',
                            textShadow: '0 10px 20px rgba(0,0,0,0.1)',
                            marginBottom: 20,
                        }}
                    >
                        My Food Test
                    </div>
                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: 'rgba(255, 255, 255, 0.9)',
                        }}
                    >
                        내 최애 음식 순위 맞추기 😋
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
