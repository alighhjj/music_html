# 音乐搜索与播放前端项目

本项目基于 React + Vite 构建，实现了音乐搜索、播放等基础功能，界面美观并带有动效。

## 项目简介

本项目为一个音乐搜索与播放的前端应用，支持：

- 音乐搜索（调用第三方API）
- 音乐播放与暂停
- 响应式美观界面与动效

## 目录结构

```
src/
	App.jsx         # 主页面组件
	main.jsx        # 入口文件
	App.css         # 全局样式
	index.css       # 入口样式
	assets/         # 静态资源
	services/
		musicApi.js   # 音乐API服务
public/           # 公共资源
```

## 安装依赖

```bash
npm install
```

## 启动项目

```bash
npm run dev
```

浏览器访问 http://localhost:5173 查看效果。

## 功能说明

- 支持音乐关键词搜索，展示搜索结果
- 支持点击播放、暂停音乐
- 界面美观，带有基础动效

## 相关文档

- [API 使用说明](./API_USAGE.md)
- [音乐API文档](./music_api.md)

## 开发建议

- 推荐使用 VS Code 编辑器，配合 ESLint 插件提升代码质量
- 如需扩展功能，建议使用 TypeScript 进行类型约束

---
如有问题欢迎提 issue 或交流。
