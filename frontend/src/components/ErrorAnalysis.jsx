import React from 'react';
import { Flame, Users, TrendingUp, BarChart2 } from 'lucide-react';

export default function ErrorAnalysis({ insights }) {
  const errorAnalysis = insights?.error_analysis;
  const percentiles = errorAnalysis?.percentiles || {};

  // Dataset-wide verified statistics (from 1,338 historical records, 1,337 unique)
  const smokingStats = {
    nonSmoker: { mean: 8441, count: 1063 },
    smoker: { mean: 32050, count: 274 },
    diff: 23610
  };

  const ageStats = [
    { bracket: '18–30', count: 443, meanCost: 9415, testMae: errorAnalysis?.by_age_bracket?.['18-30']?.mae },
    { bracket: '31–45', count: 394, meanCost: 12647, testMae: errorAnalysis?.by_age_bracket?.['31-45']?.mae },
    { bracket: '46–64', count: 500, meanCost: 17200, testMae: errorAnalysis?.by_age_bracket?.['46-64']?.mae }
  ];

  const bmiStats = [
    { category: 'Underweight (<18.5)', count: 21, meanCost: 8658, testMae: errorAnalysis?.by_bmi_category?.['Underweight (<18.5)']?.mae },
    { category: 'Normal (18.5–24.9)', count: 226, meanCost: 10435, testMae: errorAnalysis?.by_bmi_category?.['Normal (18.5-24.9)']?.mae },
    { category: 'Overweight (25–29.9)', count: 386, meanCost: 10998, testMae: errorAnalysis?.by_bmi_category?.['Overweight (25-29.9)']?.mae },
    { category: 'Obese (≥30)', count: 704, meanCost: 15581, testMae: errorAnalysis?.by_bmi_category?.['Obese (>=30)']?.mae }
  ];

  return (
    <section id="factors" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Dataset Cost Factors</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Observed Cost Factors in the Dataset
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Statistical associations observed across 1,338 historical dataset records. These figures reflect historical sample averages and do not establish clinical causation.
          </p>
        </div>

        {/* Smoker Disparity Callout */}
        <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1.5">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>Observed Cost Differences by Smoking Status</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Smokers Averaged +$23,610 in Historical Dataset Records
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                In this dataset of 1,338 records, non-smokers had an average observed annual cost of ${smokingStats.nonSmoker.mean.toLocaleString()}, while smokers had an average observed cost of ${smokingStats.smoker.mean.toLocaleString()}. This observed association is the primary driver of cost variation in the regression model.
              </p>
              <div className="mt-2 text-[11px] font-medium text-slate-500 italic">
                * Dataset-level association. The model is predictive and does not measure direct medical causation.
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-rose-200 text-center shadow-2xs min-w-[140px]">
                <div className="text-xs text-slate-500 font-medium">Non-Smokers</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  ${smokingStats.nonSmoker.mean.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Average observed cost ({smokingStats.nonSmoker.count} records)</div>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-rose-200 text-center shadow-2xs min-w-[140px]">
                <div className="text-xs text-slate-500 font-medium">Smokers</div>
                <div className="text-2xl font-black text-rose-600 mt-1">
                  ${smokingStats.smoker.mean.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Average observed cost ({smokingStats.smoker.count} records)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subgroup Factors Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Age Group Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Average Observed Cost by Age Group</span>
              <Users className="w-4 h-4 text-slate-400" />
            </h4>
            <div className="space-y-3">
              {ageStats.map((item) => (
                <div key={item.bracket} className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{item.bracket} years old</span>
                    <span className="text-xs text-slate-400 ml-2">({item.count} records)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-slate-900">${item.meanCost.toLocaleString()}</span>
                    <div className="text-[11px] text-slate-500">
                      {item.testMae ? `Test MAE: $${Math.round(item.testMae).toLocaleString()}` : 'Average observed cost'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BMI Category Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Average Observed Cost by BMI Category</span>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </h4>
            <div className="space-y-3">
              {bmiStats.map((item) => (
                <div key={item.category} className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{item.category}</span>
                    <span className="text-xs text-slate-400 ml-2">({item.count} records)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-slate-900">${item.meanCost.toLocaleString()}</span>
                    <div className="text-[11px] text-slate-500">
                      {item.testMae ? `Test MAE: $${Math.round(item.testMae).toLocaleString()}` : 'Average observed cost'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estimation Error Distribution */}
        {percentiles.p50_median && (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              Test Set Prediction Error Distribution
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Absolute prediction errors (|actual - predicted|) for the selected KNN model on the 268 held-out test records. Half of test predictions had an error under $1,944.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-xs text-slate-500 font-medium">25th Percentile</div>
                <div className="text-lg font-bold text-slate-900 mt-1">${Math.round(percentiles.p25).toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">25% of errors below this</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-xs text-blue-700 font-medium">Median Error (50th)</div>
                <div className="text-lg font-bold text-blue-900 mt-1">${Math.round(percentiles.p50_median).toLocaleString()}</div>
                <div className="text-[10px] text-blue-600 mt-0.5">50% of errors below this</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-xs text-slate-500 font-medium">75th Percentile</div>
                <div className="text-lg font-bold text-slate-900 mt-1">${Math.round(percentiles.p75).toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">75% of errors below this</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                <div className="text-xs text-slate-600 font-medium">90th Percentile</div>
                <div className="text-lg font-bold text-slate-900 mt-1">${Math.round(percentiles.p90).toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Higher error outlier cases</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
