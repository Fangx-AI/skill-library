<div align="center">

# Skill Library

**先看案例，再选 Skill。**

一个有预览、有出处、有安装指南的中文 Agent Skills 目录。

59 个技能 · 6 类任务 · 11 个公开来源

[打开网站](https://fangx-ai.github.io/skill-library/) · [收录来源](SOURCE.md) · [推荐 Skill](https://github.com/Fangx-AI/skill-library/issues/new)

</div>

[![Skill Library 网站预览](docs/images/home.jpg)](https://fangx-ai.github.io/skill-library/)

## 看见它能做什么

- **先看预览**：封面、漫画、图文、网页与演示稿，展示作者公开的真实案例；缺少案例的条目标注原文预览。
- **按任务找**：创作设计、编程开发、文档办公、研究分析、运营增长、工具效率。
- **看清用途**：中文说明、适用场景、示例请求和前置要求。
- **安装有依据**：支持 CLI 的条目可复制命令；需要插件的条目提供官方安装指南。
- **随时回访**：收藏保存在当前浏览器，搜索与筛选可以通过链接分享。

每个条目都能追溯到上游文件、固定版本与许可。图片出处和署名见 [预览清单](dist/media-manifest.json)。GitHub Stars 是**来源仓库**的数据；本站没有逐项执行收录的 Skills。

<details>
<summary>看看安装详情</summary>

![技能详情：用途、示例与安装方式](docs/images/detail.jpg)

</details>

## 参与维护

发现值得收录的 Skill，或看到失效的链接与安装方式，欢迎[提交 Issue](https://github.com/Fangx-AI/skill-library/issues)；提交目录变更请看 [CONTRIBUTING.md](CONTRIBUTING.md)。

公开目录位于 [dist/catalog.json](dist/catalog.json)，收录统计与校验摘要位于 [dist/catalog-meta.json](dist/catalog-meta.json)。

## 预览与发布

本仓库保存可部署的网站产物、目录和文档。需要 Node.js 24：

```bash
node scripts/verify-artifact.mjs
npx --yes serve dist
```

`main` 分支通过校验后，由 GitHub Actions 发布到 GitHub Pages。

界面使用已授权的 [Aceternity AI SaaS Template](https://ui.aceternity.com/templates/ai-saas-template) 与其官方组件。模板编辑源码不在此仓库分发；设计来源与依赖说明见 [THIRD_PARTY.md](THIRD_PARTY.md)。
