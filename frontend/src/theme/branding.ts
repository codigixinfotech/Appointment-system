export interface Branding {
  companyName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  borderColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle?: 'solid' | 'outline' | 'ghost';
  sidebarStyle?: 'dark' | 'light';
  navbarStyle?: 'dark' | 'light';
}
