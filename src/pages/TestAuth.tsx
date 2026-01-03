import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const TestAuth = () => {
  const [status, setStatus] = useState<string>('Idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [email, setEmail] = useState('testuser@dayflow.com');
  const [password, setPassword] = useState('123456');

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    addLog('Checking Supabase connection...');
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      addLog(`❌ Connection Error: ${error.message}`);
    } else {
      addLog(`✅ Connected! Profiles count: ${data}`);
    }
  };

  const textToColor = (text: string) => {
    if (text.includes('❌')) return 'text-red-500';
    if (text.includes('✅')) return 'text-green-500';
    return 'text-gray-700';
  }

  const createTestUser = async () => {
    try {
      setStatus('Creating Auth User...');
      addLog('🚀 Starting Test User Creation...');

      // 1. SignUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User',
            employee_id: 'TEST-' + Date.now(),
            role: 'EMPLOYEE'
          }
        }
      });

      if (authError) {
        addLog(`❌ Auth SignUp Failed: ${authError.message}`);
        setStatus('Failed');
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        addLog('❌ Auth succeeded but no User ID returned (User might already exist)');
        // Try to sign in instead
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          addLog(`❌ Fallback Sign In Failed: ${signInError.message}`);
          setStatus('Failed');
          return;
        }
        addLog(`ℹ️ User already existed, signed in as: ${signInData.user.id}`);
        // return; // Continue to fix profile
        // Use the signed-in ID
        // We might need to ensure we are using THIS id for profile creation
      } else {
        addLog(`✅ Auth User Created: ${userId}`);
      }

      const activeUserId = authData.user?.id || (await supabase.auth.getUser()).data.user?.id;
      if (!activeUserId) throw new Error("No active user ID found");

      // 2. Check Profile
      setStatus('Checking Profile...');
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', activeUserId).maybeSingle();

      if (profile) {
        addLog(`✅ Profile already exists for ${profile.email}`);
      } else {
        addLog('⚠️ Profile missing. Attempting manual insert...');
        const { error: insertError } = await supabase.from('profiles').insert({
          id: activeUserId,
          email: email,
          full_name: 'Test User',
          employee_id: 'TEST-' + Date.now(),
          role: 'EMPLOYEE'
        });

        if (insertError) {
          addLog(`❌ Profile Insert Failed: ${insertError.message}`);
        } else {
          addLog('✅ Profile created manually!');
        }
      }

      // 3. Check Employee Profile
      const { data: empProfile } = await supabase.from('employee_profiles').select('*').eq('user_id', activeUserId).maybeSingle();
      if (!empProfile) {
        addLog('Creating Employee Profile...');
        const { error: empError } = await supabase.from('employee_profiles').insert({
          user_id: activeUserId,
          department: 'Testing',
          designation: 'Tester',
          join_date: new Date().toISOString().split('T')[0]
        });
        if (empError) addLog(`❌ Employee Profile Error: ${empError.message}`);
        else addLog('✅ Employee Profile created!');
      } else {
        addLog('✅ Employee Profile exists');
      }

      setStatus('Success');
      addLog('🎉 User ready! You can now login with these credentials.');

    } catch (e: any) {
      addLog(`❌ Critical Error: ${e.message}`);
      setStatus('Error');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Diagnostic & Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Test Email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <Button onClick={createTestUser} disabled={status === 'Creating Auth User...'}>
            {status === 'Idle' ? 'Create/Fix Test User' : status}
          </Button>

          <div className="bg-slate-900 text-slate-50 p-4 rounded-md h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className={textToColor(log)}>{log}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
