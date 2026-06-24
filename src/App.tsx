import React, { useState, useEffect } from 'react';
import {
  CATEGORIES,
  WASTE_ITEMS,
  WasteCategory,
  WasteItem,
  CategoryInfo
} from './data';
import { sounds } from './utils/audio';
import WasteManualModal from './components/WasteManualModal';
import RubyText from './components/RubyText';
import {
  Flame,
  Sparkles,
  Recycle,
  Tv,
  TriangleAlert,
  Volume2,
  VolumeX,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  ArrowRight,
  Info,
  Undo2,
  ListRestart,
  Check,
  X,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Maps category to Lucide components for bins
const categoryIconMap: Record<WasteCategory, React.ComponentType<any>> = {
  BURNABLE: Flame,
  NON_BURNABLE: Sparkles,
  RECYCLABLE: Recycle,
  OVERSIZED: Tv,
  HAZARDOUS: TriangleAlert
};

// Cute, recognizable emojis for all items to fulfill the "pictures/illustrations" request
const itemEmojiMap: Record<string, string> = {
  'banana-peel': '🍌',
  'ceramic-plate': '🍽️',
  'pet-bottle': '🧴',
  'bicycle': '🚲',
  'dry-battery': '🔋',
  'leather-shoes': '👞',
  'spray-can': '💨',
  'cardboard': '📦',
  'aluminum-foil': '✨',
  'wooden-chair': '🪑',
  'mobile-battery': '🔌',
  'dirty-plastic-tray': '🍜',
  'incandescent-bulb': '💡',
  'newspaper': '📰',
  'glass-cup': '🥛',
  'umbrella': '☂️',
  'sofa': '🛋️',
  'fluorescent-tube': '🧪',
  'notebook': '📓',
  'led-light': '💡',
  'empty-can-beverage': '🥫',
  'mirror': '🪞',
  'pizza-box-dirty': '🍕',
  'hair-dryer': '💨',
  'blanket': '🛌',
  'disposable-body-warmer': '🔥',
  'ice-pack-gel': '❄️',
  'potato-chip-bag': '🥔',
  'cd-dvd': '💿',
  'video-tape': '磁',
  'credit-card': '💳',
  'gardening-soil': '🪴',
  'razor-blades': '🪒',
  'lighter-with-gas': '🔥',
  'aluminum-insulated-bag': '🛍️',
  'glass-baby-bottle': '🍼',
  'socks-worn': '🧦',
  'plastic-toy': '🧸',
  'tree-branches': '🌿',
  'dirty-canned-food': '🥫',
  'mirror-broken': '🪞',
  'umbrella-vinyl': '☔',
  'felt-tip-pen': '🖊️',
  'diaper-used': '👶',
  'diatomaceous-earth-mat': '🪨'
};

type GameState = 'START' | 'PLAYING' | 'SUMMARY';
type DifficultyFilter = 'ALL' | 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [gameLength, setGameLength] = useState<number>(10);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ALL');
  const [activeItems, setActiveItems] = useState<WasteItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, WasteCategory>>({});
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showFurigana, setShowFurigana] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gomi_show_furigana') === 'true';
    } catch {
      return false;
    }
  });
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  
  // Filtering results in summary screen
  const [summaryFilter, setSummaryFilter] = useState<'ALL' | 'CORRECT' | 'INCORRECT'>('ALL');
  
  // Animate the card movement on sort
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'down' | null>(null);

  // Load sound state on startup
  useEffect(() => {
    sounds.setMuted(isMuted);
  }, [isMuted]);

  // Persist furigana preference
  useEffect(() => {
    try {
      localStorage.setItem('gomi_show_furigana', String(showFurigana));
    } catch {}
  }, [showFurigana]);

  // Shuffles a copy of an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Start a new game session
  const startGame = () => {
    sounds.playClick();
    
    // First, filter items by difficulty if needed
    let pool = WASTE_ITEMS;
    if (difficultyFilter !== 'ALL') {
      pool = WASTE_ITEMS.filter(item => item.difficulty === difficultyFilter);
    }
    
    const shuffled = shuffleArray(pool);
    // Limit to the selected length (if selected length is greater than available, use all)
    const selectedLength = gameLength === -1 ? shuffled.length : Math.min(gameLength, shuffled.length);
    
    setActiveItems(shuffled.slice(0, selectedLength));
    setCurrentIndex(0);
    setUserAnswers({});
    setShowHint(false);
    setGameState('PLAYING');
  };

  // Handle mute toggle
  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    sounds.setMuted(newState);
    sounds.playClick();
  };

  // Sort current item to a specific category
  const handleSort = (category: WasteCategory) => {
    if (currentIndex >= activeItems.length) return;
    
    const currentItem = activeItems[currentIndex];
    sounds.playPop();

    // Record answer
    setUserAnswers(prev => ({
      ...prev,
      [currentItem.id]: category
    }));

    // Trigger swipe exit animation
    setSwipeDirection('down');

    // Proceed to next item after small delay for animation
    setTimeout(() => {
      setShowHint(false);
      setSwipeDirection(null);
      if (currentIndex < activeItems.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // If it's the last item, we still increment so all items are sorted
        setCurrentIndex(activeItems.length);
      }
    }, 150);
  };

  // Jump to specific item in the list (allows correction during play)
  const jumpToItem = (index: number) => {
    sounds.playClick();
    if (index >= 0 && index < activeItems.length) {
      setCurrentIndex(index);
      setShowHint(false);
    }
  };

  // Modify a previously made choice directly from the history table
  const handleModifyAnswer = (itemId: string, category: WasteCategory) => {
    sounds.playPop();
    setUserAnswers(prev => ({
      ...prev,
      [itemId]: category
    }));
  };

  // Complete game and view results
  const finishGame = () => {
    sounds.playFanfare();
    setGameState('SUMMARY');
    setSummaryFilter('ALL');
  };

  // Reset current game
  const resetGame = () => {
    sounds.playClick();
    setGameState('START');
    setActiveItems([]);
    setCurrentIndex(0);
    setUserAnswers({});
  };

  // Calculate results statistics
  const totalItems = activeItems.length;
  const sortedCount = Object.keys(userAnswers).length;
  const allSorted = sortedCount === totalItems;
  
  const correctCount = activeItems.reduce((acc, item) => {
    const userAns = userAnswers[item.id];
    return userAns === item.category ? acc + 1 : acc;
  }, 0);

  const scorePercentage = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;

  // Get score rank comment
  const getRankComment = () => {
    if (scorePercentage === 100) {
      return {
        title: '完全無欠の分別ゴッド！🏆✨',
        desc: '素晴らしい！超激ムズな罠もすべて見破り、全品目の分別に大正解しました！あなたの環境知識は本物のプロフェッショナルです。地球の未来はあなたに託されました！',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
      };
    } else if (scorePercentage >= 80) {
      return {
        title: 'エリートエコロジスト！🌟',
        desc: 'すばらしい好成績！複雑な例外ルールや引っ掛けゴミも、ほとんど見分けることができています。普段からゴミへの意識が本当に高いですね！',
        color: 'text-teal-700 bg-teal-50 border-teal-200'
      };
    } else if (scorePercentage >= 60) {
      return {
        title: '一般分別市民（上級）！🌱',
        desc: 'なかなかの腕前です！日常的なゴミの分別は完璧ですが、激ムズゴミの例外規定に少しだけ惑わされてしまったかも？解説を読んでレベルアップしましょう！',
        color: 'text-blue-700 bg-blue-50 border-blue-200'
      };
    } else if (scorePercentage >= 40) {
      return {
        title: '分別ビギナー（発展途上）！🔰',
        desc: 'ゴミのルールは思った以上に複雑ですね！特に使い捨てカイロや土など、迷いやすい品目がたくさん。もう一回遊んで、コツを掴みましょう！',
        color: 'text-amber-700 bg-amber-50 border-amber-200'
      };
    } else {
      return {
        title: 'のびしろ限界突破！🔥',
        desc: 'ゴミの分別には驚きのルールがいっぱい！これを機に、どんなゴミがどんな区分になるのか、最後の一覧解説でじっくり学習してみましょう！',
        color: 'text-rose-700 bg-rose-50 border-rose-200'
      };
    }
  };

  const rank = getRankComment();

  // Filter items in result screen
  const getFilteredResults = () => {
    return activeItems.filter(item => {
      const userAns = userAnswers[item.id];
      const isCorrect = userAns === item.category;
      if (summaryFilter === 'CORRECT') return isCorrect;
      if (summaryFilter === 'INCORRECT') return !isCorrect;
      return true;
    });
  };

  const currentItem = activeItems[currentIndex];
  const currentItemEmoji = currentItem ? (itemEmojiMap[currentItem.id] || '🗑️') : '🗑️';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all selection:bg-emerald-100 selection:text-emerald-900" id="app-root">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
            <Recycle className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 tracking-tight">ゴミ分別ゲーム</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase hidden sm:block">Eco-sorting Trainer v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-500 transition-all shadow-xs cursor-pointer"
            title={isMuted ? "ミュート解除" : "ミュート"}
            id="sound-toggle-btn"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Furigana Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowFurigana(!showFurigana);
            }}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              showFurigana
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
            title="難読漢字のよみかた（ふりがな）を切り替えます"
            id="furigana-toggle-btn"
          >
            <span className="text-sm font-mono leading-none">あ</span>
            <span>ふりがな: {showFurigana ? "オン" : "オフ"}</span>
          </button>

          {/* Manual Trigger */}
          <button
            onClick={() => { sounds.playClick(); setIsManualOpen(true); }}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 hover:border-emerald-200 text-emerald-700 font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            id="open-manual-btn"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">分別マニュアル</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* ==================== 1. START SCREEN ==================== */}
          {gameState === 'START' && (
            <motion.div
              key="start-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
              id="start-container"
            >
              {/* Graphic Banner with Generated 3D Recycling Bins Art */}
              <div className="relative max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200/60 shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch">
                
                {/* 3D Clay Rendering Hero Image */}
                <div className="w-full md:w-1/2 relative bg-slate-100 min-h-[220px] md:min-h-full overflow-hidden flex items-center justify-center">
                  <img 
                    src="/src/assets/images/waste_sorting_hero_1782279198858.jpg" 
                    alt="Recycling Bins Illustration" 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    id="hero-illustration"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-white/10" />
                </div>

                {/* Content Panel */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center text-left space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    地球を救う分別トレーニング
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                    ゴミを正しく分別して<br />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">クリーンな未来をつくろう！</span>
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    私たちの身の回りにある様々なゴミ。驚くような難解例外ルールがあるのをご存知ですか？
                    可愛いゴミたちの表情とヒントを頼りに、パーフェクトを目指しましょう！
                  </p>
                  
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-500">
                    <span className="font-bold text-emerald-600">NEW!</span>
                    <span>超難解な「激ムズ」品目＆難易度選択を追加！</span>
                  </div>
                </div>
              </div>

              {/* Game Settings */}
              <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white border border-slate-100 shadow-md space-y-6 text-left">
                
                {/* 1. Difficulty Level Selector */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1">
                    <span>1. 難易度を選択してください</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { key: 'ALL', label: 'すべて', desc: 'ミックス', color: 'border-slate-200 text-slate-700 hover:border-slate-300' },
                      { key: 'EASY', label: 'かんたん', desc: '基本ごみ', color: 'border-emerald-200 bg-emerald-50/10 text-emerald-700 hover:border-emerald-300' },
                      { key: 'MEDIUM', label: 'ふつう', desc: '一般レベル', color: 'border-blue-200 bg-blue-50/10 text-blue-700 hover:border-blue-300' },
                      { key: 'HARD', label: 'むずかしい', desc: '迷いやすい', color: 'border-amber-200 bg-amber-50/10 text-amber-700 hover:border-amber-300' },
                      { key: 'INSANE', label: '激ムズ 🌶️', desc: '超例外ルール', color: 'border-rose-300 bg-rose-50/20 text-rose-700 hover:border-rose-400 font-bold' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => { sounds.playClick(); setDifficultyFilter(opt.key as DifficultyFilter); }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          difficultyFilter === opt.key
                            ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500 font-bold shadow-xs'
                            : opt.color
                        }`}
                      >
                        <div className="text-sm font-bold">{opt.label}</div>
                        <div className="text-[10px] opacity-75 mt-0.5 font-normal">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Game Length Selector */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    2. 出題問題数を選択してください
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { value: 5, label: '5問', desc: '超高速プレイ' },
                      { value: 10, label: '10問', desc: 'おすすめ' },
                      { value: -1, label: '全問挑戦', desc: 'とことん極める' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { sounds.playClick(); setGameLength(opt.value); }}
                        className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          gameLength === opt.value
                            ? 'ring-2 ring-emerald-500 bg-emerald-50/10 border-emerald-500 font-bold shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <div className="text-sm font-bold">{opt.label}</div>
                        <div className="text-[10px] opacity-70 mt-0.5 font-normal">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories Overview */}
                <div className="border-t border-slate-100 pt-5">
                  <div className="text-xs font-bold text-slate-400 mb-3">5つの分別区分：</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.values(CATEGORIES).map((cat) => {
                      const CatIcon = categoryIconMap[cat.id];
                      return (
                        <div key={cat.id} className={`flex items-center gap-1.5 p-2 rounded-xl border ${cat.bgColor} ${cat.borderColor} ${cat.textColor} text-xs font-semibold`}>
                          <CatIcon className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            <RubyText text={cat.jpName} enabled={showFurigana} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Start Game Button */}
                <button
                  onClick={startGame}
                  className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
                  id="start-game-btn"
                >
                  <Play className="w-5 h-5 fill-current" />
                  分別ゲーム スタート！
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================== 2. PLAYING SCREEN ==================== */}
          {gameState === 'PLAYING' && (
            <motion.div
              key="playing-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
              id="game-board-container"
            >
              {/* Progress Bar & Header Stats */}
              <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <button
                  onClick={resetGame}
                  className="px-3 py-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs font-medium text-slate-500 flex items-center gap-1 transition-all cursor-pointer"
                  id="abort-game-btn"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  最初に戻る
                </button>
                
                {/* Progress Indicators */}
                <div className="flex-1 max-w-md flex items-center gap-3">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (sortedCount / totalItems) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-mono shrink-0">
                    {sortedCount} / {totalItems} 個
                  </span>
                </div>

                {/* Level Display */}
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono">
                  {currentIndex < totalItems ? `問題 ${currentIndex + 1}` : '仕分け完了'}
                </span>
              </div>

              {/* Active Trash Box Area */}
              <div className="relative min-h-[340px] flex items-center justify-center py-6 bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-3xl border border-slate-200/30 p-4">
                
                <AnimatePresence mode="wait">
                  {currentIndex < totalItems ? (
                    <motion.div
                      key={currentItem.id}
                      initial={{ opacity: 0, scale: 0.9, y: 15, rotate: -2 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        rotate: 0,
                        x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        y: swipeDirection === 'down' ? 60 : -40,
                        transition: { duration: 0.15 }
                      }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="w-full max-w-md rounded-3xl border border-slate-200/55 bg-white p-6 sm:p-8 shadow-lg flex flex-col items-center text-center space-y-5 relative overflow-hidden"
                      id="current-trash-card"
                    >
                      {/* Decorative background circle */}
                      <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-slate-50 blur-xl opacity-80" />

                      {/* Difficulty Tag */}
                      <span className={`absolute top-4 right-4 text-[10px] font-black px-3 py-1 rounded-full ${
                        currentItem.difficulty === 'EASY' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        currentItem.difficulty === 'MEDIUM' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        currentItem.difficulty === 'HARD' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse'
                      }`}>
                        {currentItem.difficulty === 'EASY' ? 'かんたん' :
                         currentItem.difficulty === 'MEDIUM' ? 'ふつう' :
                         currentItem.difficulty === 'HARD' ? 'むずかしい' : '🌶️ 激ムズ'}
                      </span>

                      {/* Main Cute emoji picture instead of abstract icons */}
                      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-50 to-slate-100/50 border border-slate-200/50 flex items-center justify-center text-6xl shadow-inner select-none relative z-10 transform hover:scale-105 transition-transform duration-300">
                        {currentItemEmoji}
                      </div>

                      {/* Name & Details */}
                      <div className="space-y-1.5 relative z-10">
                        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">
                          <RubyText text={currentItem.name} enabled={showFurigana} />
                        </h3>
                        <p className="text-xs text-slate-400">
                          このゴミはどのゴミ箱に入れるのが正しいかな？
                        </p>
                      </div>

                      {/* Hint Toggle */}
                      <div className="w-full border-t border-slate-100 pt-3 relative z-10">
                        <AnimatePresence mode="wait">
                          {showHint ? (
                            <motion.div
                              key="hint-open"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-amber-800 bg-amber-50 border border-amber-100 p-3 rounded-2xl leading-relaxed text-left shadow-xs"
                            >
                              💡 <span className="font-semibold text-amber-900">ヒント:</span> <RubyText text={currentItem.hint} enabled={showFurigana} />
                            </motion.div>
                          ) : (
                            <button
                              onClick={() => { sounds.playClick(); setShowHint(true); }}
                              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mx-auto transition-colors px-4 py-1.5 rounded-xl hover:bg-emerald-50 cursor-pointer"
                              id="show-hint-btn"
                            >
                              <Info className="w-3.5 h-3.5" />
                              ヒントを表示する
                            </button>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    /* All Items Sorted Card */
                    <motion.div
                      key="all-sorted-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-8 space-y-5 max-w-sm rounded-3xl bg-white border border-slate-200/50 shadow-lg"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">すべての仕分けが完了！</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          仕分けリストを確認して、問題なければ答え合わせをしてみましょう。
                        </p>
                      </div>

                      <button
                        onClick={finishGame}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all animate-bounce-subtle flex items-center justify-center gap-2 cursor-pointer"
                        id="reveal-answers-card-btn"
                      >
                        <Award className="w-5 h-5" />
                        答え合わせをする！
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bins Bar for Sorting */}
              {currentIndex < totalItems && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                    入れるゴミ箱を選んでタップ（仕分けられます）
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(Object.keys(CATEGORIES) as WasteCategory[]).map((catKey) => {
                      const cat = CATEGORIES[catKey];
                      const BinIcon = categoryIconMap[catKey];
                      
                      // Count of items in this bin
                      const binCount = activeItems.filter(item => userAnswers[item.id] === catKey).length;

                      return (
                        <button
                          key={catKey}
                          onClick={() => handleSort(catKey)}
                          className={`group rounded-2xl p-4 border flex flex-col items-center text-center transition-all relative overflow-hidden cursor-pointer ${
                            catKey === 'BURNABLE' ? 'hover:border-red-300 hover:bg-red-50/10 border-slate-200/60' :
                            catKey === 'NON_BURNABLE' ? 'hover:border-blue-300 hover:bg-blue-50/10 border-slate-200/60' :
                            catKey === 'RECYCLABLE' ? 'hover:border-emerald-300 hover:bg-emerald-50/10 border-slate-200/60' :
                            catKey === 'OVERSIZED' ? 'hover:border-amber-400 hover:bg-amber-50/10 border-slate-200/60' :
                            'hover:border-purple-300 hover:bg-purple-50/10 border-slate-200/60'
                          } bg-white shadow-xs hover:shadow-md`}
                          id={`bin-btn-${catKey}`}
                        >
                          {/* Colored Top Lip */}
                          <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${cat.color}`} />
                          
                          {/* Bin Icon */}
                          <div className={`p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-transparent transition-all mb-2 ${
                            catKey === 'BURNABLE' ? 'group-hover:text-red-500 group-hover:scale-110' :
                            catKey === 'NON_BURNABLE' ? 'group-hover:text-blue-500 group-hover:scale-110' :
                            catKey === 'RECYCLABLE' ? 'group-hover:text-emerald-500 group-hover:scale-110' :
                            catKey === 'OVERSIZED' ? 'group-hover:text-amber-700 group-hover:scale-110' :
                            'group-hover:text-purple-500 group-hover:scale-110'
                          }`}>
                            <BinIcon className="w-5 h-5 stroke-[2]" />
                          </div>

                          {/* Bin Label */}
                          <span className="font-bold text-xs text-slate-700 tracking-tight leading-tight">
                            <RubyText text={cat.jpName} enabled={showFurigana} />
                          </span>
                          
                          {/* Items sorted count badge */}
                          {binCount > 0 && (
                            <span className="absolute bottom-1 right-2 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                              {binCount}個
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ==================== PLAYING RE-CORRECTION UTILITY (仕分けリスト) ==================== */}
              {sortedCount > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="text-xs font-bold text-slate-600">あなたの仕分けリスト</h4>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      （答え合わせする前ならいつでも修正できます！）
                    </span>
                  </div>

                  {/* Scrollable list of items currently sorted */}
                  <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
                    {activeItems.map((item, idx) => {
                      const ans = userAnswers[item.id];
                      const emoji = itemEmojiMap[item.id] || '🗑️';
                      
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 text-xs transition-all ${
                            idx === currentIndex ? 'bg-emerald-50/30 font-semibold' : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-slate-300 w-4">
                              {idx + 1}
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-lg shadow-xs select-none">
                              {emoji}
                            </div>
                            <span className="text-slate-700 font-medium">
                              <RubyText text={item.name} enabled={showFurigana} />
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {ans ? (
                              <div className="flex items-center gap-1.5">
                                {/* Small dropdown to reassign */}
                                <select
                                  value={ans}
                                  onChange={(e) => handleModifyAnswer(item.id, e.target.value as WasteCategory)}
                                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold focus:outline-none cursor-pointer ${
                                    ans === 'BURNABLE' ? 'bg-red-50 text-red-600 border-red-100' :
                                    ans === 'NON_BURNABLE' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    ans === 'RECYCLABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    ans === 'OVERSIZED' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-purple-50 text-purple-600 border-purple-100'
                                  }`}
                                >
                                  {(Object.keys(CATEGORIES) as WasteCategory[]).map((catKey) => (
                                    <option key={catKey} value={catKey} className="bg-white text-slate-700">
                                      {CATEGORIES[catKey].jpName}
                                    </option>
                                  ))}
                                </select>
                                
                                <button
                                  onClick={() => jumpToItem(idx)}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="再表示してやり直す"
                                >
                                  <Undo2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => jumpToItem(idx)}
                                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-emerald-500 hover:text-white transition-all text-slate-500 text-[10px] font-bold cursor-pointer"
                              >
                                分別する
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Manual Finish trigger */}
                  {allSorted && (
                    <div className="pt-2">
                      <button
                        onClick={finishGame}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                        id="submit-answers-list-btn"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        すべての仕分けを終えて答え合わせに進む！
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== 3. SUMMARY SCREEN (答え合わせ) ==================== */}
          {gameState === 'SUMMARY' && (
            <motion.div
              key="summary-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
              id="summary-container"
            >
              {/* Score card / Summary Header */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
                
                {/* Score gauge */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-slate-100"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="54"
                      className={`stroke-current ${
                        scorePercentage >= 80 ? 'text-emerald-500' :
                        scorePercentage >= 50 ? 'text-amber-500' :
                        'text-rose-500'
                      }`}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 54}
                      initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - scorePercentage / 100) }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Center Score Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800 tracking-tight leading-none font-mono">
                      {correctCount}
                    </span>
                    <span className="text-slate-300 text-xs my-0.5">/</span>
                    <span className="text-slate-400 text-sm leading-none font-mono">
                      {totalItems}問
                    </span>
                  </div>
                </div>

                {/* Score Commentary */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className={`px-4 py-2 rounded-2xl border ${rank.color} inline-block font-extrabold text-base`}>
                    <RubyText text={rank.title} enabled={showFurigana} />
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <RubyText text={rank.desc} enabled={showFurigana} />
                  </p>
                  
                  <div className="text-xs text-slate-400">
                    難易度モード: <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{difficultyFilter === 'ALL' ? 'すべて' : difficultyFilter}</span>
                    <span className="mx-2">|</span>
                    正解率: <span className="font-bold text-slate-600 font-mono text-sm">{scorePercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Answers & Detailed Explanations section */}
              <div className="space-y-4">
                
                {/* Filters and Section title */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                  <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    分別結果と解説 (答え合わせ)
                  </h3>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { key: 'ALL', label: `すべて (${totalItems})` },
                      { key: 'CORRECT', label: `正解 (${correctCount})` },
                      { key: 'INCORRECT', label: `不正解 (${totalItems - correctCount})` }
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => { sounds.playClick(); setSummaryFilter(btn.key as any); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          summaryFilter === btn.key
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of details */}
                <div className="space-y-4">
                  {getFilteredResults().map((item, index) => {
                    const userAns = userAnswers[item.id];
                    const isCorrect = userAns === item.category;
                    const correctCat = CATEGORIES[item.category];
                    const userCat = CATEGORIES[userAns];
                    const emoji = itemEmojiMap[item.id] || '🗑️';
                    const CorrectIcon = categoryIconMap[item.category];
                    const UserIcon = userAns ? categoryIconMap[userAns] : HelpCircle;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all shadow-xs relative overflow-hidden ${
                          isCorrect ? 'border-emerald-100/80 bg-white' : 'border-rose-100/80 bg-white'
                        }`}
                      >
                        {/* Status bar */}
                        <div className={`absolute top-0 inset-x-0 h-1.5 ${
                          isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />

                        {/* Top layout */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100/60">
                          {/* Item information */}
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-50 to-slate-100/50 border border-slate-200/40 flex items-center justify-center text-3xl shadow-xs shrink-0 select-none">
                              {emoji}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-lg leading-snug">
                                <RubyText text={item.name} enabled={showFurigana} />
                              </h4>
                              <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                                item.difficulty === 'EASY' ? 'bg-emerald-50 text-emerald-600' :
                                item.difficulty === 'MEDIUM' ? 'bg-blue-50 text-blue-600' :
                                item.difficulty === 'HARD' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                              }`}>
                                {item.difficulty === 'EASY' ? 'かんたん' :
                                 item.difficulty === 'MEDIUM' ? 'ふつう' :
                                 item.difficulty === 'HARD' ? 'むずかしい' : '激ムズ 🌶️'}
                              </span>
                            </div>
                          </div>

                          {/* Verdict */}
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                正解
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-500 border border-rose-100">
                                <X className="w-3.5 h-3.5 stroke-[3]" />
                                不正解
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Middle layout (Showing choices) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {/* User Choice */}
                          <div className={`p-3.5 rounded-2xl border ${
                            isCorrect ? 'bg-slate-50/50 border-slate-100' : 'bg-rose-50/15 border-rose-100/40'
                          } flex items-center justify-between`}>
                            <span className="text-xs text-slate-400 font-medium">あなたの回答:</span>
                            {userCat ? (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${userCat.bgColor} ${userCat.borderColor} ${userCat.textColor}`}>
                                <UserIcon className="w-3.5 h-3.5" />
                                <RubyText text={userCat.jpName} enabled={showFurigana} />
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-xl">未回答</span>
                            )}
                          </div>

                          {/* Correct Choice */}
                          <div className="p-3.5 rounded-2xl border bg-emerald-50/15 border-emerald-100/40 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">正しい分別:</span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${correctCat.bgColor} ${correctCat.borderColor} ${correctCat.textColor}`}>
                              <CorrectIcon className="w-3.5 h-3.5" />
                              <RubyText text={correctCat.jpName} enabled={showFurigana} />
                            </span>
                          </div>
                        </div>

                        {/* Explanation Text */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60">
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                            分別豆知識 / 解説
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            <RubyText text={item.explanation} enabled={showFurigana} />
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}

                  {getFilteredResults().length === 0 && (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-xs">
                      <p className="text-slate-400 text-sm">表示する項目がありません。</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Bottom Actions */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetGame}
                  className="flex-1 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-sm text-slate-600 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="play-again-start-btn"
                >
                  <ListRestart className="w-4 h-4 text-slate-400" />
                  もう一度遊ぶ（スタートに戻る）
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Manual Modal Component */}
      <WasteManualModal
        isOpen={isManualOpen}
        onClose={() => { sounds.playClick(); setIsManualOpen(false); }}
        showFurigana={showFurigana}
      />
    </div>
  );
}
