import app from './app';
import { config } from './config';
import prisma from './utils/prisma';

const startServer = async () => {
  try {
    // Test database connection
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.warn('⚠️ Database connection failed (running in offline mode):', dbError);
    }

    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
