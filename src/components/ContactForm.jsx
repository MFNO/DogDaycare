import { useState } from "react";
import { Typography, Grid, Button, Form, Input, Alert, Space, Upload } from "antd";
import { site } from "../config/site.js";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL?.trim();
const CONTRACT_MAX_BYTES = 5 * 1024 * 1024;

export default function ContactForm() {
  const screens = useBreakpoint();
  const pad = screens.sm ? 56 : 32;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [contractFileList, setContractFileList] = useState([]);
  const [contractAttachment, setContractAttachment] = useState(null);

  const contractDownloadUrl = site.contactForm.contractDownloadUrl?.trim() ?? "";

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

        {sent ? (
          <Space
            direction="vertical"
            size="middle"
            style={{
              width: "100%",
              maxWidth: 560,
              margin: "0 auto 24px",
              display: "flex",
            }}
          >
            <Alert
              type="success"
              showIcon
              message={site.contactForm.successMessage}
            />
            <Button
              type="link"
              onClick={() => {
                setSent(false);
                setSubmitError(null);
                setContractFileList([]);
                setContractAttachment(null);
                form.resetFields();
              }}
              style={{ padding: 0, alignSelf: "flex-start" }}
            >
              {site.contactForm.sendAnotherLabel}
            </Button>
          </Space>
        ) : null}

        {!CONTACT_API_URL ? (
          <Alert
            type="warning"
            showIcon
            message={site.contactForm.apiMissingHint}
            style={{ marginBottom: 24, maxWidth: 560, margin: "0 auto 24px" }}
          />
        ) : null}

        {submitError ? (
          <Alert
            type="error"
            showIcon
            message={submitError}
            style={{ marginBottom: 24, maxWidth: 560, margin: "0 auto 24px" }}
            closable
            onClose={() => setSubmitError(null)}
          />
        ) : null}

        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 560, margin: "0 auto" }}
          requiredMark={false}
          disabled={sent}
          onFinish={async (values) => {
            if (!CONTACT_API_URL) {
              setSubmitError(site.contactForm.apiMissingHint);
              return;
            }

            setSubmitError(null);
            setSubmitting(true);
            try {
              const payload = {
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone.trim(),
                message: values.message.trim(),
              };
              if (contractAttachment) {
                payload.contractBase64 = contractAttachment.base64;
                payload.contractFileName = contractAttachment.fileName;
              }

              const res = await fetch(CONTACT_API_URL, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload),
              });

              let data = {};
              try {
                data = await res.json();
              } catch {
                /* ignore */
              }

              if (!res.ok) {
                throw new Error(
                  typeof data.error === "string"
                    ? data.error
                    : "Could not send your message. Please try again.",
                );
              }

              form.resetFields();
              setContractFileList([]);
              setContractAttachment(null);
              setSent(true);
            } catch (err) {
              setSubmitError(
                err instanceof Error
                  ? err.message
                  : "Something went wrong. Please try again.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Form.Item
            label={site.contactForm.nameLabel}
            name="name"
            rules={[
              { required: true, message: "Please enter your name." },
              { max: 200, message: "Name is too long." },
            ]}
          >
            <Input size="large" autoComplete="name" />
          </Form.Item>

          <Form.Item
            label={site.contactForm.emailLabel}
            name="email"
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Enter a valid email address." },
              { max: 320, message: "Email is too long." },
            ]}
          >
            <Input size="large" type="email" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label={site.contactForm.phoneLabel}
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number." },
              { max: 40, message: "Phone number is too long." },
              {
                validator: (_, value) => {
                  const digits = String(value ?? "").replace(/\D/g, "");
                  if (digits.length < 10) {
                    return Promise.reject(
                      new Error(
                        "Enter a valid phone number with area code (10 digits).",
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input size="large" type="tel" autoComplete="tel" />
          </Form.Item>

          <Form.Item
            label={site.contactForm.messageLabel}
            name="message"
            rules={[
              { required: true, message: "Please enter a message." },
              { max: 10000, message: "Message is too long." },
            ]}
          >
            <TextArea
              rows={5}
              placeholder={site.contactForm.messagePlaceholder}
              style={{ resize: "vertical" }}
            />
          </Form.Item>

          {contractDownloadUrl ? (
            <Paragraph style={{ marginBottom: 8 }}>
              <a
                href={contractDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.contactForm.contractDownloadLabel}
              </a>
            </Paragraph>
          ) : null}

          <Form.Item
            label={site.contactForm.contractUploadLabel}
            extra={site.contactForm.contractUploadHint}
          >
            <Upload
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              maxCount={1}
              fileList={contractFileList}
              beforeUpload={(file) => {
                if (!file.name.toLowerCase().endsWith(".docx")) {
                  setSubmitError("Please choose a .docx file.");
                  return Upload.LIST_IGNORE;
                }
                if (file.size > CONTRACT_MAX_BYTES) {
                  setSubmitError("Contract file must be 5 MB or smaller.");
                  return Upload.LIST_IGNORE;
                }
                setSubmitError(null);
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = reader.result;
                  if (typeof dataUrl !== "string") return;
                  const base64 = dataUrl.includes(",")
                    ? dataUrl.slice(dataUrl.indexOf(",") + 1)
                    : dataUrl;
                  setContractAttachment({
                    base64,
                    fileName: file.name,
                  });
                  setContractFileList([
                    {
                      uid: "-contract",
                      name: file.name,
                      status: "done",
                    },
                  ]);
                };
                reader.readAsDataURL(file);
                return false;
              }}
              onRemove={() => {
                setContractFileList([]);
                setContractAttachment(null);
                return true;
              }}
            >
              <Button size="large">Choose file</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              disabled={!CONTACT_API_URL}
              style={{
                minHeight: 48,
                paddingLeft: 28,
                paddingRight: 28,
                fontSize: screens.xs ? 15 : 16,
              }}
            >
              {submitting
                ? site.contactForm.sendingLabel
                : site.contactForm.submitLabel}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
