import { Row, Col, Card, Typography, Grid } from 'antd';
import Icon, {
  HomeOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  HeartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { site } from '../config/site.js';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const WalkSvg = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 13 16.8 14 19 14v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
  </svg>
);
const WalkOutlined = (props) => <Icon component={WalkSvg} {...props} />;

const icons = [
  HomeOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  WalkOutlined,
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
              <Col key={s.title} xs={24} sm={12} md={12}>
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
