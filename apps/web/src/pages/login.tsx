import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Spin } from 'antd';
import { getUser, setToken } from '../shared/auth.service';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (router.query.token && typeof window !== 'undefined') {
      setToken(router.query.token as string);

      if (!getUser()?.organizationId) {
        router.push('/onboarding');
      } else {
        router.push('/leaderboard');
      }
    }
  }, [router.query]);

  return (
    <>
      <div className="container-fluid p-0 h-100">
        <div className="row">
          <div className="col-md-6">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
              <Spin size="large" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
