# 目录来源

Skill Library 收录公开的官方与社区 Agent Skills。中文标题、简述、分类和示例请求由本站整理；原始内容以各条目的上游链接为准。

## 每条记录保留什么

| 字段 | 用途 |
| --- | --- |
| `sourceRepo`、`skillFile` | 上游仓库与 Skill 文件位置 |
| `sourceCommit`、`sourceUrl` | 完整提交 SHA 与固定版本的文件链接 |
| `license`、`licenseUrl` | 查到的许可与原始许可文件 |
| `installMethod` | CLI、插件或来源指南 |
| `installCommand`、`installGuideUrl` | 安装命令或上游安装文档 |
| `requirements` | 上游声明的工具、账号或运行环境要求 |
| `githubStars`、`starsScope` | 仓库级 Star 快照，`starsScope` 为 `repository` |
| `collectedAt` | 收录信息的核对时间 |

目录：[catalog.json](dist/catalog.json)；汇总与文件校验：[catalog-meta.json](dist/catalog-meta.json)。

## 首批来源

核对时间：2026-10-04。许可按具体 Skill 或明确的仓库声明记录。

| 来源 | 条目数 | 收录内容 |
| --- | ---: | --- |
| [Anthropic Skills](https://github.com/anthropics/skills) | 10 | 视觉设计、文稿、开发、技能评测 |
| [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | 7 | React、界面审查、技术写作 |
| [Vercel Skills](https://github.com/vercel-labs/skills) | 1 | 查找技能 |
| [Supabase Agent Skills](https://github.com/supabase/agent-skills) | 2 | PostgreSQL 与 Supabase 工具 |
| [Superpowers](https://github.com/obra/superpowers) | 10 | 规划、调试、验证与团队工作流 |
| [Marketing Skills](https://github.com/coreyhaines31/marketingskills) | 16 | 文案、研究、运营与增长 |
| [Notion · OpenAI Plugins](https://github.com/openai/plugins/tree/5fd93af4cd0c623e020d0cc7e9ce178b4ac1f70f/plugins/notion) | 4 | Notion 文档、研究、会议与实施 |

Notion 条目由 Notion 提供，位于公开的 OpenAI 插件仓库中。14 项以插件方式接入，其余 36 项提供依据安装工具文档整理的 CLI 命令。许可原文保留在 [catalog-licenses.json](docs/catalog-licenses.json)。

## 收录原则

1. 找得到公开的 Skill 文件，名称与用途可从原文核对。
2. 来源与许可明确；官方和社区身份按实际维护者区分。
3. 安装方式有上游依据。CLI 的 `--skill` 使用 Skill 原文中的名称；依赖插件工具的 Skill 跳转到安装指南。
4. 采用同一任务维度分类，工具和适配信息另行标注。
5. 不收录本机私有 Skills，不镜像完整第三方 Skill 源码。

示例请求用于帮助理解任务，不是运行结果。适配信息来自上游声明，本站未逐项执行这些 Skills。外部项目更新后，当前收录快照与最新版本可能不同。

## 参考产品与设计

[ColaSkill](https://colaskill.com/zh/) 用于研究分类、搜索与详情的浏览流程。本站未复制其品牌、插画、封面与目录文案。

页面设计来自 [Aceternity](https://ui.aceternity.com/)；具体模板版本与组件来源见 [THIRD_PARTY.md](THIRD_PARTY.md)。
