# new-api 邀请码版本发布到 GitHub

## 当前版本说明

本地代码已包含“邀请码注册系统”改动，主要包括：

- 注册接口强制校验邀请码并在事务中核销
- 新增邀请码模型与管理接口
- 后台新增邀请码管理页面与侧边栏入口
- 注册页新增邀请码输入项

## 发布步骤

1. 在 GitHub 新建一个空仓库（例如：`yourname/new-api-invite`）
2. 在本地仓库执行：

```bash
cd /root/new-api-src
git remote rename origin upstream
git remote add origin https://github.com/<你的用户名>/<你的仓库名>.git
git push -u origin main
```

3. 后续同步上游官方仓库可用：

```bash
cd /root/new-api-src
git fetch upstream
git merge upstream/main
```

## 可选：打包源码给他人导入

```bash
cd /root
tar --exclude='.git' -czf new-api-invite-source.tar.gz new-api-src
```
