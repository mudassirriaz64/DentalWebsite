'use client';

import React, { useState } from 'react';
import { X, Star, Loader, CheckCircle } from 'lucide-react';

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewSubmitModal: React.FC<ReviewSubmitModalProps> = ({ isOpen, onClose }) => {
  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('Cosmetic');
  const [treatmentType, setTreatmentType] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isVerifiedPatient, setIsVerifiedPatient] = useState(true);

  // Status states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStarClick = (val: number) => {
    setRating(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!patientName.trim()) return setErrorMsg('Your Name is required.');
    if (!title.trim()) return setErrorMsg('Review Title is required.');
    if (body.trim().length < 10) return setErrorMsg('Review text must be at least 10 characters.');

    setLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          rating,
          category,
          treatmentType: treatmentType.trim() || undefined,
          title,
          body,
          isVerifiedPatient,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setSuccess(true);
      setPatientName('');
      setRating(5);
      setCategory('Cosmetic');
      setTreatmentType('');
      setTitle('');
      setBody('');
      setIsVerifiedPatient(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-sans text-slate-800">
      {/* Overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] p-6 md:p-8 shadow-2xl border overflow-hidden z-10 text-left animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-10 flex flex-col items-center justify-center text-center animate-fade-in">
            <CheckCircle className="w-14 h-14 text-emerald-500 mb-4 animate-bounce" />
            <h3 className="font-serif font-bold text-xl text-primary mb-2">
              Review Submitted!
            </h3>
            <p className="text-xs text-body-text max-w-sm leading-relaxed mb-6 font-normal">
              Thank you for sharing your experience. To ensure the authenticity of all feedback, your review has been queued for clinical moderation and will appear once approved.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-teal-950 text-white font-sans text-xs font-bold transition shadow cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-primary leading-tight">
                Share Your Experience
              </h3>
              <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-normal">
                Your reviews help our doctors maintain biological dental quality standards.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-accent-soft text-accent border border-accent/10 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#2A3738] uppercase tracking-wide">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              {/* Treatment Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#2A3738] uppercase tracking-wide">
                  Treatment Category *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
                >
                  <option value="Cosmetic">Cosmetic Dentistry</option>
                  <option value="Implants">Dental Implants</option>
                  <option value="General Care">General Care</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Treatment Type Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#2A3738] uppercase tracking-wide">
                  Treatment Received (Optional)
                </label>
                <input
                  type="text"
                  value={treatmentType}
                  onChange={(e) => setTreatmentType(e.target.value)}
                  placeholder="Porcelain Veneers"
                  className="px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              {/* Rating picker */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#2A3738] uppercase tracking-wide">
                  Star Rating *
                </label>
                <div className="flex gap-1.5 items-center py-2 pl-1 select-none">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleStarClick(val)}
                      className="text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          val <= rating ? 'text-[#FFB020] fill-[#FFB020]' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[#2A3738] uppercase tracking-wide">
                Review Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brighter teeth in one visit"
                className="px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[#2A3738] uppercase tracking-wide">
                Review Description *
              </label>
              <textarea
                rows={4}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Bespoke veneers completely transformed my smile..."
                className="px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs resize-none"
              />
            </div>

            {/* Verified patient Checkbox */}
            <label className="flex items-center gap-2 select-none text-xs font-semibold text-slate-600 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerifiedPatient}
                onChange={(e) => setIsVerifiedPatient(e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
              />
              I am a verified patient at Dental Cosmetics & Implant Centre
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1 font-semibold transition-all duration-300 rounded-full text-xs px-8 py-3.5 bg-primary text-white hover:bg-teal-950 btn-diagonal-stripe shadow-md cursor-pointer mt-3 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4.5 h-4.5 animate-spin" /> Submitting Review...
                </>
              ) : (
                'Submit Review for Approval'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmitModal;
