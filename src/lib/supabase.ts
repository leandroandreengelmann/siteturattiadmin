import { createClient } from '@supabase/supabase-js'

// Cria um cliente Supabase usando variáveis de ambiente
// Essas variáveis devem ser definidas no seu ambiente de implantação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey); 