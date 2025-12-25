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
    mode?: 'resize' | 'crop';
    imageSrc?: string;
}

type ToolType = 'none' | 'resize' | 'crop' | 'filter' | 'rotate' | 'draw' | 'text';
type DrawMode = 'free' | 'line';
type CropRatio = 'custom' | 'square' | '3:2' | '4:3' | '5:4' | '7:5' | '16:9';

export default function ImageEditorModal({ isOpen, onClose, imageUrl, onSave }: ImageEditorModalProps) {
    const [history, setHistory] = useState<EditorState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentImage, setCurrentImage] = useState(imageUrl);
    const [currentState, setCurrentState] = useState<EditorState>({
        rotation: 0,
        filter: 'none',
        drawings: [],
        imageSrc: imageUrl
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

    const [cropRatio, setCropRatio] = useState<CropRatio>('custom');
    const [cropBox, setCropBox] = useState({ left: 15, top: 15, width: 70, height: 70 });
    const [dragSession, setDragSession] = useState<{ type: string, startX: number, startY: number, startBox: any } | null>(null);
    const [isCreatingCrop, setIsCreatingCrop] = useState(false);

    // Default crop box when switching to custom
    useEffect(() => {
        if (activeTool === 'crop' && cropRatio === 'custom' && cropBox.width === 0) {
            setCropBox({ left: 15, top: 15, width: 70, height: 70 });
        }
    }, [activeTool, cropRatio]);

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

        if (!currentState.width) {
            const updatedState = { ...currentState, width: naturalW, height: naturalH };
            setCurrentState(updatedState);
            const newHistory = [...history];
            if (newHistory.length > 0) {
                newHistory[historyIndex >= 0 ? historyIndex : 0] = {
                    ...newHistory[historyIndex >= 0 ? historyIndex : 0],
                    width: naturalW,
                    height: naturalH
                };
            }
            setHistory(newHistory);
        }
    };

    // Ensure dimensions are captured even if onLoad is skipped (cached)
    useEffect(() => {
        if (isOpen && imageRef.current && imageRef.current.complete) {
            const img = imageRef.current;
            if (img.naturalWidth && !currentState.width) {
                handleImageLoad({ currentTarget: img } as any);
            }
        }
    }, [isOpen, currentState.width]);

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
            if (prevState.imageSrc) setCurrentImage(prevState.imageSrc);
            if (prevState.width) setResizeWidth(prevState.width.toString());
            if (prevState.height) setResizeHeight(prevState.height.toString());
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setHistoryIndex(historyIndex + 1);
            setCurrentState(nextState);
            if (nextState.imageSrc) setCurrentImage(nextState.imageSrc);
            if (nextState.width) setResizeWidth(nextState.width.toString());
            if (nextState.height) setResizeHeight(nextState.height.toString());
        }
    };

    const handleReset = () => {
        const initialState: EditorState = {
            rotation: 0,
            filter: 'none',
            drawings: [],
            imageSrc: imageUrl
        };
        pushState(initialState);
        setCurrentImage(imageUrl);
        setCropRatio('custom');
        setCropBox({ left: 15, top: 15, width: 70, height: 70 });
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
                height: h,
                mode: 'resize'
            });
            setActiveTool('none');
        }
    };

    const handleCropApply = () => {
        let width = currentState.width;
        let height = currentState.height;

        if (!width || !height) {
            if (imageRef.current) {
                width = imageRef.current.naturalWidth;
                height = imageRef.current.naturalHeight;
            }
        }

        if (!width || !height) return;

        let finalWidth = width;
        let finalHeight = height;

        if (cropRatio === 'custom') {
            // Avoid zero-size application
            if (cropBox.width < 1 || cropBox.height < 1) return;
            finalWidth = Math.max(10, Math.round((width * cropBox.width) / 100));
            finalHeight = Math.max(10, Math.round((height * cropBox.height) / 100));
        } else {
            const ratios: Record<string, number> = {
                'square': 1,
                '3:2': 3 / 2,
                '4:3': 4 / 3,
                '5:4': 5 / 4,
                '7:5': 7 / 5,
                '16:9': 16 / 9
            };

            if (ratios[cropRatio]) {
                const targetRatio = ratios[cropRatio];
                const currentRatio = width / height;

                if (currentRatio > targetRatio) {
                    finalWidth = height * targetRatio;
                } else {
                    finalHeight = width / targetRatio;
                }
            }
        }

        const roundedWidth = Math.round(finalWidth);
        const roundedHeight = Math.round(finalHeight);

        // Update originalRatio so subsequent actions (like resize sync) work with new image base
        setOriginalRatio(roundedWidth / roundedHeight);

        // Create a temporary canvas to perform ACTUAL cropping
        const canvas = document.createElement('canvas');
        canvas.width = roundedWidth;
        canvas.height = roundedHeight;
        const ctx = canvas.getContext('2d');

        if (ctx && imageRef.current) {
            let sx = 0, sy = 0, sw = width, sh = height;

            if (cropRatio === 'custom') {
                sx = (width * cropBox.left) / 100;
                sy = (height * cropBox.top) / 100;
                sw = (width * cropBox.width) / 100;
                sh = (height * cropBox.height) / 100;
            } else {
                // Preset ratios: center crop
                if (width / height > (roundedWidth / roundedHeight)) {
                    sw = height * (roundedWidth / roundedHeight);
                    sx = (width - sw) / 2;
                } else {
                    sh = width / (roundedWidth / roundedHeight);
                    sy = (height - sh) / 2;
                }
            }

            ctx.drawImage(imageRef.current, sx, sy, sw, sh, 0, 0, roundedWidth, roundedHeight);
            const croppedDataUrl = canvas.toDataURL('image/png');
            setCurrentImage(croppedDataUrl);

            pushState({
                ...currentState,
                width: roundedWidth,
                height: roundedHeight,
                mode: 'crop',
                imageSrc: croppedDataUrl
            });
        }

        setResizeWidth(roundedWidth.toString());
        setResizeHeight(roundedHeight.toString());

        // Reset cropBox for next use
        setCropBox({ left: 0, top: 0, width: 0, height: 0 });
        setActiveTool('none');
    };

    const handleCropBoxMouseDown = (e: React.MouseEvent, type: string) => {
        e.stopPropagation();
        setDragSession({
            type,
            startX: e.clientX,
            startY: e.clientY,
            startBox: { ...cropBox }
        });
    };

    const handleEditorMouseDown = (e: React.MouseEvent) => {
        if (activeTool !== 'crop' || cropRatio !== 'custom') return;

        const container = imageRef.current?.parentElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();

        // Ensure the click is within the image area (with some margin)
        const x = e.clientX;
        const y = e.clientY;

        const startXPercent = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
        const startYPercent = Math.max(0, Math.min(100, ((y - rect.top) / rect.height) * 100));

        setIsCreatingCrop(true);
        setCropBox({ left: startXPercent, top: startYPercent, width: 0, height: 0 });
        setDragSession({
            type: 'create',
            startX: x,
            startY: y,
            startBox: { left: startXPercent, top: startYPercent, width: 0, height: 0 }
        });
    };

    const handleEditorMouseMove = (e: React.MouseEvent) => {
        if (!dragSession) return;

        const container = imageRef.current?.parentElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();

        const deltaX = ((e.clientX - dragSession.startX) / rect.width) * 100;
        const deltaY = ((e.clientY - dragSession.startY) / rect.height) * 100;

        const newBox = { ...dragSession.startBox };

        if (dragSession.type === 'create') {
            if (deltaX > 0) {
                newBox.width = Math.min(100 - newBox.left, deltaX);
            } else {
                newBox.left = Math.max(0, dragSession.startBox.left + deltaX);
                newBox.width = Math.abs(deltaX);
            }

            if (deltaY > 0) {
                newBox.height = Math.min(100 - newBox.top, deltaY);
            } else {
                newBox.top = Math.max(0, dragSession.startBox.top + deltaY);
                newBox.height = Math.abs(deltaY);
            }
        } else if (dragSession.type === 'move') {
            newBox.left = Math.max(0, Math.min(100 - newBox.width, dragSession.startBox.left + deltaX));
            newBox.top = Math.max(0, Math.min(100 - newBox.height, dragSession.startBox.top + deltaY));
        } else if (dragSession.type.includes('right')) {
            newBox.width = Math.max(5, Math.min(100 - newBox.left, dragSession.startBox.width + deltaX));
        } else if (dragSession.type.includes('left')) {
            const possibleX = Math.max(0, Math.min(dragSession.startBox.left + dragSession.startBox.width - 5, dragSession.startBox.left + deltaX));
            newBox.width = dragSession.startBox.width + (dragSession.startBox.left - possibleX);
            newBox.left = possibleX;
        }

        if (dragSession.type !== 'create') {
            if (dragSession.type.includes('bottom')) {
                newBox.height = Math.max(5, Math.min(100 - newBox.top, dragSession.startBox.height + deltaY));
            } else if (dragSession.type.includes('top')) {
                const possibleY = Math.max(0, Math.min(dragSession.startBox.top + dragSession.startBox.height - 5, dragSession.startBox.top + deltaY));
                newBox.height = dragSession.startBox.height + (dragSession.startBox.top - possibleY);
                newBox.top = possibleY;
            }
        }

        setCropBox(newBox);
    };

    const handleEditorMouseUp = () => {
        setDragSession(null);
        setIsCreatingCrop(false);
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
                        onClick={() => onSave(currentImage)}
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

            {/* Crop Sub-Toolbar */}
            {activeTool === 'crop' && (
                <div className="h-[100px] bg-[#2d2d2d] border-b border-white/5 flex flex-col items-center justify-center gap-2 grow-in animate-in px-8">
                    <div className="flex items-center gap-6">
                        {[
                            { id: 'square', label: '四角', icon: <div className="w-4 h-4 border-2 border-current" /> },
                            { id: '3:2', label: '3:2', icon: <div className="w-5 h-3.5 border-2 border-current" /> },
                            { id: '4:3', label: '4:3', icon: <div className="w-4.5 h-3.5 border-2 border-current" /> },
                            { id: '5:4', label: '5:4', icon: <div className="w-4 h-3.5 border-2 border-current" /> },
                            { id: '7:5', label: '7:5', icon: <div className="w-4.5 h-3.5 border-2 border-current" /> },
                            { id: '16:9', label: '16:9', icon: <div className="w-5 h-2.5 border-2 border-current" /> },
                            { id: 'custom', label: 'カスタム', icon: <div className="w-4 h-4 border-2 border-dashed border-current" /> }
                        ].map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => setCropRatio(preset.id as CropRatio)}
                                className={`flex flex-col items-center gap-1 transition-all group ${cropRatio === preset.id ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
                            >
                                <div className={`w-10 h-10 rounded border flex items-center justify-center transition-all ${cropRatio === preset.id ? 'bg-[#93B719] border-[#93B719] text-white shadow-lg' : 'border-white/5 hover:border-white/10'}`}>
                                    {preset.icon}
                                </div>
                                <span className="text-[10px] font-bold">{preset.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 mt-1 border-t border-white/5 pt-2 w-full justify-center">
                        <button
                            onClick={handleCropApply}
                            className="text-[11px] font-bold text-white hover:text-[#93B719] transition-colors"
                        >
                            適用
                        </button>
                        <button
                            onClick={() => {
                                setCropRatio('custom');
                                setActiveTool('none');
                            }}
                            className="text-[11px] font-bold text-gray-400 hover:text-gray-200 transition-colors"
                        >
                            取り消す
                        </button>
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
            <div
                className={`flex-1 bg-[#151515] flex items-center justify-center p-12 overflow-hidden relative ${activeTool === 'crop' && cropRatio === 'custom' ? 'cursor-crosshair' : ''}`}
                onMouseDown={handleEditorMouseDown}
                onMouseMove={handleEditorMouseMove}
                onMouseUp={handleEditorMouseUp}
                onMouseLeave={handleEditorMouseUp}
            >
                <div className="relative shadow-[2xl] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-black flex items-center justify-center overflow-hidden"
                    style={{
                        transform: `rotate(${currentState.rotation}deg)`,
                        filter: currentState.filter,
                        aspectRatio: currentState.width && currentState.height ? `${currentState.width}/${currentState.height}` : 'auto',
                        width: currentState.width && currentState.height ? (currentState.width / currentState.height > 1.4 ? '90%' : 'auto') : 'auto',
                        height: currentState.width && currentState.height ? (currentState.width / currentState.height <= 0.8 ? '70vh' : 'auto') : 'auto',
                        minWidth: currentState.width && currentState.height && currentState.width / currentState.height > 0.8 && currentState.width / currentState.height <= 1.4 ? '500px' : 'auto',
                        maxWidth: '90%',
                        maxHeight: '75vh'
                    }}
                >
                    <img
                        ref={imageRef}
                        src={currentImage}
                        alt="Editing"
                        onLoad={handleImageLoad}
                        className="w-full h-full select-none transition-all duration-300"
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

                    {activeTool === 'crop' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div
                                key={cropRatio}
                                onMouseDown={(e) => {
                                    if (cropRatio === 'custom') {
                                        e.stopPropagation();
                                        handleCropBoxMouseDown(e, 'move');
                                    }
                                }}
                                className={`border border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-300 relative flex items-center justify-center ${cropRatio === 'custom' ? 'pointer-events-auto cursor-move' : ''}`}
                                style={{
                                    borderStyle: cropRatio === 'custom' ? 'dashed' : 'solid',
                                    borderWidth: cropRatio === 'custom' ? '1px' : '2px',
                                    borderColor: cropRatio === 'custom' ? 'rgba(255,255,255,0.8)' : '#93B719',
                                    left: cropRatio === 'custom' ? `${cropBox.left}%` : 'auto',
                                    top: cropRatio === 'custom' ? `${cropBox.top}%` : 'auto',
                                    width: cropRatio === 'custom' ? `${cropBox.width}%` :
                                        cropRatio === 'square' ? '50%' :
                                            cropRatio === '3:2' ? '70%' :
                                                cropRatio === '4:3' ? '65%' :
                                                    cropRatio === '5:4' ? '60%' :
                                                        cropRatio === '7:5' ? '65%' :
                                                            cropRatio === '16:9' ? '90%' : '75%',
                                    aspectRatio: cropRatio === 'square' ? '1/1' :
                                        cropRatio === '3:2' ? '3/2' :
                                            cropRatio === '4:3' ? '4/3' :
                                                cropRatio === '5:4' ? '5/4' :
                                                    cropRatio === '7:5' ? '7/5' :
                                                        cropRatio === '16:9' ? '16/9' :
                                                            cropRatio === 'custom' ? 'none' : '1/1',
                                    height: cropRatio === 'custom' ? `${cropBox.height}%` : 'auto',
                                    maxHeight: '100%',
                                    maxWidth: '100%',
                                    position: cropRatio === 'custom' ? 'absolute' : 'relative',
                                    display: cropRatio === 'custom' && cropBox.width === 0 ? 'none' : 'flex'
                                }}
                            >
                                {/* Crop Handles */}
                                {cropRatio === 'custom' ? (
                                    <>
                                        {/* Corner Handles */}
                                        <div onMouseDown={(e) => handleCropBoxMouseDown(e, 'top-left')} className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-white border border-[#93B719] rounded-sm cursor-nwse-resize pointer-events-auto shadow-sm" />
                                        <div onMouseDown={(e) => handleCropBoxMouseDown(e, 'top-right')} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-[#93B719] rounded-sm cursor-nesw-resize pointer-events-auto shadow-sm" />
                                        <div onMouseDown={(e) => handleCropBoxMouseDown(e, 'bottom-left')} className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-white border border-[#93B719] rounded-sm cursor-nesw-resize pointer-events-auto shadow-sm" />
                                        <div onMouseDown={(e) => handleCropBoxMouseDown(e, 'bottom-right')} className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border border-[#93B719] rounded-sm cursor-nwse-resize pointer-events-auto shadow-sm" />

                                        {/* Side Handles */}
                                        <div onMouseDown={(e) => handleCropBoxMouseDown(e, 'left')} className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-6 bg-white border border-[#93B719] rounded-sm cursor-ew-resize pointer-events-auto shadow-sm" />
                                        <div onMouseDown={(e) => handleCropBoxMouseDown(e, 'right')} className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-6 bg-white border border-[#93B719] rounded-sm cursor-ew-resize pointer-events-auto shadow-sm" />
                                        <div onMouseDown={(e) => handleCropBoxMouseDown(e, 'top')} className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-white border border-[#93B719] rounded-sm cursor-ns-resize pointer-events-auto shadow-sm" />
                                        <div onMouseDown={(e) => handleCropBoxMouseDown(e, 'bottom')} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-white border border-[#93B719] rounded-sm cursor-ns-resize pointer-events-auto shadow-sm" />
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#93B719] rounded-sm" />
                                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#93B719] rounded-sm" />
                                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#93B719] rounded-sm" />
                                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#93B719] rounded-sm" />
                                        <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-4 bg-white border border-[#93B719] rounded-sm" />
                                        <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-4 bg-white border border-[#93B719] rounded-sm" />
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-[#93B719] rounded-sm" />
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-[#93B719] rounded-sm" />
                                    </>
                                )}

                                {/* Grid Lines */}
                                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                                    <div className="border-r border-white" />
                                    <div className="border-r border-white" />
                                    <div className="border-b border-white" />
                                    <div className="border-b border-white" />
                                    <div className="border-b border-white col-span-3" />
                                    <div className="border-b border-white col-span-3" />
                                </div>
                            </div>
                        </div>
                    )}
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
