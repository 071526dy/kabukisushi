import React, { useState, useRef } from 'react';
import { X, CloudUpload, Folder, Archive, Check, Trash2, Search, ChevronRight, Video, Plus } from 'lucide-react';

interface ImageAssetLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    mediaType?: 'image' | 'video';
}

type TabType = 'upload' | 'uploaded' | 'library';

export default function ImageAssetLibrary({ isOpen, onClose, onSelect, mediaType = 'image' }: ImageAssetLibraryProps) {
    const [activeTab, setActiveTab] = useState<TabType>('upload');
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isVideo = mediaType === 'video';
    const label = isVideo ? '動画' : '画像';

    if (!isOpen) return null;

    const uploadedImages = [
        "https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
        "https://images.unsplash.com/photo-1651977560790-42e0c5cf2ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
        "https://images.unsplash.com/photo-1512132411229-c30391241dd8?ixlib=rb-1.2.1&q=85&fm=jpg&w=400&q=80",
        "https://images.unsplash.com/photo-1638866381709-071747b518c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80"
    ];

    const libraryImages = [
        "https://uploads.strikinglycdn.com/static/backgrounds/abstract/t75.jpg",
        "https://uploads.strikinglycdn.com/static/backgrounds/abstract/t76.jpg",
        "https://uploads.strikinglycdn.com/static/backgrounds/abstract/t77.jpg",
        "https://uploads.strikinglycdn.com/static/backgrounds/abstract/t78.jpg",
        "https://uploads.strikinglycdn.com/static/backgrounds/abstract/t79.jpg",
        "https://uploads.strikinglycdn.com/static/backgrounds/abstract/t80.jpg",
        "https://uploads.strikinglycdn.com/static/backgrounds/abstract/t65.jpg",
        "https://uploads.strikinglycdn.com/static/backgrounds/abstract/t66.jpg",
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // In a real app, you would upload to a server. 
            // Here we create a local object URL for preview.
            const url = URL.createObjectURL(file);
            onSelect(url);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[900px] h-[650px] rounded-lg shadow-2xl flex flex-col relative overflow-hidden border border-gray-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {/* Sidebar Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex flex-col items-center gap-2 px-8 py-5 border-r border-gray-50 transition-all ${activeTab === 'upload' ? 'bg-[#f8f9fa] shadow-inner' : 'hover:bg-gray-50'}`}
                    >
                        <CloudUpload size={28} className={activeTab === 'upload' ? 'text-blue-500' : 'text-gray-400'} />
                        <span className={`text-[11px] font-bold ${activeTab === 'upload' ? 'text-gray-900' : 'text-gray-500'}`}>新しい{label}をアップロード</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('uploaded')}
                        className={`flex flex-col items-center gap-2 px-8 py-5 border-r border-gray-50 transition-all ${activeTab === 'uploaded' ? 'bg-[#f8f9fa] shadow-inner' : 'hover:bg-gray-50'}`}
                    >
                        <Folder size={28} className={activeTab === 'uploaded' ? 'text-blue-500' : 'text-gray-400'} />
                        <span className={`text-[11px] font-bold ${activeTab === 'uploaded' ? 'text-gray-900' : 'text-gray-500'}`}>アップロードされた{label}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`flex flex-col items-center gap-2 px-8 py-5 transition-all ${activeTab === 'library' ? 'bg-[#f8f9fa] shadow-inner' : 'hover:bg-gray-50'}`}
                    >
                        <Archive size={28} className={activeTab === 'library' ? 'text-blue-500' : 'text-gray-400'} />
                        <span className={`text-[11px] font-bold ${activeTab === 'library' ? 'text-gray-900' : 'text-gray-500'}`}>STRIKINGLY ライブラリ</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#fcfcfc]">
                    {activeTab === 'upload' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-12">
                            <div className="w-full max-w-2xl border-2 border-dashed border-gray-200 rounded-xl bg-white p-16 flex flex-col items-center text-center shadow-sm">
                                <div className="text-xl font-bold text-gray-800 mb-2">ファイルをここへドラッグしてください</div>
                                <div className="text-gray-400 mb-8 font-medium">もしくは</div>
                                <button
                                    onClick={handleBrowseClick}
                                    className="px-10 py-3 bg-[#88c057] hover:bg-[#7ab04a] text-white rounded-md font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 mb-8"
                                >
                                    参照
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept={isVideo ? "video/mp4,video/webm,video/ogg" : "image/gif,image/jpeg,image/jpg,image/png,image/bmp,image/x-icon"}
                                />

                                <div className="w-full max-w-md space-y-4">
                                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">URLから直接アップロード</div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="ウェブから直接アップロードするにはURLを入力してください"
                                            className="flex-1 p-3 border border-gray-200 rounded text-sm bg-[#fafafa] focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
                                        />
                                        <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-bold text-sm border border-gray-200 transition-colors">
                                            OK
                                        </button>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-2">
                                        {isVideo
                                            ? '対応している形式：mp4, webm, ogg。100MB までアップロード可能です。'
                                            : '対応している形式：gif, jpg, jpeg, png, bmp, ico。10MB までアップロード可能です。'
                                        }
                                    </div>
                                </div>

                                <div className="mt-12 text-blue-500 text-xs font-bold bg-blue-50 px-4 py-2 rounded-full border border-blue-100 italic">
                                    ヒント：{isVideo ? '背景動画には1280x720ピクセル以上の動画を推奨しています。' : '背景画像には1600x900ピクセル以上の画像を推奨しています。'}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'uploaded' && (
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
                                <div className="flex items-center gap-4">
                                    <select className="p-2 border border-gray-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500/20 bg-[#fafafa]">
                                        <option>すべてのアップロード{label}</option>
                                        <option>このサイトの{label}</option>
                                    </select>
                                    <div className="flex items-center text-xs text-gray-400 font-bold border-l border-gray-200 pl-4 h-6">
                                        <button className="text-blue-500 px-2">最新</button>
                                        <span className="text-gray-200 px-1">/</span>
                                        <button className="hover:text-blue-500 px-2 transition-colors">最古</button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded text-xs font-bold hover:bg-red-100 transition-colors">
                                        <Trash2 size={12} />
                                        {label}の削除
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                                <div className="grid grid-cols-5 gap-4">
                                    {/* Add Image Link */}
                                    <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 group transition-all">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all font-bold text-2xl">+</div>
                                        <div className="text-[10px] text-gray-400 font-bold group-hover:text-blue-500">{label}をインポート</div>
                                    </div>

                                    {uploadedImages.map((url, i) => (
                                        <div
                                            key={i}
                                            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-transparent hover:border-[#88c057] transition-all cursor-pointer shadow-sm hover:shadow-md"
                                            onClick={() => onSelect(url)}
                                        >
                                            {isVideo ? (
                                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                    <Video className="text-white opacity-50" />
                                                </div>
                                            ) : (
                                                <img src={url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                                <button className="px-4 py-1.5 bg-[#88c057] text-white text-[10px] font-bold rounded shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">選択</button>
                                                <div className="mt-2 text-[8px] text-white/80 text-center line-clamp-2 px-1">1080×1350 · 0.13MB<br />2日前</div>
                                            </div>
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-[#88c057] rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform shadow-md border border-white/20">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'library' && (
                        <div className="flex-1 flex h-full overflow-hidden">
                            {/* Library Sidebar Categories */}
                            <div className="w-56 border-r border-gray-100 bg-white flex flex-col p-2 space-y-1">
                                {[
                                    '全て', '抽象的なイメージ', 'ブレ', 'ビジネス', '都市の風景',
                                    'ファッション', '食物', '自然', '物体'
                                ].map((cat, i) => (
                                    <button
                                        key={i}
                                        className={`text-left px-4 py-3 text-[11px] font-bold rounded transition-colors ${i === 0 ? 'bg-[#88c057]/10 text-[#88c057]' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                                <button className="flex items-center justify-between text-left px-4 py-3 text-[11px] font-bold text-gray-500 hover:bg-gray-50 bg-blue-50/50 rounded mt-auto">
                                    <div className="flex items-center gap-2">
                                        <Video size={14} className="text-blue-500" />
                                        <span>動画</span>
                                    </div>
                                    <ChevronRight size={12} />
                                </button>
                            </div>

                            {/* Library Main Content */}
                            <div className="flex-1 flex flex-col h-full bg-[#f8f9fa]">
                                <div className="p-4 bg-white border-b border-gray-100 shadow-sm">
                                    <div className="relative">
                                        <textarea
                                            placeholder={`300万以上の${label}を検索...`}
                                            className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-300 transition-all resize-none h-12 flex items-center shadow-inner"
                                            rows={1}
                                        />
                                        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    <div className="grid grid-cols-4 gap-2">
                                        {libraryImages.map((url, i) => (
                                            <div
                                                key={i}
                                                className="group aspect-square rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#88c057] transition-all shadow-sm hover:shadow-md"
                                                onClick={() => onSelect(url)}
                                            >
                                                <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Selection Info */}
                <div className="p-4 bg-[#252525] flex justify-between items-center text-white/50 text-[10px] font-medium">
                    <div className="flex items-center gap-4">
                        <span className="text-white/30">25.07MB / 0.49GBストレージ使用</span>
                        <a href="#" className="hover:text-white transition-colors underline underline-offset-4 decoration-white/20">ストレージを管理</a>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded text-red-400 hover:bg-red-500/20 cursor-pointer transition-colors">
                        <Trash2 size={12} />
                        {label}削除
                    </div>
                </div>
            </div>
        </div>
    );
}
