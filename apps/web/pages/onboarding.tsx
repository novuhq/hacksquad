import axios from 'axios';
import { Button, Col, Form, Input, Row, Upload } from 'antd';
import { InfoCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { RcFile } from 'antd/es/upload';

import { getSignedUrl } from '../shared/api';

const mimeTypes = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};

export default function () {
  const [form] = Form.useForm();
  const [image, setImage] = useState<string>();
  const [file, setFile] = useState<RcFile>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);

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

  return (
    <>
      <Row justify="center">
        <Col span={6}>
          <Form form={form} layout="vertical">
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
            <Form.Item label="Squad Name" tooltip="This is a required field">
              <Input size="large" placeholder="Write your fancy squad name here" />
            </Form.Item>

            <Form.Item
              label="Company / Organization name"
              tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}>
              <Input size="large" placeholder="Bring your homiez fame" />
            </Form.Item>

            <Form.Item>
              <Button block size="large">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
