import type { Plugin } from 'vuepress'
import { createWriteStream, promises } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'
import { SitemapItemLoose, SitemapStream } from 'sitemap'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'

const log = (msg: string, color = 'blue', label = 'SITEMAP') =>
  console.log(`\n${chalk.reset.inverse.bold[color](` ${label} `)} ${msg}`)

function stripLocalePrefix (path, localePathPrefixes) {
  const matchingPrefix = localePathPrefixes.filter(prefix => path.startsWith(prefix)).shift()
  return { normalizedPath: path.replace(matchingPrefix, '/'), localePrefix: matchingPrefix }
}

interface Options {
  urls?: SitemapItemLoose[]
  outFile?: string
  hostname: string
  changefreq?: string
  exclude?: string[]
  dateFormatter?: (date: string) => string
}

const plugin: Plugin<Options> = (options, context) => {
  const {
    urls = [],
    hostname,
    outFile = 'sitemap.xml',
    changefreq = 'daily',
    exclude = [],
    dateFormatter = (lastUpdated) => new Date(lastUpdated).toISOString(),
    ...others
  } = options

  return {
    name: 'vuepress-sitemap-plugin',
    async onGenerated (app) {
      if (!hostname) {
        return log(
          'Not generating sitemap because required "hostname" option doesn\'t exist',
          'red'
        )
      }

      log('Generating sitemap...')

      const { locales, base } = context.siteData
      const pages = context.pages

      const withBase = (url: string) => base.replace(/\/$/, '') + url

      // Sort the locale keys in reverse order so that longer locales, such as '/en/', match before the default '/'
      const localeKeys = (locales && Object.keys(locales).sort().reverse()) || []
      const localesByNormalizedPagePath = pages.reduce((map, page) => {
        const { normalizedPath, localePrefix } = stripLocalePrefix(page.path, localeKeys)
        const prefixesByPath = map.get(normalizedPath) || []
        prefixesByPath.push(localePrefix)
        return map.set(normalizedPath, prefixesByPath)
      }, new Map())

      const pagesMap = new Map()

      await Promise.all(pages.map(async page => {
        const fmOpts: { exclude?: boolean, changefreq?: string } = page.frontmatter.sitemap || {}
        const metaRobots = (page.frontmatter.meta as [{name?: string, content?: string}] || [])
          .find(meta => meta.name === 'robots')
        const excludePage = metaRobots
          ? (metaRobots.content || '').split(/,/).map(x => x.trim()).includes('noindex')
          : fmOpts.exclude === true

        if (excludePage) {
          exclude.push(page.path)
        }

        const extendsPageData = await app.pluginApi.hooks.extendsPageData.process(
          page,
          app
        )
        extendsPageData.forEach((item) => Object.assign(page, item))

        const lastmodISO = page.git.updatedTime
          ? dateFormatter(page.git.updatedTime)
          : undefined

        const { normalizedPath } = stripLocalePrefix(page.path, localeKeys)
        const relatedLocales = localesByNormalizedPagePath.get(normalizedPath)

        let links = []
        if (relatedLocales.length > 1) {
          links = relatedLocales.map(localePrefix => {
            return {
              lang: locales[localePrefix].lang,
              url: withBase(normalizedPath.replace('/', localePrefix))
            }
          })
        }

        pagesMap.set(
          page.path,
          {
            changefreq: fmOpts.changefreq || changefreq,
            lastmodISO,
            links,
            ...others
          }
        )
      }))

      const sourceData: SitemapItemLoose[] = []

      pagesMap.forEach((page, url) => {
        if (!exclude.includes(url)) {
          sourceData.push({
            url: withBase(url),
            ...page
          })
        }
      })

      urls.forEach(item => {
        const page = pagesMap.get(item.url)
        if (page) {
          const existingIndex = sourceData.findIndex(data => data.url === item.url)
          sourceData[existingIndex] = { ...page, ...item }
        } else {
          sourceData.push(item)
        }
      })

      const sitemapStream = new SitemapStream({
        hostname,
      });
          
      const src = Readable.from(sourceData);
  
      const destinationDir = context.options.dest
      await promises.mkdir(destinationDir, { recursive: true });
      const writePath = resolve(destinationDir, './sitemap.xml');
      await pipeline(src, sitemapStream, createWriteStream(writePath));

      log('Sitemap generated')
    }
  }
}

export default plugin
