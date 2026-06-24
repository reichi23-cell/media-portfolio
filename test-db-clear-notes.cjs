const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('media_items').select('*');
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  let count = 0;
  for (const item of data) {
    if (item.note && (item.note.includes('直接アップロードされた') || item.note === '制作画像' || item.note === '制作動画')) {
      await supabase.from('media_items').update({ note: '' }).eq('id', item.id);
      count++;
    }
  }
  console.log(`Updated ${count} records.`);
}
test();
