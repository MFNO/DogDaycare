import { Row, Col, Typography, Space, Grid, Image } from "antd";
import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { site } from "../config/site.js";
import nancyImage from "../assets/nancy.png";

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

export default function About() {
  const screens = useBreakpoint();
  const pad = screens.sm ? 56 : 32;

  return (
    <div style={{ padding: `${pad}px 16px`, maxWidth: 960, margin: "0 auto" }}>
      <Title
        level={screens.xs ? 3 : 2}
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        {site.sections.about}
      </Title>
      <Row gutter={[24, 24]} align="top" style={{ marginBottom: 32 }}>
        <Col
          xs={24}
          md={10}
          lg={9}
          style={
            screens.md
              ? undefined
              : { display: "flex", justifyContent: "center", width: "100%" }
          }
        >
          <Image
            src={nancyImage}
            alt={`Image of owner - Nancy`}
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
        </Col>
        <Col xs={24} md={14} lg={15}>
          <Paragraph
            style={{
              fontSize: screens.xs ? 15 : 16,
              lineHeight: 1.75,
              marginBottom: 0,
              whiteSpace: "pre-line",
            }}
          >
            {site.aboutText}
          </Paragraph>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>
              <ClockCircleOutlined /> Hours
            </Text>
            {site.hours.map((line) => (
              <Text key={line} type="secondary" style={{ display: "block" }}>
                {line}
              </Text>
            ))}
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>
              <EnvironmentOutlined /> Location
            </Text>
            <Text
              type="secondary"
              style={{ display: "block", lineHeight: 1.7 }}
            >
              {site.location}
            </Text>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
