const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileService() {
  console.log('🧪 Testing Profile Service...\n');

  try {
    // 1. Test profiles table exists
    console.log('1. Testing profiles table...');
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Profiles table error:', error.message);
      return;
    }
    console.log('✅ Profiles table: OK');

    // 2. Test get all profiles
    console.log('\n2. Testing get all profiles...');
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (allError) {
      console.log('❌ Get all profiles error:', allError.message);
    } else {
      console.log(`✅ Found ${allProfiles?.length || 0} profiles`);
      if (allProfiles && allProfiles.length > 0) {
        console.log('   Sample profile:', {
          id: allProfiles[0].id,
          email: allProfiles[0].email,
          role: allProfiles[0].role
        });
      }
    }

    // 3. Test user stats
    console.log('\n3. Testing user statistics...');
    const { data: statsData, error: statsError } = await supabase
      .from('profiles')
      .select('role, is_active, created_at');

    if (statsError) {
      console.log('❌ User stats error:', statsError.message);
    } else {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const stats = {
        totalUsers: statsData?.length || 0,
        activeUsers: statsData?.filter(p => p.is_active).length || 0,
        adminUsers: statsData?.filter(p => p.role === 'admin').length || 0,
        newUsersThisMonth: statsData?.filter(p => 
          new Date(p.created_at) >= thisMonth
        ).length || 0
      };
      
      console.log('✅ User statistics:', stats);
    }

    console.log('\n🎉 Profile service test completed!');

  } catch (error) {
    console.error('❌ Error during profile service test:', error);
  }
}

// Run the test
testProfileService().catch(console.error);
