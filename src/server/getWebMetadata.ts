'use server';

import * as cheerio from 'cheerio';

interface SiteInfo {
  title?: string;
  description?: string;
  icon?: string;
}

async function fetchFromManifest(manifestUrl: string): Promise<SiteInfo | null> {
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) return null;
    const manifest = await response.json();
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

async function fetchFromHTML(url: string): Promise<SiteInfo> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  return {
    title: $('title').first().text(),
    description: $('meta[name="description"]').attr('content'),
    icon: $('link[rel="shortcut icon"]').attr('href') || $('link[rel="icon"]').attr('href')
  };
}

export async function getWebMetadata(url: string): Promise<SiteInfo | null> {
  const manifestUrl = new URL('/manifest.json', url).href;

  const [manifestInfo, htmlInfoPromise] = await Promise.all([
    fetchFromManifest(manifestUrl),
    fetchFromHTML(url).catch((error) => {
      console.error('Error fetching from HTML:', error);
      return null;
    })
  ]);

  let siteInfo: SiteInfo = {};

  if (manifestInfo && manifestInfo.icon && manifestInfo.title && manifestInfo.description) {
    siteInfo = manifestInfo;
  } else {
    const htmlInfo = await htmlInfoPromise;
    siteInfo = { ...htmlInfo, ...manifestInfo };
  }

  return Object.keys(siteInfo).length ? siteInfo : null;
}
