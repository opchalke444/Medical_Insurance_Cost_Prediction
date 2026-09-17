import React from 'react';
import { BarChart3, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export default function ModelComparison({ metadata }) {
  const comparison = metadata?.model_comparison || [];

  return (
    <section id="transparency" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Audited Predictive Accuracy</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Model Transparency & Comparative Benchmarks
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            We believe in full algorithmic transparency. Compare our production model against standard statistical baselines to understand how your estimate is derived.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Model Architecture</th>
                  <th className="py-3.5 px-4 text-right">Training Fit (R²)</th>
                  <th className="py-3.5 px-4 text-right">Test Accuracy (R²)</th>
                  <th className="py-3.5 px-4 text-right">5-Fold CV Stability</th>
                  <th className="py-3.5 px-4 text-right">Mean Error (MAE)</th>
                  <th className="py-3.5 px-6 text-right">Root Mean Sq. Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparison.map((m, idx) => {
                  const isPrimary = m.model_name.includes('KNN Regression');
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isPrimary ? 'bg-blue-50/60 font-medium' : ''
                      }`}
                    >
                      <td className="py-4 px-6 text-slate-900 font-semibold flex items-center space-x-2">
                        {isPrimary && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white mr-1.5 uppercase">
                            Production Engine
                          </span>
                        )}
                        <span>{m.model_name}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-600">
                        {m.train_r2.toFixed(4)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-900 font-bold">
                        {(m.test_r2 * 100).toFixed(2)}%
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-600">
                        {m.cv_r2_mean.toFixed(4)} <span className="text-xs text-slate-400">±{m.cv_r2_std.toFixed(3)}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-900">
                        ${m.test_mae.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-700">
                        ${m.test_rmse.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Transparency Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm mb-4">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Non-Linear Cohort Matching</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard linear formulas struggle when high BMI combines with smoking. Our instance-based KNN model captures complex real-world interactions by comparing individuals against similar demographic cohorts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mb-4">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Balanced Factor Normalization</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standardized feature transformation ensures that age ranges, BMI categories, and lifestyle indicators carry proportionate weight, eliminating bias and preventing any single indicator from skewing estimates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm mb-4">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Rigorously Audited Validation</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every candidate algorithm was subjected to 5-fold cross-validation on strictly held-out data to verify generalizability and prevent overfitting across diverse demographic profiles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
