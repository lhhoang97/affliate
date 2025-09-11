const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createProfiles() {
  try {
    console.log('👥 Creating profiles for existing users...\n');

    // List of users from the screenshot
    const users = [
      {
        id: '9fab30e5-613d-45b1-9b69-4a30d7566e2d',
        email: 'testuser@gmail.com',
        name: 'Test User',
        role: 'user'
      },
      {
        id: '82c567ff-e813-4f02-984d-b2a353be4101',
        email: 'hoanglehuy1197@gmail.com',
        name: 'Hoang Le Huy',
        role: 'user'
      },
      {
        id: 'c1613617-1bd5-47e1-acf5-50c34618921d',
        email: 'chichut37@gmail.com',
        name: 'Chi Chu',
        role: 'user'
      },
      {
        id: '36e2c0ba-9d84-4834-a03a-facea24aa45a',
        email: 'hoang@shopwithus.com',
        name: 'Hoang Admin',
        role: 'admin'
      },
      {
        id: '9c3c28aa-2cbe-49a2-bb32-5acf4fd534c0',
        email: 'admin@shopwithus.com',
        name: 'Admin User',
        role: 'admin'
      }
    ];

    console.log('1. Checking existing profiles...');
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email');

    if (profilesError) {
      console.error('❌ Error checking profiles:', profilesError.message);
      return;
    }

    const existingIds = existingProfiles.map(p => p.id);
    console.log(`Found ${existingProfiles.length} existing profiles`);

    console.log('\n2. Creating missing profiles...');
    const profilesToCreate = users.filter(user => !existingIds.includes(user.id));

    if (profilesToCreate.length === 0) {
      console.log('✅ All profiles already exist!');
    } else {
      console.log(`Creating ${profilesToCreate.length} new profiles...`);

      for (const user of profilesToCreate) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              phone: '+84 123 456 789',
              address: '123 Main Street, Ho Chi Minh City',
              bio: user.role === 'admin' ? 'System Administrator' : 'Regular User'
            })
            .select();

          if (error) {
            console.error(`❌ Error creating profile for ${user.email}:`, error.message);
          } else {
            console.log(`✅ Created profile for ${user.email} (${user.role})`);
          }
        } catch (err) {
          console.error(`❌ Error creating profile for ${user.email}:`, err.message);
        }
      }
    }

    console.log('\n3. Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'hoang@shopwithus.com',
      password: 'password123'
    });

    if (loginError) {
      console.error('❌ Login test failed:', loginError.message);
      console.log('\n💡 You may need to reset the password:');
      console.log('1. Go to Supabase Dashboard > Authentication > Users');
      console.log('2. Find hoang@shopwithus.com');
      console.log('3. Click "..." > "Reset Password"');
      console.log('4. Set new password: password123');
    } else {
      console.log('✅ Login test successful!');
      console.log('Logged in as:', loginData.user?.email);
      
      // Sign out
      await supabase.auth.signOut();
      console.log('✅ Signed out');
    }

    console.log('\n🎉 Profile creation completed!');
    console.log('\n📋 Available login credentials:');
    console.log('Admin: hoang@shopwithus.com / password123');
    console.log('Admin: admin@shopwithus.com / password123');
    console.log('User: testuser@gmail.com / password123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createProfiles();
