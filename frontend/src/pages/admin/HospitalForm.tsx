import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../services/db';
import type { TenantTheme } from '../../services/db';
import { FaArrowLeft, FaSave, FaPalette, FaClock, FaPlus, FaTrash } from 'react-icons/fa';

export const HospitalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    slug: '',
    logoUrl: '',
    address: '',
    phone: '',
    emergencyPhone: '',
    mapEmbedUrl: '',
    upiId: '',
    googlePlaceId: '',
  });

  const [workingHours, setWorkingHours] = useState<import('../../services/db').WorkingHour[]>([
    { label: 'Mon - Fri', time: '8:00 AM - 8:00 PM', isEmergency: false },
    { label: 'Sat - Sun', time: '9:00 AM - 5:00 PM', isEmergency: false },
    { label: 'Emergency 24/7', time: '911', isEmergency: true }
  ]);

  const [theme, setTheme] = useState<TenantTheme>({
    primaryColor: '#883b4b',
    secondaryColor: '#db2777',
    accentColor: '#f59e0b',
    backgroundColor: '#fdfbfb',
    surfaceColor: '#ffffff',
    textColor: '#1f2937',
    subtextColor: '#6b7280',
  });

  useEffect(() => {
    if (id) {
      db.getTenantById(id).then(tenant => {
        if (tenant) {
          setFormData({
            name: tenant.name || '',
            brandName: tenant.brandName || '',
            slug: tenant.slug || '',
            logoUrl: tenant.logoUrl || '',
            address: tenant.address || '',
            phone: tenant.phone || '',
            emergencyPhone: tenant.emergencyPhone || '',
            mapEmbedUrl: tenant.mapEmbedUrl || '',
            upiId: tenant.upiId || '',
            googlePlaceId: tenant.googlePlaceId || '',
          });
          if (tenant.theme) setTheme(tenant.theme);
          if (tenant.workingHours) setWorkingHours(tenant.workingHours);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await db.updateTenant(id, {
        ...formData,
        workingHours,
        theme
      });
    } else {
      await db.createTenant({
        ...formData,
        workingHours,
        theme
      });
    }
    navigate('/admin');
  };

  const handleSlugify = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium mb-6 transition-colors cursor-pointer"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-white rounded p-4 border border-gray-100">
            <h2 className="text-2xl  text-gray-900 mb-6">{id ? 'Edit Hospital Details' : 'Hospital Details'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">Hospital Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. City General Hospital"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value, slug: handleSlugify(e.target.value) })}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">Brand Name (Short)</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. CityGeneral"
                  value={formData.brandName}
                  onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">URL Slug (Subdomain / Path)</label>
                <div className="flex items-center border border-gray-200 rounded overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                  <span className="bg-gray-50 p-2 text-gray-500 text-sm font-medium border-r border-gray-200">
                    /hospitals/
                  </span>
                  <input
                    required
                    type="text"
                    placeholder="city-general"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">Logo Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.logoUrl}
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">Address</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 123 Health Ave, NY"
                  value={(formData as any).address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value } as any)}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">Google Place ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                  value={(formData as any).googlePlaceId || ''}
                  onChange={e => setFormData({ ...formData, googlePlaceId: e.target.value } as any)}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">Phone Number</label>
                <input
                  required
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  value={(formData as any).phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value } as any)}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">Emergency Phone</label>
                <input
                  required
                  type="text"
                  placeholder="911 or +1 800-EMG"
                  value={(formData as any).emergencyPhone || ''}
                  onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value } as any)}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-700">Payment UPI ID (QR Code)</label>
                <input
                  required
                  type="text"
                  placeholder="hospital@upi"
                  value={(formData as any).upiId || ''}
                  onChange={e => setFormData({ ...formData, upiId: e.target.value } as any)}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                <label className="text-xs text-gray-700">Google Maps Embed Code or URL</label>
                <input
                  required
                  type="text"
                  placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ></iframe>'
                  value={(formData as any).mapEmbedUrl || ''}
                  onChange={e => {
                    let val = e.target.value;
                    const srcMatch = val.match(/src=["']([^"']+)["']/);
                    if (srcMatch) {
                      val = srcMatch[1];
                    }
                    setFormData({ ...formData, mapEmbedUrl: val } as any);
                  }}
                  className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-gray-900 flex items-center gap-2">
                <FaClock className="text-indigo-500" /> Working Hours
              </h2>
              <button
                type="button"
                onClick={() => setWorkingHours([...workingHours, { label: '', time: '', isEmergency: false }])}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1 cursor-pointer"
              >
                <FaPlus /> Add Row
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {workingHours.map((wh, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <input
                    type="text"
                    placeholder="e.g. Mon - Fri"
                    value={wh.label}
                    onChange={(e) => {
                      const newWh = [...workingHours];
                      newWh[index].label = e.target.value;
                      setWorkingHours(newWh);
                    }}
                    className="w-1/3 p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                    value={wh.time}
                    onChange={(e) => {
                      const newWh = [...workingHours];
                      newWh[index].time = e.target.value;
                      setWorkingHours(newWh);
                    }}
                    className="w-1/3 p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <label className="flex flex-1 items-center gap-2 text-xs text-gray-600 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={wh.isEmergency || false}
                      onChange={(e) => {
                        const newWh = [...workingHours];
                        newWh[index].isEmergency = e.target.checked;
                        setWorkingHours(newWh);
                      }}
                      className="cursor-pointer"
                    />
                    Emergency
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newWh = [...workingHours];
                      newWh.splice(index, 1);
                      setWorkingHours(newWh);
                    }}
                    className="text-red-400 hover:text-red-600 p-2 cursor-pointer transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              {workingHours.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No working hours defined.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded p-4 border border-gray-100">
            <h2 className="text-xl  text-gray-900 mb-6 flex items-center gap-2">
              <FaPalette className="text-indigo-500" /> Theme Customization
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-500 ">Primary / Button Solid</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-sm">{theme.primaryColor}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-500 ">Secondary / Button Outline</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={e => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-sm">{theme.secondaryColor}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-500 ">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={e => setTheme({ ...theme, backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-sm">{theme.backgroundColor}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs  text-gray-500 ">Text Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={e => setTheme({ ...theme, textColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-sm">{theme.textColor}</span>
                </div>
              </div>
            </div>

            {/* Theme Preview */}
            <div className="mt-8 p-2 rounded border border-gray-200" style={{ backgroundColor: theme.backgroundColor }}>
              <h4 className="text-sm    mb-4" style={{ color: theme.textColor }}>Live Preview</h4>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="p-2 rounded text-xs shadow-sm cursor-pointer"
                  style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
                >
                  Solid Button
                </button>
                <button
                  type="button"
                  className="p-2 rounded text-xs bg-transparent border-2 cursor-pointer"
                  style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}
                >
                  Outline Button
                </button>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded text-sm flex items-center gap-2 shadow-lg transition-all text-lg cursor-pointer"
            >
              <FaSave /> Save & Create Hospital
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
