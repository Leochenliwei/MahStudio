# PanelKit 工作台 - 腾讯云轻量服务器部署指南

## 📋 项目信息

- **项目名称**: WEBconfig (PanelKit 工作台)
- **技术栈**: Vue 3 + Vite + Express + SQLite
- **部署目标**: 腾讯云轻量应用服务器
- **操作系统**: Ubuntu Server 24.04 LTS

## 🚀 快速部署

### 方式一：全自动部署（推荐）

```bash
# 1. 修改 deploy.sh 中的服务器 IP
cd deploy
vim deploy.sh  # 修改 REMOTE_HOST="你的服务器IP"

# 2. 执行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 方式二：手动分步部署

#### 第一步：初始化服务器环境

```bash
# 登录服务器
ssh ubuntu@你的服务器IP

# 上传并执行环境安装脚本
scp deploy/setup-server.sh ubuntu@你的服务器IP:~/
ssh ubuntu@你的服务器IP
chmod +x setup-server.sh
./setup-server.sh
```

#### 第二步：上传项目代码

```bash
# 在本地执行
# 1. 构建项目
npm install
npm run build

# 2. 上传文件到服务器
scp -r dist/* ubuntu@你的服务器IP:/var/www/webconfig/
scp -r server ubuntu@你的服务器IP:/var/www/webconfig/
scp package*.json ubuntu@你的服务器IP:/var/www/webconfig/
scp -r deploy ubuntu@你的服务器IP:/var/www/webconfig/
```

#### 第三步：配置并启动服务

```bash
# 在服务器上执行
cd /var/www/webconfig

# 安装依赖
npm install --production

# 配置 Nginx
sudo cp deploy/nginx/webconfig.conf /etc/nginx/sites-available/webconfig
sudo ln -sf /etc/nginx/sites-available/webconfig /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 启动应用
pm2 start deploy/pm2/ecosystem.config.js
pm2 save
```

## 📁 部署目录结构

```
/var/www/
├── webconfig/              # 当前项目
│   ├── dist/              # 前端构建文件
│   ├── server/            # Express 后端
│   ├── deploy/            # 部署配置
│   ├── package.json
│   └── ...
├── project2/              # 其他项目（示例）
└── project3/              # 其他项目（示例）
```

## 🔧 配置文件说明

### Nginx 配置

**文件位置**: `/etc/nginx/sites-available/webconfig`

```nginx
server {
    listen 80;
    server_name _;

    # 前端静态文件
    location /MahStudio/ {
        alias /var/www/webconfig/dist/;
        try_files $uri $uri/ /MahStudio/index.html;
    }

    # API 反向代理
    location /MahStudio/api/ {
        proxy_pass http://localhost:4174/api/;
    }
}
```

### PM2 配置

**文件位置**: `/var/www/webconfig/deploy/pm2/ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'webconfig-api',
    script: './server/server.js',
    port: 4174,
    // ... 其他配置
  }]
};
```

## 🌐 访问地址

部署完成后，可以通过以下地址访问：

| 服务 | 地址 |
|------|------|
| 前端页面 | `http://你的服务器IP/MahStudio/` |
| API 接口 | `http://你的服务器IP/MahStudio/api/` |
| 健康检查 | `http://你的服务器IP/MahStudio/health` |

## 📊 常用命令

### 应用管理

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs webconfig-api
pm2 logs webconfig-api --lines 100

# 重启应用
pm2 restart webconfig-api

# 停止应用
pm2 stop webconfig-api

# 删除应用
pm2 delete webconfig-api
```

### Nginx 管理

```bash
# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 系统监控

```bash
# 查看系统资源
htop

# 查看端口占用
sudo netstat -tlnp | grep :80

# 查看磁盘空间
df -h

# 查看内存使用
free -h
```

## 🔄 更新部署

```bash
# 方式一：使用部署脚本
./deploy/deploy.sh --deploy-only

# 方式二：手动更新
# 1. 本地重新构建
npm run build

# 2. 上传新的构建文件
scp -r dist/* ubuntu@你的服务器IP:/var/www/webconfig/

# 3. 重启应用
ssh ubuntu@你的服务器IP 'pm2 restart webconfig-api'
```

## ➕ 添加更多项目

要在同一服务器上部署其他项目，按照以下步骤：

### 1. 创建项目目录

```bash
sudo mkdir -p /var/www/new-project
sudo chown -R ubuntu:ubuntu /var/www/new-project
```

### 2. 上传项目文件

```bash
scp -r ./dist/* ubuntu@你的服务器IP:/var/www/new-project/
```

### 3. 创建 Nginx 配置

```bash
sudo tee /etc/nginx/sites-available/new-project > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location /new-project/ {
        alias /var/www/new-project/;
        try_files $uri $uri/ /new-project/index.html;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/new-project /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. 访问新项目

访问地址: `http://你的服务器IP/new-project/`

## 🛠️ 故障排查

### 问题 1: 无法访问网站

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查防火墙
sudo ufw status

# 检查端口监听
sudo netstat -tlnp | grep :80
```

### 问题 2: API 接口 502 错误

```bash
# 检查应用状态
pm2 status
pm2 logs webconfig-api

# 检查端口占用
sudo netstat -tlnp | grep :4174
```

### 问题 3: 静态文件 404

```bash
# 检查文件是否存在
ls -la /var/www/webconfig/dist/

# 检查 Nginx 配置
sudo cat /etc/nginx/sites-enabled/webconfig
```

## 🔒 安全建议

1. **修改默认密码**: 首次登录后修改 ubuntu 用户密码
   ```bash
   passwd
   ```

2. **配置 SSH 密钥**: 禁用密码登录，使用 SSH 密钥认证

3. **定期更新系统**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **配置防火墙**: 只开放必要的端口（80, 443, 22）

## 📞 技术支持

如有问题，请检查以下日志文件：

- Nginx 错误日志: `/var/log/nginx/error.log`
- PM2 应用日志: `/var/log/pm2/webconfig-api-error.log`
- 系统日志: `/var/log/syslog`

## 📝 更新记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2025-03-09 | 1.0 | 初始部署方案 |
