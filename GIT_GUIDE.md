# 📸 校园光影 - Git 版本控制指南

## 方案：使用 GitHub 仓库（免费）

---

## 第一步：在当前电脑初始化 Git

### 1.1 安装 Git（如果还没安装）
- **Windows**: https://git-scm.com/download/win 下载安装
- 安装时一路点 "Next" 即可

### 1.2 打开命令行，进入项目目录
```bash
cd d:\AUTO_PIC
```

### 1.3 初始化 Git 仓库
```bash
git init
```

### 1.4 设置用户信息（标识这次提交是谁做的）
```bash
git config --global user.email "你的邮箱@example.com"
git config --global user.name "你的名字"
```

### 1.5 添加所有文件并提交
```bash
git add .
git commit -m "Initial commit: 校园摄影作品集 Phase 1"
```

---

## 第二步：关联您的 GitHub 仓库并推送

您的仓库地址是：`https://github.com/ArroganceG/Phome.git`

### 2.1 添加远程仓库
```bash
git remote add origin https://github.com/ArroganceG/Phome.git
```

### 2.2 推送到 GitHub
```bash
git branch -M main
git push -u origin main
```

**首次推送时**，GitHub 会要求输入用户名和密码：
- **Username**: `ArroganceG`
- **Password**: 你的 GitHub 密码（或 Personal Access Token）

---

## 第三步：在其他电脑上继续开发

### 3.1 克隆仓库
```bash
git clone https://github.com/ArroganceG/Phome.git
```

### 3.2 进入项目目录
```bash
cd Phome
```

### 3.3 安装依赖
```bash
npm install
```

### 3.4 启动开发服务器
```bash
npm run dev
```

---

## 日常开发流程

### 推送代码（提交更改）
```bash
git add .
git commit -m "描述你做了什么"
git push
```

### 拉取最新代码
```bash
git pull
```

---

## ⚠️ GitHub 密码问题

如果推送时密码错误，请使用 **Personal Access Token** 代替密码：

1. 登录 GitHub → 点击头像 → **Settings**
2. 左侧底部 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. 点 **Generate new token**，勾选 `repo` 权限
5. 复制生成的 token，推送时粘贴作为密码

---

## 🎉 完成！

按照以上步骤操作后，您的代码就安全地保存在 GitHub 上了，可以随时在任何电脑上克隆下来继续开发。

如有问题，随时问我！