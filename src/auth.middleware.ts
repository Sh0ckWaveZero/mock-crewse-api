import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from 'bun';

export const auth = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: env.JWT_SECRET || 'your-secret-key'
        })
    )
