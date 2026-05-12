// supabase-config.js
// Para produção no Vercel, use variáveis de ambiente

// Verifica se está no ambiente do Vercel
const isVercel = window.location.hostname.includes('vercel.app');

// Em desenvolvimento local, defina aqui
const DEV_SUPABASE_URL = 'https://epklfkzyscrcbgqjzpej.supabase.co'; // Substitua
const DEV_SUPABASE_KEY = 'sb_publishable_zjaZTZbsUVH-osxWDaNrCw_rnbrZes7'; // Substitua

// Tenta pegar do Vercel ou usa as de desenvolvimento
const SUPABASE_URL = isVercel 
    ? '{{SUPABASE_URL}}'  // Será substituído pelo Vercel
    : DEV_SUPABASE_URL;

const SUPABASE_KEY = isVercel 
    ? '{{SUPABASE_KEY}}'  // Será substituído pelo Vercel
    : DEV_SUPABASE_KEY;

// Para debug
console.log('Ambiente:', isVercel ? 'Vercel' : 'Desenvolvimento');
console.log('URL configurada:', SUPABASE_URL ? 'Sim' : 'Não');
console.log('Key configurada:', SUPABASE_KEY ? 'Sim' : 'Não');