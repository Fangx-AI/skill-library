# 推荐与修正 Skill

欢迎提交能解决具体任务、来源可核对的 Skill。新条目、分类修正、失效链接和安装文档更新都可以通过 [Issue](https://github.com/Fangx-AI/skill-library/issues) 提交。

请提供：

- 公开仓库、具体 Skill 文件与完整提交 SHA。
- 上游 Skill 名称、许可文件和官方安装文档。
- 中文用途说明、适用任务、前置要求。
- 所属任务分类，以及官方或社区的判断依据。

任务分类保持为：创作设计、编程开发、文档办公、研究分析、运营增长、工具效率。选择主要任务；框架、Agent 和工具放入标签与适配字段。

## 修改目录

目录文件是 `dist/catalog.json`，采用条目数组。请保留现有字段；不要添加未经验证的下载量、认证、评分、独立 Skill Star 数或“已测试兼容”声明。

安装方式使用 `skills-cli`、`plugin` 或 `source`。只有上游支持的 CLI 安装才填 `installCommand`；插件与来源指南填 `installGuideUrl`，命令为空。依赖服务账号、插件或凭据时，写明前置要求，不提交真实凭据。

修改目录后，同步 `dist/catalog-meta.json` 的条目数、来源数、官方条目数、分类计数与目录 SHA-256，再运行：

```bash
node scripts/verify-artifact.mjs
```

界面修改由维护者在授权源码环境中构建，再提交编译产物。请勿向本仓库上传付费模板源码、下载包、Source Map 或本机私有 Skill 文件。
