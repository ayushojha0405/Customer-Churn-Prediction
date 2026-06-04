import { useState } from "react";
import { predict } from "./services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

const chartData = [
  { name: "LogReg", f1: 0.63 },
  { name: "Tree", f1: 0.50 },
  { name: "Forest", f1: 0.53 },
  { name: "KNN", f1: 0.55 },
  { name: "XGBoost", f1: 0.62 },
];

function App() {
  const [form, setForm] = useState({
    // Demographics
    gender: "Male",
    SeniorCitizen: "0",
    Partner: "Yes",
    Dependents: "No",
    // Services
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "Fiber optic",
    OnlineSecurity: "No",
    OnlineBackup: "Yes",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "Yes",
    StreamingMovies: "Yes",
    // Billing
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    // Numerical
    tenure: "5",
    MonthlyCharges: "70",
    TotalCharges: "350",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.tenure || !form.MonthlyCharges || !form.TotalCharges) {
      alert("Please fill all numerical fields");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload = {
        ...form,
        SeniorCitizen: Number(form.SeniorCitizen),
        tenure: Number(form.tenure),
        MonthlyCharges: Number(form.MonthlyCharges),
        TotalCharges: Number(form.TotalCharges),
      };

      const res = await predict(payload);
      setResult(res);
    } catch (err) {
      setError("Unable to connect to the prediction server. Please try again later.");
    }

    setLoading(false);
  };

  const getRiskColor = (p) => {
    if (p > 0.7) return "text-red-600 bg-red-100 border-red-200";
    if (p > 0.4) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-green-600 bg-green-100 border-green-200";
  };

  const getRiskLabel = (p) => {
    if (p > 0.7) return "High Risk";
    if (p > 0.4) return "Medium Risk";
    return "Low Risk";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-[Inter] selection:bg-lime-200">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm py-3 mb-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-lime-500 flex items-center justify-center shadow-md shadow-lime-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Customer Churn Prediction</h1>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 w-full mb-4 animate-fade-in-up">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-red-800">Connection Error</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto px-6 w-full animate-fade-in-up flex flex-col gap-4 pb-4">

        {/* Description Section */}
        <div className="mb-4">
          <p className="text-sm text-center text-gray-600 leading-relaxed w-full">
            <strong className="font-semibold text-gray-800">Identify at-risk customers instantly. </strong>
            Enter customer data to calculate AI-powered churn probability scores and isolate critical risk factors for proactive retention.
          </p>
        </div>

        {/* Top Section: Form (Left) & Risk/Chart (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* LEFT: FORM */}
          <div className="xl:col-span-2 h-full flex flex-col">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Customer Profile</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Column 1: Demographics */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Demographics</h4>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Senior Citizen</label>
                    <select name="SeniorCitizen" value={form.SeniorCitizen} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Partner</label>
                    <select name="Partner" value={form.Partner} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>

                {/* Column 2: Services */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Services</h4>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Internet Service</label>
                    <select name="InternetService" value={form.InternetService} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700">
                      <option>DSL</option>
                      <option>Fiber optic</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tech Support</label>
                    <select name="TechSupport" value={form.TechSupport} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700">
                      <option>Yes</option>
                      <option>No</option>
                      <option>No internet service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone Service</label>
                    <select name="PhoneService" value={form.PhoneService} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>

                {/* Column 3: Billing & Numerical */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Account</h4>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Contract</label>
                    <select name="Contract" value={form.Contract} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700">
                      <option>Month-to-month</option>
                      <option>One year</option>
                      <option>Two year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Payment Method</label>
                    <select name="PaymentMethod" value={form.PaymentMethod} onChange={handleChange} className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700">
                      <option>Electronic check</option>
                      <option>Mailed check</option>
                      <option>Bank transfer (automatic)</option>
                      <option>Credit card (automatic)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 truncate" title="Tenure (months)">Tenure</label>
                      <input name="tenure" type="number" value={form.tenure} onChange={handleChange} placeholder="5" className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 truncate" title="Monthly Charges ($)">Monthly</label>
                      <input name="MonthlyCharges" type="number" value={form.MonthlyCharges} onChange={handleChange} placeholder="70" className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 truncate" title="Total Charges ($)">Total ($)</label>
                      <input name="TotalCharges" type="number" value={form.TotalCharges} onChange={handleChange} placeholder="350" className="w-full p-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none text-sm transition-all text-gray-700" />
                    </div>
                  </div>

                </div>

              </div>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full md:w-auto md:min-w-[200px] float-right bg-lime-500 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-md shadow-lime-500/30 transition-all duration-200 hover:bg-lime-600 hover:shadow-lime-600/40 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : "Analyze Risk"}
                </button>
                <div className="clear-both"></div>
              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS & CHARTS */}
          <div className="flex flex-col gap-4 h-full">

            {/* Prediction Result Card */}
            <div className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm transition-all duration-500 shrink-0 ${result ? 'ring-2 ring-lime-400 shadow-lime-100' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-gray-800">Risk Assessment</h3>
                {result && (
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getRiskColor(result.probability)}`}>
                    {getRiskLabel(result.probability)}
                  </div>
                )}
              </div>

              {!result ? (
                <div className="flex flex-col items-center justify-center py-3 text-gray-400">
                  <p className="text-xs">Submit profile for analysis</p>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-0.5">Churn Probability</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">{(result.probability * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chart Card */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-0">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 shrink-0">Model Performance (F1 Score)</h3>
              <div className="flex-1 min-h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid stroke="#f3f4f6" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 0.8]}
                    />
                    <Tooltip
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="f1" radius={[4, 4, 0, 0]} animationDuration={1000}>
                      {
                        chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'XGBoost' ? '#84cc16' : '#d9f99d'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM: SHAP FEATURES */}
        {result && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800">Key Influencing Factors</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...result.top_features]
                .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                .map((item, i) => {
                  // Impact > 0 means it pushes TOWARDS churn (bad -> red)
                  // Impact < 0 means it pushes AWAY from churn (good -> green)
                  const isRiskFactor = item.impact > 0;

                  return (
                    <div key={i} className={`flex flex-col justify-between p-3 rounded-xl border transition-colors ${isRiskFactor ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                      <span className="text-sm font-medium text-gray-700 mb-1 truncate" title={item.feature.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll("_", " ")}>
                        {item.feature.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll("_", " ")}
                      </span>
                      <div className={`flex items-center justify-between`}>
                        <span className={`text-xs font-semibold ${isRiskFactor ? 'text-red-500' : 'text-green-600'}`}>
                          {isRiskFactor ? 'Increases Risk' : 'Decreases Risk'}
                        </span>
                        <div className={`flex items-center gap-1 text-sm font-bold ${isRiskFactor ? 'text-red-600' : 'text-green-600'}`}>
                          {isRiskFactor ? '+' : ''}{item.impact.toFixed(3)}
                          <svg className={`w-4 h-4 ${isRiskFactor ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="mt-auto w-full text-center py-2 text-sm text-gray-500 shrink-0">
        <p>Made with <span className="text-lime-500">♥</span> by Ayush Ranjan Ojha © 2026</p>
      </footer>

    </div>
  );
}

export default App;