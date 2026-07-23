import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { tenants } from './tenants';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({
  children
}) => {
  const {
    hospitalSlug
  } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTenant = async () => {
      setLoading(true);
      let foundTenant = null;
      if (hospitalSlug) {
        foundTenant = await db.getTenantBySlug(hospitalSlug);
      }
      if (!foundTenant && hospitalSlug) {
        // If not found in DB, we could redirect to admin or 404
        navigate('/admin');
        return;
      }
      setTenant(foundTenant);
      setLoading(false);
    };
    fetchTenant();
  }, [hospitalSlug, navigate]);
  useEffect(() => {
    if (!tenant) return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', tenant.theme.primaryColor);
    root.style.setProperty('--color-secondary', tenant.theme.secondaryColor);
    root.style.setProperty('--color-accent', tenant.theme.accentColor);
    root.style.setProperty('--color-bg-base', tenant.theme.backgroundColor);
    root.style.setProperty('--color-surface', tenant.theme.surfaceColor);
    root.style.setProperty('--color-text-main', tenant.theme.textColor);
    root.style.setProperty('--color-text-sub', tenant.theme.subtextColor);

    // Set document title dynamically
    document.title = `${tenant.name} - Booking`;
  }, [tenant]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading Portal...</div>;
  }
  return <ThemeContext.Provider value={{
    theme: tenant?.theme || tenants['default'],
    tenant
  }}>
      {children}
    </ThemeContext.Provider>;
};
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};