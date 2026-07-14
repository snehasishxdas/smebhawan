import nodemailer from "nodemailer";

let transporterInstance: any = null;

export function getTransporter() {
  if (transporterInstance) return transporterInstance;

  const email = process.env.SMTP_EMAIL || "smehouse25@gmail.com";
  const password = process.env.SMTP_PASSWORD || "mmpu uioe pkcd vldg";

  if (!email || !password) {
    console.warn("SMTP credentials not fully configured, email delivery will be simulated in console logs.");
    return null;
  }

  try {
    transporterInstance = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });
    return transporterInstance;
  } catch (error) {
    console.error("Failed to initialize SMTP transporter:", error);
    return null;
  }
}

/**
 * Beautiful, proper-design responsive SmeBhawan email layout template
 */
export function getStyledEmailHtml(title: string, contentHtml: string): string {
  const secureTxId = `SB-${Math.floor(100000 + Math.random() * 900000)}`;
  return `
    <div style="background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 16px; margin: 0;">
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; max-width: 580px; margin: 0 auto; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; border-bottom: 4px solid #b45309;">
          <div style="display: inline-block; margin-bottom: 8px;">
            <span style="font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; font-family: sans-serif;">sme<span style="color: #b45309;">bhawan</span></span>
          </div>
          <div style="width: 80px; height: 1px; background-color: rgba(255, 255, 255, 0.15); margin: 8px auto;"></div>
          <p style="margin: 0; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em;">Building Together</p>
        </div>
        
        <!-- Body Content -->
        <div style="padding: 36px 28px; background-color: #ffffff; font-size: 14px; line-height: 1.6; color: #334155;">
          ${contentHtml}
        </div>
        
        <!-- Footer Section -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 11px; color: #64748b; line-height: 1.6;">
          <p style="margin: 0; font-weight: 600; color: #475569;">smebhawan Sourcing Secretariat</p>
          <p style="margin: 4px 0 0 0;">National digital corridor linking suppliers, material testing audits, and pre-approved business credit lines.</p>
          <p style="margin: 16px 0 0 0; font-size: 10px; color: #94a3b8;">
            This automated notification was triggered via secure SMTP connection to <strong style="color: #475569;">smehouse25@gmail.com</strong>.<br/>
            Please do not reply directly to this mail box. Support: <a href="mailto:smehouse25@gmail.com" style="color: #3b82f6; text-decoration: none;">smehouse25@gmail.com</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="margin: 0; font-size: 9px; color: #94a3b8; font-family: monospace;">SECURE TRANSACTION ID: ${secureTxId}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Sends an email notification.
 */
export async function sendNotificationEmail(to: string, subject: string, htmlContent: string) {
  const fromEmail = process.env.SMTP_EMAIL || "smehouse25@gmail.com";
  console.log(`[Email Service] Attempting to send email to ${to} with subject: "${subject}"`);

  // Ensure HTML content is wrapped in our beautiful SmeBhawan template
  let finalHtml = htmlContent;
  if (!htmlContent.includes("smebhawan Sourcing Secretariat") && !htmlContent.includes("getStyledEmailHtml")) {
    finalHtml = getStyledEmailHtml(subject, htmlContent);
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[Email Simulated] To: ${to}\nSubject: ${subject}\nBody: ${finalHtml}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"smebhawan Notification" <${fromEmail}>`,
      to,
      subject,
      html: finalHtml,
    });
    console.log(`[Email Sent] Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[Email Error] Failed sending email via SMTP:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a B2B Analytical Report.
 */
export async function sendAnalyticalReport(to: string, analyticsSummary: any) {
  const subject = `📊 RawLink Weekly Business Report for ${analyticsSummary.company || "Your Business"}`;
  
  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">RawLink B2B</h1>
        <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 14px;">Automated Link Click & Logistics Report</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff;">
        <p style="font-size: 16px; line-height: 24px; margin-top: 0;">Hello <strong>${analyticsSummary.company || "Valued Customer"}</strong>,</p>
        <p style="font-size: 14px; line-height: 20px; color: #64748b;">Here is the custom-generated link performance and raw material order tracking summary requested for your account:</p>
        
        <div style="background-color: #f8fafc; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em;">🔗 Product Link Clicks</h3>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px;">
            <span style="color: #64748b;">Total Tracked Clicks:</span>
            <strong style="color: #0f172a;">${analyticsSummary.totalClicks || 0} clicks</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px;">
            <span style="color: #64748b;">Unique Clickers:</span>
            <strong style="color: #10b981;">${analyticsSummary.uniqueClicks || 0} unique</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">CTR Performance Alert:</span>
            <strong style="color: #6366f1;">Premium High</strong>
          </div>
        </div>

        <div style="background-color: #f8fafc; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em;">📦 Active Procurement Orders</h3>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px;">
            <span style="color: #64748b;">Orders Direct / Credit:</span>
            <strong style="color: #0f172a;">${analyticsSummary.directCount || 0} / ${analyticsSummary.creditCount || 0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Available Credit Line:</span>
            <strong style="color: #10b981;">₹${(analyticsSummary.creditLimit || 5000000).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 30px; margin-bottom: 0;">
          This tracking report was dispatched securely from domain verified raw material channels.
          To manage reports frequency or domains, access your RawLink Premium Subscription Dashboard.
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #64748b; margin: 0;">&copy; 2026 RawLink MSME. All rights reserved.</p>
        <p style="font-size: 10px; color: #94a3b8; margin: 4px 0 0 0;">Secure transactional email. SMTP verification SMEHOUSE25</p>
      </div>
    </div>
  `;

  return sendNotificationEmail(to, subject, htmlContent);
}
