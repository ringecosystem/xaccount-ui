'use server';

import axios from 'axios';
import cheerio from 'cheerio';

interface SiteInfo {
  title?: string;
  description?: string;
  icon?: string;
}

// 尝试从manifest.json获取信息
async function fetchFromManifest(manifestUrl: string): Promise<SiteInfo | null> {
  try {
    const response = await axios.get(manifestUrl);
    const manifest = response.data;
    if (
      !manifest.name &&
      !manifest.short_name &&
      !manifest.description &&
      (!manifest.icons || manifest.icons.length === 0)
    ) {
      return null; // 如果manifest.json中没有我们需要的信息，返回null
    }
    return {
      title: manifest.name || manifest.short_name,
      description: manifest.description,
      icon: manifest.icons ? manifest.icons[0].src : undefined
    };
  } catch (error) {
    console.error('Error fetching manifest:', error);
    return null;
  }
}

// 从HTML获取信息
async function fetchFromHTML(url: string): Promise<SiteInfo | null> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('title').first().text();
    const description = $('meta[name="description"]').attr('content');
    const icon = $('link[rel="shortcut icon"]').attr('href') || $('link[rel="icon"]').attr('href');
    if (!title && !description && !icon) {
      return null; // 如果HTML中没有我们需要的信息，返回null
    }
    return { title, description, icon };
  } catch (error) {
    console.error('Error fetching from HTML:', error);
    return null;
  }
}
const options = {
  strategies: ['duckduckgo', 'default'] // use the DuckDuckGo API and default method
};

// 主函数
// export async function getWebMetadata(url: string): Promise<SiteInfo | null> {
//   // 构建manifest.json的URL
//   const manifestUrl = new URL("/manifest.json", url).href;

//   // 首先尝试从manifest.json获取信息
//   const infoFromManifest = await fetchFromManifest(manifestUrl);
//   if (infoFromManifest) {
//     return infoFromManifest;
//   }

//   // 如果manifest.json不存在或不包含所需信息，则从HTML中获取
//   const infoFromHTML = await fetchFromHTML(url);
//   if (infoFromHTML) {
//     return infoFromHTML;
//   }

//   // 如果两者都无法获取信息，返回undefined
//   return null;
// }

// 主函数
export async function getWebMetadata(url: string): Promise<SiteInfo | null> {
  let siteInfo: SiteInfo = {};

  // 首先尝试从manifest.json获取信息
  const infoFromManifest = await fetchFromManifest(new URL('/manifest.json', url).href);
  if (infoFromManifest) {
    siteInfo = { ...infoFromManifest };
  }

  // 如果manifest.json中没有图标信息，检查根目录下的favicon.ico
  if (!siteInfo.icon) {
    const defaultFaviconUrl = new URL('/favicon.ico', url).href;
    try {
      await axios.head(defaultFaviconUrl);
      // 如果HEAD请求成功，则默认favicon存在
      siteInfo.icon = defaultFaviconUrl;
    } catch {
      // 如果favicon.ico不存在，不做处理，继续尝试从HTML中获取信息
    }
  }

  // 如果manifest没有提供标题或描述，从HTML中获取
  if (!siteInfo.title || !siteInfo.description) {
    const infoFromHTML = await fetchFromHTML(url);
    if (infoFromHTML) {
      // 合并HTML中的信息，注意不要覆盖已有的图标信息
      siteInfo = {
        ...siteInfo,
        ...infoFromHTML,
        icon: siteInfo.icon || infoFromHTML.icon
      };
    }
  }

  // 如果我们有任何信息，返回它，否则返回null
  return Object.keys(siteInfo).length ? siteInfo : null;
}
