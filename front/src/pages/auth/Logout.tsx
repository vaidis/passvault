import React from "react";
import {useNavigate } from 'react-router';
import {authApi} from '../../api/auth'

const Logout = () => {
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<'idle' | 'ok' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const response = await authApi.logout();
        if (response.success) {
          setStatus('ok');
          setSuccessMessage(response.message ?? 'Logout successful');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message: 'Logout failed');
      }
    })();
    return;
  }, [navigate]);

  if (status === 'ok') {
    return (
      <div>
        <h1>Signing out…</h1>
        <p>{successMessage}</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div>
        <h1>Logout failed</h1>
        <p>{errorMessage}</p>
        <div>
          <button onClick={() => window.location.reload()}>Retry</button>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Signing out…</h1>
    </div>
  );
}

export default Logout;
