import axios from 'axios';
import { Button, Col, Form, Input, Row, Upload, Popover, Divider, message } from 'antd';
import { InfoCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { BlockPicker } from 'react-color';

import styled from 'styled-components';
import { useRouter } from 'next/router';
import { api, getSignedUrl } from '../shared/api';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';
import { setToken } from '../shared/auth.service';

const mimeTypes = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};

export default function () {
  const router = useRouter();
  const [form] = Form.useForm();
  const [color, setColor] = useState<string>('#693C72');
  const [image, setImage] = useState<string>();
  const [file, setFile] = useState<RcFile>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  function beforeUpload(data: RcFile) {
    if (!mimeTypes[data.type]) {
      return false;
    }

    setFile(data);

    return false;
  }

  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

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

  return (
    <>
      <NavigationBar />
      <div style={{ padding: '100px 0' }}>
        <Row justify="center">
          <Col span={6}>
            <h1 className="hero-heading-white">
              Create
              <br />
{' '}
your
<span style={{ color: '#5ec6e8' }}> squad</span>
            </h1>
          </Col>

          <Col span={6}>
            <Form form={form} layout="vertical" onFinish={submit}>
              <Form.Item>
                <div style={{ textAlign: 'center' }}>
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
              <Divider />
              <Form.Item>
                <Button
                  block
                  size="large"
                  htmlType="submit"
                  type="primary"
                  disabled={imageLoading}
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