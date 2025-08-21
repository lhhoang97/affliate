// Create Admin User Script
// This script creates an admin user that can be used for web login

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwOTQ4MCwiZXhwIjoyMDcxMjg1NDgwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // Use service role key

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@shopwithus.com',
      password: 'Admin123!@#',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Auth user created successfully:', authData.user.id);

    // Step 2: Insert profile into profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'admin@shopwithus.com',
        full_name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }

    console.log('Profile created successfully:', profileData);

    // Step 3: Verify the admin user
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@shopwithus.com')
      .single();

    if (verifyError) {
      console.error('Error verifying user:', verifyError);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@shopwithus.com');
    console.log('🔑 Password: Admin123!@#');
    console.log('🆔 User ID:', authData.user.id);
    console.log('👤 Role:', verifyData.role);
    console.log('');
    console.log('🌐 You can now login to your web application with these credentials!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
createAdminUser();
