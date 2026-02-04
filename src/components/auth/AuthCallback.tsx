import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('AuthCallback: Processing OAuth callback...');
      console.log('AuthCallback: Current URL:', window.location.href);

      // Get the hash fragment which contains the tokens
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      console.log('AuthCallback: Has access token:', !!accessToken);

      if (accessToken) {
        // Set the session using the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        console.log('AuthCallback: setSession result:', { user: data.user?.email, error });

        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login');
          return;
        }
      } else {
        // No tokens in URL, try to get existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthCallback: getSession result:', { session: session?.user?.email, error });

        if (error || !session) {
          console.error('No session found');
          navigate('/login');
          return;
        }
      }

      navigate('/');
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
