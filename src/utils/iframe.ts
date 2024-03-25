export function generateIframeSrcDoc(imageSrc: string) {
  // 使用模板字符串来动态插入图像源
  const srcDoc = `
      <body style="margin: 0; overflow: hidden; display: flex;">
        <img src="${imageSrc}" alt="Safe App logo" width="48" height="48" onerror="this.onerror=null; this.src='/images/apps/app-placeholder.svg';" />
      </body>
    `;
  return srcDoc;
}
