import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        createProxyMiddleware({
            target: 'http://localhost:3000',
            changeOrigin: true,
            onProxyRes: function (proxyRes, req) {
                console.log('[URL]', req.url);

                proxyRes.headers['Content-Security-Policy'] =
                    `script-src 'self' 'unsafe-eval' https: 'unsafe-inline' https://www.google.com https://www.gstatic.com; frame-src 'self' https://www.google.com`;
            },
            // selfHandleResponse: true,
        }),
    );
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    scriptSrc: [
                        `'self'`,
                        `'unsafe-eval'`,
                        `https: 'unsafe-inline'`,
                        'https://www.google.com',
                        'https://www.gstatic.com',
                    ],
                    frameSrc: [`'self'`, `https://www.google.com`],
                },
            },
        }),
    );
    await app.listen(5555);
}
bootstrap();
