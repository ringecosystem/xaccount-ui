import GithubIcon from '@/components/icons/github';
import TwitterIcon from '@/components/icons/twitter';
import MediumIcon from '@/components/icons/medium';
import TelegramIcon from '@/components/icons/telegram';
import DiscordIcon from '@/components/icons/discord';
import ElementIcon from '@/components/icons/element';
import EmailIcon from '@/components/icons/email';

type SocialConfig = { name: string; url: string; SvgComponent: () => JSX.Element };

function createSocialConfig(
  name: string,
  url: string,
  SvgComponent: () => JSX.Element
): SocialConfig {
  return {
    name,
    url,
    SvgComponent
  };
}

export const socialConfig: SocialConfig[] = [
  createSocialConfig('Github', 'https://github.com/darwinia-network', GithubIcon),
  createSocialConfig('Twitter', 'https://twitter.com/DarwiniaNetwork', TwitterIcon),
  createSocialConfig('Medium', 'https://medium.com/darwinianetwork', MediumIcon),
  createSocialConfig('Telegram', 'https://t.me/DarwiniaNetwork', TelegramIcon),
  createSocialConfig('Discord', 'https://discord.com/invite/VcYFYETrw5', DiscordIcon),
  createSocialConfig('Element', 'https://app.element.io/#/room/#darwinia:matrix.org', ElementIcon),
  createSocialConfig('Email', 'mailto:hello@darwinia.network', EmailIcon)
];
