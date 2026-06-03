-- Crear la tabla para guardar snapshots del plan de estudios
CREATE TABLE public.user_plan_snapshots (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    datos_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS (Seguridad a Nivel de Fila)
ALTER TABLE public.user_plan_snapshots ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso: Los usuarios solo pueden ver y editar sus propios snapshots
CREATE POLICY "Users can insert their own plan snapshots"
    ON public.user_plan_snapshots FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own plan snapshots"
    ON public.user_plan_snapshots FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own plan snapshots"
    ON public.user_plan_snapshots FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plan snapshots"
    ON public.user_plan_snapshots FOR DELETE
    USING (auth.uid() = user_id);

-- Índice para mejorar el rendimiento de búsqueda por usuario
CREATE INDEX idx_user_plan_snapshots_user_id ON public.user_plan_snapshots(user_id);
