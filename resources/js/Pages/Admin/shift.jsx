import { useRef, useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';

// Components
import UnderwaterEffect from '@components/UnderwaterEffect';
import background from '@assets/backgrounds/AssistantBackground.png';
import ButtonSidebar from '@components/ButtonSidebar';
import ButtonHome from '@components/ButtonHome';
import AdminSidebar from '@components/AdminSidebar';

// Icons
import { 
    PencilSquareIcon, 
    TrashIcon, 
    PlusIcon, 
    UserGroupIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    IdentificationIcon,
    ExclamationTriangleIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';

export default function Shift() {
    const backgroundRef = useRef(null);
    const ITEMS_PER_PAGE = 7;

    // --- Shifts Data ---
    const [shifts, setShifts] = useState([
        { 
            id: 1, 
            shift: 'Shift 1', 
            type: 'Onsite', 
            place: 'GKU 03', 
            date: '2026-11-01', 
            timeStart: '06:30', 
            timeEnd: '09:30', 
            quota: 20, 
            guardians: ['Jyothi Divyananda'], // String names
            caasBooked: [
                { id: '10101230001', name: 'Kevin Wijaya', major: 'Informatics' },
                { id: '10101230002', name: 'Sarah Connor', major: 'Electrical' }
            ] 
        },
    ]);

    // --- UI States ---
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPlotterOpen, setIsPlotterOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const [currentFormData, setCurrentFormData] = useState(null);
    const [activeShift, setActiveShift] = useState(null);
    
    // Custom Plotter Input State
    const [newPlotterName, setNewPlotterName] = useState('');

    // --- Animation States ---
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Jump Page Logic ---
    const handleJumpPage = (e) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(jumpPage);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
            setJumpPage('');
        }
    };

    const formatDisplayDate = (d) => d ? `${d.split('-')[2]}/${d.split('-')[1]}` : '-';

    // --- Pagination Logic ---
    const filteredShifts = useMemo(() => {
        return shifts.filter(s => s.shift.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [shifts, searchQuery]);

    const totalPages = Math.ceil(filteredShifts.length / ITEMS_PER_PAGE);
    const paginatedShifts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredShifts.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, filteredShifts]);

    // --- Plotter Logic (Typed Entry) ---
    const openShiftManager = (shift) => {
        setActiveShift(shift);
        setIsPlotterOpen(true);
    };

    const handleAddPlotter = (e) => {
        if (e) e.preventDefault();
        if (!newPlotterName.trim()) return;

        const updatedGuardians = [...activeShift.guardians, newPlotterName.trim()];
        
        setShifts(prev => prev.map(s => s.id === activeShift.id ? { ...s, guardians: updatedGuardians } : s));
        setActiveShift(prev => ({ ...prev, guardians: updatedGuardians }));
        setNewPlotterName('');
    };

    const handleRemovePlotter = (index) => {
        const updatedGuardians = activeShift.guardians.filter((_, i) => i !== index);
        setShifts(prev => prev.map(s => s.id === activeShift.id ? { ...s, guardians: updatedGuardians } : s));
        setActiveShift(prev => ({ ...prev, guardians: updatedGuardians }));
    };

    // --- CRUD ---
    const handleSaveShift = (e) => {
        e.preventDefault();
        if (currentFormData.id) setShifts(prev => prev.map(s => s.id === currentFormData.id ? currentFormData : s));
        else setShifts(prev => [...prev, { ...currentFormData, id: Date.now() }]);
        setIsFormOpen(false);
    };

    const goHome = () => { setIsExiting(true); setInputLocked(true); setTimeout(() => router.visit('/admin/home'), 1000); };
    const handleLogout = () => { setInputLocked(true); setTimeout(() => { setIsLoggingOut(true); setTimeout(() => router.visit('/'), 1000); }, 350); };

    useEffect(() => {
        const t1 = setTimeout(() => setShowImage(true), 300);
        const t2 = setTimeout(() => { setIsTableVisible(true); setInputLocked(false); }, 800);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const styles = `
        .cold-blue-filter { filter: brightness(0.9) contrast(1.1) saturate(1.1) hue-rotate(15deg) sepia(0.1); }
        .atlantean-panel { background: rgba(15, 28, 46, 0.75); backdrop-filter: blur(12px); border: 4px double rgba(6, 182, 212, 0.3); }
        .input-etched { background: rgba(0,0,0,0.2); border-bottom: 2px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s; padding: 12px; font-size: 1.125rem; }
        .input-etched:focus { outline: none; border-bottom-color: #22d3ee; background: rgba(0,0,0,0.4); }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.3); border-radius: 10px; }
    `;

    return (
        <>
            <Head title="Shift Management" />
            <style>{styles}</style>
            <div className="relative w-full min-h-screen overflow-hidden text-gray-100 font-sans bg-[#050a10]">
                
                {/* BG */}
                <div className="absolute inset-0 z-0">
                    <img ref={backgroundRef} src={background} alt="bg" className="w-full h-full object-cover cold-blue-filter" style={{ transform: `scale(${isExiting || isLoggingOut ? 1 : 1.1})`, filter: `blur(${showImage && imageLoaded ? 0 : 10}px)`, transition: 'transform 1s ease-in-out, filter 1s' }} />
                </div>
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <UnderwaterEffect isLoaded={showImage && imageLoaded} />
                </div>

                <div className={`relative z-20 w-full h-screen flex items-center justify-center p-8 transition-all duration-1000 ${isTableVisible ? (isExiting || isLoggingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100') : 'opacity-0 translate-y-10'}`}>
                    
                    <div className="absolute top-6 left-6"><ButtonSidebar onClick={() => setIsSidebarOpen(true)} /></div>
                    <div className="absolute top-6 right-6"><ButtonHome onClick={goHome} /></div>
                    <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                    <div className="w-full max-w-7xl h-[85vh] flex flex-col gap-6">
                        <div className="atlantean-panel p-8 flex flex-col xl:flex-row justify-between items-center gap-6 rounded-t-2xl">
                            <div className="flex-1">
                                <h1 className="text-4xl font-serif font-bold text-cyan-100 tracking-widest uppercase">Shift Management</h1>
                                <p className="text-white/60 text-lg mt-1">Assign plotters and monitor attendance</p>
                            </div>
                            <button onClick={() => { setCurrentFormData({ id: null, shift: '', type: 'Onsite', place: '', date: '', timeStart: '', timeEnd: '', quota: 0, guardians: [], caasBooked: [] }); setIsFormOpen(true); }} className="px-6 py-3 bg-cyan-600/80 hover:bg-cyan-500 rounded text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <PlusIcon className="w-5 h-5" /> New Shift
                            </button>
                        </div>

                        <div className="atlantean-panel flex-1 overflow-hidden flex flex-col rounded-b-2xl">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#0f1c2e]/95 sticky top-0 z-10 border-b border-white/10 text-cyan-100/70 font-serif text-sm uppercase">
                                        <tr>
                                            <th className="p-6">No</th>
                                            <th className="p-6">Name</th>
                                            <th className="p-6">Date & Time</th>
                                            <th className="p-6">CaAs Quota</th>
                                            <th className="p-6">Plotters</th>
                                            <th className="p-6 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-base font-sans">
                                        {paginatedShifts.map((item, index) => (
                                            <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-white/40 font-mono">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                                <td className="p-6 font-bold text-cyan-100 uppercase tracking-widest">{item.shift}</td>
                                                <td className="p-6 font-mono text-sm">{formatDisplayDate(item.date)} | {item.timeStart}-{item.timeEnd}</td>
                                                <td className="p-6 font-bold text-lg">{item.caasBooked.length} / {item.quota}</td>
                                                <td className="p-6 text-cyan-400 text-sm italic">{item.guardians.length} assigned</td>
                                                <td className="p-6">
                                                    <div className="flex justify-center gap-4">
                                                        <button onClick={() => openShiftManager(item)} className="p-2.5 border border-cyan-500/30 text-cyan-400 hover:text-white" title="Manage Plotters"><UserPlusIcon className="w-6 h-6" /></button>
                                                        <button onClick={() => { setCurrentFormData(item); setIsFormOpen(true); }} className="p-2.5 border border-amber-500/30 text-amber-400 hover:text-white"><PencilSquareIcon className="w-6 h-6" /></button>
                                                        <button onClick={() => setShifts(prev => prev.filter(s => s.id !== item.id))} className="p-2.5 border border-rose-500/30 text-rose-400 hover:text-white"><TrashIcon className="w-6 h-6" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Footer */}
                            <div className="p-5 border-t border-white/5 bg-[#0f1c2e]/80 flex justify-between items-center">
                                <div className="flex items-center gap-6">
                                    <span className="text-sm text-white/50 uppercase font-bold">Page {currentPage} of {totalPages}</span>
                                    <div className="flex items-center gap-2 border-l border-white/10 pl-6 font-mono">
                                        <span className="text-[10px] text-cyan-500/50 uppercase">Jump</span>
                                        <input type="text" value={jumpPage} onChange={(e) => setJumpPage(e.target.value)} onKeyDown={handleJumpPage} className="w-12 bg-black/40 border-b border-cyan-500/30 text-center py-1 outline-none" placeholder="0" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-2 border border-white/10 hover:bg-cyan-500/20"><ChevronLeftIcon className="w-6 h-6" /></button>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="p-2 border border-white/10 hover:bg-cyan-500/20"><ChevronRightIcon className="w-6 h-6" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MODAL: SHIFT HUB (MANAGE PLOTTERS & VIEW CAAS) --- */}
                {isPlotterOpen && activeShift && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsPlotterOpen(false)} />
                        <div className="relative w-full max-w-5xl bg-[#0a121d] border-2 border-double border-cyan-600/30 shadow-2xl animate-popIn flex flex-col h-[85vh] overflow-hidden">
                            <div className="p-8 border-b border-white/5 bg-[#050a10]">
                                <h2 className="text-3xl font-serif font-bold text-cyan-100 tracking-widest uppercase">{activeShift.shift} CONTROL</h2>
                            </div>
                            
                            <div className="flex-1 flex overflow-hidden">
                                {/* LEFT: PLOTTERS (Type & Add) */}
                                <div className="w-1/2 p-8 border-r border-white/5 flex flex-col gap-6 bg-black/10">
                                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2"><UserPlusIcon className="w-5 h-5"/> Assign Plotters</h3>
                                    
                                    {/* Manual Name Entry */}
                                    <form onSubmit={handleAddPlotter} className="flex gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="Type Name..." 
                                            value={newPlotterName} 
                                            onChange={(e) => setNewPlotterName(e.target.value)} 
                                            className="flex-1 input-etched !p-2 !text-base"
                                        />
                                        <button type="submit" className="px-6 bg-cyan-600 hover:bg-cyan-400 text-white font-bold uppercase text-xs rounded transition-all">Add</button>
                                    </form>

                                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-wrap content-start gap-3">
                                        {activeShift.guardians.map((name, idx) => (
                                            <div key={idx} className="flex items-center gap-3 px-4 py-2 bg-cyan-900/30 border border-cyan-500/30 rounded-full group">
                                                <span className="text-sm font-medium text-cyan-100">{name}</span>
                                                <button onClick={() => handleRemovePlotter(idx)} className="text-rose-500 hover:text-rose-300 transition-colors">
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                        {activeShift.guardians.length === 0 && <p className="text-white/20 italic text-sm mt-4">No plotters assigned. Type a name above.</p>}
                                    </div>
                                </div>

                                {/* RIGHT: CAAS VIEW (Read Only) */}
                                <div className="flex-1 p-8 flex flex-col gap-6">
                                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2"><IdentificationIcon className="w-5 h-5"/> Booked Candidates</h3>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                                        {activeShift.caasBooked.map(caas => (
                                            <div key={caas.id} className="p-4 bg-[#111c2b] border border-white/5 flex justify-between items-center group">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium text-lg">{caas.name}</span>
                                                    <span className="text-white/40 text-xs font-mono uppercase">{caas.id} // {caas.major}</span>
                                                </div>
                                                <UserGroupIcon className="w-6 h-6 text-white/10" />
                                            </div>
                                        ))}
                                        {activeShift.caasBooked.length === 0 && <p className="text-white/20 italic text-sm text-center mt-10">No candidates have claimed this shift.</p>}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-[#050a10] border-t border-white/5 flex justify-end">
                                <button onClick={() => setIsPlotterOpen(false)} className="px-10 py-3 bg-cyan-900/40 border border-cyan-500/50 text-cyan-100 uppercase font-bold text-xs tracking-widest hover:bg-cyan-600 transition-all">Close Control</button>
                            </div>
                        </div>
                    </div>, document.body
                )}

                {/* MODAL: FORM */}
                {isFormOpen && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
                        <div className="relative w-full max-w-xl bg-[#0a121d] border-2 border-double border-cyan-600/30 p-10 shadow-2xl animate-popIn">
                            <h2 className="text-3xl font-serif font-bold text-cyan-100 mb-8 border-b border-white/5 pb-4 uppercase">Update Shift</h2>
                            <form onSubmit={handleSaveShift} className="flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Shift Name</label><input type="text" required className="input-etched w-full" value={currentFormData.shift} onChange={e => setCurrentFormData({...currentFormData, shift: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Quota</label><input type="number" required className="input-etched w-full" value={currentFormData.quota} onChange={e => setCurrentFormData({...currentFormData, quota: e.target.value})} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Start Time</label><input type="time" required className="input-etched w-full font-mono" value={currentFormData.timeStart} onChange={e => setCurrentFormData({...currentFormData, timeStart: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">End Time</label><input type="time" required className="input-etched w-full font-mono" value={currentFormData.timeEnd} onChange={e => setCurrentFormData({...currentFormData, timeEnd: e.target.value})} /></div>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Location</label><input type="text" required className="input-etched w-full" value={currentFormData.place} onChange={e => setCurrentFormData({...currentFormData, place: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Date</label><input type="date" required className="input-etched w-full font-mono" value={currentFormData.date} onChange={e => setCurrentFormData({...currentFormData, date: e.target.value})} /></div>
                                </div>
                                <button type="submit" className="w-full mt-4 py-4 bg-cyan-900/30 border border-cyan-500/50 text-cyan-100 font-bold uppercase tracking-widest shadow-lg">Save Shift Data</button>
                            </form>
                        </div>
                    </div>, document.body
                )}

                <div className="fixed inset-0 z-[200] pointer-events-none transition-opacity duration-1000" style={{ background: '#050a10', opacity: isLoggingOut ? 1 : 0 }} />
            </div>
        </>
    );
}