'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/ui/SearchBar';
import BangladeshMapBg from '@/components/ui/BangladeshMapBg';
import PassportPhoto from '@/components/ui/PassportPhoto';
import { CATEGORIES } from '@/lib/data/seed';
import { useAtlasStore } from '@/lib/store';
import { getCountryFlag } from '@/lib/data/achievers';
import type { Achiever, CategorySlug } from '@/types/achiever';

interface NominationForm {
  name: string;
  field: string;
  country: string;
  profession: string;
  bio: string;
  evidenceUrl: string;
  nominatorName: string;
  nominatorEmail: string;
  tagsString: string;
  awards: { title: string; year: string; organization: string }[];
  institutions: { name: string; role: string; current: boolean }[];
}

export default function ContributeClient() {
  const [form, setForm] = useState<NominationForm>({
    name: '',
    field: '',
    country: '',
    profession: '',
    bio: '',
    evidenceUrl: '',
    nominatorName: '',
    nominatorEmail: '',
    tagsString: '',
    awards: [],
    institutions: [],
  });

  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submittedAchiever, setSubmittedAchiever] = useState<Achiever | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addAchiever } = useAtlasStore();

  /**
   * Process and standardize uploaded photo to standard 3:4 passport aspect ratio
   */
  const processImageFile = (file: File) => {
    setPhotoError(null);

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setPhotoError('Image size exceeds 8MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Enforce 3:4 passport aspect ratio (480 x 640px)
        const targetWidth = 480;
        const targetHeight = 640;
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setPhotoDataUrl(event.target?.result as string);
          setPhotoFileName(file.name);
          return;
        }

        // Center crop to 3:4 aspect ratio
        const sourceRatio = img.width / img.height;
        const targetRatio = targetWidth / targetHeight;

        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0;
        let sy = 0;

        if (sourceRatio > targetRatio) {
          // Source is wider
          sWidth = img.height * targetRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          // Source is taller
          sHeight = img.width / targetRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

        // Convert to high quality JPEG data URL
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setPhotoDataUrl(optimizedDataUrl);
        setPhotoFileName(file.name);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
    setPhotoFileName('');
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const slug =
      form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `achiever-${Date.now()}`;

    const parsedAwards = form.awards.filter(a => a.title.trim() !== '').map(a => ({
      title: a.title.trim(),
      organization: a.organization.trim(),
      year: a.year ? parseInt(a.year, 10) : undefined
    }));

    const parsedInstitutions = form.institutions.filter(i => i.name.trim() !== '').map(i => ({
      name: i.name.trim(),
      role: i.role.trim(),
      current: i.current
    }));

    const parsedTags = [
      form.field,
      form.country.trim().toLowerCase(),
      ...form.tagsString.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    ];

    const newAchiever: Achiever = {
      id: `ach-custom-${Date.now()}`,
      slug,
      name: form.name.trim(),
      title: form.profession.trim(),
      bio: form.bio.trim(),
      photoUrl: photoDataUrl || '',
      country: form.country.trim(),
      countryFlag: getCountryFlag(form.country.trim()),
      nationality: 'Bangladeshi',
      category: (form.field as CategorySlug) || 'technology',
      profession: form.profession.trim(),
      awards: parsedAwards,
      institutions: parsedInstitutions,
      tags: Array.from(new Set(parsedTags)),
      featured: true,
    };

    try {
      // 1. Save to local Zustand store & localStorage immediately
      addAchiever(newAchiever);

      // 2. Persist to API route for filesystem / server-side persistence
      await fetch('/api/achievers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAchiever),
      });
    } catch (err) {
      console.warn('API sync warning:', err);
    }

    setSubmittedAchiever(newAchiever);
    setSubmitted(true);
    setSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResetForm = () => {
    setForm({
      name: '',
      field: '',
      country: '',
      profession: '',
      bio: '',
      evidenceUrl: '',
      nominatorName: '',
      nominatorEmail: '',
      tagsString: '',
      awards: [],
      institutions: [],
    });
    setPhotoDataUrl(null);
    setPhotoFileName('');
    setPhotoError(null);
    setSubmitted(false);
    setSubmittedAchiever(null);
  };

  const handleAddAward = () => {
    setForm(prev => ({ ...prev, awards: [...prev.awards, { title: '', year: '', organization: '' }] }));
  };

  const handleUpdateAward = (index: number, field: string, value: string) => {
    const newAwards = [...form.awards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    setForm(prev => ({ ...prev, awards: newAwards }));
  };

  const handleRemoveAward = (index: number) => {
    const newAwards = form.awards.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, awards: newAwards }));
  };

  const handleAddInstitution = () => {
    setForm(prev => ({ ...prev, institutions: [...prev.institutions, { name: '', role: '', current: false }] }));
  };

  const handleUpdateInstitution = (index: number, field: string, value: string | boolean) => {
    const newInsts = [...form.institutions];
    newInsts[index] = { ...newInsts[index], [field]: value };
    setForm(prev => ({ ...prev, institutions: newInsts }));
  };

  const handleRemoveInstitution = (index: number) => {
    const newInsts = form.institutions.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, institutions: newInsts }));
  };

  const inputStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '0.75rem 1rem',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg-primary)' }}>
      <BangladeshMapBg />
      <Header />
      <SearchBar />

      <div className="pt-24 px-4 sm:px-6 pb-20 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Nominate an{' '}
              <span style={{ color: 'var(--color-emerald-500)' }}>Achiever</span>
            </h1>
            <p className="text-base sm:text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Know a Bangladeshi achiever who deserves recognition? Fill out the form below
              to nominate them for the Bangladesh Talent Atlas.
            </p>
          </motion.div>

          {submitted && submittedAchiever ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-8 rounded-2xl shadow-xl text-center"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 106, 78, 0.2)',
                boxShadow: '0 10px 30px rgba(0, 106, 78, 0.1)',
              }}
            >
              <span className="text-5xl mb-3 block">🎉</span>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-500)' }}
              >
                Nomination & Profile Saved!
              </h2>
              <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                <strong>{submittedAchiever.name}</strong> has been added and is now immediately visible
                in the Hall of Fame with their passport photo.
              </p>

              {/* Achiever Card Preview */}
              <div
                className="max-w-md mx-auto p-4 rounded-xl mb-6 text-left flex items-center justify-between gap-4"
                style={{
                  background: '#f8faf9',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span>{submittedAchiever.countryFlag}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      {submittedAchiever.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-gray-900 truncate">
                    {submittedAchiever.name}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-1">{submittedAchiever.title}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{submittedAchiever.country}</p>
                </div>

                <PassportPhoto
                  photoUrl={submittedAchiever.photoUrl}
                  name={submittedAchiever.name}
                  className="w-20 shadow-sm"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/hall-of-fame"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-emerald-500), var(--color-emerald-400))',
                    color: '#fff',
                    boxShadow: 'var(--shadow-glow-emerald)',
                  }}
                >
                  🏛️ View in Hall of Fame
                </Link>

                <Link
                  href={`/achievers/${submittedAchiever.slug}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border"
                  style={{
                    borderColor: 'var(--glass-border)',
                    color: 'var(--color-text-primary)',
                    background: '#ffffff',
                  }}
                >
                  👤 View Profile Page
                </Link>

                <button
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-medium transition-all text-gray-500 hover:text-gray-800"
                >
                  + Nominate Another
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 p-6 sm:p-8 rounded-2xl shadow-sm"
              style={{
                background: '#ffffff',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2
                className="text-xl font-bold mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                <span>👤</span> Achiever Information
              </h2>

              {/* ─── NEW PASSPORT SIZE PHOTO UPLOAD FIELD ─── */}
              <div className="p-4 sm:p-5 rounded-xl" style={{ background: '#f8faf9', border: '1px solid var(--glass-border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
                    Passport Size Photo *
                  </label>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--color-emerald-600)' }}>
                    Uniform 3:4 Aspect Ratio
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="passport-photo-input"
                />

                {!photoDataUrl ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-emerald-900/20 hover:border-emerald-500 bg-white hover:bg-emerald-50/20'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100/60 text-emerald-700 text-xl mb-1">
                      📷
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      Click to upload or drag & drop passport size photo
                    </p>
                    <p className="text-xs text-gray-500">
                      Standard passport portrait (3:4 ratio), PNG, JPG or WEBP (Max 8MB)
                    </p>
                    <span className="mt-1 text-xs px-3 py-1 rounded-full font-medium bg-emerald-600/10 text-emerald-700 border border-emerald-600/20">
                      Select File
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-3 bg-white rounded-xl border border-emerald-500/20">
                    <PassportPhoto
                      photoUrl={photoDataUrl}
                      name={form.name || 'Passport Preview'}
                      className="w-24 sm:w-28 shadow-md"
                    />

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 font-semibold text-xs mb-1">
                        <span>✓</span> Photo Selected & Formatted (3:4)
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate" title={photoFileName}>
                        {photoFileName || 'passport_photo.jpg'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Standardized to passport proportions. Will display on the right side of the Hall of Fame card.
                      </p>

                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                          style={{ borderColor: 'var(--glass-border)' }}
                        >
                          Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium text-red-600 hover:bg-red-50 transition-colors border-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {photoError && (
                  <p className="text-xs text-red-600 mt-2 font-medium">⚠️ {photoError}</p>
                )}
              </div>

              {/* Achiever Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Jane Ahmed"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-emerald-500)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Field / Category *
                  </label>
                  <select
                    name="field"
                    required
                    value={form.field}
                    onChange={handleChange}
                    style={{ ...inputStyle, appearance: 'none' as const }}
                  >
                    <option value="">Select a category...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Country & Profession */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Country of Activity *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={form.country}
                    onChange={handleChange}
                    placeholder="e.g. United States or Bangladesh"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-emerald-500)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Profession *
                  </label>
                  <input
                    type="text"
                    name="profession"
                    required
                    value={form.profession}
                    onChange={handleChange}
                    placeholder="e.g. Quantum Physicist & Academic"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-emerald-500)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                  />
                </div>
              </div>

              {/* Biography */}
              <div>
                <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Brief Biography *
                </label>
                <textarea
                  name="bio"
                  required
                  rows={4}
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Describe this person's achievements, contributions, and international recognition..."
                  style={{ ...inputStyle, resize: 'vertical' as const }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-emerald-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                />
              </div>

              {/* Evidence URL */}
              <div>
                <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Evidence / Source URL
                </label>
                <input
                  type="url"
                  name="evidenceUrl"
                  value={form.evidenceUrl}
                  onChange={handleChange}
                  placeholder="https://wikipedia.org/... or news article"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-emerald-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                />
              </div>

              <hr style={{ borderColor: 'var(--glass-border)' }} />

              <h2
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                Structured Information
              </h2>

              {/* Tags */}
              <div>
                <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  name="tagsString"
                  value={form.tagsString}
                  onChange={handleChange}
                  placeholder="e.g. architecture, innovation"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-emerald-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                />
              </div>

              {/* Awards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Awards & Recognition
                  </label>
                  <button type="button" onClick={handleAddAward} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    + Add Award
                  </button>
                </div>
                <div className="space-y-3">
                  {form.awards.map((award, index) => (
                    <div key={index} className="p-4 rounded-xl border" style={{ borderColor: 'var(--glass-border)', background: '#f8faf9' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Award {index + 1}</span>
                        <button type="button" onClick={() => handleRemoveAward(index)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">Remove</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Award Title *"
                          required
                          value={award.title}
                          onChange={(e) => handleUpdateAward(index, 'title', e.target.value)}
                          style={inputStyle}
                        />
                        <input
                          type="text"
                          placeholder="Organization"
                          value={award.organization}
                          onChange={(e) => handleUpdateAward(index, 'organization', e.target.value)}
                          style={inputStyle}
                        />
                        <input
                          type="number"
                          placeholder="Year (e.g. 2023)"
                          value={award.year}
                          onChange={(e) => handleUpdateAward(index, 'year', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  ))}
                  {form.awards.length === 0 && <p className="text-xs text-gray-400 italic">No awards added.</p>}
                </div>
              </div>

              {/* Institutions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Institutions
                  </label>
                  <button type="button" onClick={handleAddInstitution} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    + Add Institution
                  </button>
                </div>
                <div className="space-y-3">
                  {form.institutions.map((inst, index) => (
                    <div key={index} className="p-4 rounded-xl border" style={{ borderColor: 'var(--glass-border)', background: '#f8faf9' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Institution {index + 1}</span>
                        <button type="button" onClick={() => handleRemoveInstitution(index)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">Remove</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                        <input
                          type="text"
                          placeholder="Institution Name *"
                          required
                          value={inst.name}
                          onChange={(e) => handleUpdateInstitution(index, 'name', e.target.value)}
                          style={inputStyle}
                        />
                        <input
                          type="text"
                          placeholder="Role (e.g. Professor)"
                          required
                          value={inst.role}
                          onChange={(e) => handleUpdateInstitution(index, 'role', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inst.current}
                          onChange={(e) => handleUpdateInstitution(index, 'current', e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                        />
                        Current Position
                      </label>
                    </div>
                  ))}
                  {form.institutions.length === 0 && <p className="text-xs text-gray-400 italic">No institutions added.</p>}
                </div>
              </div>

              <hr style={{ borderColor: 'var(--glass-border)' }} />

              <h2
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                Your Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="nominatorName"
                    required
                    value={form.nominatorName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-emerald-500)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="nominatorEmail"
                    required
                    value={form.nominatorEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-emerald-500)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: submitting
                    ? '#cbd5e1'
                    : 'linear-gradient(135deg, var(--color-emerald-500), var(--color-emerald-400))',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  boxShadow: submitting ? 'none' : 'var(--shadow-glow-emerald)',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving & Storing Nomination...
                  </>
                ) : (
                  <>
                    Submit Nomination & Save Achiever
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center"
        style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(0, 106, 78, 0.02)' }}
      >
        <p className="text-sm font-medium" style={{ color: 'var(--color-emerald-500)' }}>
          🇧🇩 Pride of BD — Celebrating Bangladeshi Excellence Worldwide
        </p>
      </footer>
    </main>
  );
}
