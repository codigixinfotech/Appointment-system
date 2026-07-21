import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import type { Tenant } from '../../services/db';
import { FaPlus, FaHospital, FaExternalLinkAlt, FaUserMd, FaEdit } from 'react-icons/fa';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);

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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">SaaS Admin Panel</h1>
            <p className="text-gray-500 mt-1">Manage your multi-tenant hospital platform</p>
          </div>
          <button
            onClick={() => navigate('/admin/hospitals/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-colors"
          >
            <FaPlus /> Add New Hospital
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map(tenant => (
            <div key={tenant.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                  {tenant.logoUrl ? (
                    <img src={tenant.logoUrl} alt={tenant.brandName} className="w-full h-full object-contain p-2" />
                  ) : (
                    <FaHospital className="text-2xl text-gray-300" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{tenant.name}</h3>
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
                  className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-200"
                >
                  <FaEdit /> Edit Details
                </button>
                <button
                  onClick={() => navigate(`/admin/hospitals/${tenant.id}/doctors`)}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-200"
                >
                  <FaUserMd /> Manage Doctors
                </button>
                <a
                  href={`/${tenant.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors border border-indigo-100"
                >
                  <FaExternalLinkAlt className="text-xs" /> Visit Booking Portal
                </a>
              </div>
            </div>
          ))}

          {tenants.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-gray-300">
              <FaHospital className="text-6xl text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Hospitals Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md">Start building your SaaS platform by adding your first hospital and customizing its branding.</p>
              <button
                onClick={() => navigate('/admin/hospitals/new')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md"
              >
                <FaPlus /> Create Hospital
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
