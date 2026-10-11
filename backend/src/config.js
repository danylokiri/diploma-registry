import 'dotenv/config';
function resolveJwtSecret() {
  const raw = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    // A known default would let anyone forge tokens, so refuse to start without a real secret.
    if (!raw || raw.length < 16 || /^(dev_secret|change_me)/i.test(raw)) {
      console.error('JWT_SECRET is missing or insecure in production. Set it to a random string of 32+ characters.');
      process.exit(1);
    }
    return raw;
  }
  return raw || 'dev_secret';
}

export const config = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: resolveJwtSecret(),
  allowSelfRegister: String(process.env.ALLOW_SELF_REGISTER || '').toLowerCase() === 'true',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileMb: Number(process.env.MAX_FILE_MB || process.env.UPLOAD_MAX_MB || process.env.FILE_MAX_MB || 10),
};
