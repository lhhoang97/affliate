const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createTestUser() {
  try {
    console.log('👤 Creating test user...\n');

    // 1. Create user in auth
    console.log('1. Creating user in auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'hoang@shopwithus.com',
      password: 'password123',
      options: {
        data: {
          name: 'Hoang Admin'
        }
      }
    });

    if (authError) {
      console.error('❌ Auth signup error:', authError.message);
      return;
    }

    console.log('✅ User created in auth:', authData.user?.email);

    // 2. Create profile
    console.log('\n2. Creating profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'hoang@shopwithus.com',
        name: 'Hoang Admin',
        role: 'admin',
        phone: '+84 123 456 789',
        address: '123 Admin Street, Ho Chi Minh City',
        bio: 'System Administrator'
      })
      .select();

    if (profileError) {
      console.error('❌ Profile creation error:', profileError.message);
      return;
    }

    console.log('✅ Profile created:', profileData[0].email);

    // 3. Test login
    console.log('\n3. Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'hoang@shopwithus.com',
      password: 'password123'
    });

    if (loginError) {
      console.error('❌ Login test failed:', loginError.message);
      return;
    }

    console.log('✅ Login successful:', loginData.user?.email);

    // 4. Sign out
    await supabase.auth.signOut();
    console.log('✅ Signed out');

    console.log('\n🎉 Test user created successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Email: hoang@shopwithus.com');
    console.log('Password: password123');
    console.log('Role: admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();

