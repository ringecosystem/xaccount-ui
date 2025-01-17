type SocialConfig = {
  name: string;
  url: string;
  assetPath: string;
  size: { x: number; y: number };
};

function createSocialConfig(
  name: string,
  url: string,
  assetPath: string,
  size: { x: number; y: number }
): SocialConfig {
  return {
    name,
    url,
    assetPath,
    size
  };
}

export const socialConfig: SocialConfig[] = [
  createSocialConfig('X', 'https://x.com/ringecosystem', '/images/socials/x.svg', { x: 16, y: 16 }),
  createSocialConfig('Telegram', 'https://t.me/ringecosystem', '/images/socials/telegram.svg', {
    x: 19.2,
    y: 16
  }),
  createSocialConfig(
    'Github',
    'https://github.com/ringecosystem/XAccount',
    '/images/socials/github.svg',
    {
      x: 13.3,
      y: 16
    }
  ),
  createSocialConfig('Discord', 'https://discord.gg/BhNbKWWfGV', '/images/socials/discord.svg', {
    x: 19.2,
    y: 14.4
  })
];
