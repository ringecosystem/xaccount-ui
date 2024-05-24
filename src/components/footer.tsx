import { APP_NAME } from '@/config/site';

const currentYear = new Date().getUTCFullYear();

const Footer = () => {
  return (
    <footer className="flex h-[var(--footer)] items-center">
      <div className="max-auto flex w-full items-center justify-center px-6 md:justify-between">
        <span className="text-sm font-light capitalize text-muted-foreground">
          &copy; {currentYear} {APP_NAME}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
