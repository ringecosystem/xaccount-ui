export function generateIconUrl(baseUrl: string, iconPath: string) {
  const parsedUrl = new URL(baseUrl);

  console.log(parsedUrl);

  const domain = `${parsedUrl.protocol}//${parsedUrl.host}`;

  if (iconPath.startsWith('/')) {
    iconPath = iconPath.substring(1);
  }

  return domain + '/' + iconPath;
}
