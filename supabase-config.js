// Configuração do Supabase
// Substitua com suas credenciais do Supabase

const SUPABASE_CONFIG = {
    url: 'https://epklfkzyscrcbgqjzpej.supabase.co', // Ex: 'https://xxxxxxxxxxxx.supabase.co'
    key: 'sb_publishable_zjaZTZbsUVH-osxWDaNrCw_rnbrZes7' // Chave anon/public
};

// Inicialize o cliente Supabase após instalar: npm install @supabase/supabase-js
// ou adicione via CDN no HTML

// Descomente quando instalar o Supabase:
// const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

// Estrutura das tabelas para criar NO SUPABASE:
/*
CREATE TABLE comidas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE brincadeiras (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  premio DECIMAL(10,2),
  duracao INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE participantes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  fantasia VARCHAR(255),
  tipo VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE barracas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  responsavel VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
*/