import React from "react";

type IframeComponentProps = {
  imageSrc: string;
  width?: number;
  height?: number;
};

function IframeComponent({
  imageSrc,
  width = 48,
  height = 48,
}: IframeComponentProps) {
  const srcDocContent = `
    <body style="margin: 0; overflow: hidden; display: flex;background-color: transparent;">
      <img src="${imageSrc}" alt="Safe App logo" width="${width}" height="${height}" onerror="this.onerror=null; this.src='/images/common/app-placeholder.svg';" />
    </body>
  `;

  return (
    <iframe
      title="Content"
      srcDoc={srcDocContent}
      sandbox="allow-scripts"
      referrerPolicy="strict-origin"
      width={width}
      height={height}
      tabIndex={-1}
      loading="lazy"
      style={{
        pointerEvents: "none",
        border: "0px",
        borderRadius: "var(--radius)",
      }}
    ></iframe>
  );
}

export default IframeComponent;
