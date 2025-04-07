#!/usr/bin/env bun
import { SignJWT, jwtVerify } from 'jose';
import { env } from 'bun';

// รับค่า command arguments
const [command, name] = process.argv.slice(2);

if (!command) {
    console.error('วิธีใช้:');
    console.error('  bun run token sign [ชื่อ]      - สร้าง JWT token (ค่าเริ่มต้นคือ "joe")');
    console.error('  bun run token verify [token]   - ตรวจสอบ JWT token');
    process.exit(1);
}

// แปลง secret เป็น Uint8Array
const secret = new TextEncoder().encode(
    env.JWT_SECRET || 'your-secret-key'
);

async function main() {
    try {
        switch (command) {
            case 'sign':
                const tokenName = name || 'joe';  // ใช้ "joe" เป็นค่าเริ่มต้นถ้าไม่ระบุชื่อ
                const token = await new SignJWT({ name: tokenName })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime(env.JWT_ACCESS_TOKEN_EXPIRED || '1h') // กำหนดเวลาในการหมดอายุของ token
                    .sign(secret);

                console.log('\nGenerated JWT Token:');
                console.log('--------------------');
                console.log(token);
                console.log('\nวิธีใช้งานใน API:');
                console.log(`${env.HEADER_KEY_AUTHORIZATION || 'access-token'}: ${token}`);
                break;

            case 'verify':
                if (!name) {
                    console.error('❌ กรุณาระบุ token ที่ต้องการตรวจสอบ');
                    process.exit(1);
                }
                const { payload } = await jwtVerify(name, secret);
                console.log('\nToken ถูกต้อง ✅');
                console.log('ข้อมูลใน Token:');
                console.log(JSON.stringify(payload, null, 2));
                break;

            default:
                console.error('คำสั่งไม่ถูกต้อง กรุณาใช้ sign หรือ verify');
                process.exit(1);
        }
    } catch (error: any) {
        console.error('เกิดข้อผิดพลาด:', error.message);
        process.exit(1);
    }
}

main();