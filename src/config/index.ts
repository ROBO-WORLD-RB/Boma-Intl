import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file');
  process.exit(1);
}

// Warn about insecure defaults in production
if (process.env.NODE_ENV === 'production') {
  if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production') {
    console.error('❌ SECURITY WARNING: Using default JWT_SECRET in production!');
    process.exit(1);
  }
  if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY.startsWith('sk_test_')) {
    console.warn('⚠️ WARNING: Using test Paystack keys in production');
  }
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    baseUrl: 'https://api.paystack.co',
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'BOMA 2025 <noreply@boma2025.com>',
  },
  app: {
    name: 'BOMA 2025',
    url: process.env.APP_URL || 'http://localhost:3000',
  },
};

// Log configuration status in development
if (config.nodeEnv === 'development') {
  console.log('📋 Configuration loaded:');
  console.log(`   - Port: ${config.port}`);
  console.log(`   - Environment: ${config.nodeEnv}`);
  console.log(`   - Paystack: ${config.paystack.secretKey ? 'Configured' : 'Not configured'}`);
  console.log(`   - Email: ${config.email.user ? 'Configured' : 'Not configured (will log emails)'}`);
}
