import React, { useState, useEffect, useRef } from 'react';
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
    SlidersHorizontal,
    Minus
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
    drawings: any[];
}

type ToolType = 'none' | 'resize' | 'crop' | 'filter' | 'rotate' | 'draw' | 'text';
type DrawMode = 'free' | 'line';

export default function ImageEditorModal({ isOpen, onClose, imageUrl, onSave }: ImageEditorModalProps) {
    const [history, setHistory] = useState<EditorState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentState, setCurrentState] = useState<EditorState>({
        rotation: 0,
        filter: 'none',
        drawings: []
    });

    const [activeTool, setActiveTool] = useState<ToolType>('none');
    const [drawMode, setDrawMode] = useState<DrawMode>('free');
    const [drawColor, setDrawColor] = useState('#00a9ff');
    const [brushSize, setBrushSize] = useState(12);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);

    // Initialize history
    useEffect(() => {
        if (isOpen) {
            const initialState = { rotation: 0, filter: 'none', drawings: [] };
            setHistory([initialState]);
            setHistoryIndex(0);
            setCurrentState(initialState);
            setActiveTool('none');
        }
    }, [isOpen]);

    // Draw existing drawings on canvas whenever state changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentState.drawings.forEach(draw => {
            ctx.strokeStyle = draw.color;
            ctx.lineWidth = draw.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            if (draw.mode === 'free') {
                draw.points.forEach((p: any, i: number) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
            } else {
                ctx.moveTo(draw.start.x, draw.start.y);
                ctx.lineTo(draw.end.x, draw.end.y);
            }
            ctx.stroke();
        });
    }, [currentState.drawings, currentState.rotation]);

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
        pushState({ rotation: 0, filter: 'none', drawings: [] });
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

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (activeTool !== 'draw') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPoint({ x, y });

        if (drawMode === 'free') {
            const newDrawing = {
                mode: 'free',
                color: drawColor,
                size: brushSize,
                points: [{ x, y }]
            };
            setCurrentState(prev => ({
                ...prev,
                drawings: [...prev.drawings, newDrawing]
            }));
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || activeTool !== 'draw') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (drawMode === 'free') {
            setCurrentState(prev => {
                const newDrawings = [...prev.drawings];
                const lastIdx = newDrawings.length - 1;
                newDrawings[lastIdx] = {
                    ...newDrawings[lastIdx],
                    points: [...newDrawings[lastIdx].points, { x, y }]
                };
                return { ...prev, drawings: newDrawings };
            });
        }
    };

    const handleCanvasMouseUp = (e: React.MouseEvent) => {
        if (!isDrawing || activeTool !== 'draw') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (drawMode === 'line' && startPoint) {
            const newDrawing = {
                mode: 'line',
                color: drawColor,
                size: brushSize,
                start: startPoint,
                end: { x, y }
            };
            const updatedState = {
                ...currentState,
                drawings: [...currentState.drawings, newDrawing]
            };
            pushState(updatedState);
        } else if (drawMode === 'free') {
            pushState(currentState);
        }

        setIsDrawing(false);
        setStartPoint(null);
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
                        <button
                            onClick={() => setActiveTool('resize')}
                            className={`p-2 rounded transition-colors ${activeTool === 'resize' ? 'bg-[#93B719] text-white' : 'text-gray-300 hover:bg-white/5'}`}
                            title="サイズ変更"
                        >
                            <Maximize size={20} />
                        </button>
                        <button
                            onClick={() => setActiveTool('crop')}
                            className={`p-2 rounded transition-colors ${activeTool === 'crop' ? 'bg-[#93B719] text-white' : 'text-gray-300 hover:bg-white/5'}`}
                            title="切り抜く"
                        >
                            <Crop size={20} />
                        </button>
                        <button
                            onClick={() => {
                                handleFilter();
                                setActiveTool('filter');
                            }}
                            className={`p-2 rounded transition-colors ${activeTool === 'filter' ? 'bg-[#93B719] text-white' : 'text-gray-300 hover:bg-white/5'}`}
                            title="フィルター"
                        >
                            <SlidersHorizontal size={20} />
                        </button>
                        <button
                            onClick={() => {
                                handleRotate();
                                setActiveTool('rotate');
                            }}
                            className={`p-2 rounded transition-colors ${activeTool === 'rotate' ? 'bg-[#93B719] text-white' : 'text-gray-300 hover:bg-white/5'}`}
                            title="回転"
                        >
                            <RotateCw size={20} />
                        </button>
                        <button
                            onClick={() => setActiveTool(activeTool === 'draw' ? 'none' : 'draw')}
                            className={`p-2 rounded transition-colors ${activeTool === 'draw' ? 'bg-[#93B719] text-white' : 'text-gray-300 hover:bg-white/5'}`}
                            title="書く"
                        >
                            <Pencil size={20} />
                        </button>
                        <button
                            onClick={() => setActiveTool('text')}
                            className={`p-2 rounded transition-colors ${activeTool === 'text' ? 'bg-[#93B719] text-white' : 'text-gray-300 hover:bg-white/5'}`}
                            title="文字"
                        >
                            <Type size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onSave(imageUrl)}
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

            {/* Sub-Toolbar for Tools */}
            {activeTool === 'draw' && (
                <div className="h-[100px] bg-[#2d2d2d] flex flex-col items-center justify-center gap-4 border-b border-white/5 shadow-inner grow-in animate-in">
                    <div className="flex items-center gap-12 text-[11px] font-bold">
                        {/* Mode Select */}
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => setDrawMode('free')}
                                className={`flex flex-col items-center gap-1 transition-colors ${drawMode === 'free' ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
                            >
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 14C4 14 6 16 10 16C14 16 16 14 16 14" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <span>書く</span>
                            </button>
                            <button
                                onClick={() => setDrawMode('line')}
                                className={`flex flex-col items-center gap-1 transition-colors ${drawMode === 'line' ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
                            >
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <Minus size={20} className="-rotate-45" />
                                </div>
                                <span>線</span>
                            </button>
                        </div>

                        {/* Color Picker */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full border border-white/20 shadow-lg flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0" style={{ backgroundColor: drawColor }} />
                                    <input
                                        type="color"
                                        value={drawColor}
                                        onChange={(e) => setDrawColor(e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <span className="text-gray-500">色</span>
                        </div>

                        {/* Recent Colors */}
                        <div className="flex items-center gap-1.5">
                            {['#000000', '#ffffff', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#00a9ff'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setDrawColor(c)}
                                    className={`w-4 h-4 rounded-sm border ${drawColor === c ? 'border-white scale-125' : 'border-black/20'} transition-transform`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-[400px]">
                        <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">範囲</span>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={brushSize}
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00a9ff]"
                        />
                        <div className="w-10 h-6 bg-black/40 rounded border border-white/10 flex items-center justify-center text-[11px] font-bold">
                            {brushSize}
                        </div>
                    </div>
                </div>
            )}

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
                        className="max-w-full max-h-[60vh] object-contain select-none"
                    />

                    <canvas
                        ref={canvasRef}
                        width={1200}
                        height={800}
                        className={`absolute inset-0 w-full h-full ${activeTool === 'draw' ? 'cursor-crosshair' : 'pointer-events-none'}`}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                    />
                </div>

                {/* Status Bar / Info */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs font-medium text-gray-500 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span>{currentState.rotation}° Rotation</span>
                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                    <span>Filter: {currentState.filter === 'none' ? 'None' : 'Active'}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                    <span>Drawings: {currentState.drawings.length}</span>
                </div>
            </div>
        </div>
    );
}
