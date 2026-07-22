import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import type { Tenant } from '../../services/db';
import { FaPlus, FaHospital, FaExternalLinkAlt, FaUserMd, FaEdit, FaCopy, FaTimes } from 'react-icons/fa';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantUrl, setSelectedTenantUrl] = useState<{ tenant: Tenant, url: string } | null>(null);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    const data = await db.getAllTenants();
    setTenants(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl  text-gray-900">SaaS Admin Panel</h1>
            <p className="text-gray-500 mt-1 text-xs">Manage your multi-tenant hospital platform</p>
          </div>
          <button
            onClick={() => navigate('/admin/hospitals/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded  text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <FaPlus /> Add New Hospital
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map(tenant => (
            <div key={tenant.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                  {tenant.logoUrl ? (
                    <img src={tenant.logoUrl} alt={tenant.brandName} className="w-full h-full object-contain p-2" />
                  ) : (
                    <FaHospital className="text-2xl text-gray-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg text-gray-900">{tenant.name}</h3>
                  <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-max mt-1">
                    {tenant.brandName}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tenant.theme.primaryColor }}></div>
                  <span>Primary Color: {tenant.theme.primaryColor}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3">
                <button
                  onClick={() => navigate(`/admin/hospitals/${tenant.id}/edit`)}
                  className="w-full p-2 bg-white hover:bg-gray-50 text-gray-700 rounded flex items-center justify-center gap-2 transition-colors border border-gray-200"
                >
                  <FaEdit /> Edit Details
                </button>
                <button
                  onClick={() => navigate(`/admin/hospitals/${tenant.id}/doctors`)}
                  className="w-full p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded  flex items-center justify-center gap-2 transition-colors border border-gray-200"
                >
                  <FaUserMd /> Manage Doctors
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/${tenant.slug}`;
                    setSelectedTenantUrl({ tenant, url });
                  }}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded  flex items-center justify-center gap-2 transition-colors border border-indigo-100"
                >
                  <FaExternalLinkAlt className="text-xs" /> Share Booking Portal
                </button>
              </div>
            </div>
          ))}

          {tenants.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-gray-300">
              <FaHospital className="text-6xl text-gray-200 mb-4" />
              <h3 className="text-xl  text-gray-700 mb-2">No Hospitals Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md">Start building your SaaS platform by adding your first hospital and customizing its branding.</p>
              <button
                onClick={() => navigate('/admin/hospitals/new')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl  flex items-center gap-2 shadow-md"
              >
                <FaPlus /> Create Hospital
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share URL Modal */}
      {selectedTenantUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg  text-gray-900">Share Booking Portal</h3>
              <button onClick={() => setSelectedTenantUrl(null)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <FaTimes />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Share this link with patients so they can book appointments at <strong>{selectedTenantUrl.tenant.name}</strong>.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={selectedTenantUrl.url}
                className="bg-transparent flex-1 outline-none text-sm text-gray-700"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedTenantUrl.url);
                  alert("Copied to clipboard!");
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FaCopy /> Copy
              </button>
              <button
                onClick={() => window.open(selectedTenantUrl.url, '_blank')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FaExternalLinkAlt /> Open Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
