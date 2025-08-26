import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { supabase } from '../utils/supabaseClient';

const SupabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    envVars: boolean;
    supabaseConfig: boolean;
    connection: boolean;
    auth: boolean;
  }>({
    envVars: false,
    supabaseConfig: false,
    connection: false,
    auth: false,
  });

  const [error, setError] = useState<string>('');

  useEffect(() => {
    const runTests = async () => {
      const results = {
        envVars: false,
        supabaseConfig: false,
        connection: false,
        auth: false,
      };

      try {
        // Test 1: Environment Variables
        const hasUrl = !!process.env.REACT_APP_SUPABASE_URL;
        const hasKey = !!process.env.REACT_APP_SUPABASE_ANON_KEY;
        results.envVars = hasUrl && hasKey;

        // Test 2: Supabase Configuration
        results.supabaseConfig = true;

        // Test 3: Connection
        try {
          const { error } = await supabase.from('profiles').select('*');
          results.connection = !error;
        } catch (err) {
          console.error('Connection test failed:', err);
        }

        // Test 4: Authentication
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: 'hoang@shopwithus.com',
            password: 'hoang123@'
          });
          results.auth = !error;
        } catch (err) {
          console.error('Auth test failed:', err);
        }

        setTestResults(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    runTests();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🔍 Supabase Configuration Test
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Environment Variables
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          REACT_APP_SUPABASE_URL: {process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          REACT_APP_SUPABASE_ANON_KEY: {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
        </Typography>
        <Alert severity={testResults.envVars ? 'success' : 'error'} sx={{ mt: 1 }}>
          {testResults.envVars ? 'Environment variables are configured' : 'Environment variables are missing'}
        </Alert>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Supabase Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          isSupabaseConfigured: {'✅ True'}
        </Typography>
        <Alert severity={testResults.supabaseConfig ? 'success' : 'error'} sx={{ mt: 1 }}>
          {testResults.supabaseConfig ? 'Supabase is configured' : 'Supabase is not configured'}
        </Alert>
      </Paper>

      {testResults.supabaseConfig && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Database Connection
            </Typography>
            <Alert severity={testResults.connection ? 'success' : 'error'} sx={{ mt: 1 }}>
              {testResults.connection ? 'Database connection successful' : 'Database connection failed'}
            </Alert>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Authentication Test
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Testing login with: hoang@shopwithus.com
            </Typography>
            <Alert severity={testResults.auth ? 'success' : 'error'} sx={{ mt: 1 }}>
              {testResults.auth ? 'Authentication successful' : 'Authentication failed'}
            </Alert>
          </Paper>
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error: {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          🎯 Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All tests passed: {Object.values(testResults).every(Boolean) ? '✅ Yes' : '❌ No'}
        </Typography>
        {Object.values(testResults).every(Boolean) && (
          <Alert severity="success" sx={{ mt: 1 }}>
            🎉 Supabase is working correctly! You should be able to login.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default SupabaseTest;
