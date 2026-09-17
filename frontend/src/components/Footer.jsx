import React from 'react';
import { Activity, ShieldCheck, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-lg mb-3">
              <Activity className="w-5 h-5 text-blue-400" />
              <span>MedCost<span className="text-blue-400">.AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Intelligent healthcare insurance cost estimation powered by calibrated machine learning. Providing upfront pricing transparency and personal budgeting insights.
            </p>
            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <span>Zero-Data Retention Architecture</span>
            </div>
          </div>

          {/* Privacy Posture */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Data Ethics & Privacy Policy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We operate under strict data minimization standards. Your inputs are evaluated strictly in temporary server memory (RAM) and immediately discarded. We never maintain a database of patient records, never track you across sessions, and never sell information to brokers or marketers.
            </p>
          </div>

          {/* Consumer Notice */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Consumer Advisory Notice</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              MedCost.AI generates indicative statistical estimates based on historical healthcare benchmarks. These estimates are intended solely for personal planning and budgeting. They do not constitute an official insurance policy, underwriting guarantee, or certified medical counsel.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} MedCost.AI. All rights reserved.
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <span>FastAPI Engine</span>
            <span>•</span>
            <span>React + Vite Interface</span>
            <span>•</span>
            <span>Zero-Persistence Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
