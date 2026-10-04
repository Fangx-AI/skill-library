# 设计与第三方依赖

## Aceternity

网站采用已授权的 [AI SaaS Template](https://ui.aceternity.com/templates/ai-saas-template)，基于原模板的黑色背景、导航、标题、按钮、网格卡片与页脚，并使用 Aceternity 官方交互组件。

模板来源版本：`a811327dfdafb4011c230c415d79f4cef05f9ba4`。

| 页面部分 | 实际来源 |
| --- | --- |
| 首屏、网格背景、导航、按钮、技能网格、页脚 | [AI SaaS 完整模板](https://ui.aceternity.com/templates/ai-saas-template) 的 Hero、Background、Navbar、Button、GridFeatures、Footer |
| 搜索输入框 | [Signup Form](https://ui.aceternity.com/components/signup-form) 的 Input |
| 分类与来源切换 | [Tabs](https://ui.aceternity.com/components/tabs) |
| 技能详情 | [Animated Modal](https://ui.aceternity.com/components/animated-modal) |
| 安装命令与示例复制 | [Code Block](https://ui.aceternity.com/components/code-block) |

保留原套件的视觉与动效，内容改为真实 Skill 目录，并补充筛选、收藏、链接状态、键盘焦点和手机交互。

[Aceternity 许可](https://ui.aceternity.com/licence)允许发布最终产品，限制模板源码的再分发。本仓库因此仅发布编译后的网站、目录数据与文档，不包含模板源码、源映射或下载包。

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
| [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | 安装命令展示 | MIT |
| [clsx](https://github.com/lukeed/clsx) / [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 组件样式合并 | MIT |

编译产物保留依赖的许可注释。目录中第三方 Skills 的许可分别列在对应条目，本站不为它们重新授权。
