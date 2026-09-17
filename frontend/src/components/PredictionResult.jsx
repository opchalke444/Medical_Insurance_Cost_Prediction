import React from 'react';
import { DollarSign, ShieldAlert, ArrowLeft, CheckCircle, TrendingUp, Info, Calendar } from 'lucide-react';

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
  const isHighBmi = (features_received?.bmi || 0) >= 30;

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 rounded-2xl border-2 border-blue-200 shadow-xl shadow-blue-500/10 p-6 sm:p-8 mt-8 animate-fadeIn">
      {/* Result Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-100">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-100/80 px-2.5 py-1 rounded-md">
            Estimate Calculated Successfully
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">Estimated Healthcare Coverage Expenditure</h3>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Adjust Beneficiary Inputs</span>
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
            Approx. <span className="font-bold text-slate-900">{formattedMonthly}</span> per month • Powered by <span className="font-semibold text-blue-700">{model_name}</span>
          </p>
        </div>

        <div className="mt-4 sm:mt-0 inline-flex items-center px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
          <span>Calibrated on 1,300+ Actuarial Profiles</span>
        </div>
      </div>

      {/* Clinical Factor Impact Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Smoking Status</div>
          <div className={`text-base font-bold mt-1 ${isSmoker ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isSmoker ? 'High Surcharge (~+$20k-30k)' : 'Baseline Standard Rate'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isSmoker ? 'Primary cost driver in healthcare regression' : 'No tobacco surcharge applied'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Body Mass Index ({features_received?.bmi} kg/m²)</div>
          <div className={`text-base font-bold mt-1 ${isHighBmi ? 'text-amber-600' : 'text-slate-800'}`}>
            {isHighBmi ? 'Elevated BMI Category' : 'Controlled BMI Range'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isHighBmi && isSmoker ? 'Multiplicative risk when combined with smoking' : 'Stable correlation with standard baseline'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Demographics & Dependents</div>
          <div className="text-base font-bold text-slate-800 mt-1">
            {features_received?.age} yrs • {features_received?.children} {features_received?.children === 1 ? 'child' : 'children'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Consistent actuarial baseline for regional cohort
          </p>
        </div>
      </div>

      {/* Prominent Ethical & Financial Disclaimer */}
      <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-900 text-xs leading-relaxed flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Ethical & Transparency Notice: </span>
          <span>
            This estimate is computed using predictive algorithmic regression calibrated against historical healthcare benchmarks. It is intended solely for personal planning, budgeting, and transparency. It does NOT constitute an official insurance quotation, underwriting determination, or legal medical advice.
          </span>
        </div>
      </div>
    </div>
  );
}
