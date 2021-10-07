import { Button, Col, Form, Input, Row, Upload, Popover, Divider, message, Avatar, Tooltip } from 'antd';
import {
  InfoCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import capitalize from 'lodash.capitalize';
import { api, getSignedUrl } from '../../shared/api';
import { NavigationBar } from '../../components/shared/NavBar';
import { Footer } from '../../components/landing';
import { trackAnalyticsEvent } from '../../shared/analytics.service';
import { isServerSide } from '../../shared/utils';
import { Contributions } from '../../components/Contributions';

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

export default function Squad(data) {
  const [form] = Form.useForm();
  const router = useRouter();
  const { slug } = router.query;
  const [squad, setSquad] = useState({});

  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (!isServerSide()) {
      trackAnalyticsEvent('sqaud:started');
    }

    loadSquad();
  }, [slug]);

  async function loadSquad() {
    if (slug) {
      const organization = await api.get(`/v1/organizations/${slug}`);
      const members = await api.get(`/v1/organizations/${slug}/members`);
      const contributions = await api.get(`/v1/organizations/${slug}/contributions`);

      organization.members = members || [];
      organization.contributions = contributions || [];
      setSquad(organization);
    }
  }

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

      <div>
        <Row justify="center">
          <Col md={10} sm={24} xs={24}>
            <h1 className="hero-heading-white">
              <span style={{ color: `${squad?.color}` }}> {squad?.name}</span>
            </h1>
            <h5 className="h5-title-white">{squad?.tagline}</h5>
          </Col>
        </Row>
      </div>

      <Row justify="center">
        <Col md={10} sm={24} xs={24}>
          <AvatarGroupWrapper>
            <Avatar.Group>
              {squad?.members?.map((member) => {
                return (
                  <Tooltip
                    key={member?._id}
                    title={`${capitalize(member?.firstName || member?.username)}`}
                    placement="top">
                    <a target="_blank" href={`https://github.com/${member?.username}`}>
                      <Avatar
                        style={{ backgroundColor: '#87d068' }}
                        src={member?.profilePicture}
                        icon={<UserOutlined />}
                      />
                    </a>
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          </AvatarGroupWrapper>
        </Col>
      </Row>

      <Row justify="center">
        <Col md={10} sm={24} xs={24}>
          {squad?._id && <Contributions items={squad ? squad?.contributions : []} />}
        </Col>
      </Row>
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

const AvatarGroupWrapper = styled.div`
  @media screen and (max-width: 1024px) {
    display: none !important;
  }
`;
