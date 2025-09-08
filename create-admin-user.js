const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Create user with email and password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@shopwithus.com',
      password: 'admin123456',
      options: {
        data: {
          name: 'Admin User',
          role: 'admin'
        }
      }
    });

    if (authError) {
      console.log('❌ Auth error:', authError.message);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', authData.user?.email);
    console.log('🆔 User ID:', authData.user?.id);
    
    // Create profile in profiles table
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: 'Admin User',
          email: 'admin@shopwithus.com',
          role: 'admin',
          is_verified: true
        })
        .select();

      if (profileError) {
        console.log('⚠️  Profile creation error:', profileError.message);
      } else {
        console.log('✅ Admin profile created successfully!');
        console.log('👤 Profile:', profileData[0]);
      }
    }

    console.log('\n🎉 Admin user setup complete!');
    console.log('📧 Email: admin@shopwithus.com');
    console.log('🔑 Password: admin123456');
    console.log('🔐 Role: admin');

  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

createAdminUser();