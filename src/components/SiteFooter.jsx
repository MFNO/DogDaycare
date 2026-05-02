import { Layout, Row, Col, Typography, Space } from 'antd';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { site } from '../config/site.js';

const { Footer } = Layout;
const { Text, Link } = Typography;

export default function SiteFooter() {
  return (
    <Footer style={{ textAlign: 'center', padding: '40px 16px' }}>
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={8}>
          <Text strong style={{ fontSize: 16 }}>
            {site.businessName}
          </Text>
        </Col>
        <Col xs={24} md={8}>
          <Space direction="vertical" size={4}>
            <Text>
              <PhoneOutlined />{' '}
              <Link href={`tel:${site.phone.replace(/\D/g, '')}`}>{site.phone}</Link>
            </Text>
            <Text>
              <MailOutlined /> <Link href={`mailto:${site.email}`}>{site.email}</Link>
            </Text>
          </Space>
        </Col>
        <Col xs={24} md={8}>
          <Space size="middle" wrap>
            {/* // TODO: replace placeholder social URLs in site.js */}
            <Link href={site.social.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </Link>
            <Link href={site.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </Link>
            <Link href={site.social.yelp} target="_blank" rel="noopener noreferrer">
              Yelp
            </Link>
          </Space>
        </Col>
      </Row>
      <Text type="secondary" style={{ display: 'block', marginTop: 24, fontSize: 13 }}>
        © {new Date().getFullYear()} {site.businessName}. All rights reserved.
      </Text>
    </Footer>
  );
}
