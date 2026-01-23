import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import UserSidebar from '@components/UserSidebar';
import UnderwaterEffect from '@components/UnderwaterEffect';
import ShiftTable from '@components/table';
import BlueModalWrapper from '@components/BlueBox';
import ShiftSuccessModal from '@components/ShiftInfo';

import utama from '@assets/backgrounds/utama.png';
import buttonImg from '@assets/buttons/ButtonRegular.png';

export default function ShiftPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null); 
    const [hasChosen, setHasChosen] = useState(false);

    const shifts = [
        { no: 1, shiftName: "Interview 90", date: "17/08/1945", time: "10.00–12.00", quota: 99, availability: 45 },
        { no: 2, shiftName: "Interview 91", date: "18/08/1945", time: "13.00–15.00", quota: 50, availability: 12 },
        { no: 3, shiftName: "Technical 01", date: "20/08/1945", time: "09.00–11.00", quota: 20, availability: 5 },
    ];

    const handleAddClick = (shift) => {
        if (hasChosen) return;
        setSelectedShift(shift); 
        setShowModal(true); 
    };

    const handleConfirmAdd = () => {
        setHasChosen(true);
        setShowModal(false);
        setTimeout(() => {
            setShowSuccess(true);
        }, 300);
    };

    return (
        <>
            <Head title="Choose Shift" />
            <div className="relative w-full h-screen overflow-hidden text-white font-caudex">
                
                {/* LAYER 1: Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={utama}
                        alt="Background Utama"
                        className="w-full h-full object-cover brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-slate-900/80" />
                </div>

                {/* LAYER 2: Underwater Effect */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                     <UnderwaterEffect />
                </div>

                {/* LAYER 3: Tombol Navigasi */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50 transition-all">
                    <ButtonSidebar onClick={() => setIsSidebarOpen(true)} />
                </div>

                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 transition-all">
                    <ButtonHome onClick={() => router.visit('/user/home')} />
                </div>

                {/* LAYER 4: Konten Utama */}
                <div className={`relative z-40 flex flex-col items-center justify-center h-full px-4 w-full transition-all duration-300 ${showModal || showSuccess ? 'blur-sm brightness-75' : ''}`}>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-8 font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wide text-center transition-all">
                        Choose Your Shift
                    </h1>

                    <div className="w-full max-w-[95%] md:max-w-6xl">
                         <ShiftTable 
                            shifts={shifts} 
                            onAddShift={handleAddClick} 
                        />
                    </div>
                </div>

                <BlueModalWrapper 
                    isOpen={showModal} 
                    onClose={() => setShowModal(false)}
                >
                    <div className="flex flex-col justify-center items-center text-center h-full w-full space-y-4 px-4">
                        <p className="font-caudex text-[10px] md:text-xs text-white tracking-[0.2em] uppercase drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold">
                            Let The Deep Uncover Your Purpose
                        </p>

                        <h2 className="font-caudex text-2xl md:text-4xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] leading-tight font-bold">
                            Are you sure you want <br /> to add this shift?
                        </h2>

                        <div className="flex gap-4 md:gap-6 mt-2 md:mt-4">                   
                            <button
                                onClick={() => setShowModal(false)}
                                className="relative flex items-center justify-center h-10 md:h-12 min-w-[120px] md:min-w-[150px] px-6 group active:scale-95 transition-transform"
                            >
                                <img
                                    src={buttonImg}
                                    alt="No bg"
                                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                                />
                                <span className="relative z-10 text-white text-lg md:text-xl tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                                    No
                                </span>
                            </button>

                            <button
                                onClick={handleConfirmAdd}
                                className="relative flex items-center justify-center h-10 md:h-12 min-w-[120px] md:min-w-[150px] px-6 group active:scale-95 transition-transform"
                            >
                                <img
                                    src={buttonImg}
                                    alt="Yes bg"
                                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                                />
                                <span className="relative z-10 text-white text-lg md:text-xl tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                                    Yes
                                </span>
                            </button>
                        </div>
                    </div>
                </BlueModalWrapper>

                <ShiftSuccessModal 
                    isOpen={showSuccess} 
                    onClose={() => setShowSuccess(false)}
                    shift={selectedShift}
                />

                {/* LAYER 5: Footer */}
                <div className="absolute bottom-4 md:bottom-6 w-full text-center z-40 text-white text-xs sm:text-sm md:text-base tracking-widest font-caudex px-4 opacity-80">
                    @Atlantis.DLOR2026. All Right Served
                </div>

                <UserSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={() => router.post('/logout')} 
                />

            </div>
        </>
    );
}