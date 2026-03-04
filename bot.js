import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const sessions = [
  { name: "FP1", time: new Date("2026-03-06T02:30:00Z") },
  { name: "FP2", time: new Date("2026-03-06T06:00:00Z") },
  { name: "FP3", time: new Date("2026-03-07T02:30:00Z") },
  { name: "Qualifica", time: new Date("2026-03-07T05:00:00Z") },
  { name: "Gara", time: new Date("2026-03-08T04:00:00Z") }
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

function getNextSession() {
  const now = new Date();
  return sessions.find(s => s.time > now);
}

function formatTime(ms) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;

  return `${d}g ${h}h ${m}m`;
}

client.once('ready', () => {
  console.log(`Bot online come ${client.user.tag}`);

  setInterval(async () => {
    const channel = await client.channels.fetch(CHANNEL_ID);
    const next = getNextSession();

    if (!next) return;

    const diff = next.time - new Date();

    if (diff <= 0) {
      await channel.setName(`🔴 ${next.name} IN CORSO`);
    } else {
      await channel.setName(`⏳ ${formatTime(diff)} a ${next.name}`);
    }

  }, 60000);
});

client.login(TOKEN);