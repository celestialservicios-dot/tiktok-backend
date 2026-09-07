-- =================================================================
-- Esquema de Base de Datos para PostgreSQL (Neon, Supabase, Render, Railway, etc.)
-- =================================================================

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    inicio_sesion VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(250) NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para acelerar búsquedas por nombre de usuario
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 2. Tabla de Códigos de Verificación
CREATE TABLE IF NOT EXISTS codigos (
    id_codigo SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    codigo VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para acelerar consultas de códigos por usuario
CREATE INDEX IF NOT EXISTS idx_codigos_user_id ON codigos(user_id);
