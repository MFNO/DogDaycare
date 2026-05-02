import { Typography, Grid, Button } from "antd";
import { site } from "../config/site.js";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function ContactForm() {
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
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          {site.sections.contact}
        </Title>
        <Paragraph
          style={{
            fontSize: screens.xs ? 15 : 16,
            lineHeight: 1.75,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          {site.contactIntro}
        </Paragraph>
        <div style={{ textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            href={site.intakeFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              minHeight: 48,
              paddingLeft: 28,
              paddingRight: 28,
              fontSize: screens.xs ? 15 : 16,
            }}
          >
            {site.intakeFormButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
