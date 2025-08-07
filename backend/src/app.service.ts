import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth(): object {
    return {
      status: 'ok',
      message: 'Multi-Vendor E-Commerce API is running',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV'),
    };
  }

  getDetailedHealth(): object {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'ok',
      message: 'Multi-Vendor E-Commerce API is running',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV'),
      uptime: {
        seconds: Math.floor(uptime),
        human: this.formatUptime(uptime),
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
  }

  getVersion(): object {
    return {
      name: this.configService.get('APP_NAME') || 'Multi-Vendor E-Commerce API',
      version: '1.0.0',
      description: 'Complete multi-vendor e-commerce platform API',
      author: 'Your Company',
      license: 'MIT',
      repository: 'https://github.com/vijaysinghrajput/multi-vendor-ecommerce',
      documentation: `${this.configService.get('APP_URL') || `http://localhost:${this.configService.get('PORT') || 3000}`}/api/docs`,
      timestamp: new Date().toISOString(),
    };
  }

  private formatUptime(uptime: number): string {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(' ') || '0s';
  }
}