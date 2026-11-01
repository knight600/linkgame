/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, X, CornerDownRight, Zap, Flame, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">連連看核心玩法規則</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm text-slate-300">
          {/* Rule 1: Connection limits */}
          <div>
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <CornerDownRight className="w-4 h-4 text-emerald-400" />
              <span>「不超過兩個轉彎」消除原則</span>
            </h3>
            <p className="text-slate-400 leading-relaxed mb-3">
              點擊兩個圖案相同的方塊，若兩者之間可以透過水平或垂直的折線相連，且<strong>折角不超過 2 個（即最多 3 段直線）</strong>，中間無其他方塊阻擋，即可順利消除！
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="font-bold text-emerald-400 mb-1">0 折 · 直線相連</div>
                <div className="text-slate-400">兩方塊同行或同列，中間無任何阻擋，直接一線貫通。</div>
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="font-bold text-sky-400 mb-1">1 折 · L 型拐角</div>
                <div className="text-slate-400">直角轉一個彎，該交會轉折點必須是空白處。</div>
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="font-bold text-amber-400 mb-1">2 折 · 繞道外圍/Z型</div>
                <div className="text-slate-400">最多轉兩個彎，亦可沿著最外側棋盤邊界繞過障礙。</div>
              </div>
            </div>
          </div>

          {/* Rule 2: Combos */}
          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>連擊加分系統 (Combo)</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              每次消除後，若在 <strong>3.5 秒內</strong> 迅速完成下一次消除，即可觸發連擊 (Combo)。連擊數越高，單次得分加成與音效音調越高，是衝擊最高分的關鍵技巧！
            </p>
          </div>

          {/* Rule 3: Deadlock & Shuffle */}
          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>智能死局偵測與輔助道具</span>
            </h3>
            <ul className="space-y-2 text-slate-400 list-disc list-inside">
              <li>
                <strong>自動重排：</strong>若盤面上已無任何可連接的配對，系統會自動重新洗牌，絕不會陷入死局卡關。
              </li>
              <li>
                <strong>提示功能：</strong>消耗一次提示，系統會立即為你高亮一組當前可連線的方塊。
              </li>
              <li>
                <strong>手動洗牌：</strong>當找不到好路徑時，隨時手動點擊洗牌重整盤面。
              </li>
            </ul>
          </div>

          {/* Rule 4: Scoring */}
          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>過關結算與星級評價</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              清空全盤即算通關！結算時將獲得剩餘時間獎勵（剩餘秒數 × 難度倍率）。剩餘時間超過 50% 且具備高連擊即可獲得三星卓越評價，並自動載入至本機最高分榮譽榜！
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            我知道了，開始連線！
          </button>
        </div>
      </div>
    </div>
  );
};
