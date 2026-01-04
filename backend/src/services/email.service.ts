import { transporter, FROM_EMAIL, ADMIN_EMAIL } from '../config/email.config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  /**
   * Send email
   */
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      });
      console.log(`✅ Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to Clarify!';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Clarify!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>Thank you for creating an account! We're excited to have you join the Clarify community.</p>
              <p><strong>Clarify</strong> is your professional text processing toolkit with 15+ specialized tools, AI integration, and support for 7 languages.</p>
              <h3>What's next?</h3>
              <ul>
                <li>🚀 Download Clarify for your platform</li>
                <li>📚 Explore our documentation</li>
                <li>💡 Check out 15+ powerful tools</li>
                <li>🤖 Try AI-powered features (OpenAI + Gemini)</li>
              </ul>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/download" class="button">Download Now</a>
              <p>If you have any questions, feel free to reach out to us!</p>
            </div>
            <div class="footer">
              <p>© 2026 Clarify. All rights reserved.</p>
              <p>This email was sent to ${userEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const subject = 'Reset Your Password - Clarify';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your Clarify account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you access the link above</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 Clarify. All rights reserved.</p>
              <p>This email was sent to ${userEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }

  /**
   * Send contact form auto-reply
   */
  static async sendContactAutoReply(userEmail: string, userName: string): Promise<boolean> {
    const subject = 'We received your message - Clarify Support';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Thank You for Contacting Us!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>Thank you for reaching out to Clarify support. We've received your message and our team will review it shortly.</p>
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>📧 Our support team will respond within 24 hours</li>
                <li>🔍 We'll investigate your inquiry thoroughly</li>
                <li>💬 You'll receive a detailed response via email</li>
              </ul>
              <p>In the meantime, you might find these resources helpful:</p>
              <ul>
                <li><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/docs">📚 Documentation</a></li>
                <li><a href="https://github.com/Jvieyrah/clarify/issues">🐛 GitHub Issues</a></li>
                <li><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/features">✨ Features</a></li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2026 Clarify. All rights reserved.</p>
              <p>This email was sent to ${userEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: userEmail, subject, html });
  }

  /**
   * Notify admin of new contact message
   */
  static async notifyAdminNewContact(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    const subject = `New Contact Message: ${contactData.subject}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .field { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; }
            .label { font-weight: bold; color: #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📬 New Contact Message Received</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div>${contactData.name} (${contactData.email})</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div>${contactData.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div style="white-space: pre-wrap;">${contactData.message}</div>
              </div>
              <p style="margin-top: 20px;">
                <a href="mailto:${contactData.email}?subject=Re: ${contactData.subject}" 
                   style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Reply to ${contactData.name}
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: ADMIN_EMAIL, subject, html });
  }

  /**
   * Send new release notification to newsletter subscribers
   */
  static async sendReleaseNotification(
    subscriberEmail: string,
    version: string,
    releaseNotes: string
  ): Promise<boolean> {
    const subject = `🚀 Clarify ${version} is Now Available!`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .release-notes { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .unsubscribe { color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Version Available!</h1>
              <h2>Clarify ${version}</h2>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We're excited to announce that <strong>Clarify ${version}</strong> is now available for download!</p>
              <div class="release-notes">
                <h3>📝 What's New:</h3>
                <div style="white-space: pre-wrap;">${releaseNotes}</div>
              </div>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/download" class="button">Download Now</a>
              <p>Thank you for being part of the Clarify community!</p>
            </div>
            <div class="footer">
              <p>© 2026 Clarify. All rights reserved.</p>
              <p class="unsubscribe">
                Don't want these updates? 
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?email=${subscriberEmail}">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: subscriberEmail, subject, html });
  }
}
