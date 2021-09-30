import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Checkbox, Form, Spin } from 'antd';
import { GithubLoginButton } from 'react-social-login-buttons';
import { IOrganizationEntity } from '@hacksquad/shared/src';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';
import { isServerSide } from '../shared/utils';
import { api, AUTH_URL } from '../shared/api';
import { getUser } from '../shared/auth.service';

export default function AcceptInvite() {
  const router = useRouter();
  const [squad, setSquad] = useState<IOrganizationEntity>();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    termsAndConditions: true,
    promotionalsEnabled: true,
  });
  useEffect(() => {
    if (!isServerSide() && router.query.token) {
      loadInviteSquad(router.query.token as string);
    }
  }, [router]);

  useEffect(() => {
    if (!isServerSide()) {
      const user = getUser();

      if (user?.organizationId) {
        // router.push('/leaderboard');
      }
    }
  }, []);

  async function loadInviteSquad(token: string) {
    const response = await api.get(`/v1/organizations/token/${token}`);
    setSquad(response);
  }

  if (!squad) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  function formChanged(_, values) {
    if (!values.termsAndConditions) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }

    setFormData(values);
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
        <Avatar size={100} src={squad?.logo}>
          {squad?.name[0]}
        </Avatar>

        <div className="title-grey-400" style={{ marginBottom: -10, marginTop: 30 }}>
          Accept your hacksquad invite
        </div>
        <h1 className="hero-heading-white" style={{ marginBottom: 70 }}>
          Join
          <span style={{ color: '#5ec6e8' }}> {squad?.name}</span>
        </h1>
        <Form
          onValuesChange={formChanged}
          initialValues={{
            promotionalsEnabled: true,
            termsAndConditions: true,
          }}>
          <div style={{ margin: '0px 0', color: 'white' }}>
            <Form.Item valuePropName="checked" name="termsAndConditions">
              <Checkbox style={{ marginTop: '10px', marginBottom: -20, color: 'white', fontWeight: 'normal' }}>
                I agree to the <Link href="/rules"> rules</Link>,<Link href="/privacy"> privacy policy</Link>
{' '}
and
<Link href="/terms"> terms and conditions</Link>.
              </Checkbox>
            </Form.Item>
            <Form.Item valuePropName="checked" name="promotionalsEnabled">
              <Checkbox style={{ marginBottom: '20px', color: 'white', fontWeight: 'normal' }}>
                I agree to receive promotional emails from notifire.
              </Checkbox>
            </Form.Item>
          </div>
          <ButtonWrapper disabled={buttonDisabled}>
            <GithubLoginButton
              style={{ maxWidth: 300 }}
              onClick={() =>
                window.open(
                  `${AUTH_URL}?token=${router?.query?.token}&promotionalsEnabled=${formData?.promotionalsEnabled}&termsAndConditions=${formData?.termsAndConditions}`
                )}
            />
          </ButtonWrapper>
        </Form>
      </div>

      <Footer />
    </>
  );
}

const ButtonWrapper = styled.div<{ disabled: boolean }>`
  text-align: center;
  display: flex;
  justify-content: center;

  ${({ disabled }) =>
    disabled
      ? css`
          pointer-events: none;
          opacity: 0.5;
        `
      : null}
`;
