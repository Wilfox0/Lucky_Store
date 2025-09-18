// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// رابط مشروعك على Supabase
const SUPABASE_URL = "https://hetysfxvbbgunqxmcauu.supabase.co";

// المفتاح الذي حصلت عليه (API Key)
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldHlzZnh2YmJndW5xeG1jYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjI4MTMsImV4cCI6MjA3MzY5ODgxM30.o8v4wXJOzDkxsrhQQnVFlsaDAwJrdmlvpPwhD74HGdg";

// إنشاء عميل Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
