import type { Branding } from './branding';

export const tenants: Record<string, Branding> = {
  default: {
    companyName: 'Default SaaS',
    logoUrl: '/logos/default-logo.svg',
    primaryColor: '#4f46e5', // Indigo 600
    secondaryColor: '#db2777', // Pink 600
    accentColor: '#f59e0b', // Amber 500
    backgroundColor: '#ffffff',
    surfaceColor: '#f3f4f6', // Gray 100
    borderColor: '#e5e7eb', // Gray 200
    textColor: '#1f2937', // Gray 800
    fontFamily: '"Golos Text", sans-serif',
    borderRadius: '0.5rem',
  },
  'tenant-a': {
    companyName: 'HealthCare Plus',
    logoUrl: '/logos/healthcare-logo.svg',
    primaryColor: '#059669', // Emerald 600
    secondaryColor: '#0284c7', // Sky 600
    accentColor: '#fbbf24', // Amber 400
    backgroundColor: '#f8fafc', // Slate 50
    surfaceColor: '#ffffff',
    borderColor: '#cbd5e1', // Slate 300
    textColor: '#0f172a', // Slate 900
    fontFamily: '"Golos Text", sans-serif',
    borderRadius: '0.25rem',
  },
  'tenant-b': {
    companyName: 'Luxury Spa & Salon',
    logoUrl: '/logos/spa-logo.svg',
    primaryColor: '#9333ea', // Purple 600
    secondaryColor: '#e11d48', // Rose 600
    accentColor: '#fcd34d', // Amber 300
    backgroundColor: '#18181b', // Zinc 900 (Dark theme example)
    surfaceColor: '#27272a', // Zinc 800
    borderColor: '#3f3f46', // Zinc 700
    textColor: '#fafafa', // Zinc 50
    fontFamily: '"Golos Text", sans-serif',
    borderRadius: '1rem',
  }
};
