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
    width?: number;
    height?: number;
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
    const [showColorPicker, setShowColorPicker] = useState(false);

    const [resizeWidth, setResizeWidth] = useState('2000');
    const [resizeHeight, setResizeHeight] = useState('1333');
    const [maintainRatio, setMaintainRatio] = useState(true);
    const [originalRatio, setOriginalRatio] = useState(2000 / 1333);

    const colorPresets = [
        ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#eeeeee', '#ffffff', 'transparent'],
        ['#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#007aff', '#5856d6', '#af52de', '#ff2d55']
    ];

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);

    // Initialize history
    useEffect(() => {
        if (isOpen) {
            const initialState: EditorState = {
                rotation: 0,
                filter: 'none',
                drawings: []
            };
            setHistory([initialState]);
            setHistoryIndex(0);
            setCurrentState(initialState);
            setActiveTool('none');
        }
    }, [isOpen]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const naturalW = img.naturalWidth;
        const naturalH = img.naturalHeight;

        setResizeWidth(naturalW.toString());
        setResizeHeight(naturalH.toString());
        setOriginalRatio(naturalW / naturalH);

        if (historyIndex === 0 && !currentState.width) {
            const updatedState = { ...currentState, width: naturalW, height: naturalH };
            setCurrentState(updatedState);
            const newHistory = [...history];
            newHistory[0] = updatedState;
            setHistory(newHistory);
        }
    };

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
            const prevState = history[historyIndex - 1];
            setHistoryIndex(historyIndex - 1);
            setCurrentState(prevState);
            if (prevState.width) setResizeWidth(prevState.width.toString());
            if (prevState.height) setResizeHeight(prevState.height.toString());
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setHistoryIndex(historyIndex + 1);
            setCurrentState(nextState);
            if (nextState.width) setResizeWidth(nextState.width.toString());
            if (nextState.height) setResizeHeight(nextState.height.toString());
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

    const handleResizeApply = () => {
        const w = parseInt(resizeWidth);
        const h = parseInt(resizeHeight);
        if (!isNaN(w) && !isNaN(h)) {
            pushState({
                ...currentState,
                width: w,
                height: h
            });
            setActiveTool('none');
        }
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (activeTool !== 'draw') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

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
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

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
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

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

            {/* Resize Sub-Toolbar */}
            {activeTool === 'resize' && (
                <div className="h-[100px] bg-[#2d2d2d] border-b border-white/5 flex items-center justify-center grow-in animate-in px-8">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-500">横幅</label>
                            <input
                                type="text"
                                value={resizeWidth}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setResizeWidth(val);
                                    if (maintainRatio) {
                                        const w = parseInt(val);
                                        if (!isNaN(w)) {
                                            setResizeHeight(Math.round(w / originalRatio).toString());
                                        }
                                    }
                                }}
                                className="w-24 bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-xs font-bold text-white focus:border-[#93B719] outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-500">高さ</label>
                            <input
                                type="text"
                                value={resizeHeight}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setResizeHeight(val);
                                    if (maintainRatio) {
                                        const h = parseInt(val);
                                        if (!isNaN(h)) {
                                            setResizeWidth(Math.round(h * originalRatio).toString());
                                        }
                                    }
                                }}
                                className="w-24 bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-xs font-bold text-white focus:border-[#93B719] outline-none"
                            />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer pt-4 group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={maintainRatio}
                                    onChange={(e) => setMaintainRatio(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-4 h-4 border border-white/20 rounded peer-checked:bg-[#007aff] peer-checked:border-[#007aff] transition-colors" />
                                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-0.5 transition-opacity" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="4">
                                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                                </svg>
                            </div>
                            <span className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors">アスペクト比を維持する</span>
                        </label>

                        <div className="flex items-center gap-4 ml-6 pt-4 border-l border-white/10 pl-8">
                            <button
                                onClick={handleResizeApply}
                                className="text-[11px] font-bold text-white hover:text-[#93B719] transition-colors"
                            >
                                適用
                            </button>
                            <button
                                onClick={() => setActiveTool('none')}
                                className="text-[11px] font-bold text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                取り消す
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

                        {/* Color Picker Popover */}
                        <div className="flex flex-col items-center gap-1 relative">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    className="w-8 h-8 rounded-full border border-white/20 shadow-lg flex items-center justify-center relative overflow-hidden transition-transform hover:scale-110 active:scale-95"
                                >
                                    <div className="absolute inset-0" style={{ backgroundColor: drawColor === 'transparent' ? 'white' : drawColor }} />
                                    {drawColor === 'transparent' && (
                                        <div className="absolute inset-0 bg-white flex items-center justify-center">
                                            <div className="w-full h-[1px] bg-red-500 rotate-45" />
                                        </div>
                                    )}
                                </button>
                            </div>
                            <span className="text-gray-500">色</span>

                            {showColorPicker && (
                                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-4 w-[280px] z-[120] animate-in slide-in-from-top-2">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            {colorPresets.map((row, i) => (
                                                <div key={i} className="flex justify-between">
                                                    {row.map(color => (
                                                        <button
                                                            key={color}
                                                            onClick={() => {
                                                                setDrawColor(color);
                                                                setShowColorPicker(false);
                                                            }}
                                                            className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 relative ${drawColor === color ? 'border-[#00a9ff] scale-110' : 'border-black/5'}`}
                                                            style={{ backgroundColor: color === 'transparent' ? 'white' : color }}
                                                        >
                                                            {color === 'transparent' && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-full h-[1px] bg-red-500 rotate-45" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="h-px bg-gray-100" />

                                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded border border-gray-200">
                                            <div className="w-8 h-8 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: drawColor === 'transparent' ? 'white' : drawColor }}>
                                                {drawColor === 'transparent' && (
                                                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                                        <div className="w-full h-[1px] bg-red-500 rotate-45" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex items-center gap-1">
                                                <span className="text-gray-400 text-sm font-medium">#</span>
                                                <input
                                                    type="text"
                                                    value={drawColor.startsWith('#') ? drawColor.slice(1).toUpperCase() : ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
                                                        if (val.length <= 6) {
                                                            setDrawColor(`#${val}`);
                                                        }
                                                    }}
                                                    placeholder="FFFFFF"
                                                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-700 focus:ring-0 uppercase placeholder:text-gray-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                                </div>
                            )}
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
                <div className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out bg-black flex items-center justify-center"
                    style={{
                        transform: `rotate(${currentState.rotation}deg)`,
                        filter: currentState.filter,
                        aspectRatio: currentState.width && currentState.height ? `${currentState.width}/${currentState.height}` : 'auto',
                        width: currentState.width && currentState.height ? (currentState.width > currentState.height ? '80%' : 'auto') : 'auto',
                        height: currentState.width && currentState.height ? (currentState.height >= currentState.width ? '70vh' : 'auto') : 'auto',
                        maxWidth: '90%',
                        maxHeight: '70vh'
                    }}
                >
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Editing"
                        onLoad={handleImageLoad}
                        className="w-full h-full select-none transition-all duration-300"
                        style={{
                            objectFit: 'fill'
                        }}
                    />

                    <canvas
                        ref={canvasRef}
                        width={currentState.width || 1200}
                        height={currentState.height || 800}
                        className={`absolute inset-0 w-full h-full ${activeTool === 'draw' ? 'cursor-crosshair' : 'pointer-events-none'}`}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                    />
                </div>

                {/* Status Bar / Info */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs font-medium text-gray-500 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                    {currentState.width && (
                        <>
                            <span>{currentState.width} × {currentState.height}</span>
                            <div className="w-1 h-1 rounded-full bg-gray-700" />
                        </>
                    )}
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
