# WhatsappAuto

A small Baileys bot that sends a configured sequence of messages when an incoming one-to-one chat contains a configured keyword.

## Setup

Requirements: Node.js 20 or newer.

1. Install dependencies with `npm install`.
2. Copy `config.example.json` to `config.json` and edit the keywords and reply messages.
3. Start the bot with `npm start` and scan the QR code in WhatsApp on your phone under **Linked devices**.

The first matching keyword in the order listed in `config.json` is used. Matching ignores capitalization and accents. Each reply is sent as a separate WhatsApp message, in order. The bot ignores groups, status updates, and messages sent by your own account.

The linked-device session is stored in `auth_info_baileys/`; keep that directory private and do not share it. To disconnect the bot, unlink its device from WhatsApp and remove the local session directory.

Run the matching tests with `npm test`.

