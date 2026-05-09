# GitHub Actions 在线构建 APK 指南

## 🎉 优势
- ✅ **完全免费**
- ✅ **自动构建**（推送代码后自动触发）
- ✅ **无需本地Java环境**
- ✅ **构建完成后可下载APK**

## 📋 完整步骤

### 第一步：创建GitHub仓库

1. **访问GitHub**
   - 打开：https://github.com
   - 登录您的账号（如没有请注册）

2. **创建新仓库**
   - 点击右上角 "+" → "New repository"
   - Repository name: `64-wheel-app`
   - 选择 "Public" 或 "Private"
   - 勾选 "Add a README file"（可选）
   - 点击 "Create repository"

### 第二步：上传代码到GitHub

在 **Git Bash** 中执行：

```bash
# 进入项目目录
cd "/c/Users/admin/WorkBuddy/2026-05-09-task-1/64-wheel-app"

# 初始化Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 64转盘APP with settings and sound"

# 添加远程仓库（替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/64-wheel-app.git

# 推送到GitHub
git push -u origin main
```

**如果遇到认证问题**：
- GitHub 不再支持密码推送
- 需要使用 **Personal Access Token (PAT)**
- 参考：https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

### 第三步：触发自动构建

推送代码后：
1. 访问您的GitHub仓库
2. 点击 **"Actions"** 标签页
3. 您会看到 **"Build Android APK"** workflow
4. 点击进入，查看构建进度
5. 等待构建完成（约5-10分钟）

### 第四步：下载APK

构建完成后：
1. 在Workflow运行页面，滚动到 **"Artifacts"** 部分
2. 点击 **"64wheel-app-debug-apk"** 下载
3. 解压下载的zip文件
4. 得到 `app-debug.apk`

## 🔄 后续更新

每次您修改代码并推送到GitHub，都会自动重新构建：

```bash
# 修改代码后...
git add .
git commit -m "更新说明"
git push
```

然后访问 GitHub Actions 页面查看构建进度，构建完成后下载新的APK。

## 🐛 故障排查

### 1. 构建失败
- 点击失败的workflow run
- 查看日志，找到红色错误信息
- 常见问题：
  - Node.js版本不匹配 → 修改 `.github/workflows/build-android.yml` 中的 `node-version`
  - 依赖安装失败 → 检查 `package.json` 是否正确

### 2. Artifacts找不到
- 确保构建步骤中有 "Upload APK artifact" 这一步
- 检查 `.github/workflows/build-android.yml` 文件是否存在

### 3. Git推送失败
- **认证问题**：使用Personal Access Token (PAT)
- **仓库不存在**：检查GitHub上的仓库名称是否正确
- **分支名称**：GitHub默认分支可能是 `main` 或 `master`

## 📞 需要帮助？

遇到问题时，请提供：
1. 错误信息截图
2. GitHub仓库链接
3. Actions构建日志（失败的那个）

---

## 🚀 快速命令参考

```bash
# 初始化并推送（首次）
cd "/c/Users/admin/WorkBuddy/2026-05-09-task-1/64-wheel-app"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/64-wheel-app.git
git push -u origin main

# 后续更新
git add .
git commit -m "Update: 描述更新内容"
git push
```

---

**作者**: 齐活林（Qi）- 交付总监
**日期**: 2026-05-09
**项目**: 64转盘APP
