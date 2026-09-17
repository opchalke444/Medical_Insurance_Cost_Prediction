import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import ModelComparison from './components/ModelComparison';
import ErrorAnalysis from './components/ErrorAnalysis';
import Methodology from './components/Methodology';
import Footer from './components/Footer';

import {
  checkBackendHealth,
  predictInsurance,
  fetchModelMetadata,
  fetchModelInsights
} from './services/api';

export default function App() {
  const [serverStatus, setServerStatus] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [insights, setInsights] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  const resultRef = useRef(null);

  // Initialize data on component mount
  useEffect(() => {
    async function initializeApp() {
      // 1. Health check
      const health = await checkBackendHealth();
      setServerStatus(health);

      // 2. Fetch metadata & insights
      const meta = await fetchModelMetadata();
      if (meta) setMetadata(meta);

      const ins = await fetchModelInsights();
      if (ins) setInsights(ins);
    }

    initializeApp();
  }, []);

  // Handle prediction form submission
  const handlePredictionSubmit = async (formData) => {
    setIsLoading(true);
    setPredictionError(null);

    try {
      const response = await predictInsurance(formData);
      setPredictionResult(response);

      // Smoothly scroll to result card
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err) {
      setPredictionError(err.message || 'An unexpected error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setPredictionError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar serverStatus={serverStatus} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Prediction Interface Section */}
        <section id="estimator" className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Cost Estimator
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Calculate Your Cost Estimate
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Enter your demographic and health indicators below to receive a regression-based medical insurance cost estimate.
            </p>
          </div>

          <PredictionForm
            onSubmit={handlePredictionSubmit}
            isLoading={isLoading}
            error={predictionError}
          />

          <div ref={resultRef}>
            <PredictionResult
              result={predictionResult}
              onReset={handleReset}
            />
          </div>
        </section>

        {/* Key Health Factors & Cost Drivers */}
        <ErrorAnalysis insights={insights} />

        {/* Model Transparency & Comparative Benchmarks */}
        <ModelComparison metadata={metadata} />

        {/* Consumer FAQs & Ethical Governance */}
        <Methodology />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
