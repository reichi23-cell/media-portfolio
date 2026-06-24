const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('media_items').insert([{
    id: 'test-col',
    title: 'test',
    source: 'test',
    kind: 'url',
    media_type: 'video'
  }]);
  console.log('Error:', error);
}
test();
