# Firebase 后台管理系统 - 安装指南

---

## 第一步：创建 Firebase 项目

### 1.1 注册 Firebase
1. 访问 https://firebase.google.com/
2. 点击 **Get started** 登录 Google 账号
3. 点击 **Add project** 创建新项目
4. 项目名称：`campus-photography`（或其他名称）
5. 关闭 Google Analytics（可选）
6. 点击 **Create project**

### 1.2 获取配置信息
1. 进入项目后，点击 **⚙️ 设置图标**
2. 选择 **Project settings**
3. 向下滚动，找到 **Your apps** 部分
4. 点击 **</> (Web)** 图标
5. 注册应用，昵称：`campus-photography-web`
6. 复制生成的配置信息

### 1.3 复制配置到项目

打开 `src/firebase.js`，替换为您的配置：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "campus-photography.firebaseapp.com",
  projectId: "campus-photography",
  storageBucket: "campus-photography.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

---

## 第二步：启用存储服务

1. 在 Firebase Console 左侧菜单，点击 **Build** → **Storage**
2. 点击 **Get started**
3. 选择 **Start in test mode**（测试模式）
4. 选择存储位置（建议选择离您最近的区域，如 `asia-east1`）
5. 点击 **Done**

---

## 第三步：启用 Firestore 数据库

1. 在 Firebase Console 左侧菜单，点击 **Build** → **Firestore Database**
2. 点击 **Create database**
3. 选择 **Start in test mode**
4. 选择位置（与 Storage 相同）
5. 点击 **Done**

---

## 第四步：设置公开规则

### Storage 规则
1. 进入 **Storage** → **Rules**
2. 替换为以下规则：

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Firestore 规则
1. 进入 **Firestore Database** → **Rules**
2. 替换为以下规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photos/{photoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 第五步：启用身份验证

1. 在 Firebase Console 左侧菜单，点击 **Build** → **Authentication**
2. 点击 **Get started**
3. 在 **Native providers** 中，点击 **Email/Password**
4. 启用 **Email/Password**
5. 点击 **Save**

### 添加管理员账号
1. 点击 **Users** → **Add user**
2. 输入您的邮箱和密码
3. 点击 **Add user**

---

## 第六步：在本地配置

回到项目目录，在 `src/firebase.js` 中填入您在步骤 1.3 复制的配置信息。

---

## 第七步：运行项目

```bash
npm run dev
```

访问 http://localhost:5173/admin 进入后台管理页面。

---

## 完成！🎉

按照以上步骤设置好后，您就可以：
- 使用管理员账号登录
- 上传新照片
- 拖拽管理照片分类
- 照片会自动同步到前台网站

---

## 常见问题

### Q: 提示 "Permission denied"？
检查 Storage 和 Firestore 的规则是否正确设置。

### Q: 无法登录？
确认 Authentication 的 Email/Password 已启用，且用户已创建。

### Q: 图片上传失败？
检查 Storage 规则是否允许写入。

---

如有问题，随时问我！