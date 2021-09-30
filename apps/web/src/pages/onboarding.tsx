import axios from 'axios';
import { Button, Col, Form, Input, Row, Upload, Popover, Divider, message, Checkbox } from 'antd';
import { InfoCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { BlockPicker } from 'react-color';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api, getSignedUrl } from '../shared/api';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';
import { getUser, setToken } from '../shared/auth.service';
import { isServerSide } from '../shared/utils';
import { trackAnalyticsEvent } from '../shared/analytics.service';

const mimeTypes = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};

export default function Onboarding() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [color, setColor] = useState<string>('#693C72');
  const [image, setImage] = useState<string>();
  const [file, setFile] = useState<RcFile>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  useEffect(() => {
    if (!isServerSide()) {
      trackAnalyticsEvent('onboarding:started');
    }
  }, []);

  useEffect(() => {
    if (!isServerSide()) {
      const user = getUser();
      if (user?.organizationId) {
        router.push('/leaderboard');
      }
    }
  }, []);

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  function beforeUpload(data: RcFile) {
    if (!mimeTypes[data.type]) {
      return false;
    }

    setFile(data);

    return false;
  }

  async function handleUpload() {
    if (!file) return;

    setImageLoading(true);
    const { signedUrl, path } = await getSignedUrl(mimeTypes[file.type]);

    const response = await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      transformRequest: [
        (data, headers) => {
          // eslint-disable-next-line
          delete headers.common.Authorization;

          return data;
        },
      ],
    });

    setImage(path);
    setImageLoading(false);
  }

  async function submit(values) {
    if (!values.name) {
      return message.error('Name is a required field');
    }

    setLoadingSubmit(true);

    const data = {
      ...values,
      logo: image,
      color,
    };

    try {
      await api.post('/v1/organizations', data);
      const token = await api.get('/v1/auth/refresh');
      setToken(token);

      router.push('/invite');
    } catch (e) {
      message.error('Un-expected error occurred');
    } finally {
      setLoadingSubmit(false);
    }

    return true;
  }

  function onFormChange(_, values) {
    if (!values.termsAndConditions) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }

  return (
    <>
      <NavigationBar />
      <div style={{ padding: '100px 10px' }}>
        <Row justify="center">
          <Col md={6} xs={24}>
            <h1 className="hero-heading-white">
              Create
              <br />
{' '}
your
<span style={{ color: '#5ec6e8' }}> squad</span>
            </h1>
          </Col>

          <Col md={6} xs={24}>
            <Form
              onValuesChange={onFormChange}
              initialValues={{
                termsAndConditions: true,
                promotionalsEnabled: true,
              }}
              form={form}
              layout="vertical"
              onFinish={submit}>
              <Form.Item>
                <div
                  style={{ textAlign: 'center' }}
                  onClick={() => {
                    trackAnalyticsEvent('onboarding:select-logo');
                  }}>
                  <Upload
                    accept={Object.keys(mimeTypes).join(', ')}
                    name="avatar"
                    listType="picture-card"
                    data-test-id="upload-image-button"
                    showUploadList={false}
                    beforeUpload={beforeUpload}>
                    {image ? (
                      <img src={image} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      <div>
                        {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Squad Logo</div>
                      </div>
                    )}
                  </Upload>
                </div>
              </Form.Item>
              <Form.Item
                required
                requiredMark={false}
                label="Squad Name"
                tooltip="This is a required field"
                name="name">
                <Input size="large" placeholder="Write your fancy squad name here" />
              </Form.Item>

              <Form.Item
                name="company"
                label="Company / Organization name"
                tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}>
                <Input size="large" placeholder="Bring your homiez fame" />
              </Form.Item>

              <Form.Item label="Pick your squad color">
                <Popover
                  trigger="click"
                  content={
                    <BlockPicker
                      color={color}
                      colors={[
                        '#693C72',
                        '#F64662',
                        '#005874',
                        '#DD4747',
                        '#511E78',
                        '#259F6C',
                        '#FFBE00',
                        '#5170FD',
                        '#F4ABC4',
                      ]}
                      triangle="hide"
                      onChange={(selectedColor) => {
                        setColor(selectedColor.hex);
                      }}
                    />
                  }
                  placement="topLeft">
                  <Input
                    onClick={() => {
                      trackAnalyticsEvent('onboarding:select-color');
                    }}
                    size="large"
                    style={{ width: '100%' }}
                    disabled
                    data-test-id="color-picker-value"
                    addonAfter={
                      <Popover
                        trigger="click"
                        content={(
                          <BlockPicker
                            color={color}
                            triangle="hide"
                            onChange={(selectedColor) => {
                              setColor(selectedColor.hex);
                            }}
                          />
                        )}
                        placement="topLeft">
                        <ColorPreview data-test-id="color-picker" $color={color} />
                      </Popover>
                    }
                    value={color}
                  />
                </Popover>
              </Form.Item>
              <div style={{ margin: '0px 0', color: 'white' }}>
                <Form.Item valuePropName="checked" name="termsAndConditions">
                  <Checkbox style={{ marginTop: '10px', marginBottom: -20, color: 'white', fontWeight: 'normal' }}>
                    I agree to the
                    <Link href="/privacy"> privacy policy</Link>
{' '}
and<Link href="/terms"> terms and conditions</Link>
.
</Checkbox>
                </Form.Item>
                <Form.Item valuePropName="checked" name="promotionalsEnabled">
                  <Checkbox style={{ marginBottom: '20px', color: 'white', fontWeight: 'normal' }}>
                    I agree to receive promotional emails from notifire.
                  </Checkbox>
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  onClick={() => {
                    trackAnalyticsEvent('onboarding:create-account');
                  }}
                  block
                  size="large"
                  htmlType="submit"
                  type="primary"
                  disabled={imageLoading || buttonDisabled}
                  loading={loadingSubmit}>
                  CREATE ACCOUNT
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}

const ColorPreview = styled.div<{ $color: string }>`
  width: 15px;
  height: 15px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};

  &:hover {
    cursor: pointer;
  }
`;
