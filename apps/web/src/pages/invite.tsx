import { Button, Col, Form, Input, Row, Upload, Popover, Divider, message } from 'antd';
import { InfoCircleOutlined, LoadingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api, getSignedUrl } from '../shared/api';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';
import { trackAnalyticsEvent } from '../shared/analytics.service';
import { isServerSide } from '../shared/utils';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

export default function InvitePage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (!isServerSide()) {
      trackAnalyticsEvent('invite:started');
    }
  }, []);

  async function submit({ emails }) {
    setLoading(true);

    try {
      await api.post('/v1/organizations/invite', {
        emails: emails.filter((i) => i),
      });

      message.success('Invites sent successfully');
      router.push('/leaderboard');
    } catch (e) {
      message.error('Error while sending invites');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavigationBar />
      <Wrapper style={{ padding: '100px 0' }}>
        <Row justify="center" gutter={100}>
          <Col span={6}>
            <Form form={form} layout="vertical" initialValues={{ emails: ['', '', ''] }} onFinish={submit}>
              <Form.List name="emails" rules={[]}>
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayout)}
                        label={index === 0 ? 'Squad Members (up to 5 including you)' : ''}
                        required={false}
                        key={field.key}>
                        <Form.Item
                          style={{ width: '100%' }}
                          {...field}
                          validateTrigger={['onBlur']}
                          rules={[
                            { type: 'email' },
                            {
                              whitespace: true,
                              message: 'Please input member email or delete this field.',
                            },
                          ]}
                          noStyle>
                          <Input type="email" placeholder="Member E-mail" style={{ width: 'calc(100% - 40px)' }} />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                        ) : null}
                      </Form.Item>
                    ))}
                    {fields.length < 4 ? (
                      <Form.Item>
                        <Button
                          type="dashed"
                          ghost
                          onClick={() => add()}
                          style={{ width: '100%' }}
                          icon={<PlusOutlined />}
                        />
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    ) : null}
                  </>
                )}
              </Form.List>
              <Divider />

              <Form.Item>
                <Button
                  size="large"
                  type="primary"
                  block
                  htmlType="submit"
                  loading={loading}
                  onClick={() => {
                    trackAnalyticsEvent('invite:send-invite');
                  }}>
                  INVITE
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center' }}>
              <Link href="/leaderboard">
                <Button
                  type="link"
                  style={{ color: '#cfcfcf' }}
                  onClick={() => {
                    trackAnalyticsEvent('invite:skip-invite');
                  }}>
                  Skip and invite later
                </Button>
              </Link>
            </div>
          </Col>

          <Col span={6}>
            <h1 className="hero-heading-white">
              Invite
              <br />
{' '}
squad
<span style={{ color: '#5ec6e8' }}> members</span>
            </h1>
          </Col>
        </Row>
      </Wrapper>
      <Footer />
    </>
  );
}

const Wrapper = styled.div`
  .dynamic-delete-button {
    position: relative;
    top: 4px;
    margin: 0 8px;
    color: #999;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .dynamic-delete-button:hover {
    color: #777;
  }

  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .ant-divider {
    border-top-color: rgba(255, 255, 255, 0.31);
  }
`;
