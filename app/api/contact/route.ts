import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface EmailTemplateProps {
  headerTitle: string;
  senderField: string;
  subjectField: string;
  protocolStatus: string;
  payloadContent: string;
  buttonText: string;
  buttonUrl: string;
}

// Shared layout wrapper matching your deep background visual workspace
const generateEmailTemplate = ({
  headerTitle,
  senderField,
  subjectField,
  protocolStatus,
  payloadContent,
  buttonText,
  buttonUrl,
}: EmailTemplateProps): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');
          body { margin: 0; padding: 0; background-color: #11131c; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
          table { border-collapse: collapse; width: 100%; }
          .wrapper { background-color: #0c0e17; padding: 40px 20px; min-h: 100%; }
          .container { max-width: 600px; margin: 0 auto; width: 100%; }
          .header { color: #ff79c6; font-size: 16px; font-weight: 600; letter-spacing: 0.05em; margin-bottom: 20px; text-transform: uppercase; }
          .terminal-card { background-color: #11131c; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 4px; padding: 24px; }
          .meta-box { background-color: #191b24; border-radius: 2px; padding: 16px; margin-bottom: 24px; }
          .meta-label { color: #928f9e; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; width: 90px; padding-bottom: 8px; vertical-align: top; }
          .meta-value { color: #e1e1ef; font-size: 13px; font-weight: 500; padding-bottom: 8px; word-break: break-all; }
          .message-box { background-color: #11131c; border-radius: 2px; padding: 4px 0px; position: relative; }
          .protocol-line { color: #928f9e; font-size: 13px; font-weight: 400; margin: 0 0 16px 0; font-family: monospace; }
          .payload-text { color: #e1e1ef; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap; }
          .quote-mark { color: #2e303a; font-size: 32px; font-family: serif; position: absolute; right: 0; top: -10px; font-weight: bold; }
          .action-container { text-align: center; margin-top: 32px; }
          .gradient-btn { display: inline-block; background: #bd93f9; background: linear-gradient(90deg, #bd93f9 0%, #ff79c6 100%); color: #11131c !important; text-decoration: none !important; padding: 12px 32px; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; box-shadow: 0 4px 24px rgba(255, 121, 198, 0.15); }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <span style="font-size: 14px; margin-right: 6px;">✉</span> ${headerTitle}
            </div>
            
            <div class="terminal-card">
              <div class="meta-box">
                <table>
                  <tr>
                    <td class="meta-label">SENDER</td>
                    <td class="meta-value">${senderField}</td>
                  </tr>
                  <tr>
                    <td class="meta-label" style="padding-bottom: 0;">SUBJECT</td>
                    <td class="meta-value" style="color: #c5c0ff; padding-bottom: 0;">${subjectField}</td>
                  </tr>
                </table>
              </div>
              
              <div class="message-box">
                <span class="quote-mark">”</span>
                <p class="protocol-line">${protocolStatus}</p>
                <p class="payload-text">${payloadContent}</p>
              </div>
            </div>
            
            <div class="action-container">
              <a href="${buttonUrl}" class="gradient-btn">${buttonText}</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Please provide both an email and a message." },
        { status: 400 },
      );
    }

    const parsedName = name?.trim() || email.split("@")[0] || "Website Visitor";

    // Read variables matching your specific configuration keys exactly
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.RECEIVER_EMAIL || smtpUser;

    if (!smtpUser || !smtpPass) {
      console.error(
        "Configuration Error: Missing SMTP_USER or SMTP_PASS environment variables.",
      );
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    // Configure connection using your explicit keys
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for port 465 SSL, false for 587 TLS
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 1. INBOUND TRANSMISSION (Sent to your personal inbox)
    const adminHtml = generateEmailTemplate({
      headerTitle: "New Contact Form Submission",
      senderField: `${parsedName} (${email})`,
      subjectField: `New message from your portfolio website`,
      protocolStatus: "Message details:",
      payloadContent: message,
      buttonText: "↩ Reply to Message",
      buttonUrl: `mailto:${email}`,
    });

    const adminMailOptions = {
      from: `"${parsedName}" <${smtpUser}>`,
      to: receiverEmail,
      subject: `New Portfolio Message: From ${parsedName}`,
      html: adminHtml,
      replyTo: email,
    };

    // 2. RECEIPT CONFIRMATION (Sent out to the client)
    const visitorHtml = generateEmailTemplate({
      headerTitle: "Message Received",
      senderField: "Kimberley Madoya",
      subjectField: "Thank you for reaching out",
      protocolStatus: "Here is a copy of the message you sent:",
      payloadContent: `Hi ${parsedName},\n\nThank you for getting in touch! I have received your message and will get back to you as soon as possible.\n\n---\n\nYour message:\n"${message}"`,
      buttonText: "↩ Return to Website",
      buttonUrl: "https://portfolio-theta-neon-h0l8yeezbo.vercel.app/",
    });

    const visitorMailOptions = {
      from: `"Kimberley Madoya" <${smtpUser}>`,
      to: email,
      subject: `Message Received - Kimberley Madoya`,
      html: visitorHtml,
    };

    // Dispatch streams simultaneously
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(visitorMailOptions),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error("Error sending email:", errorDetails);

    return NextResponse.json(
      {
        error: "Failed to send the message. Please try again later.",
      },
      { status: 500 },
    );
  }
}
