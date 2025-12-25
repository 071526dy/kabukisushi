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
    ChevronRight,
    HelpCircle,
    Menu,
    Plus,
    Users,
    FileText,
    X,
    Image as ImageIcon,
    Video,
    Trash2,
    Save
} from 'lucide-react';
import { LandingPage } from '../../pages/LandingPage';
import ImageAssetLibrary from '../components/editor/ImageAssetLibrary';
import ImageEditorModal from '../components/editor/ImageEditorModal';

export type BackgroundType = 'color' | 'image' | 'video';

export interface BackgroundConfig {
    type: BackgroundType;
    value: string;
    overlay?: number;
}

export default function EditorPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('sections');
    const [activeSection, setActiveSection] = useState<string | null>('home');
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);
    const [backgroundEditSection, setBackgroundEditSection] = useState<string | null>(null);
    const [activeBackgroundTab, setActiveBackgroundTab] = useState<BackgroundType>('image');
    const [showAssetLibrary, setShowAssetLibrary] = useState(false);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [editingImage, setEditingImage] = useState<string>('');

    // Background settings state
    const [backgroundSettings, setBackgroundSettings] = useState<Record<string, BackgroundConfig>>({
        home: { type: 'image', value: 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXshiUlyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3NjU5NjY2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
        about: { type: 'color', value: '#ffffff' },
        gallery: { type: 'color', value: '#E8EAEC' },
        access: { type: 'image', value: 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1080' },
        menu: { type: 'color', value: '#f5f5f5' },
        affiliated: { type: 'image', value: 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&auto=format&q=80' },
        footer: { type: 'color', value: '#1C1C1C' }
    });


    const menuItems = [
        { id: 'styles', icon: Palette, label: 'スタイル' },
        { id: 'store', icon: ShoppingBag, label: 'ストア' },
        { id: 'settings', icon: Settings, label: '設定' },
        { id: 'sections', icon: Layout, label: 'セクション' },
    ];

    const handleBackgroundEdit = (sectionId: string) => {
        setBackgroundEditSection(sectionId);
        const currentConfig = backgroundSettings[sectionId];
        if (currentConfig) {
            setActiveBackgroundTab(currentConfig.type);
        }
        setShowBackgroundPanel(true);
    };

    const updateBackground = (sectionId: string, config: Partial<BackgroundConfig>) => {
        setBackgroundSettings(prev => ({
            ...prev,
            [sectionId]: {
                ...(prev[sectionId] || { type: 'color', value: '#ffffff' }),
                ...config
            }
        }));
    };

    const handleImageSelect = (url: string) => {
        if (backgroundEditSection) {
            updateBackground(backgroundEditSection, { type: 'image', value: url });
        }
        setShowAssetLibrary(false);
    };

    const handleImageEdit = () => {
        if (backgroundEditSection) {
            const currentConfig = backgroundSettings[backgroundEditSection];
            if (currentConfig && currentConfig.type === 'image') {
                setEditingImage(currentConfig.value);
                setShowImageEditor(true);
            }
        }
    };

    const handleImageSave = (editedUrl: string) => {
        if (backgroundEditSection) {
            updateBackground(backgroundEditSection, { type: 'image', value: editedUrl });
        }
        setShowImageEditor(false);
    };


    const sections = [
        { id: 'home', label: 'HOME' },
        { id: 'about', label: 'ABOUT' },
        { id: 'gallery', label: 'GALLERY' },
        { id: 'access', label: 'ACCESS' },
        { id: 'menu', label: 'MENU' },
        { id: 'tanpin', label: 'TANPIN' },
        { id: 'nigiri', label: 'NIGIRI' },
        { id: 'makimono', label: 'MAKIMONO' },
        { id: 'ippin', label: 'IPPIN' },
        { id: 'ippin_text', label: 'IPPIN_補足テキスト' },
        { id: 'drink_sake', label: 'DRINK（日本酒）' },
        { id: 'drink', label: 'DRINK' },
        { id: 'affiliated', label: 'Affiliated Store' },
    ];

    return (
        <div className="flex h-screen bg-[#e0e0e0] overflow-hidden font-sans">
            {/* Unified Sidebar */}
            <div className="w-72 bg-[#2d2d2d] border-r border-black/20 flex flex-col z-20 shadow-2xl overflow-hidden h-screen flex-shrink-0 text-white">
                {/* Save Actions */}
                <div className="p-4 bg-[#252525] border-b border-black/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#88c057] font-medium flex items-center gap-1.5 font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#88c057] shadow-[0_0_5px_#88c057]" />
                                保存されました
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <button className="px-2 py-0.5 text-[10px] text-blue-400 hover:text-blue-300 transition-colors border border-blue-400/30 rounded hover:bg-blue-400/10">保存する</button>
                            <div className="w-px h-4 bg-gray-700 mx-1" />
                            <div className="flex gap-1">
                                <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                    <Undo size={14} />
                                </button>
                                <button className="p-1 text-gray-600 cursor-not-allowed">
                                    <Redo size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shortcut Buttons Grid */}
                <div className="p-2 grid grid-cols-2 gap-1 border-b border-black/10">
                    {[
                        { id: 'styles', icon: Palette, label: 'スタイル', color: 'text-[#deb55a]', badge: false },
                        { id: 'store', icon: ShoppingBag, label: 'ストアを追加', color: 'text-[#88c057]', badge: true },
                        { id: 'audience', icon: Users, label: 'オーディエンス', color: 'text-[#4db8e5]', badge: true },
                        { id: 'settings', icon: Settings, label: '設定', color: 'text-gray-400', badge: true },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <button key={item.id} className="flex items-center gap-2 p-3 rounded hover:bg-white/5 transition-colors relative text-left group">
                                <div className="relative">
                                    <Icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                                    {item.badge && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#2d2d2d]" />
                                    )}
                                </div>
                                <span className="text-[11px] text-gray-300 font-medium">{item.label}</span>
                                <ChevronRight size={10} className="ml-auto text-gray-600 group-hover:text-gray-400" />
                            </button>
                        );
                    })}
                </div>

                {/* Middle Menu Section */}
                <div className="flex-1 overflow-y-auto middle-menu scroll bg-[#2d2d2d] custom-scrollbar">
                    {/* Page Selector */}
                    <div className="p-3 border-b border-black/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ページ</span>
                            <button className="text-[10px] text-blue-400 hover:underline flex items-center gap-1">
                                <Settings size={10} />
                                管理
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded bg-[#363636] border border-white/5 shadow-inner">
                            <div className="flex items-center gap-2">
                                <FileText size={14} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-200">日本語TOP</span>
                            </div>
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-500" />
                        </div>
                    </div>

                    {/* Section List */}
                    <div className="p-3">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                            <span>セクション</span>
                            <Menu size={12} className="text-gray-600" />
                        </div>
                        <div className="space-y-0.5">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`group relative flex items-center p-2 rounded transition-all cursor-pointer ${activeSection === section.id
                                        ? 'bg-[#3d3d3d] ring-1 ring-white/10 shadow-lg'
                                        : 'hover:bg-white/5'
                                        }`}
                                >
                                    {/* Sort Handle (Mock) */}
                                    <div className="w-4 flex flex-col gap-0.5 opacity-20 group-hover:opacity-60 transition-opacity">
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-0.5 rounded-full bg-white" />
                                            <div className="w-0.5 h-0.5 rounded-full bg-white" />
                                        </div>
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-0.5 rounded-full bg-white" />
                                            <div className="w-0.5 h-0.5 rounded-full bg-white" />
                                        </div>
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-0.5 rounded-full bg-white" />
                                            <div className="w-0.5 h-0.5 rounded-full bg-white" />
                                        </div>
                                    </div>

                                    <span className={`text-xs ml-2 transition-colors ${activeSection === section.id ? 'text-white font-bold' : 'text-gray-400'}`}>
                                        {section.label}
                                    </span>

                                    {activeSection === section.id && (
                                        <div className="ml-auto flex items-center gap-2">
                                            <Settings size={12} className="text-gray-500 hover:text-white" />
                                            <X size={12} className="text-gray-500 hover:text-red-400" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add New Section Button */}
                    <div className="p-3">
                        <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:border-[#88c057] hover:text-[#88c057] transition-all hover:bg-[#88c057]/5 group">
                            <Plus size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold">セクションを追加</span>
                        </button>
                    </div>
                </div>

                {/* Footer / Support */}
                <div className="p-4 bg-[#252525] flex justify-between items-center text-gray-500">
                    <button className="text-[10px] hover:text-white">ヘルプセンター</button>
                    <HelpCircle size={14} className="hover:text-white cursor-pointer" />
                </div>
            </div>

            {/* Background Settings Side Panel (Overlay/Right) */}
            {showBackgroundPanel && (
                <div className="w-64 bg-[#2d2d2d] border-l border-black/20 flex flex-col z-30 shadow-2xl text-white absolute right-0 top-14 bottom-0 animate-in slide-in-from-right duration-300">
                    <div className="p-4 border-b border-black/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">背景</span>
                            <ImageIcon size={14} className="text-gray-400" />
                        </div>
                        <button
                            onClick={() => setShowBackgroundPanel(false)}
                            className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Background Tabs */}
                    <div className="flex border-b border-black/10 bg-[#252525]">
                        {[
                            { id: 'color', label: '色', type: 'color' as BackgroundType },
                            { id: 'image', label: '画像', type: 'image' as BackgroundType },
                            { id: 'video', label: '動画', type: 'video' as BackgroundType }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveBackgroundTab(tab.type)}
                                className={`flex-1 py-3 text-[11px] font-bold transition-colors ${activeBackgroundTab === tab.type ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeBackgroundTab === 'color' && (
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
                                    '#343a40', '#212529', '#fcebc5', '#deb55a',
                                    '#ffefef', '#ffe0e0', '#ffccd5', '#ffb3c1',
                                    '#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc'
                                ].map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => backgroundEditSection && updateBackground(backgroundEditSection, { type: 'color', value: color })}
                                        className={`aspect-square rounded shadow-inner border-2 ${backgroundEditSection && backgroundSettings[backgroundEditSection]?.value === color ? 'border-blue-500' : 'border-black/20'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        )}

                        {activeBackgroundTab === 'image' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
                                        'https://images.unsplash.com/photo-1651977560790-42e0c5cf2ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
                                        'https://images.unsplash.com/photo-1512132411229-c30391241dd8?ixlib=rb-1.2.1&q=85&fm=jpg&w=400&q=80',
                                        'https://images.unsplash.com/photo-1638866381709-071747b518c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
                                        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80'
                                    ].map((url, i) => (
                                        <div
                                            key={i}
                                            onClick={() => backgroundEditSection && updateBackground(backgroundEditSection, { type: 'image', value: url })}
                                            className={`aspect-video rounded bg-gray-800 border transition-all cursor-pointer hover:border-blue-400 ${backgroundEditSection && backgroundSettings[backgroundEditSection]?.value === url ? 'border-blue-500 ring-1 ring-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                        />
                                    ))}
                                    <button
                                        onClick={() => setShowAssetLibrary(true)}
                                        className="aspect-video rounded border border-dashed border-gray-700 flex flex-col items-center justify-center gap-1 hover:border-gray-500 bg-white/5 group"
                                    >
                                        <Plus size={14} className="text-gray-500 group-hover:text-gray-300" />
                                        <span className="text-[10px] text-gray-500">その他</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowAssetLibrary(true)}
                                    className="w-full py-2 bg-[#3d3d3d] hover:bg-[#4d4d4d] rounded text-[11px] font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    画像アップロード
                                </button>
                            </div>
                        )}

                        {activeBackgroundTab === 'video' && (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-black/20 rounded border border-dashed border-gray-700">
                                <Video size={24} className="text-gray-600 mb-2" />
                                <span className="text-xs text-gray-500 px-4">動画背景は今後のアップデートで追加されます</span>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-[#252525] border-t border-black/10 space-y-2">
                        <div className="pb-2 border-b border-black/10">
                            <button className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 group text-left">
                                <div className="flex items-center gap-2">
                                    <Monitor size={14} className="text-gray-400" />
                                    <span className="text-[11px] text-gray-200">拡大</span>
                                </div>
                                <ChevronRight size={12} className="text-gray-600" />
                            </button>
                        </div>
                        <button
                            onClick={handleImageEdit}
                            className="w-full py-2 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 hover:text-white transition-colors"
                        >
                            <ImageIcon size={14} />
                            画像を編集
                        </button>
                        <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-[11px] font-bold transition-colors flex items-center justify-center gap-2">
                            <Trash2 size={12} />
                            削除
                        </button>
                        <button
                            onClick={() => setShowBackgroundPanel(false)}
                            className="w-full py-2 bg-[#88c057] hover:bg-[#7ab04a] text-white rounded text-[11px] font-bold transition-colors shadow-lg"
                        >
                            保存
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#e0e0e0]">
                {/* Top Bar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-xs font-bold text-gray-900">KABUKI寿司 1番通り店</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300" />
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setDevice('desktop')}
                                className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white shadow-sm text-[#4db8e5]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Monitor size={16} />
                            </button>
                            <button
                                onClick={() => setDevice('mobile')}
                                className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white shadow-sm text-[#4db8e5]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Smartphone size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-gray-400 italic">最終保存: たった今</span>
                        <button className="px-5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded border border-gray-300 transition-colors bg-white">
                            プレビュー
                        </button>
                        <button className="px-6 py-1.5 text-xs font-bold text-white bg-[#88c057] hover:bg-[#7ab04a] rounded shadow-[0_2px_4px_rgba(136,192,87,0.3)] transition-all">
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
                                <LandingPage
                                    isEditing={true}
                                    onSectionSelect={(id) => setActiveSection(id)}
                                    onBackgroundEdit={handleBackgroundEdit}
                                    activeSection={activeSection || undefined}
                                    backgroundSettings={backgroundSettings}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Image Asset Library Modal */}
            <ImageAssetLibrary
                isOpen={showAssetLibrary}
                onClose={() => setShowAssetLibrary(false)}
                onSelect={handleImageSelect}
            />
            {/* Image Editor Modal */}
            <ImageEditorModal
                isOpen={showImageEditor}
                onClose={() => setShowImageEditor(false)}
                imageUrl={editingImage}
                onSave={handleImageSave}
            />
        </div>
    );
}
