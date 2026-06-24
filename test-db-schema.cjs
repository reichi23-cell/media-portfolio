const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('media_items').insert([{
    id: 'test-col2',
    title: 'test',
    source: 'test',
    note: 'test note',
    kind: 'url',
    media_type: 'video'
  }]);
  console.log('Error:', error);
}
test();
