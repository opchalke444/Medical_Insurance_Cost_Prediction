import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white py-14 sm:py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Consumer Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Intelligent Healthcare Expense Forecasting</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Estimate Your Medical Insurance Costs <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              With Predictive Precision
            </span>
          </h1>

          {/* Value Proposition */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Get an instant, data-driven estimate of annual health insurance premiums based on key clinical and demographic indicators. 100% confidential and free to use with zero data retention.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#estimator"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Calculate My Estimate</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="#factors"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 shadow-2xs transition-all"
            >
              <span>Explore Cost Drivers</span>
            </a>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-2xl font-bold text-slate-900">1,300+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Clinical Profiles Analyzed</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-2xl font-bold text-emerald-600">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Private & Anonymous</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-2xl font-bold text-blue-600">&lt; 1 sec</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Instant Inference</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-2xl font-bold text-indigo-600">82%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Model Accuracy (R²)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
