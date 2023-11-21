# Alert Bounties

AlertBounties is a TypeScript Node.js project designed to keep you informed about new bounties on [Algora Console](https://console.algora.io). It utilizes Puppeteer for web scraping and Resend for email notifications.

## How it Works

The script automatically scrapes new bounties from Algora Console every 25 minutes (customizable) and sends email notifications to the user. Stay ahead in the bounty hunting game with timely updates!

## Technologies Used

- **Scraping**: Puppeteer
- **Language**: TypeScript, Node.js
- **Email Service**: Resend

## Getting Started

To use AlertBounties, follow these steps:

1. Fork this repository.

2. Obtain your Resend API key from [Resend API Keys](https://resend.com/api-keys) and your Algora Console session token.

3. Copy `.env.example` to `.env`

```bash
  cp .env.example .env
```

4. Add the following secrets to environment variables:

   - `RESEND_API_KEY`: Your Resend API key.
   - `SESSION_TOKEN`: The value of the '\_\_Secure-next-auth.session-token' cookie from [Algora Console](https://console.algora.io).
   - `USER_EMAIL`: Your Resend login email (this email is used to receive updates).

5. Add the **RESEND_API_KEY**, **SESSION_TOKEN** and **USER_EMAIL** secret to your forked repository by following the steps outlined in the [GitHub Actions documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

If you find this project helpful, don't forget to star the repository!

Happy bounty hunting! 🚀
