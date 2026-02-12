import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Award, Briefcase, BookOpen } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/analyze";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeResume = async () => {
    if (!file || !jobDescription) {
      setError("Please upload a resume and provide a job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            ATS Resume Optimizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Beat the automated systems. Match your resume to the job description with AI-powered precision.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12 max-w-4xl mx-auto">

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Resume Upload */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-outfit">Upload Resume</h2>
              </div>

              <div className="relative border-2 border-dashed border-indigo-200 rounded-xl p-8 transition-colors hover:border-indigo-400 bg-indigo-50/30">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {file ? file.name : "Drop your resume here"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PDF files only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-outfit">Job Description</h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-48 bg-gray-50 rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeResume}
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Award className="w-6 h-6" />
                  <span>Analyze Match</span>
                </>
              )}
            </motion.button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-3 border border-red-100"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {result ? (
              <div className="space-y-8">
                {/* Score Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                  <h2 className="text-2xl font-bold text-gray-900 font-outfit mb-6">Match Score</h2>
                  <div className="flex items-center justify-center py-8">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={result.match_percentage > 70 ? "#10B981" : result.match_percentage > 40 ? "#F59E0B" : "#EF4444"}
                          strokeWidth="3"
                          strokeDasharray={`${result.match_percentage}, 100`}
                          className="animate-[spin_1s_ease-out_reverse]"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900">{Math.round(result.match_percentage)}%</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Match</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-gray-600">{result.summary}</p>
                </div>

                {/* Missing Keywords & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 font-outfit">Missing Keywords</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.length > 0 ? (
                        result.missing_keywords.map((keyword, i) => (
                          <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">
                            {keyword}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic text-sm">No critical keywords missing!</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 font-outfit">Missing Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_skills.length > 0 ? (
                        result.missing_skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-100">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic text-sm">Skills look good!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended Projects */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="flex items-center space-x-3 mb-6 relative z-10">
                    <div className="p-3 bg-white/10 rounded-lg text-white backdrop-blur-sm">
                      <Award className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold font-outfit">Project Recommendations</h2>
                  </div>
                  <div className="space-y-4 relative z-10">
                    {result.recommended_projects.map((project, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                        <p className="font-medium text-indigo-100">{project}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvement Guide */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 font-outfit">Improvement Guide</h2>
                  </div>
                  <div className="space-y-4">
                    {result.resume_improvement_suggestions.map((suggestion, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white/50 rounded-2xl border-2 border-dashed border-gray-200 h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-6">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2 font-outfit">Ready to Analyze</h3>
                <p className="text-gray-400 max-w-sm">
                  Upload your resume and the job description to get a detailed match analysis and improvement plan.
                </p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default App;
