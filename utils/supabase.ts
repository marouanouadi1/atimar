import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uceyjnufppsgmdsienxb.supabase.co/rest/v1/";
const supabasePublishableKey = "sb_publishable_n-GRebkz0HXY5NXrIYOaYQ_m3H6TZvr";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
