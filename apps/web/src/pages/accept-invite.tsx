import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { GithubLoginButton } from 'react-social-login-buttons';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';
import { isServerSide } from '../shared/utils';
import { api, AUTH_URL } from '../shared/api';
import { setToken } from '../shared/auth.service';

export default function AcceptInvite() {
  const router = useRouter();

  useEffect(() => {
    if (!isServerSide()) {
      // acceptInvite();
    }
  }, [router]);

  async function acceptInvite() {
    const { token } = router.query;
    if (!token) return;

    await api.post('/v1/organization/invite/accept', {
      token,
    });

    const jwt = await api.get('/v1/auth/refresh');
    setToken(jwt);

    router.push('/leaderboard');
  }

  return (
    <>
      <NavigationBar />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '100px 0',
          flexDirection: 'column',
        }}>
        <h1 className="hero-heading-white">
          Join the
          <span style={{ color: '#5ec6e8' }}> Company</span>
{' '}
Squad
</h1>
        <GithubLoginButton
          style={{ maxWidth: 300 }}
          onClick={() => window.open(`${AUTH_URL}?token=${router?.query?.token}`)}
        />
      </div>
      <Footer />
    </>
  );
}
