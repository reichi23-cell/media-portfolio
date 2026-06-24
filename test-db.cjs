const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('media_items').insert([{
    id: 'test-insert-uuid',
    title: 'test',
    source: 'test',
    kind: 'url',
    media_type: 'video'
  }]);
  console.log('Insert attempt error:', error);
}
test();
