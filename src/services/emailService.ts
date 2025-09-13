import { supabase } from '../utils/supabaseClient';

// Email template types
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  loginUrl: string;
}

export interface OrderConfirmationData {
  userName: string;
  userEmail: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress?: string;
}

export interface PasswordResetData {
  userName: string;
  userEmail: string;
  resetUrl: string;
  expiryTime: string;
}

export interface PriceAlertData {
  userName: string;
  userEmail: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  productUrl: string;
  discount: number;
}

export interface NewDealData {
  userName: string;
  userEmail: string;
  dealTitle: string;
  dealDescription: string;
  dealUrl: string;
  discount: number;
  validUntil: string;
}

// Email templates
const templates = {
  welcome: (data: WelcomeEmailData): EmailTemplate => ({
    subject: `🎉 Chào mừng đến với BestFinds, ${data.userName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chào mừng đến với BestFinds</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Chào mừng đến với BestFinds!</h1>
            <p>Tìm kiếm những deal tốt nhất với giá cả hợp lý</p>
          </div>
          <div class="content">
            <h2>Xin chào ${data.userName}!</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại BestFinds. Chúng tôi rất vui được chào đón bạn trở thành thành viên của cộng đồng tìm kiếm deal tốt nhất!</p>
            
            <h3>🚀 Bạn có thể làm gì với tài khoản:</h3>
            <ul>
              <li>📱 Theo dõi các deal hot nhất mỗi ngày</li>
              <li>❤️ Lưu sản phẩm yêu thích vào wishlist</li>
              <li>💰 Nhận thông báo khi giá sản phẩm giảm</li>
              <li>🛒 Mua sắm an toàn qua affiliate links</li>
              <li>⭐ Đánh giá và review sản phẩm</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${data.loginUrl}" class="button">Bắt đầu khám phá ngay!</a>
            </div>
            
            <p><strong>Mẹo nhỏ:</strong> Theo dõi BestFinds để không bỏ lỡ những deal cực hot!</p>
          </div>
          <div class="footer">
            <p>BestFinds - Tìm kiếm deal tốt nhất cho bạn</p>
            <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🎉 Chào mừng đến với BestFinds!
      
      Xin chào ${data.userName}!
      
      Cảm ơn bạn đã đăng ký tài khoản tại BestFinds. Chúng tôi rất vui được chào đón bạn trở thành thành viên của cộng đồng tìm kiếm deal tốt nhất!
      
      Bạn có thể làm gì với tài khoản:
      - 📱 Theo dõi các deal hot nhất mỗi ngày
      - ❤️ Lưu sản phẩm yêu thích vào wishlist  
      - 💰 Nhận thông báo khi giá sản phẩm giảm
      - 🛒 Mua sắm an toàn qua affiliate links
      - ⭐ Đánh giá và review sản phẩm
      
      Bắt đầu khám phá: ${data.loginUrl}
      
      BestFinds - Tìm kiếm deal tốt nhất cho bạn
    `
  }),

  orderConfirmation: (data: OrderConfirmationData): EmailTemplate => ({
    subject: `✅ Xác nhận đơn hàng #${data.orderId} - BestFinds`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đơn hàng</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Đơn hàng đã được xác nhận!</h1>
            <p>Mã đơn hàng: #${data.orderId}</p>
          </div>
          <div class="content">
            <h2>Xin chào ${data.userName}!</h2>
            <p>Cảm ơn bạn đã đặt hàng tại BestFinds. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
            
            <div class="order-details">
              <h3>📦 Chi tiết đơn hàng:</h3>
              ${data.orderItems.map(item => `
                <div class="item">
                  <span>${item.name} x ${item.quantity}</span>
                  <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              <div class="item total">
                <span>Tổng cộng:</span>
                <span>$${data.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            ${data.shippingAddress ? `
              <div class="order-details">
                <h3>📍 Địa chỉ giao hàng:</h3>
                <p>${data.shippingAddress}</p>
              </div>
            ` : ''}
            
            <p><strong>Bước tiếp theo:</strong> Bạn sẽ được chuyển hướng đến trang thanh toán của nhà bán để hoàn tất giao dịch.</p>
          </div>
          <div class="footer">
            <p>BestFinds - Tìm kiếm deal tốt nhất cho bạn</p>
            <p>Nếu bạn có câu hỏi, vui lòng liên hệ support@bestfinds.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ✅ Đơn hàng đã được xác nhận!
      
      Xin chào ${data.userName}!
      
      Cảm ơn bạn đã đặt hàng tại BestFinds. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
      
      Mã đơn hàng: #${data.orderId}
      
      Chi tiết đơn hàng:
      ${data.orderItems.map(item => `- ${item.name} x ${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      Tổng cộng: $${data.totalAmount.toFixed(2)}
      
      ${data.shippingAddress ? `Địa chỉ giao hàng: ${data.shippingAddress}` : ''}
      
      Bước tiếp theo: Bạn sẽ được chuyển hướng đến trang thanh toán của nhà bán để hoàn tất giao dịch.
      
      BestFinds - Tìm kiếm deal tốt nhất cho bạn
    `
  }),

  passwordReset: (data: PasswordResetData): EmailTemplate => ({
    subject: `🔐 Đặt lại mật khẩu - BestFinds`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đặt lại mật khẩu</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef3cd; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Đặt lại mật khẩu</h1>
            <p>Yêu cầu đặt lại mật khẩu cho tài khoản BestFinds</p>
          </div>
          <div class="content">
            <h2>Xin chào ${data.userName}!</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản BestFinds của bạn.</p>
            
            <div style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Đặt lại mật khẩu ngay</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Lưu ý quan trọng:</strong>
              <ul>
                <li>Link này sẽ hết hạn vào: <strong>${data.expiryTime}</strong></li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                <li>Để bảo mật, không chia sẻ link này với bất kỳ ai</li>
              </ul>
            </div>
            
            <p>Nếu bạn gặp khó khăn, hãy copy và paste link sau vào trình duyệt:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${data.resetUrl}
            </p>
          </div>
          <div class="footer">
            <p>BestFinds - Tìm kiếm deal tốt nhất cho bạn</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🔐 Đặt lại mật khẩu
      
      Xin chào ${data.userName}!
      
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản BestFinds của bạn.
      
      Đặt lại mật khẩu: ${data.resetUrl}
      
      ⚠️ Lưu ý quan trọng:
      - Link này sẽ hết hạn vào: ${data.expiryTime}
      - Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này
      - Để bảo mật, không chia sẻ link này với bất kỳ ai
      
      BestFinds - Tìm kiếm deal tốt nhất cho bạn
    `
  }),

  priceAlert: (data: PriceAlertData): EmailTemplate => ({
    subject: `💰 Giá giảm! ${data.productName} - BestFinds`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Giá sản phẩm giảm</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .price-comparison { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .old-price { text-decoration: line-through; color: #666; font-size: 18px; }
          .new-price { color: #dc2626; font-size: 24px; font-weight: bold; }
          .discount { background: #dc2626; color: white; padding: 5px 10px; border-radius: 20px; font-weight: bold; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Giá sản phẩm giảm!</h1>
            <p>Sản phẩm bạn quan tâm đang có giá tốt</p>
          </div>
          <div class="content">
            <h2>Xin chào ${data.userName}!</h2>
            <p>Sản phẩm bạn đã lưu vào wishlist đang có giá tốt hơn!</p>
            
            <div class="price-comparison">
              <h3>${data.productName}</h3>
              <div style="margin: 20px 0;">
                <div class="old-price">$${data.oldPrice.toFixed(2)}</div>
                <div class="new-price">$${data.newPrice.toFixed(2)}</div>
                <div class="discount">Tiết kiệm ${data.discount}%</div>
              </div>
              <a href="${data.productUrl}" class="button">Xem sản phẩm ngay</a>
            </div>
            
            <p><strong>⚡ Nhanh tay lên!</strong> Deal này có thể kết thúc sớm.</p>
          </div>
          <div class="footer">
            <p>BestFinds - Tìm kiếm deal tốt nhất cho bạn</p>
            <p>Để tắt thông báo giá, vui lòng vào trang cá nhân và cập nhật cài đặt.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      💰 Giá sản phẩm giảm!
      
      Xin chào ${data.userName}!
      
      Sản phẩm bạn đã lưu vào wishlist đang có giá tốt hơn!
      
      ${data.productName}
      Giá cũ: $${data.oldPrice.toFixed(2)}
      Giá mới: $${data.newPrice.toFixed(2)}
      Tiết kiệm: ${data.discount}%
      
      Xem sản phẩm: ${data.productUrl}
      
      ⚡ Nhanh tay lên! Deal này có thể kết thúc sớm.
      
      BestFinds - Tìm kiếm deal tốt nhất cho bạn
    `
  }),

  newDeal: (data: NewDealData): EmailTemplate => ({
    subject: `🔥 Deal mới! ${data.dealTitle} - BestFinds`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deal mới</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .deal-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .discount-badge { background: #dc2626; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔥 Deal mới!</h1>
            <p>Không bỏ lỡ cơ hội mua sắm tốt nhất</p>
          </div>
          <div class="content">
            <h2>Xin chào ${data.userName}!</h2>
            <p>Chúng tôi vừa tìm thấy một deal cực hot dành cho bạn!</p>
            
            <div class="deal-card">
              <h3>${data.dealTitle}</h3>
              <div class="discount-badge">Giảm ${data.discount}%</div>
              <p>${data.dealDescription}</p>
              <p><strong>⏰ Hạn đến:</strong> ${data.validUntil}</p>
              <div style="text-align: center;">
                <a href="${data.dealUrl}" class="button">Xem deal ngay</a>
              </div>
            </div>
            
            <p><strong>⚡ Deal này có thể kết thúc sớm!</strong> Nhanh tay đặt hàng để không bỏ lỡ cơ hội.</p>
          </div>
          <div class="footer">
            <p>BestFinds - Tìm kiếm deal tốt nhất cho bạn</p>
            <p>Để tắt thông báo deal, vui lòng vào trang cá nhân và cập nhật cài đặt.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🔥 Deal mới!
      
      Xin chào ${data.userName}!
      
      Chúng tôi vừa tìm thấy một deal cực hot dành cho bạn!
      
      ${data.dealTitle}
      Giảm: ${data.discount}%
      Mô tả: ${data.dealDescription}
      Hạn đến: ${data.validUntil}
      
      Xem deal: ${data.dealUrl}
      
      ⚡ Deal này có thể kết thúc sớm! Nhanh tay đặt hàng để không bỏ lỡ cơ hội.
      
      BestFinds - Tìm kiếm deal tốt nhất cho bạn
    `
  })
};

// Email service functions
export class EmailService {
  // Send welcome email when user registers
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    try {
      const loginUrl = `${window.location.origin}/login`;
      const template = templates.welcome({
        userName,
        userEmail,
        loginUrl
      });

      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      console.log('✅ Welcome email sent successfully to:', userEmail);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw error;
    }
  }

  // Send order confirmation email
  static async sendOrderConfirmationEmail(
    userEmail: string,
    userName: string,
    orderId: string,
    orderItems: Array<{ name: string; quantity: number; price: number }>,
    totalAmount: number,
    shippingAddress?: string
  ): Promise<void> {
    try {
      const template = templates.orderConfirmation({
        userName,
        userEmail,
        orderId,
        orderItems,
        totalAmount,
        shippingAddress
      });

      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      console.log('✅ Order confirmation email sent successfully to:', userEmail);
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      throw error;
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetUrl: string,
    expiryTime: string
  ): Promise<void> {
    try {
      const template = templates.passwordReset({
        userName,
        userEmail,
        resetUrl,
        expiryTime
      });

      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      console.log('✅ Password reset email sent successfully to:', userEmail);
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw error;
    }
  }

  // Send price alert email
  static async sendPriceAlertEmail(
    userEmail: string,
    userName: string,
    productName: string,
    oldPrice: number,
    newPrice: number,
    productUrl: string
  ): Promise<void> {
    try {
      const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
      
      const template = templates.priceAlert({
        userName,
        userEmail,
        productName,
        oldPrice,
        newPrice,
        productUrl,
        discount
      });

      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      console.log('✅ Price alert email sent successfully to:', userEmail);
    } catch (error) {
      console.error('❌ Failed to send price alert email:', error);
      throw error;
    }
  }

  // Send new deal notification email
  static async sendNewDealEmail(
    userEmail: string,
    userName: string,
    dealTitle: string,
    dealDescription: string,
    dealUrl: string,
    discount: number,
    validUntil: string
  ): Promise<void> {
    try {
      const template = templates.newDeal({
        userName,
        userEmail,
        dealTitle,
        dealDescription,
        dealUrl,
        discount,
        validUntil
      });

      await this.sendEmail({
        to: userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      console.log('✅ New deal email sent successfully to:', userEmail);
    } catch (error) {
      console.error('❌ Failed to send new deal email:', error);
      throw error;
    }
  }

  // Core email sending function using Supabase Edge Functions
  private static async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    try {
      // For now, we'll use a simple approach with Supabase
      // In production, you would use Supabase Edge Functions or external email service
      
      // Store email in database for tracking (optional)
      const { error: insertError } = await supabase
        .from('email_logs')
        .insert({
          to_email: emailData.to,
          subject: emailData.subject,
          status: 'sent',
          sent_at: new Date().toISOString()
        });

      if (insertError) {
        console.warn('Failed to log email:', insertError);
      }

      // In a real implementation, you would call your email service here
      // For now, we'll simulate the email sending
      console.log('📧 Email would be sent:', {
        to: emailData.to,
        subject: emailData.subject
      });

      // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
      // This is a placeholder for the actual email sending implementation
      
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  // Get user email preferences
  static async getUserEmailPreferences(userId: string): Promise<{
    welcomeEmails: boolean;
    orderEmails: boolean;
    priceAlerts: boolean;
    dealNotifications: boolean;
  }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_preferences')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data?.email_preferences || {
        welcomeEmails: true,
        orderEmails: true,
        priceAlerts: true,
        dealNotifications: true
      };
    } catch (error) {
      console.error('❌ Failed to get email preferences:', error);
      return {
        welcomeEmails: true,
        orderEmails: true,
        priceAlerts: true,
        dealNotifications: true
      };
    }
  }

  // Update user email preferences
  static async updateUserEmailPreferences(
    userId: string,
    preferences: {
      welcomeEmails?: boolean;
      orderEmails?: boolean;
      priceAlerts?: boolean;
      dealNotifications?: boolean;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email_preferences: preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      console.log('✅ Email preferences updated successfully');
    } catch (error) {
      console.error('❌ Failed to update email preferences:', error);
      throw error;
    }
  }
}

export default EmailService;
