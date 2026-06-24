const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('media_items').select('*').limit(1);
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  console.log("DB schema:", Object.keys(data[0] || {}));
}
test();
