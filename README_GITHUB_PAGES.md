# GitHub Pages 一键部署

## 方法 A：网页上传（最简单）
1. 在 GitHub 新建一个公开仓库，例如 `emoto-suspension-pro`。
2. 上传本目录全部文件到仓库根目录。
3. 打开仓库 Settings → Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，Folder 选择 `/(root)`，保存。
6. 等待 Pages 发布完成。
7. 用 iPad Safari 打开 Pages 地址 → 分享 → 添加到主屏幕。

## 方法 B：GitHub Actions 自动部署
本项目已包含 `.github/workflows/deploy-pages.yml`。推送到 `main` 后可自动部署。
在 GitHub 仓库 Settings → Pages 中，将 Source 设为 `GitHub Actions`。
