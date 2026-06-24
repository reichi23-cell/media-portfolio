const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('media_items').select('*').order('created_at', { ascending: false }).limit(5);
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  console.log(data.map(d => ({ id: d.id, kind: d.kind, aspect_ratio: d.aspect_ratio })));
}
test();
