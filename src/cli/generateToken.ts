#!/usr/bin/env bun
import { SignJWT, jwtVerify } from 'jose';
import { env } from 'bun';

const [command, name] = process.argv.slice(2);

// Validate required environment variables
if (!env.JWT_SECRET) {
    console.error('❌ Error: JWT_SECRET environment variable is required');
    process.exit(1);
}

if (!env.JWT_ACCESS_TOKEN_EXPIRED) {
    console.error('❌ Error: JWT_ACCESS_TOKEN_EXPIRED environment variable is required');
    process.exit(1);
}

if (!command) {
    console.error('Usage:');
    console.error('  bun run token sign [name]    - Generate JWT token');
    console.error('  bun run token verify [token] - Verify JWT token');
    process.exit(1);
}

// Convert secret to Uint8Array with additional security check
const secret = new TextEncoder().encode(env.JWT_SECRET);

// Minimum length check for security
if (env.JWT_SECRET.length < 32) {
    console.error('❌ Error: JWT_SECRET must be at least 32 characters long');
    process.exit(1);
}

async function main() {
    try {
        switch (command) {
            case 'sign': {
                if (!name) {
                    console.error('❌ Error: Name parameter is required');
                    process.exit(1);
                }

                // Generate a unique token ID
                const tokenId = crypto.randomUUID();

                const token = await new SignJWT({
                    name,
                    tokenId,
                })
                    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
                    .setIssuedAt()
                    .setExpirationTime(env.JWT_ACCESS_TOKEN_EXPIRED as string)
                    .setJti(tokenId) // Add JWT ID claim
                    .setNotBefore(new Date()) // Token not valid before now
                    .setAudience('mock-crewse-api') // Specify intended audience
                    .setIssuer('mock-crewse-cli') // Specify token issuer
                    .sign(secret);

                console.log('\nGenerated JWT Token:');
                console.log('--------------------');
                console.log(token);
                console.log('\nAPI Usage:');
                console.log(`${env.HEADER_KEY_AUTHORIZATION || 'access-token'}: ${token}`);
                break;
            }

            case 'verify': {
                if (!name) {
                    console.error('❌ Error: Token parameter is required');
                    process.exit(1);
                }

                const { payload } = await jwtVerify(name, secret, {
                    issuer: 'mock-crewse-cli',
                    audience: 'mock-crewse-api',
                });

                console.log('\n✅ Token verified successfully');
                // Only show essential information
                const safePayload = {
                    name: payload.name,
                    exp: payload.exp,
                    iat: payload.iat
                };
                console.log('Token information:');
                console.log(JSON.stringify(safePayload, null, 2));
                break;
            }

            default:
                console.error('❌ Error: Invalid command. Use "sign" or "verify"');
                process.exit(1);
        }
    } catch (error) {
        // Generic error message for security
        console.error('❌ Error: Token operation failed');
        process.exit(1);
    }
}

main();