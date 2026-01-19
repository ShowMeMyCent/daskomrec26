import React, { useRef, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';

import trial from '../../../../public/assets/backgrounds/trial.png';
import door2 from '../../../../public/assets/backgrounds/door2.png';
import scroll from '../../../../public/assets/backgrounds/scroll2.png';
import Sign04 from '../../../../public/assets/buttons/sign1.png';
import BlueInputBox from '../../Components/BlueInputBox';

export default function Login() {
    const trialRef = useRef(null);
    const rafRef = useRef(null);
    const scrollWrapperRef = useRef(null);


    const BASE_SCALE = 2.1;
    const BASE_OFFSET_X = 20;
    const BASE_OFFSET_Y = -260;

    const SCROLL_SCALE = 1.9;
    const SCROLL_OFFSET_Y = BASE_OFFSET_Y - 180;

    const handleMouseMove = (e) => {
        if (rafRef.current) return;

        rafRef.current = requestAnimationFrame(() => {
            if (!trialRef.current) return;

            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 50;
            const y = (e.clientY / innerHeight - 0.5) * 50;

            trialRef.current.style.transform = `
                translate(${x + BASE_OFFSET_X}px, ${y + BASE_OFFSET_Y}px)
                scale(${BASE_SCALE})
            `;

            rafRef.current = null;
        });
    };

    const handleMouseLeave = () => {
        if (!trialRef.current) return;

        trialRef.current.style.transform = `
            translate(${BASE_OFFSET_X}px, ${BASE_OFFSET_Y}px)
            scale(${BASE_SCALE})
        `;
    };

    const handleOutsideClick = (e) => {
        if (!scrollWrapperRef.current) return;

        if (!scrollWrapperRef.current.contains(e.target)) {
            router.visit('/');
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        post('/login'); // Laravel route
    };

    const styles = `
        @keyframes swimRight {
        from { transform: translateX(-50vw); }
        to { transform: translateX(120vw); }
        }
        @keyframes swimLeft {
        from { transform: translateX(120vw) scaleX(-1); }
        to { transform: translateX(-50vw) scaleX(-1); }
        }
        .fish-swim-right { animation: swimRight 35s linear infinite; }
        .fish-swim-left { animation: swimLeft 40s linear infinite; }
    `;

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    return (
        <>
            <Head title="Login" />

            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleOutsideClick}
                className="relative w-full min-h-screen overflow-hidden bg-black"
            >
                {/* Background */}
                <img
                    ref={trialRef}
                    src={trial}
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{
                        transform: `translate(${BASE_OFFSET_X}px, ${BASE_OFFSET_Y}px) scale(${BASE_SCALE})`,
                    }}
                />

                {/* Door */}
                <img
                    src={door2}
                    alt="door"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    style={{
                        transform: `translate(${BASE_OFFSET_X}px, ${BASE_OFFSET_Y}px) scale(${BASE_SCALE})`,
                    }}
                />

                {/* Blur Overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-black/10 z-20 pointer-events-none" />

                {/* Blue Tint */}
                <div className="absolute inset-0 bg-blue/10 z-20 pointer-events-none" />

                {/* Scroll Wrapper */}
                <div
                    ref={scrollWrapperRef}
                    className="absolute left-1/2 top-1/2 z-40 flex flex-col items-center"
                    style={{
                        transform: `translate(-50%, -50%)`,
                        maxHeight: '90vh',
                        width: '520px',
                        pointerEvents: 'auto',
                    }}
                >
                    {/* Scroll Image */}
                    <img
                        src={scroll}
                        alt="scroll"
                        className="w-auto max-h-full object-contain"
                        style={{
                            filter:
                                'brightness(1.08) contrast(1.05) saturate(0.2) hue-rotate(-18deg)',
                            transform:
                                `scale(${SCROLL_SCALE})`,
                            transformOrigin:
                                'center center',
                        }}
                    />

                    {/* Scroll Contents */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center px-4 text-[#0b3a66] gap-6"
                        style={{
                            maxHeight: '90vh',
                            width: '100%',
                        }}
                    >
                        {/* Title */}
                        <h1
                            className="font-serif font-extrabold tracking-wide drop-shadow text-6xl mb-4 text-center"
                            style={{ fontFamily: 'Cormorant Infant' }}
                        >
                            Insert The Key
                        </h1>

                        {/* Form */}
                        <form className="w-[70%] sm:w-[90%] max-w-105 flex flex-col gap-4">
                            {/* Username */}
                            <div className="flex flex-col gap-1">
                                <label
                                    className="font-serif text-3xl"
                                    style={{ fontFamily: 'Caudex' }}
                                >
                                    Username
                                </label>
                                <BlueInputBox
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1">
                                <label
                                    className="font-serif text-3xl"
                                    style={{ fontFamily: 'Caudex' }}
                                >
                                    Password
                                </label>
                                <BlueInputBox
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-6 relative self-center transition-transform duration-300 hover:scale-110 disabled:opacity-50"
                            >
                                <img
                                    src={Sign04}
                                    alt="Start"
                                    className="w-55 h-12.5 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                                />
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-['Cormorant_Infant'] text-3xl font-extrabold text-white tracking-[2px] pointer-events-none">
                                    Dive In
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
