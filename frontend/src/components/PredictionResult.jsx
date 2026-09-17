import React from 'react';
import { ArrowLeft, ShieldAlert, Cpu, CheckCircle, BarChart3 } from 'lucide-react';

export default function PredictionResult({ result, onReset }) {
  if (!result) return null;

  const { prediction, currency, model_name, features_received } = result;

  // Format currency
  const annualCost = prediction || 0;
  const monthlyCost = annualCost / 12;

  const formattedAnnual = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(annualCost);

  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(monthlyCost);

  const isSmoker = features_received?.smoker === 'yes';
  const bmiValue = features_received?.bmi || 0;
  const isHighBmi = bmiValue >= 30;

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 rounded-2xl border-2 border-blue-200 shadow-xl shadow-blue-500/10 p-6 sm:p-8 mt-8 animate-fadeIn">
      {/* Result Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-100">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-100/80 px-2.5 py-1 rounded-md">
            Estimate Calculated
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">Estimated Annual Medical Insurance Cost</h3>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Adjust Inputs</span>
        </button>
      </div>

      {/* Primary Number Callout */}
      <div className="my-8 text-center sm:text-left sm:flex sm:items-baseline sm:justify-between">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <div className="text-4xl sm:text-6xl font-extrabold text-blue-900 tracking-tight">
              {formattedAnnual}
            </div>
            <span className="text-base sm:text-lg font-medium text-slate-500">/ year</span>
          </div>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Approx. <span className="font-bold text-slate-900">{formattedMonthly}</span> per month
          </p>
        </div>

        {/* Core Model Identification Card */}
        <div className="mt-4 sm:mt-0 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-left">
          <div className="text-xs text-slate-500 font-medium">Deployed Model</div>
          <div className="text-sm font-bold text-blue-700 mt-0.5">{model_name || 'KNN Regression (k=9)'}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Trained on 1,338 historical records</div>
        </div>
      </div>

      {/* Evaluation Metrics for this Model */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-white/80 border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block font-medium">Model Used:</span>
          <span className="font-bold text-slate-900">{model_name || 'KNN Regression (k=9)'}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Test R²:</span>
          <span className="font-bold text-slate-900">0.8185</span>
          <span className="text-slate-500 text-[11px] block">(explains 81.8% variance on test data)</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Typical Error (MAE):</span>
          <span className="font-bold text-slate-900">$3,632.17</span>
          <span className="text-slate-500 text-[11px] block">(average error on test predictions)</span>
        </div>
      </div>

      {/* Dataset Context Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Smoking Status in Dataset</div>
          <div className={`text-base font-bold mt-1 ${isSmoker ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isSmoker ? 'Smoker' : 'Non-Smoker'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isSmoker 
              ? 'In the dataset, smokers averaged $32,050 vs $8,441 for non-smokers.' 
              : 'In the dataset, non-smokers had an average cost of $8,441.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Body Mass Index ({bmiValue.toFixed(1)} kg/m²)</div>
          <div className={`text-base font-bold mt-1 ${isHighBmi ? 'text-amber-600' : 'text-slate-800'}`}>
            {isHighBmi ? 'Obese (≥30.0 kg/m²)' : bmiValue >= 25 ? 'Overweight (25–29.9 kg/m²)' : 'Normal Weight (18.5–24.9 kg/m²)'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isHighBmi 
              ? 'Dataset group average for obese records is $15,581.' 
              : bmiValue >= 25 
              ? 'Dataset group average for overweight records is $10,998.'
              : 'Dataset group average for normal weight is $10,435.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Demographics & Region</div>
          <div className="text-base font-bold text-slate-800 mt-1 capitalize">
            {features_received?.age} yrs • {features_received?.children} {features_received?.children === 1 ? 'child' : 'children'}
          </div>
          <p className="text-xs text-slate-500 mt-1 capitalize">
            Region: {features_received?.region || 'N/A'} • Sex: {features_received?.sex || 'N/A'}
          </p>
        </div>
      </div>

      {/* Prominent Mandatory Disclaimer */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs leading-relaxed flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Disclaimer: </span>
          <span>
            This is a machine-learning estimate based on patterns in the evaluation/training dataset. It is not an official insurance quote, underwriting decision, or medical advice.
          </span>
        </div>
      </div>
    </div>
  );
}
