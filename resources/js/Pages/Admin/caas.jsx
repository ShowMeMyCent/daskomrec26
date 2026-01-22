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
    EyeIcon, 
    PlusIcon, 
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    ArrowsUpDownIcon,
    ChevronUpIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function Caas() {
    const backgroundRef = useRef(null);
    const fileInputRef = useRef(null);
    const ITEMS_PER_PAGE = 7;

    const stateOptions = ["Administration", "Coding and Writing Test", "Interview", "Grouping Task", "Teaching Test", "Rising"];

    // --- Intro & Animation States ---
    const [showImage, setShowImage] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inputLocked, setInputLocked] = useState(true);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- Data States ---
    const [caasList, setCaasList] = useState([
        { id: '10101230001', name: 'Jyothi Divyananda', email: 'jyothi@student.telkom.co.id', password: 'password123', major: 'Informatics', class: 'IF-45-01', state: 'Rising', status: 'Passed' },
        { id: '10101230002', name: 'Budi Santoso', email: 'budi@student.telkom.co.id', password: 'password123', major: 'Telecommunication', class: 'TT-45-02', state: 'Interview', status: 'Pending' },
    ]);

    // --- Search, Sort, Pagination, Jump States ---
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpPage, setJumpPage] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    // --- Modals ---
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
    const [currentFormData, setCurrentFormData] = useState(null);
    const [viewData, setViewData] = useState(null);

    // --- Logic: Jump to Page ---
    const handleJumpPage = (e) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(jumpPage);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                setCurrentPage(pageNum);
            }
            setJumpPage('');
        }
    };

    // --- Logic: Search & Sort ---
    const filteredAndSortedData = useMemo(() => {
        let items = [...caasList];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            items = items.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
        }
        if (sortConfig.key) {
            items.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [caasList, sortConfig, searchQuery]);

    const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedData.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, filteredAndSortedData]);

    // --- Excel Handlers ---
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(caasList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CaAs");
        XLSX.writeFile(workbook, "CaAs_List_Full.xlsx");
    };

    const handleImportClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            const newEntries = data.map(row => ({
                id: String(row.ID || row.NIM || Math.floor(Math.random() * 10000000)), 
                name: row.Name || 'Unknown', 
                email: row.Email || '', 
                password: row.Password || '123456', 
                major: row.Major || '-', 
                class: row.Class || '-', 
                state: 'Administration', 
                status: 'Pending'
            }));
            setCaasList(prev => [...prev, ...newEntries]);
        };
        reader.readAsBinaryString(file);
        e.target.value = null; 
    };

    // --- Actions ---
    const handleAdd = () => {
        setCurrentFormData({ id: '', name: '', email: '', password: '', major: '', class: '', state: 'Administration', status: 'Pending' });
        setIsFormOpen(true);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const existingIndex = caasList.findIndex(c => c.id === currentFormData.id);
        if (existingIndex >= 0) setCaasList(prev => prev.map(c => c.id === currentFormData.id ? currentFormData : c));
        else setCaasList(prev => [...prev, currentFormData]);
        setIsFormOpen(false);
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true, title: 'Delete Account', message: 'Delete this CaAs record permanently?', type: 'danger',
            onConfirm: () => { setCaasList(prev => prev.filter(c => c.id !== id)); setConfirmModal(prev => ({ ...prev, isOpen: false })); }
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowsUpDownIcon className="w-5 h-5 text-white/20" />;
        return sortConfig.direction === 'ascending' ? <ChevronUpIcon className="w-5 h-5 text-cyan-400" /> : <ChevronDownIcon className="w-5 h-5 text-cyan-400" />;
    };

    const getStatusColor = (status) => {
        if (status === 'Passed') return 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20';
        if (status === 'Failed') return 'text-rose-400 border-rose-500/30 bg-rose-900/20';
        return 'text-amber-400 border-amber-500/30 bg-amber-900/20';
    };

    // --- Navigation ---
    const goHome = () => { setIsExiting(true); setInputLocked(true); setTimeout(() => router.visit('/admin/home'), 1000); };
    const handleLogout = () => { setInputLocked(true); setTimeout(() => { setIsLoggingOut(true); setTimeout(() => router.visit('/'), 1000); }, 350); };

    useEffect(() => {
        const showTimer = setTimeout(() => setShowImage(true), 300);
        const tableTimer = setTimeout(() => { setIsTableVisible(true); setInputLocked(false); }, 800);
        return () => { clearTimeout(showTimer); clearTimeout(tableTimer); };
    }, []);

    const styles = `
        .cold-blue-filter { filter: brightness(0.9) contrast(1.1) saturate(1.1) hue-rotate(15deg) sepia(0.1); }
        .atlantean-panel { background: rgba(15, 28, 46, 0.75); backdrop-filter: blur(12px); border: 4px double rgba(6, 182, 212, 0.3); }
        .input-etched { background: rgba(0,0,0,0.2); border-bottom: 2px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s; }
        .input-etched:focus { outline: none; border-bottom-color: #22d3ee; }
        .table-row-hover:hover { background: rgba(6, 182, 212, 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.4); border-radius: 3px; }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-popIn { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    `;

    return (
        <>
            <Head title="CaAs Management" />
            <style>{styles}</style>
            <div className="relative w-full min-h-screen overflow-hidden text-gray-100 font-sans bg-[#050a10]">
                
                {/* --- LAYER 1: BACKGROUND --- */}
                <div className="absolute inset-0 z-0">
                    <img 
                        ref={backgroundRef} 
                        src={background} 
                        alt="bg" 
                        onLoad={() => setImageLoaded(true)}
                        className="w-full h-full object-cover cold-blue-filter" 
                        style={{ transform: `scale(${isExiting || isLoggingOut ? 1 : 1.1})`, filter: `blur(${showImage && imageLoaded ? 0 : 10}px)`, transition: 'transform 1s ease-in-out, filter 1s' }} 
                    />
                </div>

                {/* --- LAYER 2: UNDERWATER EFFECT (Behind Table) --- */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <UnderwaterEffect isLoaded={showImage && imageLoaded} isZooming={false} />
                </div>

                {/* --- LAYER 3: CONTENT --- */}
                <div className={`relative z-20 w-full h-screen flex items-center justify-center p-8 transition-all duration-1000 ${isTableVisible ? (isExiting || isLoggingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100') : 'opacity-0 translate-y-10'}`}>
                    
                    <div className="absolute top-6 left-6"><ButtonSidebar onClick={() => setIsSidebarOpen(true)} /></div>
                    <div className="absolute top-6 right-6"><ButtonHome onClick={goHome} /></div>
                    <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

                    <div className="w-full max-w-7xl h-[85vh] flex flex-col gap-6">
                        {/* HEADER */}
                        <div className="atlantean-panel p-8 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-visible rounded-t-2xl">
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                            <div className="flex-1"><h1 className="text-4xl font-serif font-bold text-cyan-100 tracking-widest uppercase drop-shadow-md">CaAs Management</h1><p className="text-white/60 text-base mt-1 tracking-wider">Manage candidates and accounts</p></div>
                            
                            <div className="relative group w-full xl:w-72">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-500/50 group-focus-within:text-cyan-400" />
                                <input type="text" placeholder="Search CaAs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-lg text-cyan-100 focus:outline-none focus:border-cyan-500/50" />
                            </div>
                            
                            <div className="flex gap-4">
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
                                <button onClick={handleImportClick} className="px-5 py-2.5 border border-blue-500/40 text-blue-200 rounded text-sm font-semibold uppercase tracking-widest hover:bg-blue-600/20 flex items-center gap-2"><ArrowUpTrayIcon className="w-5 h-5" /> Import</button>
                                <button onClick={handleExportExcel} className="px-5 py-2.5 border border-emerald-500/40 text-emerald-200 rounded text-sm font-semibold uppercase tracking-widest hover:bg-emerald-600/20 flex items-center gap-2"><ArrowDownTrayIcon className="w-5 h-5" /> Export</button>
                                <button onClick={handleAdd} className="px-6 py-2.5 bg-cyan-600/80 hover:bg-cyan-500 rounded text-sm font-bold uppercase tracking-widest shadow-lg flex items-center gap-2"><PlusIcon className="w-5 h-5" /> Add</button>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="atlantean-panel flex-1 overflow-hidden flex flex-col rounded-b-2xl">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#0f1c2e]/95 sticky top-0 z-10 border-b border-white/10 text-cyan-100/70 font-serif text-sm uppercase">
                                        <tr>
                                            <th className="p-6 w-24">No</th>
                                            <th className="p-6 cursor-pointer" onClick={() => requestSort('name')}><div className="flex items-center gap-2">Name {getSortIcon('name')}</div></th>
                                            <th className="p-6">Status</th>
                                            <th className="p-6">Stage</th>
                                            <th className="p-6 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-base font-sans">
                                        {paginatedData.map((item, index) => (
                                            <tr key={item.id} className="table-row-hover border-b border-white/5 transition-colors group">
                                                <td className="p-6 text-white/60 font-mono">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                                <td className="p-6"><div className="flex flex-col"><span className="text-white font-medium text-xl">{item.name}</span><span className="text-cyan-500/60 text-sm font-mono">{item.id}</span></div></td>
                                                <td className="p-6"><span className={`px-4 py-1.5 rounded border text-xs font-bold uppercase ${getStatusColor(item.status)}`}>{item.status}</span></td>
                                                <td className="p-6 text-sm text-cyan-100 font-semibold">{item.state}</td>
                                                <td className="p-6">
                                                    <div className="flex justify-center gap-4">
                                                        <button onClick={() => {setViewData(item); setIsViewOpen(true);}} className="p-2.5 border border-cyan-500/30 text-cyan-400 hover:text-white transition-all"><EyeIcon className="w-6 h-6" /></button>
                                                        <button onClick={() => {setCurrentFormData(item); setIsFormOpen(true);}} className="p-2.5 border border-amber-500/30 text-amber-400 hover:text-white transition-all"><PencilSquareIcon className="w-6 h-6" /></button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-2.5 border border-rose-500/30 text-rose-400 hover:text-white transition-all"><TrashIcon className="w-6 h-6" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* FOOTER WITH JUMP */}
                            <div className="p-5 border-t border-white/5 bg-[#0f1c2e]/80 backdrop-blur-md flex justify-between items-center">
                                <div className="flex items-center gap-6">
                                    <span className="text-base text-white/50 font-bold uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                                    <div className="flex items-center gap-3 border-l border-white/10 pl-6 group">
                                        <span className="text-[10px] text-cyan-500/50 uppercase font-bold tracking-widest">Jump to</span>
                                        <input type="text" value={jumpPage} onChange={(e) => setJumpPage(e.target.value)} onKeyDown={handleJumpPage} className="w-12 bg-black/40 border-b border-cyan-500/30 text-center text-cyan-100 text-sm focus:outline-none transition-all font-mono py-1" placeholder="0" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2.5 border border-white/10 hover:bg-cyan-500/20 disabled:opacity-20"><ChevronLeftIcon className="w-6 h-6" /></button>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2.5 border border-white/10 hover:bg-cyan-500/20 disabled:opacity-20"><ChevronRightIcon className="w-6 h-6" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MODALS --- */}
                
                {/* ADD/EDIT MODAL */}
                {isFormOpen && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsFormOpen(false)} />
                        <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 p-10 shadow-2xl animate-popIn">
                            <h2 className="text-3xl font-serif font-bold text-cyan-100 mb-8 border-b border-white/5 pb-4 uppercase">Update Account</h2>
                            <form onSubmit={handleSave} className="flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Name</label><input type="text" required className="input-etched w-full p-3 text-lg" value={currentFormData.name} onChange={e => setCurrentFormData({...currentFormData, name: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">ID (NIM)</label><input type="text" required className="input-etched w-full p-3 text-lg" value={currentFormData.id} onChange={e => setCurrentFormData({...currentFormData, id: e.target.value})} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Email</label><input type="email" required className="input-etched w-full p-3 text-lg font-sans" value={currentFormData.email} onChange={e => setCurrentFormData({...currentFormData, email: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Password</label><input type="text" required className="input-etched w-full p-3 text-lg font-mono" value={currentFormData.password} onChange={e => setCurrentFormData({...currentFormData, password: e.target.value})} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Major</label><input type="text" required className="input-etched w-full p-3 text-lg" value={currentFormData.major} onChange={e => setCurrentFormData({...currentFormData, major: e.target.value})} /></div>
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Class</label><input type="text" required className="input-etched w-full p-3 text-lg" value={currentFormData.class} onChange={e => setCurrentFormData({...currentFormData, class: e.target.value})} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Stage</label><select className="input-etched w-full p-3 text-lg" value={currentFormData.state} onChange={e => setCurrentFormData({...currentFormData, state: e.target.value})}>{stateOptions.map(opt => <option key={opt} value={opt} className="bg-black text-white">{opt}</option>)}</select></div>
                                    <div><label className="text-cyan-500/60 text-xs font-bold uppercase block mb-2">Status</label><select className="input-etched w-full p-3 text-lg" value={currentFormData.status} onChange={e => setCurrentFormData({...currentFormData, status: e.target.value})}><option value="Pending" className="bg-black text-white">Pending</option><option value="Passed" className="bg-black text-white">Passed</option><option value="Failed" className="bg-black text-white">Failed</option></select></div>
                                </div>
                                <div className="flex justify-end mt-6 gap-4"><button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 border border-white/10 text-white/40 uppercase font-bold text-sm">Cancel</button><button type="submit" className="px-10 py-3 bg-cyan-900/30 border border-cyan-500/50 text-cyan-100 font-bold uppercase tracking-widest text-sm">Save Record</button></div>
                            </form>
                        </div>
                    </div>, document.body
                )}

                {/* VIEW MODAL */}
                {isViewOpen && viewData && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsViewOpen(false)} />
                        <div className="relative w-full max-w-2xl bg-[#0a121d] border-2 border-double border-cyan-600/30 p-0 overflow-hidden animate-fadeIn flex flex-col shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-[#050a10]">
                                <h2 className="text-3xl font-serif font-bold text-cyan-100 mb-1 tracking-widest uppercase">CaAs Record</h2>
                                <p className="text-white/40 text-sm font-mono uppercase">ID: {viewData.id}</p>
                            </div>
                            <div className="p-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] flex flex-col gap-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div><span className="block text-cyan-500/50 text-xs font-bold uppercase mb-1">Full Name</span><span className="text-white text-2xl font-serif">{viewData.name}</span></div>
                                    <div><span className="block text-cyan-500/50 text-xs font-bold uppercase mb-1">Email</span><span className="text-white text-lg">{viewData.email}</span></div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div><span className="block text-cyan-500/50 text-xs font-bold uppercase mb-1">Major</span><span className="text-white text-lg">{viewData.major}</span></div>
                                    <div><span className="block text-cyan-500/50 text-xs font-bold uppercase mb-1">Class</span><span className="text-white font-mono text-lg">{viewData.class}</span></div>
                                </div>
                                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                    <div><span className="block text-cyan-500/50 text-xs font-bold uppercase mb-3">Recruitment Stage</span><span className="text-cyan-200 text-lg font-bold uppercase">{viewData.state}</span></div>
                                    <div><span className="block text-cyan-500/50 text-xs font-bold uppercase mb-3">Final Result</span><span className={`px-5 py-2 rounded border text-sm font-bold uppercase tracking-widest ${getStatusColor(viewData.status)}`}>{viewData.status}</span></div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/5 bg-[#050a10] flex justify-end"><button onClick={() => setIsViewOpen(false)} className="px-8 py-3 border border-white/10 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase">Close Manifest</button></div>
                        </div>
                    </div>, document.body
                )}

                {/* EXIT FADE */}
                <div className="fixed inset-0 z-[200] pointer-events-none transition-opacity duration-1000" style={{ background: '#050a10', opacity: isLoggingOut ? 1 : 0 }} />
            </div>
        </>
    );
}