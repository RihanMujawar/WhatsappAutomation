import { readFile } from 'node:fs/promises';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import { findMatchingRule, getMessageText } from './rules.js';

const config = JSON.parse(await readFile(new URL('../config.json', import.meta.url), 'utf8'));

if (!Array.isArray(config.rules) || config.rules.length === 0) {
  throw new Error('config.json must contain at least one rule.');
}

const processedMessages = new Set();

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const socket = makeWASocket({ auth: state });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('Scan this QR code using WhatsApp Linked devices:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('WhatsApp connected.');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode !== DisconnectReason.loggedOut) {
        void startBot();
      } else {
        console.error('WhatsApp logged out. Remove the local session and scan a new QR code.');
      }
    }
  });

  socket.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const message of messages) {
      const jid = message.key.remoteJid;
      const messageId = message.key.id;

      if (!jid || jid === 'status@broadcast' || jid.endsWith('@g.us') || message.key.fromMe) {
        continue;
      }

      if (!messageId || processedMessages.has(messageId)) continue;
      processedMessages.add(messageId);

      const text = getMessageText(message.message ?? {});
      const rule = findMatchingRule(text, config.rules);
      if (!rule) continue;

      for (const reply of rule.replies) {
        await socket.sendMessage(jid, { text: reply });
      }
    }
  });
}

await startBot();