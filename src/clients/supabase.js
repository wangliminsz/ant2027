import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.VUE_APP_supa_url;
// const supabaseKey = process.env.VUE_APP_supa_key;




// const supabaseUrl_vite = process.env.VITE_supa_url;
// const supabaseKey_vite = process.env.VITE_supa_key;

// let supa_url = ''
// supa_url = supabaseUrl_vite.replace(/^"|"$/g, '')

// let supa_key = ''
// supa_key = supabaseKey_vite.replace(/^"|"$/g, '')


const supabaseUrl = process.env.VUE_APP_SUPA_URL;
const supabaseKey = process.env.VUE_APP_SUPA_KEY;

let supa_url = "";
supa_url = supabaseUrl ? supabaseUrl.replace(/^"|"$/g, "") : "";

let supa_key = "";
supa_key = supabaseKey ? supabaseKey.replace(/^"|"$/g, "") : "";



export const supabase = createClient(supa_url, supa_key, {
    auth: {
        signupOptions: {
            redirectTo: 'https://pass2024.vercel.app' // your custom redirect URL after sign up
        }
    }
});




// auth: {
//     signupOptions: {
//       redirectTo: 'http://localhost:3000/welcome' // your custom redirect URL after sign up
//     }
//   }