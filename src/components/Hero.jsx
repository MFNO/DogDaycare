import { Row, Col, Button, Typography, Grid, Image } from "antd";
import bannerImage from "../assets/banner.png";
import { site } from "../config/site.js";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function Hero() {
  const screens = useBreakpoint();
  const isSm = screens.sm;

  return (
    <div
      style={{
        background:
          "linear-gradient(160deg, #faf7f2 0%, #efe8dd 45%, #e8dfd2 100%)",
        padding: isSm ? "72px 24px 88px" : "48px 16px 64px",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Row justify="center" gutter={[0, 24]}>
        <Col xs={24} md={20} lg={16} style={{ textAlign: "center" }}>
          <Image
            src={bannerImage}
            alt={`${site.businessName} banner`}
            style={{
              maxWidth: "100%",
              maxHeight: 650,
              width: "auto",
              height: "auto",
              display: "block",
            }}
            preview={{
              mask: "View",
            }}
          />
          <Title
            level={isSm ? 1 : 2}
            style={{
              marginBottom: 16,
              fontSize: screens.xs ? 28 : screens.sm ? 40 : 46,
              lineHeight: 1.15,
              wordBreak: "break-word",
            }}
          >
            {site.businessName}
          </Title>
          <Paragraph
            type="secondary"
            style={{
              fontSize: screens.xs ? 15 : 17,
              maxWidth: 560,
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            {site.tagline}
          </Paragraph>
          <Button
            type="primary"
            size="large"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            style={{
              minHeight: 48,
              paddingLeft: 28,
              paddingRight: 28,
              fontSize: screens.xs ? 15 : 16,
            }}
          >
            {site.heroCtaLabel}
          </Button>
        </Col>
      </Row>
    </div>
  );
}
