import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const password = randomBytes(15).toString("base64url");
const hash = bcrypt.hashSync(password, 12);
const sessionSecret = randomBytes(32).toString("base64");

console.log("\n=== ADMIN CREDENTIALS — SAVE THESE NOW ===\n");
console.log(`Username: admin`);
console.log(`Password: ${password}\n`);
console.log("=== ADD THESE TO .env.local ===\n");
console.log(`ADMIN_USERNAME="admin"`);
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log(`SESSION_SECRET="${sessionSecret}"`);
console.log("\n");
