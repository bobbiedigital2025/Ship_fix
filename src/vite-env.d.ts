/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_RESTRICTED_KEY: string;
  readonly RESEND_API_KEY: string;
  readonly SUPPORT_EMAIL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
