import React, { useState, useEffect } from 'react';
import {
    Undo2,
    Redo2,
    RotateCcw,
    Maximize,
    Crop,
    RotateCw,
    Pencil,
    Type,
    X,
    SlidersHorizontal
} from 'lucide-react';

interface ImageEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    onSave: (editedUrl: string) => void;
}

interface EditorState {
    rotation: number;
    filter: string;
    // Add other properties as we implement features
}

export default function ImageEditorModal({ isOpen, onClose, imageUrl, onSave }: ImageEditorModalProps) {
    const [history, setHistory] = useState<EditorState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentState, setCurrentState] = useState<EditorState>({
        rotation: 0,
        filter: 'none',
    });

    // Initialize history
    useEffect(() => {
        if (isOpen) {
            setHistory([{ rotation: 0, filter: 'none' }]);
            setHistoryIndex(0);
            setCurrentState({ rotation: 0, filter: 'none' });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const pushState = (newState: EditorState) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentState(newState);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setCurrentState(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setCurrentState(history[historyIndex + 1]);
        }
    };

    const handleReset = () => {
        pushState({ rotation: 0, filter: 'none' });
    };

    const handleRotate = () => {
        pushState({
            ...currentState,
            rotation: (currentState.rotation + 90) % 360
        });
    };

    const handleFilter = () => {
        const filters = ['none', 'grayscale(100%)', 'sepia(100%)', 'blur(5px)', 'brightness(150%)'];
        const currentIdx = filters.indexOf(currentState.filter);
        const nextIdx = (currentIdx + 1) % filters.length;
        pushState({
            ...currentState,
            filter: filters[nextIdx]
        });
    };

    return (
        <div className="fixed inset-0 z-[110] bg-[#1a1a1a] flex flex-col font-sans text-white animate-in grow-in duration-200">
            {/* Top Navigation Bar */}
            <div className="h-[60px] bg-[#222] border-b border-white/5 flex items-center justify-between px-6 shadow-xl">
                <div className="flex items-center gap-6">
                    <span className="text-lg font-bold tracking-tight">画像編集ソフト</span>

                    <div className="flex items-center gap-1 ml-4 border-l border-white/10 pl-6">
                        <button
                            onClick={handleUndo}
                            disabled={historyIndex <= 0}
                            className={`p-2 rounded hover:bg-white/5 transition-colors ${historyIndex <= 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300'}`}
                            title="元に戻す"
                        >
                            <Undo2 size={20} />
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={historyIndex >= history.length - 1}
                            className={`p-2 rounded hover:bg-white/5 transition-colors ${historyIndex >= history.length - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300'}`}
                            title="やり直し"
                        >
                            <Redo2 size={20} />
                        </button>
                        <button
                            onClick={handleReset}
                            className="p-2 text-gray-300 hover:bg-white/5 rounded transition-colors"
                            title="リセット"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-300 hover:bg-white/5 rounded transition-colors" title="サイズ変更">
                            <Maximize size={20} />
                        </button>
                        <button className="p-2 text-gray-300 hover:bg-white/5 rounded transition-colors" title="切り抜く">
                            <Crop size={20} />
                        </button>
                        <button
                            onClick={handleFilter}
                            className="p-2 text-gray-300 hover:bg-white/5 rounded transition-colors"
                            title="フィルター"
                        >
                            <SlidersHorizontal size={20} />
                        </button>
                        <button
                            onClick={handleRotate}
                            className="p-2 text-gray-300 hover:bg-white/5 rounded transition-colors"
                            title="回転"
                        >
                            <RotateCw size={20} />
                        </button>
                        <button className="p-2 text-gray-300 hover:bg-white/5 rounded transition-colors" title="書く">
                            <Pencil size={20} />
                        </button>
                        <button className="p-2 text-gray-300 hover:bg-white/5 rounded transition-colors" title="文字">
                            <Type size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onSave(imageUrl)} // In real usage, would apply transform to canvas/image data
                        className="px-8 py-2 bg-[#93B719] hover:bg-[#a6cd1d] text-white font-bold rounded shadow-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                        保存
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Editing Canvas Area */}
            <div className="flex-1 bg-[#151515] flex items-center justify-center p-12 overflow-hidden relative">
                <div className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out"
                    style={{
                        transform: `rotate(${currentState.rotation}deg)`,
                        filter: currentState.filter
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Editing"
                        className="max-w-full max-h-[70vh] object-contain select-none"
                    />

                    {/* Helper overlays for Crop/Draw would go here */}
                </div>

                {/* Status Bar / Info */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs font-medium text-gray-500 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span>{currentState.rotation}° Rotation</span>
                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                    <span>Filter: {currentState.filter === 'none' ? 'None' : 'Active'}</span>
                </div>
            </div>
        </div>
    );
}
