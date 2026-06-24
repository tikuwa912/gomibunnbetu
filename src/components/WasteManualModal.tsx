import React, { useState } from 'react';
import { CATEGORIES, WASTE_ITEMS, WasteCategory } from '../data';
import { X, Search, Info, Flame, Sparkles, Recycle, Tv, TriangleAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RubyText from './RubyText';

interface WasteManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  showFurigana?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Flame,
  Sparkles,
  Recycle,
  Tv,
  TriangleAlert
};

export default function WasteManualModal({ isOpen, onClose, showFurigana = false }: WasteManualModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | 'ALL'>('ALL');

  if (!isOpen) return null;

  // Filter items based on search and category
  const filteredItems = WASTE_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.hint.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100"
          id="waste-manual-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-emerald-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-white">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">ごみ分別マニュアル</h3>
                <p className="text-xs text-slate-500 mt-0.5">迷ったらここをチェック！正しい分別の仕方を学びましょう。</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
              id="close-manual-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ゴミの名前、キーワードで検索... (例: アルミ缶, お皿)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  クリア
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                すべて ({WASTE_ITEMS.length})
              </button>
              {(Object.keys(CATEGORIES) as WasteCategory[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const count = WASTE_ITEMS.filter(item => item.category === catKey).length;
                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      selectedCategory === catKey
                        ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <span><RubyText text={cat.jpName} enabled={showFurigana} /></span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Category Cards Overview (Show when ALL is selected or no active search) */}
            {selectedCategory === 'ALL' && !searchQuery && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(CATEGORIES) as WasteCategory[]).map((catKey) => {
                  const cat = CATEGORIES[catKey];
                  const IconComponent = iconMap[cat.iconName] || Info;
                  return (
                    <div
                      key={catKey}
                      onClick={() => setSelectedCategory(catKey)}
                      className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-md cursor-pointer transition-all bg-slate-50/40 hover:bg-white text-left group"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-sm`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                          <RubyText text={cat.jpName} enabled={showFurigana} />
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        <RubyText text={cat.description} enabled={showFurigana} />
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Category Detail Focus */}
            {selectedCategory !== 'ALL' && (
              <div className={`p-5 rounded-2xl border ${CATEGORIES[selectedCategory].borderColor} ${CATEGORIES[selectedCategory].bgColor} flex flex-col md:flex-row gap-4 items-start`}>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${CATEGORIES[selectedCategory].color} text-white shadow-md`}>
                  {(() => {
                    const Icon = iconMap[CATEGORIES[selectedCategory].iconName] || Info;
                    return <Icon className="w-8 h-8" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <RubyText text={CATEGORIES[selectedCategory].jpName} enabled={showFurigana} />
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{CATEGORIES[selectedCategory].name}</span>
                  </h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    <RubyText text={CATEGORIES[selectedCategory].description} enabled={showFurigana} />
                  </p>
                </div>
              </div>
            )}

            {/* Items Grid */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {selectedCategory === 'ALL' ? 'ゴミ品目一覧' : <><RubyText text={CATEGORIES[selectedCategory].jpName} enabled={showFurigana} />の代表品目</>} ({filteredItems.length}件)
              </h4>

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => {
                    const itemCat = CATEGORIES[item.category];
                    const CatIcon = iconMap[itemCat.iconName] || Info;
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all hover:shadow-sm bg-white flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800 text-base">
                              <RubyText text={item.name} enabled={showFurigana} />
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${itemCat.color} text-white shadow-xs`}>
                              <CatIcon className="w-3 h-3" />
                              <RubyText text={itemCat.jpName} enabled={showFurigana} />
                            </span>
                          </div>
                          {item.hint && (
                            <p className="text-xs text-slate-400 bg-slate-50 p-2 rounded-lg mb-2 italic">
                              💡 ヒント: <RubyText text={item.hint} enabled={showFurigana} />
                            </p>
                          )}
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <RubyText text={item.explanation} enabled={showFurigana} />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm">該当するゴミが見つかりませんでした。</p>
                  <p className="text-slate-400 text-xs mt-1">キーワードを変えて探してみてください。</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all shadow-sm"
              id="close-manual-footer-btn"
            >
              閉じる
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
