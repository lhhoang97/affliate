const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixAuthIssue() {
  try {
    console.log('🔧 Fixing Authentication Issues...\n');

    // 1. Check if user already exists
    console.log('1. Checking existing users...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (user) {
      console.log('✅ User already logged in:', user.email);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.log('⚠️  Profile not found, creating...');
        
        // Try to create profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || 'Admin User',
            role: 'admin'
          })
          .select();

        if (createError) {
          console.error('❌ Profile creation failed:', createError.message);
          console.log('\n💡 Manual fix needed:');
          console.log('1. Go to Supabase Dashboard');
          console.log('2. Go to Authentication > Users');
          console.log('3. Find user:', user.email);
          console.log('4. Go to Table Editor > profiles');
          console.log('5. Insert row with:');
          console.log(`   id: ${user.id}`);
          console.log(`   email: ${user.email}`);
          console.log('   name: Admin User');
          console.log('   role: admin');
        } else {
          console.log('✅ Profile created:', newProfile[0].email);
        }
      } else {
        console.log('✅ Profile exists:', profile.email);
      }
    } else {
      console.log('⚠️  No user logged in');
      
      // Try to sign in with test credentials
      console.log('\n2. Trying to sign in...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'hoang@shopwithus.com',
        password: 'password123'
      });

      if (loginError) {
        console.error('❌ Login failed:', loginError.message);
        console.log('\n💡 Manual fix needed:');
        console.log('1. Go to Supabase Dashboard');
        console.log('2. Go to Authentication > Users');
        console.log('3. Create new user:');
        console.log('   Email: hoang@shopwithus.com');
        console.log('   Password: password123');
        console.log('4. Go to Table Editor > profiles');
        console.log('5. Insert row with the user ID and role: admin');
      } else {
        console.log('✅ Login successful:', loginData.user?.email);
      }
    }

    console.log('\n🎯 Quick Fix Instructions:');
    console.log('1. Go to Supabase Dashboard');
    console.log('2. Authentication > Users > Add User');
    console.log('3. Email: hoang@shopwithus.com');
    console.log('4. Password: password123');
    console.log('5. Table Editor > profiles > Insert');
    console.log('6. Use the user ID and set role: admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAuthIssue();
