import { GithubLoginButton } from 'react-social-login-buttons';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { setToken } from '../shared/auth.service';

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    if (router.query.token && typeof window !== 'undefined') {
      setToken(router.query.token as string);
      router.push('/onboarding');
    }
  }, [router.query]);

  return (
    <>
      <div className="container-fluid p-0 h-100">
        <div className="row">
          <div className="col-md-6">
            <GithubLoginButton style={{ maxWidth: 300 }} onClick={() => window.open('localhost:3000/v1/auth/github')} />
          </div>
        </div>
      </div>
    </>
  );
}
