export function generateIframeSrcDoc(imageSrc: string) {
  const srcDoc = `
      <body style="margin: 0; overflow: hidden; display: flex;">
        <img src="${imageSrc}" alt="Safe App logo" width="48" height="48" onerror="this.onerror=null; this.src='/images/apps/app-placeholder.svg';" />
      </body>
    `;
  return srcDoc;
}
