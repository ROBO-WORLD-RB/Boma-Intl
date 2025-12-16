import nodemailer from 'nodemailer';
import { config } from '../config';

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: {
    title: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  /**
   * Send order confirmation email.
   */
  async sendOrderConfirmation(data: OrderEmailData): Promise<void> {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            ${item.title} (${item.size}, ${item.color})
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ₦${item.price.toLocaleString()}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; font-size: 28px; margin: 0;">${config.app.name}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 8px;">
          <h2 style="color: #000; margin-top: 0;">Order Confirmed! 🎉</h2>
          <p>Hi ${data.customerName},</p>
          <p>Thank you for your order! We're excited to get your items to you.</p>
          
          <div style="background: #fff; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">Order ID</p>
            <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold;">${data.orderId}</p>
          </div>
          
          <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left;">Item</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px;">
                  ₦${data.totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
          
          <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-top: 30px;">Shipping Address</h3>
          <p style="margin: 0;">
            ${data.shippingAddress.fullName}<br>
            ${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
            ${data.shippingAddress.country}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Questions? Reply to this email or contact us at support@boma2025.com</p>
          <p style="margin-top: 20px;">
            <a href="${config.app.url}" style="color: #000;">Visit our store</a>
          </p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: data.customerEmail,
      subject: `Order Confirmed - ${data.orderId}`,
      html,
    });
  }

  /**
   * Send shipping notification email.
   */
  async sendShippingNotification(data: OrderEmailData): Promise<void> {
    const trackingSection = data.trackingNumber
      ? `
        <div style="background: #fff; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #666;">Tracking Number</p>
          <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold;">${data.trackingNumber}</p>
          ${
            data.trackingUrl
              ? `<a href="${data.trackingUrl}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">Track Package</a>`
              : ''
          }
        </div>
      `
      : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; font-size: 28px; margin: 0;">${config.app.name}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 8px;">
          <h2 style="color: #000; margin-top: 0;">Your Order Has Shipped! 📦</h2>
          <p>Hi ${data.customerName},</p>
          <p>Great news! Your order is on its way.</p>
          
          <div style="background: #fff; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">Order ID</p>
            <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold;">${data.orderId}</p>
          </div>
          
          ${trackingSection}
          
          <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px;">Shipping To</h3>
          <p style="margin: 0;">
            ${data.shippingAddress.fullName}<br>
            ${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
            ${data.shippingAddress.country}
          </p>
          
          <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-top: 30px;">Items in This Shipment</h3>
          <ul style="padding-left: 20px;">
            ${data.items.map((item) => `<li>${item.title} (${item.size}, ${item.color}) x ${item.quantity}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Questions about your shipment? Reply to this email.</p>
          <p style="margin-top: 20px;">
            <a href="${config.app.url}" style="color: #000;">Visit our store</a>
          </p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: data.customerEmail,
      subject: `Your Order Has Shipped - ${data.orderId}`,
      html,
    });
  }

  /**
   * Send low stock alert to admin.
   */
  async sendLowStockAlert(
    adminEmail: string,
    items: { title: string; sku: string; stockQuantity: number }[]
  ): Promise<void> {
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.sku}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: ${item.stockQuantity === 0 ? '#dc2626' : '#f59e0b'}; font-weight: bold;">
            ${item.stockQuantity}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">⚠️ Low Stock Alert</h2>
        <p>The following items are running low on stock:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: left;">SKU</th>
              <th style="padding: 12px; text-align: center;">Stock</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <p>
          <a href="${config.app.url}/admin/inventory" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">
            View Inventory
          </a>
        </p>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: adminEmail,
      subject: `[${config.app.name}] Low Stock Alert - ${items.length} items need attention`,
      html,
    });
  }

  /**
   * Generic email sending method.
   */
  private async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<void> {
    // Skip sending in development if no SMTP credentials configured
    if (config.nodeEnv === 'development' && !config.email.user) {
      console.log('📧 Email would be sent (dev mode, no SMTP configured):');
      console.log(`   To: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      console.log(`📧 Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't throw - email failures shouldn't break the main flow
    }
  }
}

export const emailService = new EmailService();
