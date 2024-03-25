export function generateIconUrl(baseUrl: string, iconPath: string) {
  const parsedUrl = new URL(baseUrl);

  console.log(parsedUrl);

  const domain = `${parsedUrl.protocol}//${parsedUrl.host}`;

  // 如果iconPath以斜杠("/")开头，移除这个斜杠
  if (iconPath.startsWith('/')) {
    iconPath = iconPath.substring(1);
  }

  // 拼接并返回完整的URL
  return domain + '/' + iconPath;
}
