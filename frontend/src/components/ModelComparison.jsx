import React from 'react';
import { BarChart3, CheckCircle2, HelpCircle } from 'lucide-react';

export default function ModelComparison({ metadata }) {
  const comparison = metadata?.model_comparison || [];

  return (
    <section id="performance" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Model Evaluation</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Model Performance & Comparative Evaluation
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Comparison of candidate regression algorithms evaluated on the medical insurance dataset using identical 80/20 train/test splits and 5-fold cross-validation.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Model Architecture</th>
                  <th className="py-3.5 px-4 text-right">Train R²</th>
                  <th className="py-3.5 px-4 text-right">Test R²</th>
                  <th className="py-3.5 px-4 text-right">5-Fold CV R²</th>
                  <th className="py-3.5 px-4 text-right">Test MAE</th>
                  <th className="py-3.5 px-6 text-right">Test RMSE</th>
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
                            Selected Model
                          </span>
                        )}
                        <span>{m.model_name}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-600">
                        {m.train_r2.toFixed(4)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-900 font-bold">
                        {m.test_r2.toFixed(4)}
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

        {/* Evaluation Metrics Explained in Simple Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">R² Metric</span>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">Coefficient of Determination</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Measures how well the model explains variation in the target cost on the evaluation data. 1.0 indicates complete explanation; 0.8185 means 81.8% of variance is accounted for.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">MAE Metric</span>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">Mean Absolute Error</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Average absolute difference between predicted and actual cost. For our selected model on test data, typical error is $3,632.17.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">RMSE Metric</span>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">Root Mean Squared Error</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Measures prediction error while giving larger errors more weight. Useful for understanding sensitivity to outlier cases.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Validation</span>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">5-Fold Cross-Validation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Splits the training data into 5 separate folds to test stability across subsets and guard against overfitting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
