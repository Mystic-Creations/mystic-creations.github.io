// Requires DISCORD_BOT_TOKEN in .env
// https://discord.com/developers/docs/reference#image-formatting

const CDN = 'https://cdn.discordapp.com';
const API = 'https://discord.com/api/v10';

export async function discordAvatar(userId: string, size: number = 256): Promise<string> {
  const token = import.meta.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error('DISCORD_BOT_TOKEN is not set');

  const res = await fetch(`${API}/users/${userId}`, {
    headers: { Authorization: `Bot ${token}` },
  });
  if (!res.ok) throw new Error(`Discord API returned ${res.status} for user ${userId}`);

  const user = await res.json();

  if (!user.avatar) {
    const index = user.discriminator === '0'
      ? Number(BigInt(userId) >> 22n) % 6
      : parseInt(user.discriminator) % 5;
    return `${CDN}/embed/avatars/${index}.png`;
  }

  const ext = user.avatar.startsWith('a_') ? 'gif' : 'webp';
  return `${CDN}/avatars/${userId}/${user.avatar}.${ext}?size=${size}`;
}