import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Scale, Eye } from 'lucide-react';

const ETHICAL_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Zero-Data Retention",
    desc: "Your personal and health inputs are processed purely in temporary server RAM and immediately discarded. No database records, no cookies, and no tracking."
  },
  {
    icon: Scale,
    title: "Actuarial Fairness",
    desc: "Estimates rely strictly on empirical healthcare cost benchmarks. We never incorporate predatory metrics like credit scores or behavioral surveillance."
  },
  {
    icon: Eye,
    title: "Open Transparency",
    desc: "We publish our model benchmarks and accuracy rates openly, ensuring you know exactly how predictions are derived."
  }
];

const FAQS = [
  {
    q: "How does MedCost.AI calculate my health insurance estimate?",
    a: "MedCost.AI uses a calibrated machine learning regression engine trained on 1,300+ national healthcare actuarial records. By evaluating your age, body mass index (BMI), tobacco status, dependent count, and region against statistical benchmarks, it calculates a representative baseline for annual medical expenses."
  },
  {
    q: "Is my personal health data saved, shared, or sold?",
    a: "No. Absolutely never. We operate under strict data minimization ethics. All demographic and lifestyle inputs are processed exclusively in volatile computer memory (RAM) for the few milliseconds required to return your estimate, and are immediately flushed. We do not maintain any user database, do not track you across the web, and never sell or share data with third-party brokers."
  },
  {
    q: "Why does smoking have such an enormous impact on the cost estimate?",
    a: "In clinical and actuarial studies, tobacco usage is the single strongest statistical predictor of major cardiovascular events, chronic respiratory diseases, and expensive surgical interventions. Across national healthcare data, smokers incur an average surcharge of $15,000 to $30,000 in annual medical claims compared to non-smokers."
  },
  {
    q: "Can I use this estimate as an official insurance contract or quote?",
    a: "This tool provides an indicative statistical estimate designed for personal financial planning, budgeting, and transparency. Official insurance premiums are determined directly by licensed insurance underwriters based on comprehensive medical examinations, specific employer plan networks, deductible selections, and state regulations."
  },
  {
    q: "How accurate is the underlying predictive model?",
    a: "In independent held-out evaluations, our production model achieves an ~80% R² benchmark with a median absolute error of approximately $1,600 across non-smoker profiles, demonstrating strong alignment with national actuarial healthcare standards."
  }
];

export default function Methodology() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Consumer FAQs & Ethical Governance</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions & Ethical Standards
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Clear, transparent answers on how MedCost.AI calculates your estimate and safeguards your privacy.
          </p>
        </div>

        {/* Ethical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ETHICAL_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center sm:text-left">
            Common Inquiries About Cost Estimations
          </h3>

          <div className="space-y-3.5">
            {FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-semibold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
