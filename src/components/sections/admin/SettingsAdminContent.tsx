'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2, HelpCircle, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { ClinicSettings, OpeningHoursEntry } from '@/types/settings';
import ImageUploadField from '@/components/admin/ImageUploadField';

interface SettingsAdminContentProps {
  initialSettings: ClinicSettings;
}

interface FormHoursRow {
  id?: string;
  label: string;
  hours: string;
  isEmergencyNote: boolean;
  isDimmed: boolean;
}

export const SettingsAdminContent: React.FC<SettingsAdminContentProps> = ({ initialSettings }) => {
  const router = useRouter();
  // Input states
  const [address, setAddress] = useState(initialSettings.address);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [phoneNote, setPhoneNote] = useState(initialSettings.phoneNote || '');
  const [whatsapp, setWhatsapp] = useState(initialSettings.whatsapp || '');
  const [email, setEmail] = useState(initialSettings.email);
  const [emergencyPhone, setEmergencyPhone] = useState(initialSettings.emergencyPhone || '');
  const [mapImageUrl, setMapImageUrl] = useState(initialSettings.mapImageUrl || '');
  const [mapDirectionsUrl, setMapDirectionsUrl] = useState(initialSettings.mapDirectionsUrl || '');
  const [bookingStatusMessage, setBookingStatusMessage] = useState(initialSettings.bookingStatusMessage || '');

  // Repeatable rows for hours
  const [hoursRows, setHoursRows] = useState<FormHoursRow[]>(
    (initialSettings.openingHours || []).map((oh) => ({
      id: oh.id,
      label: oh.label,
      hours: oh.hours,
      isEmergencyNote: oh.isEmergencyNote,
      isDimmed: oh.isDimmed,
    }))
  );

  useEffect(() => {
    setAddress(initialSettings.address);
    setPhone(initialSettings.phone);
    setPhoneNote(initialSettings.phoneNote || '');
    setWhatsapp(initialSettings.whatsapp || '');
    setEmail(initialSettings.email);
    setEmergencyPhone(initialSettings.emergencyPhone || '');
    setMapImageUrl(initialSettings.mapImageUrl || '');
    setMapDirectionsUrl(initialSettings.mapDirectionsUrl || '');
    setBookingStatusMessage(initialSettings.bookingStatusMessage || '');
    setHoursRows(
      (initialSettings.openingHours || []).map((oh) => ({
        id: oh.id,
        label: oh.label,
        hours: oh.hours,
        isEmergencyNote: oh.isEmergencyNote,
        isDimmed: oh.isDimmed,
      }))
    );
  }, [initialSettings]);

  // Status indicators
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Add row
  const handleAddRow = () => {
    setHoursRows([
      ...hoursRows,
      { label: '', hours: '', isEmergencyNote: false, isDimmed: false },
    ]);
  };

  // Delete row
  const handleDeleteRow = (index: number) => {
    if (hoursRows.length <= 1) {
      alert('You must have at least one opening hour row.');
      return;
    }
    setHoursRows(hoursRows.filter((_, idx) => idx !== index));
  };

  // Handle row changes
  const handleRowChange = (index: number, field: keyof FormHoursRow, value: any) => {
    setHoursRows(
      hoursRows.map((row, idx) => {
        if (idx === index) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg('');

    // Field Validations
    if (!address.trim()) return setErrorMsg('Clinic Address is required.');
    if (!phone.trim()) return setErrorMsg('Clinic Phone is required.');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setErrorMsg('Please enter a valid clinic email.');
    
    // Hours validations
    for (let i = 0; i < hoursRows.length; i++) {
      if (!hoursRows[i].label.trim() || !hoursRows[i].hours.trim()) {
        return setErrorMsg(`Row ${i + 1} inside Opening Hours list contains empty day labels or hours.`);
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings/clinic', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          phone,
          phoneNote: phoneNote.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          email,
          emergencyPhone: emergencyPhone.trim() || undefined,
          mapImageUrl: mapImageUrl.trim() || undefined,
          mapDirectionsUrl: mapDirectionsUrl.trim() || undefined,
          bookingStatusMessage: bookingStatusMessage.trim() || undefined,
          openingHours: hoursRows.map((row) => ({
            label: row.label,
            hours: row.hours,
            isEmergencyNote: row.isEmergencyNote,
            isDimmed: row.isDimmed,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings.');
      }

      setSuccess(true);
      router.refresh();
      // Update form fields with returned details to synchronize
      setAddress(data.address);
      setPhone(data.phone);
      setPhoneNote(data.phoneNote || '');
      setWhatsapp(data.whatsapp || '');
      setEmail(data.email);
      setEmergencyPhone(data.emergencyPhone || '');
      setMapImageUrl(data.mapImageUrl || '');
      setMapDirectionsUrl(data.mapDirectionsUrl || '');
      setBookingStatusMessage(data.bookingStatusMessage || '');
      setHoursRows(
        (data.openingHours || []).map((oh: OpeningHoursEntry) => ({
          id: oh.id,
          label: oh.label,
          hours: oh.hours,
          isEmergencyNote: oh.isEmergencyNote,
          isDimmed: oh.isDimmed,
        }))
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 overflow-hidden h-full">
      <main className="flex-grow flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col font-sans p-6 text-sm">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">
              Clinic Configuration Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Edit global contact details, physical address, and schedule tables. These values update across public footers and forms.
            </p>
          </header>

          {/* Settings Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
        {success && (
          <div className="p-4 rounded-xl bg-green-50 text-green-700 border border-green-200/50 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            Clinic settings updated successfully! Changes reflect on public pages immediately.
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-accent-soft text-accent border border-accent/10 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Section 1: General details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-serif font-bold text-lg text-primary border-b pb-3">
            Contact Channels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#333333] uppercase">Clinic Phone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(502) 555-0107"
                className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>

            {/* Phone note */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#333333] uppercase">Phone Note (Subtext)</label>
              <input
                type="text"
                value={phoneNote}
                onChange={(e) => setPhoneNote(e.target.value)}
                placeholder="Mon-Fri, 9am - 5pm"
                className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#333333] uppercase">Clinic Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="office@dentalcosmetic.com"
                className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>

            {/* Emergency Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#333333] uppercase">Emergency Hotline Phone</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="(502) 999-0000"
                className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#333333] uppercase">WhatsApp / Mobile Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="03245021261"
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
              />
            </div>

            {/* Booking Status Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#333333] uppercase">Booking status / availability message</label>
              <input
                type="text"
                value={bookingStatusMessage}
                onChange={(e) => setBookingStatusMessage(e.target.value)}
                placeholder="Now Accepting New Patients"
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address & Location map */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-serif font-bold text-lg text-primary border-b pb-3">
            Address & Locations
          </h2>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#333333] uppercase">Clinic Physical Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="4517 Washington Ave. Manchester, Kentucky 39495"
              className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          {/* Map Image Upload */}
          <ImageUploadField
            label="Clinic Map Image / Building Location Photo"
            folder="clinic-settings"
            value={mapImageUrl}
            onChange={(val) => setMapImageUrl(val?.url || '')}
          />

          {/* Map Directions URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#333333] uppercase">Google Map Directions Link</label>
            <input
              type="url"
              value={mapDirectionsUrl}
              onChange={(e) => setMapDirectionsUrl(e.target.value)}
              placeholder="https://google.com/maps/place/..."
              className="px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>
        </div>

        {/* Section 3: Repeatable Opening Hours entries */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-serif font-bold text-lg text-primary">
              Clinic Opening Hours
            </h2>
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Day Row
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {hoursRows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-150 relative animate-fade-in"
              >
                {/* Day label (e.g. Mon-Fri) */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Schedule Day Label
                  </span>
                  <input
                    type="text"
                    required
                    value={row.label}
                    onChange={(e) => handleRowChange(index, 'label', e.target.value)}
                    placeholder="Mon - Thu"
                    className="px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
                  />
                </div>

                {/* Hours Details */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Hours Detail Text
                  </span>
                  <input
                    type="text"
                    required
                    value={row.hours}
                    onChange={(e) => handleRowChange(index, 'hours', e.target.value)}
                    placeholder="09:00 - 18:00"
                    className="px-3 py-1.5 bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
                  />
                </div>

                {/* Checkboxes parameters */}
                <div className="col-span-10 md:col-span-3 flex flex-col gap-2 pl-2 md:pl-0 mt-2 md:mt-0">
                  {/* Emergency checkbox */}
                  <label className="flex items-center gap-1.5 select-none text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.isEmergencyNote}
                      onChange={(e) => handleRowChange(index, 'isEmergencyNote', e.target.checked)}
                      className="w-3.5 h-3.5 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    Emergency Note
                  </label>

                  {/* Dimmed checkbox */}
                  <label className="flex items-center gap-1.5 select-none text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={row.isDimmed}
                      onChange={(e) => handleRowChange(index, 'isDimmed', e.target.checked)}
                      className="w-3.5 h-3.5 text-primary border-slate-300 rounded focus:ring-primary"
                    />
                    Dimmed / Closed
                  </label>
                </div>

                {/* Delete row widget */}
                <div className="col-span-2 md:col-span-1 flex justify-end md:justify-center mt-3 md:mt-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(index)}
                    className="p-1.5 text-slate-400 hover:text-accent hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Delete row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white disabled:opacity-50 transition shadow-sm cursor-pointer w-fit"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Saving Configuration...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings
            </>
          )}
        </button>
      </form>
        </div>
      </main>
    </div>
  );
};

export default SettingsAdminContent;
