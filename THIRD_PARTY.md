# 设计、图片与第三方依赖

## Aceternity

网站采用已授权的 [AI SaaS Template](https://ui.aceternity.com/templates/ai-saas-template)，以其 Blog Page 图文目录、BlogCard 和 BlurImage 为基础，适配真实 Skill 目录与图片详情。

模板来源版本：`a811327dfdafb4011c230c415d79f4cef05f9ba4`。

| 页面部分 | 实际来源 |
| --- | --- |
| 黑色目录布局与标题 | AI SaaS Template 的 Blog Page、Background、Container、Heading、Subheading |
| 图片技能卡片与图片加载 | AI SaaS Template 的 BlogCard、BlurImage |
| 导航、按钮、页脚 | AI SaaS Template 的 Navbar、Button、Footer |
| 搜索输入框 | [Signup Form](https://ui.aceternity.com/components/signup-form) 的 Input |
| 分类与来源切换 | [Tabs](https://ui.aceternity.com/components/tabs) |
| 技能详情 | [Animated Modal](https://ui.aceternity.com/components/animated-modal) |
| 安装命令、示例复制、原文预览 | [Code Block](https://ui.aceternity.com/components/code-block) |

保留套件的视觉与动效，补充目录筛选、收藏、可分享的链接状态、键盘焦点与手机交互。模板演示内容已替换为公开 Skills 与可追溯图片。

[Aceternity 许可](https://ui.aceternity.com/licence)允许发布最终产品，限制模板源码的再分发。可编辑的付费组件保留在私有工作区；本公开仓库仅发布编译后的网站、目录数据与文档，不包含付费模板源码、源映射或下载包。

## Skill 示例图片

图片许可与 Skill 源码许可分别核对。作者原图保留内容，不把示例描述为本站测试结果。

| 来源与署名 | 采用内容 | 许可与固定版本 |
| --- | --- | --- |
| Jim Liu / 宝玉 | 封面、文章插图、漫画、信息图、幻灯片、小红书图文示例，共 12 张 | [MIT](https://github.com/JimLiu/baoyu-skills/blob/1567581c26ec29f4216c6e6835415bf30343b0e3/LICENSE) |
| Jim Liu / 宝玉 | Reader Mac App 的 Codex 与 Cursor 演示截图，共 2 张 | [MIT](https://github.com/JimLiu/baoyu-design/blob/6530033592bf7fa58bc1a5a2a2ad278da45213a9/LICENSE) |
| Leonxlnx | Floria 网站示例，共 2 张 | [MIT](https://github.com/Leonxlnx/taste-skill/blob/ce26fc25c0e5e8cab638f883de62d9a86ee5e45b/LICENSE) |
| heytea-style contributors | 原创涂鸦海报与粉绿角色海报，共 2 张 | [CC BY 4.0 资产声明](https://github.com/Hchen1218/heytea-style/blob/d5125372adcc945c2314cfb649c50407379a18ab/ASSET-NOTICE.md) · [许可](https://creativecommons.org/licenses/by/4.0/) |
| Anthropic, PBC | Theme Factory 官方主题样张的 PDF 页面预览 | [Apache-2.0](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/theme-factory/LICENSE.txt) |
| Supabase | Agent Skills 项目 OG 封面 | [MIT](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/LICENSE) |

heytea-style 的 Skill 源码遵循 [MIT](https://github.com/Hchen1218/heytea-style/blob/d5125372adcc945c2314cfb649c50407379a18ab/LICENSE)，原创示例图片单独遵循 CC BY 4.0。署名为 **heytea-style contributors**，图片内容未修改。该项目声明与 HEYTEA 无隶属或背书关系；本站没有采用其第三方品牌研究素材。

源码原文预览是公开 Skill 文档的视觉呈现，按对应条目记录原文来源与许可。来源图标仅用于标明项目身份。未复制参考目录的图片，也未采用禁止再分发的 Mono Color 示例。

第三方 Skill 的许可原文见 [catalog-licenses.json](docs/catalog-licenses.json)；图片来源、许可、署名和文件校验见 [media-manifest.json](dist/media-manifest.json)。本站不为第三方 Skills 重新授权。

## 运行依赖

| 项目 | 用途 | 许可 |
| --- | --- | --- |
| [React](https://github.com/facebook/react) | 界面渲染 | MIT |
| [Motion](https://github.com/motiondivision/motion) | Aceternity 组件动画 | MIT |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | 模板样式 | MIT |
| [Tabler Icons](https://github.com/tabler/tabler-icons) | 界面图标 | MIT |
| [React Icons](https://github.com/react-icons/react-icons) | 界面图标组件 | MIT；图标集遵循各自许可 |
| [Radix UI](https://github.com/radix-ui/primitives) | 标签组件 | MIT |
| [react-wrap-balancer](https://github.com/shuding/react-wrap-balancer) | 标题排版 | MIT |
| [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | 代码展示 | MIT |
| [clsx](https://github.com/lukeed/clsx) / [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 组件样式合并 | MIT |

编译产物保留依赖的许可注释。
