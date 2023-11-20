if (!process.env.RESEND_API_KEY)
  throw new Error('RESEND_API_KEY is not defined in .env file');
if (!process.env.SESSION_TOKEN)
  throw new Error('SESSION_TOKEN is not defined in .env file');
if (!process.env.USER_EMAIL)
  throw new Error('USER_EMAIL is not defined in .env file');

export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const SESSION_TOKEN = process.env.SESSION_TOKEN;
export const USER_EMAIL = process.env.USER_EMAIL;
