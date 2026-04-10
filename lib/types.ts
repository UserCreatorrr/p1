export interface Lead {
  [key: string]: string | number | null | undefined;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  personal_email?: string;
  mobile_number?: string;
  job_title?: string;
  headline?: string;
  seniority_level?: string;
  functional_level?: string;
  linkedin?: string;
  twitter?: string;
  company_name?: string;
  company_website?: string;
  company_linkedin?: string;
  company_size?: string | number;
  company_annual_revenue?: number;
  company_annual_revenue_clean?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  email_status?: string;
}

export type ViewMode = 'form' | 'loading' | 'results';
export type ResultsView = 'cards' | 'table';
