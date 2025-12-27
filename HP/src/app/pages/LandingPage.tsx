import { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, Clock, Image as ImageIcon, Layout, Settings2, ChevronDown, ArrowUpToLine, ArrowDownToLine, AlignCenterVertical, RotateCcw } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { BackgroundConfig, LayoutConfig } from '../admin/pages/EditorPage';

interface LandingPageProps {
    isEditing?: boolean;
    onSectionSelect?: (id: string) => void;
    onBackgroundEdit?: (id: string) => void;
    activeSection?: string;
    backgroundSettings?: Record<string, BackgroundConfig>;
    layoutSettings?: Record<string, LayoutConfig>;
    onLayoutChange?: (sectionId: string, config: Partial<LayoutConfig>) => void;
}


const DEFAULT_BACKGROUND_SETTINGS: Record<string, BackgroundConfig> = {
    home: { type: 'image', value: '/assets/home_hero_new.jpg' },
    about: { type: 'color', value: '#ffffff', textTheme: 'dark' },
    gallery: { type: 'color', value: '#E8EAEC' },
    access: { type: 'image', value: 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1080' },
    menu: { type: 'color', value: '#f5f5f5' },
    affiliated: { type: 'image', value: '/assets/honten_hero.jpg' },
    footer: { type: 'color', value: '#1C1C1C' }
};

const DEFAULT_LAYOUT_SETTINGS: Record<string, LayoutConfig> = {
    home: { width: 'full', alignment: 'center', fullHeight: true, topSpace: false, bottomSpace: false },
    about: { width: 'normal', alignment: 'center', fullHeight: false, topSpace: true, bottomSpace: true },
    gallery: { width: 'wide', alignment: 'center', fullHeight: false, topSpace: true, bottomSpace: true },
    access: { width: 'normal', alignment: 'center', fullHeight: false, topSpace: true, bottomSpace: true },
    menu: { width: 'normal', alignment: 'center', fullHeight: false, topSpace: true, bottomSpace: true },
    affiliated: { width: 'full', alignment: 'center', fullHeight: false, topSpace: true, bottomSpace: true },
    footer: { width: 'wide', alignment: 'center', fullHeight: false, topSpace: true, bottomSpace: true }
};


export function LandingPage({ isEditing = false, onSectionSelect, onBackgroundEdit, activeSection, backgroundSettings: propBackgroundSettings, layoutSettings: propLayoutSettings, onLayoutChange }: LandingPageProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Local state for settings when running in public mode (not editing)
    const [localBackgroundSettings, setLocalBackgroundSettings] = useState<Record<string, BackgroundConfig> | undefined>(undefined);
    const [localLayoutSettings, setLocalLayoutSettings] = useState<Record<string, LayoutConfig> | undefined>(undefined);

    // Use props if available (editing mode), otherwise use local state (public mode)
    // Merge with defaults to ensure new defaults (like images) are used if not explicitly overridden in local state
    const backgroundSettings = propBackgroundSettings || (localBackgroundSettings ? { ...DEFAULT_BACKGROUND_SETTINGS, ...localBackgroundSettings } : DEFAULT_BACKGROUND_SETTINGS);
    const layoutSettings = propLayoutSettings || (localLayoutSettings ? { ...DEFAULT_LAYOUT_SETTINGS, ...localLayoutSettings } : DEFAULT_LAYOUT_SETTINGS);

    // Load settings from localStorage if on public page
    useEffect(() => {
        if (!isEditing) {
            const savedBackgrounds = localStorage.getItem('site_background_settings');
            const savedLayouts = localStorage.getItem('site_layout_settings');

            if (savedBackgrounds) {
                try {
                    const parsed = JSON.parse(savedBackgrounds);
                    // Migration: Remove old Unsplash default URLs so they fall back to the new hardcoded defaults
                    const oldUnsplashUrl = 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&auto=format&q=80';
                    if (parsed.affiliated && parsed.affiliated.value === oldUnsplashUrl) {
                        delete parsed.affiliated;
                    }
                    if (parsed.home && (parsed.home.value === '/assets/home_hero.jpg' || parsed.home.value === 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80')) {
                        delete parsed.home;
                    }
                    setLocalBackgroundSettings(parsed);
                } catch (e) {
                    console.error('Failed to parse saved background settings', e);
                }
            }

            if (savedLayouts) {
                try {
                    setLocalLayoutSettings(JSON.parse(savedLayouts));
                } catch (e) {
                    console.error('Failed to parse saved layout settings', e);
                }
            }
        }
    }, [isEditing]);



    const renderBackgroundContent = (sectionId: string) => {
        const config = backgroundSettings?.[sectionId];
        if (!config) return null;

        return (
            <>
                {/* Video Background */}
                {config.type === 'video' && (
                    <div className="absolute inset-0 overflow-hidden z-0">
                        {/* Check if it's a YouTube embed or direct file (simplified check) */}
                        {isYouTubeUrl(config.value) ? (
                            <iframe
                                src={getYouTubeEmbedUrl(config.value)}
                                className="w-full h-full object-cover pointer-events-none"
                                allow="autoplay; encrypted-media; loop"
                                title="Background Video"
                            />
                        ) : (
                            // Assume direct selection from stock or file
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${config.value}')` }}
                            >
                                {/* Stock video mock: actually rendering image as video placeholder for now per EditorPage implementation details where we mapped stock video to images */}
                            </div>
                        )}
                    </div>
                )}

                {/* Overlay */}
                {(config.overlayOpacity !== undefined && config.overlayOpacity > 0) && (
                    <div
                        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
                        style={{ backgroundColor: 'black', opacity: config.overlayOpacity / 100 }}
                    />
                )}
            </>
        );
    };

    const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');
    const getYouTubeEmbedUrl = (url: string) => {
        // Simple mock converter
        return url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&controls=0&loop=1';
    };


    const getBackgroundStyle = (sectionId: string) => {
        const config = backgroundSettings?.[sectionId];
        if (!config) return {};

        if (config.type === 'color') {
            return { backgroundColor: config.value, backgroundImage: 'none', color: config.textTheme === 'dark' ? '#000000' : '#ffffff' };
        } else if (config.type === 'image') {
            const style: any = {
                backgroundImage: `url('${config.value}')`,
                backgroundColor: 'transparent',
                color: config.textTheme === 'dark' ? '#000000' : '#ffffff'
            };
            if (config.backgroundMode === 'contain') style.backgroundSize = 'contain';
            else if (config.backgroundMode === 'tile') style.backgroundRepeat = 'repeat';
            else if (config.backgroundMode === 'center') {
                style.backgroundPosition = 'center';
                style.backgroundRepeat = 'no-repeat';
            } else {
                style.backgroundSize = 'cover';
                style.backgroundPosition = 'center';
            }
            return style;
        } else if (config.type === 'video') {
            return { backgroundColor: 'transparent', color: config.textTheme === 'dark' ? '#000000' : '#ffffff' };
        }
        return {};
    };

    const getLayoutStyle = (sectionId: string) => {
        const config = layoutSettings?.[sectionId];
        if (!config) return {};

        let classes = '';
        /* Height */
        if (config.fullHeight) classes += ' min-h-screen';

        /* Padding */
        if (config.topSpace) classes += ' pt-20';
        else classes += ' pt-0';

        if (config.bottomSpace) classes += ' pb-20';
        else classes += ' pb-0';

        /* Alignment (Vertical) */
        if (config.alignment === 'top') classes += ' justify-start';
        else if (config.alignment === 'bottom') classes += ' justify-end';
        else classes += ' justify-center'; // center default

        return classes + ' w-full';
    };

    const getContainerWidthClass = (sectionId: string) => {
        const config = layoutSettings?.[sectionId];
        const width = config?.width || 'normal';

        switch (width) {
            case 'auto': return 'container mx-auto px-4';
            case 'full': return 'w-full px-4';
            case 'wide': return 'max-w-7xl w-full px-4';
            case 'small': return 'max-w-2xl w-full px-4';
            case 'normal':
            default: return 'max-w-4xl w-full px-4';
        }
    };


    const SectionToolbar = ({ sectionId }: { sectionId: string }) => {
        const [showLayout, setShowLayout] = useState(false);
        const config = layoutSettings?.[sectionId] || { width: 'normal', alignment: 'center', fullHeight: false, topSpace: true, bottomSpace: true };

        return (
            <div
                className="absolute top-4 right-4 z-20 flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Layout Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowLayout(!showLayout)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-white rounded cursor-pointer transition-all border group shadow-md ${showLayout ? 'bg-[#2d2d2d] border-[#2d2d2d]' : 'bg-black/70 hover:bg-black/90 border-white/10'}`}
                    >
                        <span className="text-[10px] font-bold">レイアウト</span>
                        <Layout size={12} className={showLayout ? 'text-white' : 'text-gray-300 group-hover:text-white'} />
                    </button>

                    {/* Layout Control Panel (Popover) */}
                    {showLayout && (
                        <div className="absolute top-9 right-0 w-64 bg-[#2d2d2d] rounded shadow-xl text-white border border-black/20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            {/* Header */}
                            <div className="flex items-center justify-between px-3 py-2 bg-[#363636] border-b border-black/10">
                                <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                                    <Layout size={12} />
                                    レイアウト
                                </span>
                                <Settings2 size={12} className="text-gray-500 hover:text-gray-300 cursor-pointer" />
                            </div>

                            <div className="p-3 space-y-4">
                                {/* Width Control */}
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 font-bold">セクション幅</label>
                                    <div className="relative">
                                        <select
                                            value={config.width}
                                            onChange={(e) => onLayoutChange?.(sectionId, { width: e.target.value as any })}
                                            className="w-full bg-[#1c1c1c] text-[11px] text-white border border-gray-700 rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="auto">自動 （デフォルト）</option>
                                            <option value="full">全体</option>
                                            <option value="wide">幅さ</option>
                                            <option value="normal">普通</option>
                                            <option value="small">狭い</option>
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Content Alignment */}
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 font-bold">コンテンツの配置</label>
                                    <div className="flex bg-[#1c1c1c] rounded p-0.5 border border-gray-700">
                                        <button
                                            onClick={() => onLayoutChange?.(sectionId, { alignment: 'top' })}
                                            className={`flex-1 flex items-center justify-center py-1 rounded-sm transition-colors ${config.alignment === 'top' ? 'bg-[#3d3d3d] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                            title="上揃え"
                                        >
                                            <ArrowUpToLine size={14} />
                                        </button>
                                        <button
                                            onClick={() => onLayoutChange?.(sectionId, { alignment: 'center' })}
                                            className={`flex-1 flex items-center justify-center py-1 rounded-sm transition-colors ${config.alignment === 'center' ? 'bg-[#3d3d3d] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                            title="中央揃え"
                                        >
                                            <AlignCenterVertical size={14} />
                                        </button>
                                        <button
                                            onClick={() => onLayoutChange?.(sectionId, { alignment: 'bottom' })}
                                            className={`flex-1 flex items-center justify-center py-1 rounded-sm transition-colors ${config.alignment === 'bottom' ? 'bg-[#3d3d3d] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                            title="下揃え"
                                        >
                                            <ArrowDownToLine size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-gray-300">フルハイト</span>
                                        <button
                                            onClick={() => onLayoutChange?.(sectionId, { fullHeight: !config.fullHeight })}
                                            className={`w-8 h-4 rounded-full relative transition-colors ${config.fullHeight ? 'bg-[#88c057]' : 'bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${config.fullHeight ? 'left-4.5 translate-x-3.5' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-gray-300">上のスペース</span>
                                        <button
                                            onClick={() => onLayoutChange?.(sectionId, { topSpace: !config.topSpace })}
                                            className={`w-8 h-4 rounded-full relative transition-colors ${config.topSpace ? 'bg-[#88c057]' : 'bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${config.topSpace ? 'left-4.5 translate-x-3.5' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-gray-300">下のスペース</span>
                                        <button
                                            onClick={() => onLayoutChange?.(sectionId, { bottomSpace: !config.bottomSpace })}
                                            className={`w-8 h-4 rounded-full relative transition-colors ${config.bottomSpace ? 'bg-[#88c057]' : 'bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${config.bottomSpace ? 'left-4.5 translate-x-3.5' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onLayoutChange?.(sectionId, { width: 'normal', alignment: 'center', fullHeight: false, topSpace: true, bottomSpace: true })}
                                    className="w-full flex items-center justify-center gap-2 py-1.5 mt-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 rounded text-[10px] transition-colors"
                                >
                                    <RotateCcw size={10} />
                                    リセット
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Background Button */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onSectionSelect?.(sectionId);
                        onBackgroundEdit?.(sectionId);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded cursor-pointer transition-all border border-white/10 group shadow-md"
                >
                    <span className="text-[10px] font-bold">背景</span>
                    <div className="flex items-center justify-center">
                        <ImageIcon size={12} className="text-gray-300 group-hover:text-white" />
                    </div>
                </div>
            </div>
        );
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1C1C1C]">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-[#1C1C1C]/95 backdrop-blur-sm z-50 border-b border-[#deb55a]/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <button
                            onClick={() => !isEditing && scrollToSection('home')}
                            style={{ fontFamily: "'Bad Script', cursive" }}
                            className={`text-2xl text-[#fcebc5] transition-colors ${!isEditing ? 'hover:text-[#deb55a]' : ''}`}
                        >
                            KABUKI寿司 1番通り店
                        </button>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8">
                            <button onClick={() => isEditing ? onSectionSelect?.('about') : scrollToSection('about')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-[#e8eaec] hover:text-[#deb55a] transition-colors">ABOUT</button>
                            <button onClick={() => isEditing ? onSectionSelect?.('gallery') : scrollToSection('gallery')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-[#e8eaec] hover:text-[#deb55a] transition-colors">GALLERY</button>
                            <button onClick={() => isEditing ? onSectionSelect?.('menu') : scrollToSection('menu')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-[#e8eaec] hover:text-[#deb55a] transition-colors">MENU</button>
                            <button onClick={() => isEditing ? onSectionSelect?.('access') : scrollToSection('access')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-[#e8eaec] hover:text-[#deb55a] transition-colors">ACCESS</button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-[#e8eaec]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-[#1C1C1C] border-t border-[#deb55a]/20">
                        <div className="px-4 py-4 space-y-3">
                            <button onClick={() => isEditing ? onSectionSelect?.('about') : scrollToSection('about')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="block w-full text-left text-[#e8eaec] hover:text-[#deb55a] transition-colors py-2">ABOUT</button>
                            <button onClick={() => isEditing ? onSectionSelect?.('gallery') : scrollToSection('gallery')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="block w-full text-left text-[#e8eaec] hover:text-[#deb55a] transition-colors py-2">GALLERY</button>
                            <button onClick={() => isEditing ? onSectionSelect?.('menu') : scrollToSection('menu')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="block w-full text-left text-[#e8eaec] hover:text-[#deb55a] transition-colors py-2">MENU</button>
                            <button onClick={() => isEditing ? onSectionSelect?.('access') : scrollToSection('access')} style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="block w-full text-left text-[#e8eaec] hover:text-[#deb55a] transition-colors py-2">ACCESS</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section
                id="home"
                onClick={() => isEditing && onSectionSelect?.('home')}
                className={`flex flex-col relative transition-all duration-300 bg-cover bg-center ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-[#deb55a]/50' : ''} ${activeSection === 'home' ? 'ring-4 ring-[#deb55a]' : ''} ${getLayoutStyle('home')}`}
                style={getBackgroundStyle('home')}
            >
                {renderBackgroundContent('home')}
                {isEditing && <SectionToolbar sectionId="home" />}

                {/* Original hardcoded overlay - conditionally render if no config overlay is active to preserve default look until edited */}
                {(!backgroundSettings?.['home']?.overlayOpacity) && <div className="absolute inset-0 bg-black/60"></div>}
                <div className={`relative z-10 text-center mx-auto ${getContainerWidthClass('home')}`}>
                    <div className="mb-8">
                        <div className="w-48 h-32 mx-auto mb-4 bg-[#deb55a]/10 rounded flex items-center justify-center">
                            <span style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-[#fcebc5]">KABUKI</span>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <a
                            href="https://grizzle-giraffe-1fgdjb.mystrikingly.com/traveler"
                            style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
                            className="inline-block px-6 py-2 text-sm text-[#e8eaec] hover:text-[#deb55a] transition-colors border border-[#e8eaec]/30 rounded hover:border-[#deb55a]"
                        >
                            Languages: English · 中文 · 한국어
                        </a>
                        <div>
                            <button
                                onClick={() => scrollToSection('menu')}
                                style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
                                className="px-12 py-4 bg-[#deb55a] text-[#1C1C1C] rounded-lg hover:bg-[#fcebc5] transition-colors font-bold text-lg"
                            >
                                メニュー
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://www.tablecheck.com/shops/kabukisushi-ichiban/reserve"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
                                className="px-8 py-3 text-[#886107] hover:text-[#1C1C1C] bg-white/90 hover:bg-white rounded transition-colors font-semibold"
                            >
                                予約はこちら
                            </a>
                            <a
                                href="https://maps.app.goo.gl/yC8c23nWvXpjYmoXA"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
                                className="px-8 py-3 text-[#e8eaec] hover:text-[#deb55a] border-2 border-[#e8eaec] hover:border-[#deb55a] rounded transition-colors font-semibold"
                            >
                                Google Maps
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <a href="https://www.instagram.com/kabukizushi_ichiban?igsh=MWRzdmxuNzF1ODlzNA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="px-6 py-2 text-[#e8eaec] hover:text-[#deb55a] border border-[#e8eaec]/30 rounded hover:border-[#deb55a] transition-colors">Instagram</a>
                            <a href="https://www.tiktok.com/@kabukisushi1001?_t=8kzjmGapCuP&_r=1" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="px-6 py-2 text-[#e8eaec] hover:text-[#deb55a] border border-[#e8eaec]/30 rounded hover:border-[#deb55a] transition-colors">Tik Tok</a>
                            <a href="https://www.youtube.com/@KABUKI-ev3sy" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="px-6 py-2 text-[#e8eaec] hover:text-[#deb55a] border border-[#e8eaec]/30 rounded hover:border-[#deb55a] transition-colors">YouTube</a>
                            <a href="https://www.facebook.com/profile.php?id=100064940143541" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="px-6 py-2 text-[#e8eaec] hover:text-[#deb55a] border border-[#e8eaec]/30 rounded hover:border-[#deb55a] transition-colors">Facebook</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section
                id="about"
                onClick={() => isEditing && onSectionSelect?.('about')}
                className={`flex flex-col relative transition-all duration-300 ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-[#deb55a]/50' : ''} ${activeSection === 'about' ? 'ring-4 ring-[#deb55a]' : ''} ${getLayoutStyle('about')}`}
                style={getBackgroundStyle('about')}
            >
                {renderBackgroundContent('about')}
                {isEditing && <SectionToolbar sectionId="about" />}
                <div className={`mx-auto ${getContainerWidthClass('about')}`}>
                    <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-center mb-4">ABOUT US</h2>
                    <div className="flex flex-col items-center gap-12 mt-12">
                        <div className="w-full max-w-4xl">
                            <ImageWithFallback
                                src="/assets/about_content_new.jpg"
                                alt="KABUKI寿司 1番通り店"
                                className="rounded-lg shadow-xl w-full h-auto"
                            />
                        </div>
                        <div className="space-y-4 text-center max-w-3xl mx-auto" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>
                            <p className="text-lg">KABUKI寿司の2号店となる <strong>「KABUKI寿司 1番通り店」</strong> をオープンいたしました。</p>
                            <p>1番通り店では、これまでの伝統を受け継ぎながらも、さらなる進化を目指しています。</p>
                            <p>店主を務めるのは、<strong>新進気鋭の若手寿司職人増田</strong>。</p>
                            <p>繊細な技術と斬新なアイデアで、新しい「KABUKI寿司」の世界を皆さまにお届けいたします。</p>
                            <p>お店の特徴の一つは、<strong>カウンター付きの個室</strong>です。職人の技を間近で堪能しながら、ゆったりとしたプライベート空間でお食事をお楽しみいただけます。特別な日のお祝いから接待まで、幅広いシーンでご利用いただけます。</p>
                            <p>伝統と革新が融合したKABUKI寿司 1番通り店で、特別なひとときをお過ごしください。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section
                id="gallery"
                onClick={() => isEditing && onSectionSelect?.('gallery')}
                className={`flex flex-col relative transition-all duration-300 ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-[#deb55a]/50' : ''} ${activeSection === 'gallery' ? 'ring-4 ring-[#deb55a]' : ''} ${getLayoutStyle('gallery')}`}
                style={getBackgroundStyle('gallery')}
            >
                {renderBackgroundContent('gallery')}
                {isEditing && <SectionToolbar sectionId="gallery" />}
                <div className={`mx-auto ${getContainerWidthClass('gallery')}`}>
                    <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-center mb-4 text-[#1C1C1C]">Gallery</h2>
                    <p className="text-center text-gray-600 mb-12">Photos from our restaurant.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            '/assets/gallery_2.jpg',
                            '/assets/gallery_4.jpg',
                            '/assets/gallery_3.jpg',
                            '/assets/gallery_5.jpg',
                            '/assets/gallery_1.jpg',
                            '/assets/gallery_6.jpg',
                            '/assets/gallery_7.jpg',
                            '/assets/gallery_8.jpg',
                            '/assets/gallery_9.jpg',
                            '/assets/gallery_10.jpg',
                            '/assets/gallery_11.jpg',
                        ].map((src, i) => (
                            <div key={i} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                <ImageWithFallback
                                    src={src}
                                    alt={`Gallery ${i + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Access Section */}
            <section
                id="access"
                onClick={() => isEditing && onSectionSelect?.('access')}
                className={`py-20 bg-cover bg-center relative transition-all duration-300 ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-[#deb55a]/50' : ''} ${activeSection === 'access' ? 'ring-4 ring-[#deb55a]' : ''}`}
                style={getBackgroundStyle('access')}
            >
                {renderBackgroundContent('access')}
                {isEditing && <SectionToolbar sectionId="access" />}
                {(!backgroundSettings?.['access']?.overlayOpacity) && <div className="absolute inset-0 bg-white/90"></div>}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-center mb-12 text-[#1C1C1C]">ACCESS</h2>
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-6 h-6 text-[#deb55a] flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-lg">〒160-0021</p>
                                    <p className="text-gray-700">東京都新宿区歌舞伎町2丁目45−16</p>
                                    <p className="text-gray-700">GEST34ビル4F</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-6 h-6 text-[#deb55a]" />
                                <p className="text-lg">03-6302-1477</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="w-6 h-6 text-[#deb55a]" />
                                <p className="text-lg">OPEN : 18:00-24:00</p>
                            </div>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-xl">
                            <ImageWithFallback
                                src="/assets/access_map.jpg"
                                alt="Map"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Section */}
            <section
                id="menu"
                onClick={() => isEditing && onSectionSelect?.('menu')}
                className={`flex flex-col relative transition-all duration-300 ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-[#deb55a]/50' : ''} ${activeSection === 'menu' ? 'ring-4 ring-[#deb55a]' : ''} ${getLayoutStyle('menu')}`}
                style={getBackgroundStyle('menu')}
            >
                {renderBackgroundContent('menu')}
                {isEditing && <SectionToolbar sectionId="menu" />}
                <div className={`mx-auto ${getContainerWidthClass('menu')}`}>
                    <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-5xl text-center mb-4 text-[#1C1C1C]">Menu</h2>
                    <p className="text-center text-xl mb-12" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>Course</p>
                    <p className="text-center text-gray-600 mb-12">まずは当店お勧めのコースからお選びください</p>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#1C1C1C]">おまかせにぎり８貫</h3>
                            <p className="text-3xl text-[#deb55a] font-bold mb-4">¥4,980</p>
                            <p className="text-gray-600">お勧め握り８貫と本日の１品、お椀</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#1C1C1C]">特選にぎり８貫</h3>
                            <p className="text-3xl text-[#deb55a] font-bold mb-4">¥6,980</p>
                            <p className="text-gray-600">贅沢なお勧め握り８貫と本日の１品、お椀</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#1C1C1C]">特選にぎり１０貫</h3>
                            <p className="text-3xl text-[#deb55a] font-bold mb-4">¥9,900</p>
                            <p className="text-gray-600">贅沢なお勧め握り１０貫と本日の１品<br />厳選刺身５種盛り合わせ、お椀</p>
                        </div>
                    </div>

                    {/* NIGIRI Section */}
                    <div className="mb-16">
                        <h3 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-8 text-[#1C1C1C]">NIGIRI</h3>
                        <p className="text-center text-xl mb-8 text-[#deb55a]" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>Fish in Season</p>
                        <p className="text-center text-gray-600 mb-8">季節の魚</p>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[
                                { name: '赤身', price: '550', image: '/assets/nigiri_akami.jpg' },
                                { name: '中トロ', price: '780', image: '/assets/nigiri_chutoro.jpg' },
                                { name: '大トロ', price: '880', image: '/assets/nigiri_otoro.jpg' },
                                { name: '大トロ炙り', price: '880', image: '/assets/nigiri_otoroaburi.jpg' },
                                { name: '海ぶどうトロ手巻き', price: '880', image: '/assets/nigiri_budo_toro_maki.jpg' },
                                { name: 'タイ', price: '480', image: '/assets/nigiri_tai.jpg' },
                                { name: '金目鯛', price: '550', image: '/assets/nigiri_kinmedai.jpg' },
                                { name: 'カマス', price: '550', image: '/assets/nigiri_kamasu.jpg' },
                                { name: 'サワラ', price: '550', image: '/assets/nigiri_sawara.jpg' },
                                { name: 'ブリ', price: '550', image: '/assets/nigiri_buri.jpg' },
                                { name: 'アジ', price: '450', image: '/assets/nigiri_aji.jpg' },
                                { name: 'カツオ', price: '500', soldOut: true, image: '/assets/nigiri_katsuo.jpg' },
                                { name: 'サーモン', price: '450', image: '/assets/nigiri_samon.jpg' },
                                { name: '炙りサーモン', price: '450', image: '/assets/nigiri_aburisamon.jpg' },
                                { name: '車海老', price: '980', image: '/assets/nigiri_ebi.jpg' },
                                { name: '車海老カダイフ揚げ', price: '1300', image: '/assets/nigiri_ebidokku.jpeg' },
                                { name: '生海老漬け', price: '480', image: '/assets/nigiri_ebiduke.jpg' },
                                { name: 'イカ', price: '550', image: '/assets/nigiri_ika.jpg' },
                                { name: '水タコ', price: '550', image: '/assets/nigiri_tako.jpg' },
                                { name: 'ホタテ', price: '600', image: '/assets/nigiri_hotate.jpg' },
                                { name: '赤貝', price: '850', image: '/assets/nigiri_akagai.jpg' },
                                { name: 'えんがわ', price: '550', image: '/assets/nigiri_engawa.jpg' },
                                { name: 'ウナギドック', price: '680', image: '/assets/nigiri_unagi.jpg' },
                                { name: '穴子', price: '680', image: '/assets/nigiri_anago.jpg' },
                                { name: 'ノドグロドック', price: '900', image: '/assets/nigiri_nodogurodokku.jpg' },
                                { name: 'タチウオドック', price: '700', image: '/assets/nigiri_tachiuodokku.jpg' },
                                { name: 'とびっこ', price: '400', image: '/assets/nigiri_tobikko.jpg' },
                                { name: '白子軍艦', price: '550', image: '/assets/nigiri_shirako.jpg' },
                                { name: 'いくら', price: '600', image: '/assets/nigiri_ikura.jpg' },
                                { name: 'ウニ', price: '880', image: '/assets/nigiri_uni.jpg' },
                                { name: '玉子', price: '350', image: '/assets/nigiri_tamago.jpg' },
                                { name: '芽ネギ', price: '350', image: '/assets/nigiri_menegi.jpg' },
                            ].map((item, index) => (
                                <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                                    <ImageWithFallback
                                        src={(item as any).image || "https://images.unsplash.com/photo-1763647756796-af9230245bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&h=300&auto=format&q=80"}
                                        alt={item.name}
                                        className="w-full h-48 object-cover rounded mb-3"
                                    />
                                    <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="font-bold text-lg text-[#1C1C1C]">
                                        {item.name}
                                        {item.soldOut && <span className="text-red-600 text-sm ml-2">売り切れ</span>}
                                    </h4>
                                    <p className="text-[#deb55a] font-bold">¥{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MAKIMONO Section */}
                    <div className="mb-16">
                        <h3 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-8 text-[#1C1C1C]">MAKIMONO</h3>
                        <p className="text-center text-gray-600 mb-8">巻物</p>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { name: 'トロたく巻き', price: '1200', image: '/assets/makimono_torotaku.jpg' },
                                { name: 'ネギトロ巻き', price: '1000', image: '/assets/makimono_negitoro.jpg' },
                                { name: '鉄火巻き', price: '1200', image: '/assets/makimono_tekka.jpg' },
                                { name: 'ウニトロ巻き', price: '2000', image: '/assets/makimono_unitoro.jpg' },
                                { name: 'カッパ巻き', price: '650', image: '/assets/makimono_kappa.jpg' },
                                { name: 'かんぴょう巻き', price: '650', image: '/assets/makimono_kanpyou.jpg' },
                            ].map((item, index) => (
                                <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                                    <ImageWithFallback
                                        src={(item as any).image || "https://images.unsplash.com/photo-1712725214706-e564b8dd1bbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&h=300&auto=format&q=80"}
                                        alt={item.name}
                                        className="w-full h-48 object-cover rounded mb-3"
                                    />
                                    <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="font-bold text-lg text-[#1C1C1C]">{item.name}</h4>
                                    <p className="text-[#deb55a] font-bold">¥{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* IPPIN Section */}
                    <div className="mb-16">
                        <h3 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-8 text-[#1C1C1C]">IPPIN</h3>
                        <p className="text-center text-gray-600 mb-8">一品料理</p>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { name: '味噌汁', price: '350', image: '/assets/ippin_misoshiru.jpg' },
                                { name: '茶碗蒸し', price: '650', image: '/assets/ippin_chawanmushi.jpg' },
                                { name: '刺身盛り合わせ', price: '2000', note: '※その他(赤身だけ3人前、おまかせ3種類2人前)など、お客様のご要望あれば、お気軽にお申し付けください。', image: '/assets/ippin_sashimori.jpg' },
                                { name: 'カニつまみ', price: '980', image: '/assets/ippin_kanitsuami.jpg' },
                                { name: '白子（ポン酢・天ぷら）', price: '1300', image: '/assets/ippin_shirapon.jpg' },
                                { name: '生牡蠣', price: '750', image: '/assets/ippin_namagaki.jpg' },
                                { name: '海鮮ユッケ', price: '980', image: '/assets/ippin_kaisenyukke.jpg' },
                                { name: 'マグロカマ焼き', price: '3200', image: '/assets/ippin_kamayai.jpg' },
                                { name: 'サーモンハラス焼き', price: '1800', image: '/assets/ippin_harasuyaki.jpg' },
                                { name: 'タチウオ塩焼き', price: '980', image: '/assets/ippin_tachiuoyaki.jpg' },
                                { name: 'つまみ玉子', price: '680', image: '/assets/ippin_tsumatama.jpg' },
                                { name: '大福アイス', price: '580', image: '/assets/ippin_ice.jpg' },
                            ].map((item, index) => (
                                <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                                    {(item as any).image && (
                                        <ImageWithFallback
                                            src={(item as any).image}
                                            alt={item.name}
                                            className="w-full h-48 object-cover rounded mb-3"
                                        />
                                    )}
                                    <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="font-bold text-lg text-[#1C1C1C] mb-2">{item.name}</h4>
                                    <p className="text-[#deb55a] font-bold mb-2">¥{item.price}</p>
                                    {item.note && <p className="text-sm text-gray-600">{item.note}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DRINK Section */}
                    <div>
                        <h3 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-8 text-[#1C1C1C]">Drink</h3>
                        <p className="text-center text-gray-600 mb-8">お飲み物</p>

                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Sake Section */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-4 text-[#1C1C1C]">日本酒（１合）</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { name: '写楽 福島', price: '2000', image: '/assets/drink_sharaku.jpg' },
                                        { name: '三井の寿 福岡', price: '1500', image: '/assets/drink_miinokotobuki.jpg' },
                                        { name: '日高見 宮城', price: '1500', image: '/assets/drink_hitakami.jpg' },
                                        { name: 'ゼブラ 山形', price: '2000', image: '/assets/drink_zebra.jpg' },
                                    ].map((item, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div className="w-full aspect-[3/4] overflow-hidden rounded-lg mb-2 shadow-sm">
                                                <ImageWithFallback
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-sm text-[#1C1C1C]">{item.name}</p>
                                                <p className="text-[#deb55a] font-bold text-sm">¥{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Alcohol Section */}
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-4 text-[#1C1C1C]">アルコール</h4>
                                    <div className="space-y-4 text-sm">
                                        <ul className="space-y-2">
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">サントリー プレミアムモルツ生</span><span className="text-[#deb55a] font-bold">／880</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">サッポロラガー中瓶</span><span className="text-[#deb55a] font-bold">／900</span></li>
                                        </ul>

                                        <ul className="space-y-2 border-t pt-4">
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">角ハイボール</span><span className="text-[#deb55a] font-bold">／770</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">知多</span><span className="text-[#deb55a] font-bold">／1600</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">白州</span><span className="text-[#deb55a] font-bold">／1800</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">山﨑</span><span className="text-[#deb55a] font-bold">／1800</span></li>
                                        </ul>

                                        <ul className="space-y-2 border-t pt-4">
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">ガリサワー</span><span className="text-[#deb55a] font-bold">／770</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">レモンサワー</span><span className="text-[#deb55a] font-bold">／770</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">濃厚緑茶ハイ</span><span className="text-[#deb55a] font-bold">／770</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">さんぴん茶ハイ</span><span className="text-[#deb55a] font-bold">／770</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">ウーロンハイ</span><span className="text-[#deb55a] font-bold">／770</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">コーン茶ハイ</span><span className="text-[#deb55a] font-bold">／770</span></li>
                                        </ul>

                                        <div className="border-t pt-4">
                                            <p className="font-bold text-[#1C1C1C] mb-2 text-xs">グラスワイン</p>
                                            <li className="flex justify-between list-none"><span className="text-[#1C1C1C]">赤・白</span><span className="text-[#deb55a] font-bold">／1000〜1300</span></li>
                                        </div>

                                        <div className="border-t pt-4">
                                            <p className="font-bold text-[#1C1C1C] mb-2 text-xs">ボトルワイン</p>
                                            <li className="flex justify-between list-none"><span className="text-[#1C1C1C]">白・ヴェルメンティーノ・グアド・アル・タッソ</span><span className="text-[#deb55a] font-bold">／10000</span></li>
                                        </div>

                                        <div className="border-t pt-4">
                                            <p className="font-bold text-[#1C1C1C] mb-2 text-xs">シャンパン</p>
                                            <li className="flex justify-between list-none"><span className="text-[#1C1C1C]">ペリエ ジュエ グラン ブリュット</span><span className="text-[#deb55a] font-bold">／25000</span></li>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Shochu Section */}
                                    <div className="bg-white rounded-lg shadow-lg p-6">
                                        <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-4 text-[#1C1C1C]">焼酎・泡盛・ハブ酒</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">富乃宝山(芋)</span><span className="text-[#deb55a] font-bold">／880</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">吉四六(麦)</span><span className="text-[#deb55a] font-bold">／880</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">鳥飼(米)</span><span className="text-[#deb55a] font-bold">／880</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">残波白（泡盛)</span><span className="text-[#deb55a] font-bold">／770</span></li>
                                            <li className="flex justify-between"><span className="text-[#1C1C1C]">ハブ酒ショット</span><span className="text-[#deb55a] font-bold">／1000</span></li>
                                        </ul>
                                    </div>

                                    {/* Others Section */}
                                    <div className="bg-white rounded-lg shadow-lg p-6">
                                        <h4 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-4 text-[#1C1C1C]">その他</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex justify-between">
                                                <span className="text-[#1C1C1C]">さんぴん茶、ウーロン茶、緑茶、<br />コーン茶、コカ・コーラ、炭酸水</span>
                                                <span className="text-[#deb55a] font-bold whitespace-nowrap">各種 ¥500</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Affiliated Store Section */}
            <section
                id="affiliated"
                onClick={() => isEditing && onSectionSelect?.('affiliated')}
                className={`py-20 bg-cover bg-center relative transition-all duration-300 ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-[#deb55a]/50' : ''} ${activeSection === 'affiliated' ? 'ring-4 ring-[#deb55a]' : ''}`}
                style={getBackgroundStyle('affiliated')}
            >
                {renderBackgroundContent('affiliated')}
                {isEditing && <SectionToolbar sectionId="affiliated" />}
                {(!backgroundSettings?.['affiliated']?.overlayOpacity) && <div className="absolute inset-0 bg-black/70"></div>}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 style={{ fontFamily: "'Bad Script', cursive" }} className="text-4xl text-center mb-4 text-[#fcebc5]">Affiliated store of KABUKI SUSHI</h2>
                    <p className="text-center text-xl mb-12 text-[#e8eaec]">姉妹店</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-[#271c02] rounded-lg p-6 border border-[#deb55a]/30">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1651977560790-42e0c5cf2ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&h=400&auto=format&q=80"
                                alt="KABUKI寿司 本店"
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#fcebc5]">■KABUKI寿司 本店</h3>
                            <div className="space-y-2 text-[#e8eaec]">
                                <p>〒160-0021 東京都新宿区歌舞伎町2丁目25-8 エコプレイス新宿1F</p>
                                <p>TEL：03-6457-6612</p>
                                <p>OPEN：18:00-4:00</p>
                                <p>グルテンフリー対応可</p>
                                <a href="https://site-1229809-8757-747.mystrikingly.com/" target="_blank" rel="noopener noreferrer" className="text-[#deb55a] hover:underline block mt-2">https://site-1229809-8757-747.mystrikingly.com/</a>
                            </div>
                        </div>

                        <div className="bg-[#271c02] rounded-lg p-6 border border-[#deb55a]/30">
                            <ImageWithFallback
                                src="https://images.unsplash.com/photo-1651977560790-42e0c5cf2ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&h=400&auto=format&q=80"
                                alt="KABUKI SOBA"
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 style={{ fontFamily: "'Archivo Narrow', sans-serif" }} className="text-2xl font-bold mb-3 text-[#fcebc5]">■KABUKI SOBA</h3>
                            <div className="space-y-2 text-[#e8eaec]">
                                <p>〒160-0021 東京都新宿区歌舞伎町２丁目２７ １２Lee２ビル １F</p>
                                <p>TEL：03-6457-3112</p>
                                <p>OPEN：19:00-6:00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Footer */}
            <footer
                id="footer"
                onClick={() => isEditing && onSectionSelect?.('footer')}
                className={`text-[#e8eaec] border-t border-[#deb55a]/20 flex flex-col relative transition-all duration-300 ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-[#deb55a]/50' : ''} ${activeSection === 'footer' ? 'ring-4 ring-[#deb55a]' : ''} ${getLayoutStyle('footer')}`}
                style={getBackgroundStyle('footer')}
            >
                {renderBackgroundContent('footer')}
                {isEditing && <SectionToolbar sectionId="footer" />}
                <div className={`mx-auto text-center ${getContainerWidthClass('footer')}`}>
                    <p style={{ fontFamily: "'Bad Script', cursive" }} className="text-2xl mb-2 text-[#fcebc5]">KABUKI寿司 1番通り店</p>
                    <p className="text-sm text-gray-400">© 2024 KABUKI Sushi. All rights reserved.</p>
                    <div className="mt-4">
                        <a href="/admin/dashboard" className="text-xs text-gray-600 hover:text-[#deb55a] transition-colors">
                            管理画面へ
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
