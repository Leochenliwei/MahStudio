#!/bin/bash

# ============================================================================
# 服务器环境初始化脚本
# 用途: 在腾讯云轻量服务器上安装和配置运行环境
# 适用系统: Ubuntu Server 24.04 LTS
# 执行方式: 在服务器上直接运行
# ============================================================================

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 更新系统
update_system() {
    print_info "更新系统软件包..."
    sudo apt update && sudo apt upgrade -y
    print_success "系统更新完成"
}

# 安装基础工具
install_basic_tools() {
    print_info "安装基础工具..."
    sudo apt install -y \
        curl \
        wget \
        git \
        vim \
        htop \
        unzip \
        build-essential \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
    print_success "基础工具安装完成"
}

# 安装 Node.js
install_nodejs() {
    print_info "安装 Node.js..."
    
    # 添加 NodeSource 仓库（安装 Node.js 20 LTS）
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # 验证安装
    node_version=$(node -v)
    npm_version=$(npm -v)
    
    print_success "Node.js 安装完成: ${node_version}"
    print_success "npm 安装完成: ${npm_version}"
}

# 安装 PM2
install_pm2() {
    print_info "安装 PM2 进程管理器..."
    sudo npm install -g pm2
    pm2 --version
    print_success "PM2 安装完成"
}

# 安装 Nginx
install_nginx() {
    print_info "安装 Nginx..."
    
    # 安装 Nginx
    sudo apt install -y nginx
    
    # 启动 Nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    # 验证安装
    nginx_version=$(nginx -v 2>&1 | head -n1)
    print_success "Nginx 安装完成: ${nginx_version}"
}

# 配置防火墙
setup_firewall() {
    print_info "配置防火墙..."
    
    # 安装 UFW（如果未安装）
    sudo apt install -y ufw
    
    # 允许 SSH
    sudo ufw allow OpenSSH
    
    # 允许 HTTP 和 HTTPS
    sudo ufw allow 'Nginx Full'
    
    # 启用防火墙
    sudo ufw --force enable
    
    print_success "防火墙配置完成"
    sudo ufw status
}

# 创建项目目录
create_project_dirs() {
    print_info "创建项目目录结构..."
    
    # 创建主目录
    sudo mkdir -p /var/www
    sudo chown -R ubuntu:ubuntu /var/www
    
    # 创建日志目录
    sudo mkdir -p /var/log/pm2
    sudo chown -R ubuntu:ubuntu /var/log/pm2
    
    # 创建项目目录（示例）
    mkdir -p /var/www/webconfig
    mkdir -p /var/www/project2
    mkdir -p /var/www/project3
    
    print_success "项目目录创建完成"
    print_info "项目目录结构:"
    ls -la /var/www/
}

# 配置 Nginx 多项目支持
configure_nginx() {
    print_info "配置 Nginx 多项目支持..."
    
    # 创建 Nginx 配置目录结构
    sudo mkdir -p /etc/nginx/sites-available
    sudo mkdir -p /etc/nginx/sites-enabled
    
    # 备份默认配置
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    
    # 修改 nginx.conf 支持多站点
    sudo tee /etc/nginx/nginx.conf > /dev/null << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/access.log;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # 包含所有站点配置
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

    # 创建默认站点配置（返回 444 关闭直接 IP 访问）
    sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 444;
}
EOF

    sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
    
    # 测试配置
    sudo nginx -t
    
    # 重启 Nginx
    sudo systemctl restart nginx
    
    print_success "Nginx 多项目配置完成"
}

# 安装 SQLite（项目需要）
install_sqlite() {
    print_info "安装 SQLite..."
    sudo apt install -y sqlite3 libsqlite3-dev
    print_success "SQLite 安装完成"
}

# 创建部署用户（可选）
create_deploy_user() {
    print_info "检查部署用户..."
    
    # 当前使用 ubuntu 用户，确保其在 www-data 组
    sudo usermod -a -G www-data ubuntu
    
    print_success "用户权限配置完成"
}

# 配置 SSH（安全加固）
configure_ssh() {
    print_info "配置 SSH 安全..."
    
    # 备份 SSH 配置
    sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # 修改 SSH 配置
    sudo tee /etc/ssh/sshd_config.d/custom.conf > /dev/null << 'EOF'
# 禁用 root 登录
PermitRootLogin no

# 使用密钥认证（可选，如果需要密码登录请注释掉）
# PasswordAuthentication no
# PubkeyAuthentication yes

# 限制最大认证尝试次数
MaxAuthTries 3

# 空闲超时时间
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

    # 重启 SSH 服务
    sudo systemctl restart sshd
    
    print_success "SSH 安全配置完成"
}

# 安装监控工具（可选）
install_monitoring() {
    print_info "安装监控工具..."
    
    # 安装 net-tools（提供 netstat 等命令）
    sudo apt install -y net-tools
    
    print_success "监控工具安装完成"
}

# 显示系统信息
show_system_info() {
    echo ""
    echo "=========================================="
    echo "  服务器环境配置完成！"
    echo "=========================================="
    echo ""
    echo "系统信息:"
    echo "  - 主机名: $(hostname)"
    echo "  - IP 地址: $(curl -s ifconfig.me || echo '无法获取')"
    echo "  - 操作系统: $(lsb_release -ds)"
    echo "  - Node.js: $(node -v)"
    echo "  - npm: $(npm -v)"
    echo "  - PM2: $(pm2 --version | head -n1)"
    echo "  - Nginx: $(nginx -v 2>&1 | head -n1)"
    echo ""
    echo "目录结构:"
    echo "  - 项目目录: /var/www/"
    echo "  - Nginx 配置: /etc/nginx/sites-available/"
    echo "  - PM2 日志: /var/log/pm2/"
    echo ""
    echo "常用命令:"
    echo "  - 查看 Nginx 状态: sudo systemctl status nginx"
    echo "  - 查看 PM2 状态: pm2 status"
    echo "  - 查看防火墙状态: sudo ufw status"
    echo ""
    echo "下一步:"
    echo "  1. 将项目代码上传到 /var/www/webconfig/"
    echo "  2. 配置 Nginx 站点: sudo vim /etc/nginx/sites-available/webconfig"
    echo "  3. 启动应用: pm2 start /var/www/webconfig/deploy/pm2/ecosystem.config.js"
    echo "=========================================="
}

# 主函数
main() {
    echo "=========================================="
    echo "  服务器环境初始化脚本"
    echo "  Ubuntu Server 24.04 LTS"
    echo "=========================================="
    echo ""
    
    # 检查是否以 root 权限运行
    if [ "$EUID" -eq 0 ]; then
        print_error "请不要以 root 用户运行此脚本"
        print_info "请使用 ubuntu 用户执行: ./setup-server.sh"
        exit 1
    fi
    
    # 检查系统版本
    if ! lsb_release -ds | grep -q "Ubuntu 24.04"; then
        print_warning "此脚本针对 Ubuntu 24.04 优化，当前系统: $(lsb_release -ds)"
        read -p "是否继续? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    print_info "开始初始化服务器环境..."
    
    # 执行安装步骤
    update_system
    install_basic_tools
    install_nodejs
    install_pm2
    install_nginx
    install_sqlite
    setup_firewall
    create_project_dirs
    configure_nginx
    create_deploy_user
    configure_ssh
    install_monitoring
    
    # 显示系统信息
    show_system_info
    
    print_success "服务器环境初始化完成！"
}

# 执行主函数
main "$@"
