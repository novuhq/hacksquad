import axios from 'axios';
import { Button, Col, Form, Input, Row, Upload, Popover, Divider, message, Checkbox } from 'antd';
import { InfoCircleOutlined, LoadingOutlined, PlusOutlined, RetweetOutlined } from '@ant-design/icons';
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
import { fullColorList, getRandomColor, getRandomName } from '../shared/content-generators.service';

const mimeTypes = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};

export default function Onboarding() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [color, setColor] = useState<string>();

  const [image, setImage] = useState<string>();
  const [companyImage, setCompanyImage] = useState<string>();
  const [companyImageLoading, setCompanyImageLoading] = useState<boolean>();
  const [file, setFile] = useState<RcFile>();
  const [companyFile, setCompanyFile] = useState<RcFile>();

  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (!isServerSide()) {
      trackAnalyticsEvent('onboarding:started');
    }
  }, []);
  useEffect(() => {
    if (!isServerSide()) {
      setColor(getRandomColor());
      form.setFieldsValue({ name: getRandomName() });
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
    if (companyFile) {
      handleCompanyUpload();
    }
  }, [companyFile]);

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  function beforeCompanyImageUpload(data: RcFile) {
    if (!mimeTypes[data.type]) {
      return false;
    }

    setCompanyFile(data);

    return false;
  }

  function beforeUpload(data: RcFile) {
    if (!mimeTypes[data.type]) {
      return false;
    }

    setFile(data);

    return false;
  }

  async function handleCompanyUpload() {
    if (!companyFile) return;

    setCompanyImageLoading(true);
    const { signedUrl, path } = await getSignedUrl(mimeTypes[companyFile.type]);

    const response = await axios.put(signedUrl, companyFile, {
      headers: {
        'Content-Type': companyFile.type,
      },
      transformRequest: [
        (data, headers) => {
          // eslint-disable-next-line
          delete headers.common.Authorization;

          return data;
        },
      ],
    });

    setCompanyImage(path);
    setCompanyImageLoading(false);
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
      companyLogo: companyImage,
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
            <br />
            <br />
            <p style={{ maxWidth: '80%' }}>
              {' '}
              <span style={{ color: '#5ec6e8', textTransform: 'uppercase' }}> did you know?</span>
              <br />
              Once you're done, we collect all OS approved commits auto-magically. <br />
              <br />
              <span style={{ color: '#5ec6e8', textTransform: 'uppercase' }}> dont forget!!</span>
              <br />
              Register to
{' '}
              <a href="https://hacktoberfest.digitalocean.com/register" target="_blank">
                Hacktoberfest
              </a>
{' '}
              to qualify for their swag, and
{' '}
              <a href="https://hacktoberfest.digitalocean.com" target="_blank">
                learn more
              </a>
              .
            </p>
          </Col>

          <Col md={6} xs={24}>
            <Form onValuesChange={onFormChange} initialValues={{}} form={form} layout="vertical" onFinish={submit}>
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
                <Input
                  size="large"
                  addonAfter={
                    <RetweetOutlined
                      onClick={() => {
                        form.setFieldsValue({ name: getRandomName() });
                      }}
                    />
                  }
                  placeholder="Write your fancy squad name here"
                />
              </Form.Item>
              <Form.Item label="Squad Tagline" tooltip="A catchy phrase for your squad" name="tagline">
                <Input maxLength={40} size="large" placeholder="A catchy phrase for your squad" />
              </Form.Item>

              <Form.Item label="Pick your squad color">
                <Popover
                  trigger="click"
                  content={
                    <BlockPicker
                      color={color}
                      colors={fullColorList}
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
                        content={
                          <BlockPicker
                            color={color}
                            colors={fullColorList}
                            triangle="hide"
                            onChange={(selectedColor) => {
                              setColor(selectedColor.hex);
                            }}
                          />
                        }
                        placement="topLeft">
                        <ColorPreview data-test-id="color-picker" $color={color} />
                      </Popover>
                    }
                    value={color}
                  />
                </Popover>
              </Form.Item>

              <Row>
                <Col span={24}>
                  <h5 style={{ color: 'white', fontSize: 16, marginBottom: 0 }}>Tag your company (optional)</h5>
                  <p style={{ fontSize: 14, lineHeight: '16px' }}>
                    We will calculate your company score based on all squads participating.
                  </p>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name="company"
                    label="Company / Organization name"
                    tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}>
                    <Input size="large" placeholder="Bring your homiez fame" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item>
                    <div
                      style={{ textAlign: 'center' }}
                      onClick={() => {
                        trackAnalyticsEvent('onboarding:select-company-logo');
                      }}>
                      <Upload
                        accept={Object.keys(mimeTypes).join(', ')}
                        name="avatar"
                        listType="picture-card"
                        data-test-id="upload-image-button"
                        showUploadList={false}
                        beforeUpload={beforeCompanyImageUpload}>
                        {companyImage ? (
                          <img src={companyImage} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                          <div>
                            {companyImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                            <div style={{ marginTop: 8 }}>Company Logo</div>
                          </div>
                        )}
                      </Upload>
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ margin: '0px 0', color: 'white' }}>
                <Form.Item valuePropName="checked" name="termsAndConditions">
                  <Checkbox style={{ marginTop: '10px', marginBottom: -20, color: 'white', fontWeight: 'normal' }}>
                    I agree to the
                    <Link href="/rules"> rules</Link>
                    ,<Link href="/privacy"> privacy policy</Link>
                    {' '}
                    and
<Link href="/terms"> terms and conditions</Link>
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
