import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// 1. PUBLIC CLIENT: Safe for both Browser and Server
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. ADMIN CLIENT: Only allowed to run on the Server
// We wrap this in a check to stop the browser from crashing
export const supabaseAdmin = 
  typeof window === "undefined" 
    ? createClient(supabaseUrl, serviceRoleKey) 
    : (null as any);