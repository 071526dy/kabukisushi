import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings,
    Layout,
    Type,
    Palette,
    ShoppingBag,
    ChevronLeft,
    Monitor,
    Smartphone,
    Undo,
    Redo,
    HelpCircle,
    Menu,
    Plus
} from 'lucide-react';
import { LandingPage } from '../../pages/LandingPage';

export function EditorPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('sections');
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

    const menuItems = [
        { id: 'styles', icon: Palette, label: 'スタイル' },
        { id: 'store', icon: ShoppingBag, label: 'ストア' },
        { id: 'settings', icon: Settings, label: '設定' },
        { id: 'sections', icon: Layout, label: 'セクション' },
    ];

    const sections = [
        { id: 'home', label: 'HOME' },
        { id: 'about', label: 'ABOUT' },
        { id: 'gallery', label: 'GALLERY' },
        { id: 'access', label: 'ACCESS' },
        { id: 'menu', label: 'MENU' },
        { id: 'drink', label: 'DRINK' },
        { id: 'affiliated', label: 'Affiliated Store' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Left Sidebar - Main Menu */}
            <div className="w-16 bg-[#2b2b2b] flex flex-col items-center py-4 z-20 flex-shrink-0">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col gap-6 w-full">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center gap-1 w-full py-2 transition-colors relative ${activeTab === item.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <Icon size={24} />
                                <span className="text-[10px]">{item.label}</span>
                                {activeTab === item.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#deb55a]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <HelpCircle size={24} />
                    </button>
                </div>
            </div>

            {/* Sub Sidebar - Section List (Visible when 'sections' is active) */}
            {activeTab === 'sections' && (
                <div className="w-64 bg-[#f5f5f5] border-r border-gray-200 flex flex-col z-10 flex-shrink-0 shadow-lg">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h2 className="font-bold text-gray-700">セクション</h2>
                        <button className="p-1 hover:bg-gray-100 rounded">
                            <Menu size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className="group flex items-center justify-between p-3 rounded bg-white border border-gray-200 hover:border-[#deb55a] cursor-pointer transition-all shadow-sm hover:shadow-md"
                            >
                                <span className="text-sm font-medium text-gray-700">{section.label}</span>
                                <button className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600">
                                    編集
                                </button>
                            </div>
                        ))}

                        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#deb55a] hover:text-[#deb55a] transition-colors flex items-center justify-center gap-2 mt-4">
                            <Plus size={16} />
                            <span className="text-sm font-bold">新しいセクションを追加</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-200">
                {/* Top Bar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setDevice('desktop')}
                                className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Monitor size={18} />
                            </button>
                            <button
                                onClick={() => setDevice('mobile')}
                                className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Smartphone size={18} />
                            </button>
                        </div>
                        <div className="h-6 w-px bg-gray-300" />
                        <div className="flex gap-2">
                            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                                <Undo size={18} />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                                <Redo size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">最終保存: たった今</span>
                        <button className="px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded border border-gray-300 transition-colors">
                            プレビュー
                        </button>
                        <button className="px-6 py-1.5 text-sm font-bold text-white bg-[#88c057] hover:bg-[#7ab04a] rounded shadow-sm transition-colors">
                            公開する
                        </button>
                    </div>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 overflow-hidden relative flex justify-center bg-[#e0e0e0] p-8">
                    <div
                        className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden ${device === 'mobile'
                                ? 'w-[375px] h-[667px] rounded-3xl border-8 border-gray-800'
                                : 'w-full h-full rounded-lg border border-gray-300'
                            }`}
                    >
                        {/* 
              LandingPage is rendered here. 
              We use a transform to scale it down if needed, or just let it scroll.
              For this demo, we'll just render it inside a scrolling container.
            */}
                        <div className="w-full h-full overflow-y-auto scrollbar-hide">
                            <div className={device === 'desktop' ? '' : 'pointer-events-none select-none'}>
                                <LandingPage />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
