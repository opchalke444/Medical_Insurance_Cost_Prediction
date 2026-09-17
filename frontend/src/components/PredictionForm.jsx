import React, { useState } from 'react';
import { User, HeartPulse, Sparkles, AlertCircle, RefreshCw, Lock } from 'lucide-react';

const EXAMPLES = [
  {
    label: 'Standard Non-Smoker',
    data: { age: 35, sex: 'male', bmi: 24.5, children: 1, smoker: 'no', region: 'southeast' }
  },
  {
    label: 'Smoker with High BMI',
    data: { age: 48, sex: 'male', bmi: 33.2, children: 0, smoker: 'yes', region: 'southwest' }
  },
  {
    label: 'Young Adult',
    data: { age: 24, sex: 'female', bmi: 22.0, children: 0, smoker: 'no', region: 'northeast' }
  }
];

export default function PredictionForm({ onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    age: 35,
    sex: 'male',
    bmi: 26.5,
    children: 1,
    smoker: 'no',
    region: 'southeast'
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      errors.age = 'Age must be between 18 and 100 years.';
    }
    if (!formData.bmi || formData.bmi < 10.0 || formData.bmi > 65.0) {
      errors.bmi = 'BMI must be between 10.0 and 65.0 kg/m².';
    }
    if (formData.children < 0 || formData.children > 10) {
      errors.children = 'Children count must be between 0 and 10.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleExample = (exampleData) => {
    setFormData(exampleData);
    setValidationErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div id="estimator" className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-8">
      {/* Header with Quick Fill Examples */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Model Inputs & Demographic Attributes</h2>
          <p className="text-sm text-slate-500 mt-0.5">Enter demographic and health indicators to estimate annual insurance costs.</p>
        </div>

        {/* Quick Fill Options */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Example Inputs:</span>
          {EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleExample(ex.data)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors border border-slate-200"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Calculation Error: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Demographics */}
          <div className="space-y-5">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 mb-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Demographic Details</span>
            </div>

            {/* Age */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="age-input" className="text-sm font-medium text-slate-700">
                  Age in years
                </label>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {formData.age} years old
                </span>
              </div>
              <input
                id="age-input"
                type="range"
                min="18"
                max="64"
                step="1"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>18 yrs (dataset min)</span>
                <span>40 yrs</span>
                <span>64 yrs (dataset max)</span>
              </div>
              {validationErrors.age && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.age}</p>
              )}
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Biological Sex <span className="text-xs text-slate-400 font-normal">(as recorded in dataset)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleChange('sex', option)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium border capitalize transition-all ${
                      formData.sex === option
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Children / Dependents */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="children-input" className="text-sm font-medium text-slate-700">
                  Covered Dependents <span className="text-xs text-slate-400 font-normal">(children: 0 to 5)</span>
                </label>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {formData.children} {formData.children === 1 ? 'dependent' : 'dependents'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleChange('children', num)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      formData.children === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {validationErrors.children && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.children}</p>
              )}
            </div>
          </div>

          {/* Right Column: Health Factors */}
          <div className="space-y-5">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 mb-2">
              <HeartPulse className="w-4 h-4 text-blue-600" />
              <span>Health & Location Factors</span>
            </div>

            {/* BMI */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="bmi-input" className="text-sm font-medium text-slate-700">
                  Body Mass Index (BMI)
                </label>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                  formData.bmi < 18.5
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : formData.bmi <= 24.9
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : formData.bmi <= 29.9
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {formData.bmi.toFixed(1)} kg/m² ({
                    formData.bmi < 18.5 ? 'Underweight' :
                    formData.bmi <= 24.9 ? 'Normal weight' :
                    formData.bmi <= 29.9 ? 'Overweight' : 'Obese category'
                  })
                </span>
              </div>
              <input
                id="bmi-input"
                type="number"
                min="10.0"
                max="65.0"
                step="0.1"
                value={formData.bmi}
                onChange={(e) => handleChange('bmi', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold text-sm mb-2"
              />
              <input
                type="range"
                min="15.0"
                max="50.0"
                step="0.1"
                value={formData.bmi}
                onChange={(e) => handleChange('bmi', parseFloat(e.target.value) || 0)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              {validationErrors.bmi && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.bmi}</p>
              )}
            </div>

            {/* Tobacco / Smoker Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Smoking status in the dataset
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('smoker', 'no')}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                    formData.smoker === 'no'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Non-Smoker
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('smoker', 'yes')}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                    formData.smoker === 'yes'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-2xs font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Smoker
                </button>
              </div>
            </div>

            {/* US Region */}
            <div>
              <label htmlFor="region-select" className="block text-sm font-medium text-slate-700 mb-1.5">
                Residential region represented in the dataset
              </label>
              <select
                id="region-select"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="northeast">Northeast</option>
                <option value="northwest">Northwest</option>
                <option value="southeast">Southeast</option>
                <option value="southwest">Southwest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Action & Privacy Assurance */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center text-xs text-slate-500 space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>The application does not intentionally store prediction inputs in a database.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-white font-semibold shadow-md transition-all ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                <span>Computing Estimate...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Calculate Cost Estimate</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
