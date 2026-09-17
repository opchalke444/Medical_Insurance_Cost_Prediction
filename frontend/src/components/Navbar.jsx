import { Activity } from 'lucide-react';

export default function Navbar({ serverStatus }) {
  const isHealthy = serverStatus?.status === 'healthy' && serverStatus?.model_loaded;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">MedCost<span className="text-blue-600">.AI</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                Academic ML Project
              </span>
            </div>
          </div>

          {/* User Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#estimator" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Estimator
            </a>
            <a href="#factors" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Cost Factors
            </a>
            <a href="#performance" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Model Performance
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* System Status */}
          <div className="flex items-center space-x-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
              isHealthy
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isHealthy ? 'Estimator Ready' : 'Connecting...'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
