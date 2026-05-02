import { Row, Col, Card, Typography, Grid } from 'antd';
import {
  HomeOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  ScissorOutlined,
  HeartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { site } from '../config/site.js';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const icons = [
  HomeOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  ScissorOutlined,
  HeartOutlined,
  TeamOutlined,
];

export default function Services() {
  const screens = useBreakpoint();
  const pad = screens.sm ? 56 : 32;

  return (
    <div
      style={{
        background: 'rgba(239, 232, 221, 0.5)',
        padding: `${pad}px 16px`,
        maxWidth: '100%',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Title level={screens.xs ? 3 : 2} style={{ textAlign: 'center', marginBottom: 32 }}>
          {site.sections.services}
        </Title>
        <Row gutter={[16, 16]}>
          {site.services.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Col key={s.title} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  styles={{ body: { padding: screens.xs ? 20 : 24 } }}
                  style={{ height: '100%', borderColor: 'rgba(139, 115, 85, 0.12)' }}
                >
                  <Icon
                    style={{
                      fontSize: 28,
                      color: 'var(--ant-color-primary)',
                      marginBottom: 12,
                    }}
                  />
                  <Title level={5} style={{ marginTop: 0 }}>
                    {s.title}
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: 0, lineHeight: 1.65 }}>
                    {s.description}
                  </Paragraph>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
