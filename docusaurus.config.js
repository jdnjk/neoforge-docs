// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const {themes} = require('prism-react-renderer');
const lightTheme = themes.oneLight;
const darkTheme = themes.vsDark;

// Section metadata

const contentPlugins = [];
const navbarItems = [];
const footerItems = [];

function createContentDocs(id, label) {
  contentPlugins.push([
    "@docusaurus/plugin-content-docs",
    {
      id: id,
      path: id,
      routeBasePath: id,
      sidebarPath: require.resolve(`./sidebar/${id}.js`),
    },
  ]);

  navbarItems.push({
    type: "docSidebar",
    sidebarId: `${id}Sidebar`,
    position: "left",
    docsPluginId: id,
    label: label,
  });

  footerItems.push({
    to: `/${id}/docs/`,
    label: label
  });
}

createContentDocs("toolchain", "工具链");
createContentDocs("primer", "迁移");
createContentDocs("user", "用户指南");
createContentDocs("modpack", "整合包开发");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "NeoForged 文档",
  tagline: "更好的模组加载器",
  favicon: "img/favicon.ico",

  // 在此处设置站点的生产 URL
  url: "https://zh-neoforge.netlify.app",
  // 设置站点服务的 /<baseUrl>/ 路径名
  // 对于 GitHub Pages 部署，通常是 '/<projectName>/'
  baseUrl: "/",

  // GitHub Pages 部署配置。
  // 如果您不使用 GitHub Pages，则不需要这些配置。
  organizationName: "jdnjk", // 通常是您的 GitHub 组织/用户名。
  projectName: "neoforge-docs", // 通常是您的仓库名称。

  onBrokenLinks: "throw", // Yay multi versioned-docs sites
  onBrokenMarkdownLinks: "throw",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          lastVersion: "current",
          includeCurrentVersion: true,
          versions: require("./version_labels.json"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: contentPlugins,

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true
      },

      // 替换为您项目的社交卡片
      //image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: "首页",
        logo: {
          alt: "NeoForged 标志",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "mainSidebar",
            position: "left",
            label: "NeoForge 文档",
          }
        ]
        .concat(navbarItems)
        .concat([
          {
            type: "docsVersionDropdown",
            position: "right",
          },
          {
            to: "/contributing",
            label: "贡献指南",
            position: "right",
          },
          {
            href: "https://github.com/neoforged/documentation",
            label: "GitHub",
            position: "right",
          },
        ]),
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "文档",
            items: [
              {
                to: "/docs/gettingstarted/",
                label: "NeoForge 文档",
              },
            ]
            .concat(footerItems)
            .concat([
              {
                to: "/contributing",
                label: "参与文档贡献"
              }
            ]),
          },
          {
            title: "链接",
            items: [
              {
                label: "Discord",
                href: "https://discord.neoforged.net/",
              },
              {
                label: "主网站",
                href: "https://neoforged.net/",
              },
              {
                label: "GitHub",
                href: "https://github.com/neoforged/documentation",
              },
            ],
          },
        ],
        copyright: `版权所有 © ${new Date().getFullYear()}，遵循 MIT 许可证。由 Docusaurus 构建。`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ["java", "gradle", "toml", "groovy", "kotlin", "javascript", "json", "json5", "properties"],
      },
      algolia: {
        // Algolia 提供的应用程序 ID
        appId: '05RJFT798Z',
  
        // 公共 API 密钥：提交它是安全的
        apiKey: 'b198aa85c7f2ee9364d105ef0be4d81a',
  
        indexName: 'neoforged'
      },
    }),

    markdown: {
      mermaid: true
    },

    themes: ['@docusaurus/theme-mermaid']
};

module.exports = config;
module.exports = config;
