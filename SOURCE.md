# 目录与图片来源

Skill Library 收录 59 个公开 Agent Skills，来自 11 个仓库，其中 24 个官方条目、35 个社区条目。中文标题、简述、分类和示例请求由本站整理；原始内容以各条目的上游链接为准。

## 记录与版本

| 字段 | 用途 |
| --- | --- |
| `sourceRepo`、`skillFile` | 上游仓库与 Skill 文件位置 |
| `sourceCommit`、`sourceUrl` | 完整提交 SHA 与固定版本的文件链接 |
| `license`、`licenseUrl` | Skill 许可及原始许可文件 |
| `installMethod`、`installGuideUrl` | CLI、插件或官方安装指南 |
| `requirements` | 工具、账号或运行环境要求 |
| `githubStars`、`starsScope` | 仓库级 Star 快照，不是单项 Skill 使用量 |
| `collectedAt` | 收录信息的核对时间 |

目录：[catalog.json](dist/catalog.json)；版本与校验：[catalog-meta.json](dist/catalog-meta.json)；许可原文：[catalog-licenses.json](docs/catalog-licenses.json)。

## 收录来源

核对日期：2026-10-04。链接固定到收录时的提交；许可按具体 Skill 或仓库声明记录。

| 来源 | 条目数 | 收录内容 | 收录版本 |
| --- | ---: | --- | --- |
| [Anthropic Skills](https://github.com/anthropics/skills) | 10 | 视觉设计、文稿、开发、技能评测 | [8a1541c](https://github.com/anthropics/skills/tree/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4) |
| [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | 7 | React、界面审查、技术写作 | [063bee9](https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278) |
| [Vercel Skills](https://github.com/vercel-labs/skills) | 1 | 查找技能 | [18f96ea](https://github.com/vercel-labs/skills/tree/18f96ea131dab3b0fcc9b27cf7c6f6cbb6174680) |
| [Supabase Agent Skills](https://github.com/supabase/agent-skills) | 2 | PostgreSQL 与 Supabase 工具 | [c9be0e9](https://github.com/supabase/agent-skills/tree/c9be0e931b7930f7d02126d04774d904c381e7d7) |
| [Superpowers](https://github.com/obra/superpowers) | 10 | 规划、调试、验证与协作 | [8ca22db](https://github.com/obra/superpowers/tree/8ca22dba9a94f28898bbce59f2537ff4d87c747d) |
| [Marketing Skills](https://github.com/coreyhaines31/marketingskills) | 16 | 文案、研究、运营与增长 | [dda3841](https://github.com/coreyhaines31/marketingskills/tree/dda3841f0b294e01e93b1541486beefbfab0915e) |
| [Notion · OpenAI Plugins](https://github.com/openai/plugins) | 4 | Notion 文档、研究、会议与实施 | [5fd93af](https://github.com/openai/plugins/tree/5fd93af4cd0c623e020d0cc7e9ce178b4ac1f70f/plugins/notion) |
| [宝玉 Skills](https://github.com/JimLiu/baoyu-skills) | 6 | 封面、插画、漫画、信息图、幻灯片、小红书图文 | [1567581](https://github.com/JimLiu/baoyu-skills/tree/1567581c26ec29f4216c6e6835415bf30343b0e3) |
| [宝玉 Design](https://github.com/JimLiu/baoyu-design) | 1 | 界面设计与交互原型 | [6530033](https://github.com/JimLiu/baoyu-design/tree/6530033592bf7fa58bc1a5a2a2ad278da45213a9) |
| [Taste Skill](https://github.com/Leonxlnx/taste-skill) | 1 | 前端视觉设计 | [ce26fc2](https://github.com/Leonxlnx/taste-skill/tree/ce26fc25c0e5e8cab638f883de62d9a86ee5e45b) |
| [heytea-style](https://github.com/Hchen1218/heytea-style) | 1 | 涂鸦海报 | [d512537](https://github.com/Hchen1218/heytea-style/tree/d5125372adcc945c2314cfb649c50407379a18ab) |

Notion 条目由 Notion 提供，位于公开的 OpenAI 插件仓库中。依赖插件工具的 Skills 使用完整插件的安装指南。仓库根目录的 Skill 使用上游安装说明；CLI 的 `--skill` 使用原文中的名称。

## 图片是什么

图片与文字均可追溯到原始来源；逐图记录见 [media-manifest.json](dist/media-manifest.json)。不同类型分别标注：

- **技能示例**：作者在公开仓库展示的实际样张。新增 9 个社区 Skills 共采用 18 张作者示例图；宝玉与 Taste 示例遵循其仓库 MIT 许可，heytea-style 原创海报遵循 CC BY 4.0。
- **官方模板预览**：Anthropic Theme Factory 的官方 PDF 样张，按 Apache-2.0 许可渲染为图片。
- **项目封面**：例如 Supabase 仓库的项目 OG 图，只代表来源项目。
- **原文预览**：公开 Skill 说明的截图，使用 Aceternity Code Block 展示原文。它帮助辨认技能内容，不代表执行效果。

heytea-style 海报署名为 **heytea-style contributors**；原图许可与来源见 [ASSET-NOTICE.md](https://github.com/Hchen1218/heytea-style/blob/d5125372adcc945c2314cfb649c50407379a18ab/ASSET-NOTICE.md)。该项目声明与 HEYTEA 无隶属或背书关系。其 Skill 源码为 MIT，图片许可单独记录。

作者示例图未修改内容；页面裁切只用于卡片展示，详情提供完整预览。来源图标只用于标明项目身份。

## 收录原则

1. Skill 文件公开，名称与用途能从原文核对。
2. 来源与许可明确；官方和社区身份按维护者区分。
3. 安装入口有上游依据，不把单个 Skill 文件当作完整插件。
4. 分类采用任务维度，来源和适配信息另行呈现。
5. 不收录本机私有 Skills，不镜像完整第三方 Skill 源码。

示例请求用于理解任务，不是运行结果。本站未逐项执行 Skills；适配信息来自上游声明。外部项目更新后，收录快照与最新版本可能不同。

## 参考产品与设计

[ColaSkill](https://colaskill.com/zh/) 用于研究图文目录、分类、搜索与详情流程。本站未复制其品牌、插画、封面或目录文案。

页面来自 [Aceternity](https://ui.aceternity.com/) 已授权的黑色套件与官方组件；具体版本与图片许可见 [THIRD_PARTY.md](THIRD_PARTY.md)。
