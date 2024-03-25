import { socialConfig } from '@/config/social';

const currentYear = new Date().getUTCFullYear();

const Footer = () => {
  return (
    <footer className="mt-10 flex h-[3.13rem] items-center">
      <div className="max-auto flex w-full items-center justify-center px-8 md:justify-between">
        <span className="text-sm font-light capitalize text-muted-foreground">
          &copy; {currentYear} Darwinia Network
        </span>

        <div className="hidden items-center gap-5 md:flex">
          {socialConfig.map(({ url, name, SvgComponent }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition hover:opacity-80 active:scale-95 active:opacity-60 dark:text-white"
            >
              <SvgComponent />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
