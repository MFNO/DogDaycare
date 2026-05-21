import { Row, Col, Card, Typography, Grid } from "antd";
import { site } from "../config/site.js";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

export default function Reviews() {
  const screens = useBreakpoint();
  const pad = screens.sm ? 56 : 32;

  return (
    <div
      style={{
        background: "rgba(239, 232, 221, 0.5)",
        padding: `${pad}px 16px`,
        maxWidth: "100%",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Title
          level={screens.xs ? 3 : 2}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          {site.sections.reviews}
        </Title>
        <Row gutter={[24, 24]}>
          {site.reviews.map((review) => (
            <Col key={review.author} xs={24} md={12}>
              <Card
                style={{
                  height: "100%",
                  borderColor: "rgba(139, 115, 85, 0.12)",
                }}
                styles={{ body: { padding: screens.xs ? 20 : 24 } }}
              >
                <Paragraph
                  style={{
                    fontSize: screens.xs ? 15 : 16,
                    lineHeight: 1.75,
                    marginBottom: 16,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;{review.quote}&rdquo;
                </Paragraph>
                <Text strong>— {review.author}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
