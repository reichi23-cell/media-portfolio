const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('media_items').select('id, title, note');
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  console.log("DB notes:");
  data.forEach(item => {
    console.log(`[${item.id}] title="${item.title}" note="${item.note}"`);
  });
}
test();
