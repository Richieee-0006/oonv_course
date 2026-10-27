import React, { useState, useMemo } from 'react';
import {
  dragDropExercises,
  CategorizationTask,
  MatchingTask
} from '../../data/dragDropData';
import { storageService } from '../../services/storageService';
import {
  CheckCircle2,
  XCircle,
  GripVertical,
  Link2,
  Shuffle,
  HelpCircle
} from 'lucide-react';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const Mode5DragDrop: React.FC = () => {
  const [exerciseIdx, setExerciseIdx] = useState<number>(0);
  const [seed, setSeed] = useState<number>(1);

  // State for Categorization Task: itemId -> bucketId
  const [placedItems, setPlacedItems] = useState<Record<string, string>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [catChecked, setCatChecked] = useState<boolean>(false);

  // State for Matching Task: leftPairId -> rightPairId
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchChecked, setMatchChecked] = useState<boolean>(false);

  const currentExercise = dragDropExercises[exerciseIdx];

  const handleReset = () => {
    setPlacedItems({});
    setSelectedItemId(null);
    setCatChecked(false);
    setMatchedPairs({});
    setSelectedLeftId(null);
    setMatchChecked(false);
    setSeed(s => s + 1);
  };

  // Shuffled items for Categorization
  const shuffledCatItems = useMemo(() => {
    if (currentExercise.type !== 'categorize') return [];
    return shuffle(currentExercise.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise.id, seed]);

  // Shuffled right-side items for Matching
  const shuffledRightPairs = useMemo(() => {
    if (currentExercise.type !== 'matching') return [];
    return shuffle(currentExercise.pairs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise.id, seed]);

  // ========================================================
  // CATEGORIZATION HANDLERS (Drag & Drop + Click-to-Assign)
  // ========================================================
  const handleDropToBucket = (bucketId: string, itemId: string) => {
    if (!itemId) return;
    setPlacedItems(prev => ({ ...prev, [itemId]: bucketId }));
    setSelectedItemId(null);
    setCatChecked(false);
  };

  const handleRemoveFromBucket = (itemId: string) => {
    setPlacedItems(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setCatChecked(false);
  };

  const handleCheckCategorization = (task: CategorizationTask) => {
    setCatChecked(true);
    const allCorrect = task.items.every(it => placedItems[it.id] === it.targetBucketId);
    if (allCorrect) {
      storageService.markCompleted(`dragdrop_${task.id}`);
    }
  };

  // ========================================================
  // MATCHING HANDLERS (Click or Drag Left -> Right)
  // ========================================================
  const handleConnectPair = (leftId: string, rightId: string) => {
    if (!leftId || !rightId) return;
    setMatchedPairs(prev => {
      const next = { ...prev };
      // Remove any existing link to this rightId so 1-to-1 holds
      for (const k of Object.keys(next)) {
        if (next[k] === rightId) delete next[k];
      }
      next[leftId] = rightId;
      return next;
    });
    setSelectedLeftId(null);
    setMatchChecked(false);
  };

  const handleCheckMatching = (task: MatchingTask) => {
    setMatchChecked(true);
    const allCorrect = task.pairs.every(p => matchedPairs[p.id] === p.id);
    if (allCorrect) {
      storageService.markCompleted(`dragdrop_${task.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {dragDropExercises.map((ex, idx) => {
          const isDone = !!storageService.getProgress()[`dragdrop_${ex.id}`];
          return (
            <button
              key={ex.id}
              onClick={() => {
                setExerciseIdx(idx);
                handleReset();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                exerciseIdx === idx
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{ex.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {currentExercise.type === 'categorize' ? 'Drag & Drop Roztřiďování' : 'Interaktivní Spojovačka'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              {currentExercise.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {currentExercise.description}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Zamíchat a resetovat</span>
          </button>
        </div>

        {/* ============================================================
            RENDER: CATEGORIZATION (DRAG & DROP INTO BUCKETS)
           ============================================================ */}
        {currentExercise.type === 'categorize' && (() => {
          const unplaced = shuffledCatItems.filter(it => !placedItems[it.id]);

          return (
            <div className="space-y-6">
              {/* Unplaced Pool */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 flex items-center justify-between">
                  <span>Kartičky k roztřídění ({unplaced.length} zbývá):</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Tip: Přetáhni myší do koše níže, nebo klikni na kartičku a pak na cílový koš
                  </span>
                </div>

                {unplaced.length === 0 ? (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold py-2">
                    Všechny kartičky jsou umístěné v koších! Klikni dole na „Zkontrolovat roztřídění“.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {unplaced.map(it => {
                      const isSelected = selectedItemId === it.id;
                      return (
                        <div
                          key={it.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', it.id);
                            setSelectedItemId(it.id);
                          }}
                          onClick={() => setSelectedItemId(isSelected ? null : it.id)}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing flex items-center space-x-1.5 transition-all select-none ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400 shadow-md'
                              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                          }`}
                        >
                          <GripVertical className="w-3.5 h-3.5 opacity-50" />
                          <span>{it.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Target Buckets */}
              <div className={`grid grid-cols-1 ${
                currentExercise.buckets.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'
              } gap-4`}>
                {currentExercise.buckets.map(bucket => {
                  const bucketItems = currentExercise.items.filter(it => placedItems[it.id] === bucket.id);
                  return (
                    <div
                      key={bucket.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const draggedId = e.dataTransfer.getData('text/plain') || selectedItemId;
                        if (draggedId) handleDropToBucket(bucket.id, draggedId);
                      }}
                      onClick={() => {
                        if (selectedItemId) {
                          handleDropToBucket(bucket.id, selectedItemId);
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 border-dashed min-h-[210px] flex flex-col justify-between transition-all ${
                        selectedItemId
                          ? 'border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20 cursor-pointer'
                          : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50'
                      }`}
                    >
                      <div>
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {bucket.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {bucket.subtitle}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {bucketItems.map(it => {
                            const isCorrect = it.targetBucketId === bucket.id;
                            let cardStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                            if (catChecked) {
                              cardStyle = isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200';
                            }

                            return (
                              <div
                                key={it.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromBucket(it.id);
                                }}
                                title="Kliknutím vrátíš kartičku zpět"
                                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${cardStyle}`}
                              >
                                <div className="flex items-center justify-between font-semibold">
                                  <span>{it.label}</span>
                                  {catChecked && (
                                    isCorrect
                                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                      : <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                  )}
                                </div>
                                {catChecked && (
                                  <p className="text-[11px] mt-1 opacity-90 font-normal">
                                    {it.explanation}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {bucketItems.length === 0 && (
                        <div className="text-center py-8 text-xs text-slate-400">
                          Sem přetáhni nebo kliknutím vlož kartičky
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleCheckCategorization(currentExercise)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zkontrolovat roztřídění</span>
                </button>

                <button
                  onClick={() => {
                    const solved: Record<string, string> = {};
                    currentExercise.items.forEach(it => {
                      solved[it.id] = it.targetBucketId;
                    });
                    setPlacedItems(solved);
                    setCatChecked(true);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ukázat správné roztřídění</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* ============================================================
            RENDER: MATCHING (CONNECT LEFT & RIGHT PAIRS)
           ============================================================ */}
        {currentExercise.type === 'matching' && (() => {
          return (
            <div className="space-y-6">
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/60 text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Link2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>
                  <strong>Jak spojovat:</strong> Klikni na pojem v levém sloupci (nebo ho přetáhni myší) a pak klikni na odpovídající definici / C# kód v pravém sloupci.
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                    Pojem / Návrhový vzor / Klíčové slovo
                  </div>
                  {currentExercise.pairs.map((p, idx) => {
                    const isSelected = selectedLeftId === p.id;
                    const connectedRightId = matchedPairs[p.id];
                    const isCorrect = connectedRightId === p.id;

                    let boxStyle = 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white';
                    if (isSelected) {
                      boxStyle = 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400';
                    } else if (matchChecked && connectedRightId) {
                      boxStyle = isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200';
                    } else if (connectedRightId) {
                      boxStyle = 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-900 dark:text-indigo-200';
                    }

                    return (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', p.id);
                          setSelectedLeftId(p.id);
                        }}
                        onClick={() => setSelectedLeftId(isSelected ? null : p.id)}
                        className={`p-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${boxStyle}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-mono">{p.leftText}</span>
                        </div>
                        {connectedRightId && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                            Spojeno #{currentExercise.pairs.findIndex(x => x.id === p.id) + 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right Column */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                    C# Implementace / Význam ke zkoušce
                  </div>
                  {shuffledRightPairs.map((rightItem) => {
                    // Find which left item is connected to this rightItem
                    const connectedLeftId = Object.keys(matchedPairs).find(
                      leftId => matchedPairs[leftId] === rightItem.id
                    );
                    const connectedLeftIndex = connectedLeftId
                      ? currentExercise.pairs.findIndex(x => x.id === connectedLeftId) + 1
                      : null;
                    const connectedLeftObj = connectedLeftId
                      ? currentExercise.pairs.find(x => x.id === connectedLeftId)
                      : null;
                    const isCorrect = connectedLeftId === rightItem.id;

                    let boxStyle = 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400';
                    if (matchChecked && connectedLeftId) {
                      boxStyle = isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200';
                    } else if (connectedLeftId) {
                      boxStyle = 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 text-slate-900 dark:text-white';
                    }

                    return (
                      <div
                        key={rightItem.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const leftId = e.dataTransfer.getData('text/plain') || selectedLeftId;
                          if (leftId) handleConnectPair(leftId, rightItem.id);
                        }}
                        onClick={() => {
                          if (selectedLeftId) {
                            handleConnectPair(selectedLeftId, rightItem.id);
                          } else if (connectedLeftId) {
                            // Unlink on click if nothing selected
                            setMatchedPairs(prev => {
                              const next = { ...prev };
                              delete next[connectedLeftId];
                              return next;
                            });
                            setMatchChecked(false);
                          }
                        }}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${boxStyle}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono leading-relaxed">{rightItem.rightText}</span>
                          {connectedLeftIndex && (
                            <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono font-bold text-[10px] flex-shrink-0">
                              ← #{connectedLeftIndex} ({connectedLeftObj?.leftText.split(' ')[0]})
                            </span>
                          )}
                        </div>

                        {matchChecked && connectedLeftId && (
                          <div className="flex items-start space-x-1.5 pt-1 text-[11px] border-t border-slate-200/60 dark:border-slate-800/60">
                            {isCorrect ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                            )}
                            <span>{rightItem.explanation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleCheckMatching(currentExercise)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zkontrolovat spojovačku</span>
                </button>

                <button
                  onClick={() => {
                    const solved: Record<string, string> = {};
                    currentExercise.pairs.forEach(p => {
                      solved[p.id] = p.id;
                    });
                    setMatchedPairs(solved);
                    setMatchChecked(true);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ukázat správné dvojice</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
