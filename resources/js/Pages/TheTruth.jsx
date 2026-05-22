import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

/* Background Assets */
import Background from '@assets/backgrounds/Main.webp';

/* Other Components */
import UnderwaterEffect from '@components/UnderwaterEffect';

// ── Atlantis ARG: "The Drowned Archive" ─────────────────────────────────────
//
// This page is an easter egg accessed only by clicking Mike Wazowski on the 404
// page. Shows the cipher text and a link to the archive.
// ─────────────────────────────────────────────────────────────────────────────

const CIPHER_DISPLAY = 'ΒΡΙΝG ΤΠΕ LΟΣΤ_ΑRCHIϜΣ ΤΟ ΘΗΕ ΕΧΡΟΣΥΡΕ ΩF ΘΗΕ SUη';
const ARCHIVE_LINK = 'https://drive.google.com/drive/folders/1hA8RvIlp1p6ltgCw8mVujjKmnFd3aexU?usp=sharing';

export default function TheTruth() {
    const [phase, setPhase] = useState(0);   // 0 = intro, 1 = reveal
    const [glitchText, setGlitchText] = useState('');

    // Intro glitch typing effect
    useEffect(() => {
        if (phase !== 0) return;

        const introText = '> ACCESSING DROWNED ARCHIVE ...\n> SIGNAL DETECTED FROM DEPTH 11,034m\n> DECRYPTION REQUIRED\n> STAND BY ...';
        let i = 0;
        const timer = setInterval(() => {
            setGlitchText(introText.slice(0, i));
            i++;
            if (i > introText.length) {
                clearInterval(timer);
                setTimeout(() => setPhase(1), 1200);
            }
        }, 30);

        return () => clearInterval(timer);
    }, [phase]);

    // Scanline + CRT styles
    const styles = `
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            92% { opacity: 1; }
            93% { opacity: 0.8; }
            94% { opacity: 1; }
            96% { opacity: 0.9; }
            97% { opacity: 1; }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .crt-flicker { animation: flicker 4s infinite; }
        .fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .scanline-overlay::after {
            content: '';
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 180, 0.03) 2px,
                rgba(0, 255, 180, 0.03) 4px
            );
            pointer-events: none;
            z-index: 40;
        }
        .scanline-bar {
            position: absolute;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(0, 255, 180, 0.08);
            animation: scanline 6s linear infinite;
            z-index: 41;
            pointer-events: none;
        }
        .terminal-cursor::after {
            content: '█';
            animation: cursorBlink 1s step-end infinite;
            color: #00ffb4;
        }
    `;

    return (
        <>
            <Head title="???" />
            <style>{styles}</style>

            <div className="relative w-full min-h-screen overflow-hidden bg-[#020a0f] text-[#00ffb4] font-mono">

                {/* Deep ocean background — very dim */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={Background}
                        alt=""
                        className="w-full h-full object-cover brightness-[0.15] saturate-50 hue-rotate-[160deg]"
                    />
                </div>
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

                {/* CRT effects */}
                <div className="absolute inset-0 z-30 scanline-overlay pointer-events-none" />
                <div className="scanline-bar" />

                {/* Subtle underwater effect */}
                <div className="absolute inset-0 z-10 opacity-20 pointer-events-none">
                    <UnderwaterEffect />
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 z-30 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)'
                    }}
                />

                {/* Content */}
                <div className="relative z-20 w-full min-h-screen flex items-center justify-center p-6 crt-flicker">
                    <div className="w-full max-w-2xl flex flex-col items-center gap-10">

                        {/* ── PHASE 0: INTRO GLITCH ── */}
                        {phase === 0 && (
                            <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                <span>{glitchText}</span>
                                <span className="terminal-cursor" />
                            </div>
                        )}

                        {/* ── PHASE 1: CIPHER TEXT + ARCHIVE LINK ── */}
                        {phase === 1 && (
                            <div className="space-y-10 fade-in-up flex flex-col items-center">

                                {/* Cipher text */}
                                <p
                                    className="text-lg sm:text-xl tracking-[0.15em] leading-relaxed text-center"
                                    style={{ textShadow: '0 0 8px rgba(0,255,180,0.4)' }}
                                >
                                    {CIPHER_DISPLAY}
                                </p>

                                {/* Google Drive link */}
                                <a
                                    href={ARCHIVE_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-[#00ffb4]/40 text-[#00ffb4] px-8 py-2.5 text-sm uppercase tracking-[0.2em]
                                               hover:bg-[#00ffb4]/10 hover:border-[#00ffb4]/60 transition-all duration-300"
                                >
                                    Access the Drowned Archive
                                </a>
                            </div>
                        )}

                    </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#00ffb4]/20 z-50" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#00ffb4]/20 z-50" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#00ffb4]/20 z-50" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#00ffb4]/20 z-50" />

                {/* Bottom identifier */}
                <div className="absolute bottom-4 w-full text-center z-50">
                    <p className="text-[8px] text-[#00ffb4]/15 tracking-[0.5em] uppercase font-mono">
                        DEPTH-11034 · SECTOR-7G · CLASSIFIED
                    </p>
                </div>
            </div>
        </>
    );
}
