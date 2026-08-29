# 电摩减震器调校 Pro · iPad PWA 离线包

## 重要：PWA 不能直接双击 index.html 安装
iPad 的 Service Worker / PWA 离线缓存需要 HTTPS（或 localhost）。

## 推荐部署方式
把本文件夹中的全部文件上传到任意 HTTPS 静态网站托管服务，例如 GitHub Pages、Cloudflare Pages 或 Netlify。

部署后：
1. 用 iPad Safari 打开 HTTPS 网站地址。
2. 等待页面完全打开一次。
3. 点击 Safari“分享”。
4. 选择“添加到主屏幕”。
5. 以后从主屏幕图标打开。
6. 已缓存后可在无网络环境下继续使用。

文件：
- index.html：主应用
- manifest.webmanifest：PWA 配置
- sw.js：离线缓存
- icon.svg：应用图标
