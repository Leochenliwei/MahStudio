#!/bin/bash

# ============================================================================
# PanelKit 工作台项目部署脚本
# 用途: 自动化部署 Vue 3 + Express 项目到腾讯云轻量服务器
# 作者: Claude
# 日期: 2025-03-09
# ============================================================================

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 切换到项目根目录
cd "$PROJECT_DIR"

# 配置变量
REMOTE_HOST="43.167.235.183"        # 需要替换为实际IP
REMOTE_USER="ubuntu"
REMOTE_PASSWORD=".WU[m;x3~nFh8Q"
PROJECT_NAME="webconfig"
REMOTE_DIR="/var/www/${PROJECT_NAME}"
LOCAL_DIST="${PROJECT_DIR}/dist"
LOCAL_SERVER="${PROJECT_DIR}/server"
NGINX_CONF="${PROJECT_DIR}/deploy/nginx/webconfig.conf"
PM2_CONF="${PROJECT_DIR}/deploy/pm2/ecosystem.config.cjs"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
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

# 检查本地环境
check_local_env() {
    print_info "检查本地环境..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装"
        exit 1
    fi
    
    print_success "本地环境检查通过"
}

# 构建项目
build_project() {
    print_info "开始构建项目..."
    print_info "当前工作目录: $(pwd)"
    
    # 安装依赖
    print_info "安装依赖..."
    npm install
    
    # 构建前端
    print_info "构建前端项目..."
    npm run build
    
    # 检查构建结果（使用绝对路径）
    print_info "检查构建输出..."
    if [ ! -d "${LOCAL_DIST}" ]; then
        print_error "构建失败，dist 目录不存在: ${LOCAL_DIST}"
        print_info "当前目录内容:"
        ls -la "${PROJECT_DIR}"
        exit 1
    fi
    
    if [ ! -f "${LOCAL_DIST}/index.html" ]; then
        print_error "构建失败，index.html 不存在"
        print_info "dist 目录内容:"
        ls -la "${LOCAL_DIST}"
        exit 1
    fi
    
    print_success "项目构建完成"
    print_info "构建输出内容:"
    ls -la "${LOCAL_DIST}"
}

# 部署到远程服务器
deploy_to_server() {
    print_info "开始部署到服务器 ${REMOTE_HOST}..."
    
    # 使用 sshpass 进行自动登录（需要提前安装 sshpass）
    # macOS: brew install sshpass
    # Ubuntu: sudo apt-get install sshpass
    
    if ! command -v sshpass &> /dev/null; then
        print_warning "sshpass 未安装，尝试使用 SSH 密钥..."
        print_info "建议安装 sshpass: macOS: brew install sshpass | Ubuntu: sudo apt install sshpass"
    fi
    
    # 创建远程目录
    print_info "创建远程目录..."
    if command -v sshpass &> /dev/null; then
        sshpass -p "${REMOTE_PASSWORD}" ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "sudo mkdir -p ${REMOTE_DIR} && sudo chown -R ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_DIR}"
    else
        ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "sudo mkdir -p ${REMOTE_DIR} && sudo chown -R ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_DIR}"
    fi
    
    # 上传前端文件
    print_info "上传前端构建文件..."
    if command -v sshpass &> /dev/null; then
        sshpass -p "${REMOTE_PASSWORD}" scp -o StrictHostKeyChecking=no -r "${LOCAL_DIST}"/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
    else
        scp -o StrictHostKeyChecking=no -r "${LOCAL_DIST}"/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
    fi
    
    # 上传后端文件
    print_info "上传后端文件..."
    if command -v sshpass &> /dev/null; then
        sshpass -p "${REMOTE_PASSWORD}" scp -o StrictHostKeyChecking=no -r "${LOCAL_SERVER}" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
        sshpass -p "${REMOTE_PASSWORD}" scp -o StrictHostKeyChecking=no "${PROJECT_DIR}/package.json" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
        sshpass -p "${REMOTE_PASSWORD}" scp -o StrictHostKeyChecking=no "${PROJECT_DIR}/package-lock.json" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
        sshpass -p "${REMOTE_PASSWORD}" scp -o StrictHostKeyChecking=no -r "${PROJECT_DIR}/deploy" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
    else
        scp -o StrictHostKeyChecking=no -r "${LOCAL_SERVER}" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
        scp -o StrictHostKeyChecking=no "${PROJECT_DIR}/package.json" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
        scp -o StrictHostKeyChecking=no "${PROJECT_DIR}/package-lock.json" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
        scp -o StrictHostKeyChecking=no -r "${PROJECT_DIR}/deploy" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
    fi
    
    print_success "文件上传完成"
}

# 在服务器上执行部署命令
setup_server() {
    print_info "在服务器上执行部署命令..."
    
    local REMOTE_COMMANDS=$(cat << 'EOF'
#!/bin/bash

PROJECT_DIR="/var/www/webconfig"
LOG_DIR="/var/log/pm2"

echo "[INFO] 开始服务器端部署..."

# 创建日志目录
sudo mkdir -p ${LOG_DIR}
sudo chown -R ubuntu:ubuntu ${LOG_DIR}

# 进入项目目录
cd ${PROJECT_DIR}

# 安装生产依赖
echo "[INFO] 安装 Node.js 依赖..."
npm install --production

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    echo "[INFO] 安装 PM2..."
    sudo npm install -g pm2
fi

# 启动或重启应用
echo "[INFO] 启动应用..."
pm2 delete webconfig-api 2>/dev/null || true
pm2 start ./deploy/pm2/ecosystem.config.js

# 保存 PM2 配置
echo "[INFO] 保存 PM2 配置..."
pm2 save

# 配置 PM2 开机自启
echo "[INFO] 配置 PM2 开机自启..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# 配置 Nginx
echo "[INFO] 配置 Nginx..."
sudo cp ./deploy/nginx/webconfig.conf /etc/nginx/sites-available/webconfig
sudo ln -sf /etc/nginx/sites-available/webconfig /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试 Nginx 配置
echo "[INFO] 测试 Nginx 配置..."
sudo nginx -t

# 重启 Nginx
echo "[INFO] 重启 Nginx..."
sudo systemctl restart nginx

echo "[SUCCESS] 服务器部署完成！"
EOF
)

    if command -v sshpass &> /dev/null; then
        echo "${REMOTE_COMMANDS}" | sshpass -p "${REMOTE_PASSWORD}" ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} 'bash -s'
    else
        echo "${REMOTE_COMMANDS}" | ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} 'bash -s'
    fi
    
    print_success "服务器配置完成"
}

# 验证部署
verify_deployment() {
    print_info "验证部署..."
    
    # 等待服务启动
    sleep 3
    
    # 检查 HTTP 响应
    local HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://${REMOTE_HOST}/MahStudio/health 2>/dev/null || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        print_success "部署验证通过！"
        print_info "访问地址: http://${REMOTE_HOST}/MahStudio/"
    else
        print_warning "部署可能存在问题，HTTP 状态码: ${HTTP_STATUS}"
        print_info "请手动检查服务器日志: ssh ${REMOTE_USER}@${REMOTE_HOST}"
    fi
}

# 主函数
main() {
    echo "=========================================="
    echo "  PanelKit 工作台项目部署脚本"
    echo "=========================================="
    echo ""
    
    # 检查参数
    if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        echo "用法: ./deploy/deploy.sh [选项]"
        echo ""
        echo "选项:"
        echo "  --build-only    仅构建项目"
        echo "  --deploy-only   仅部署（跳过构建）"
        echo "  --setup-only    仅执行服务器配置"
        echo "  --help, -h      显示帮助"
        echo ""
        echo "示例:"
        echo "  ./deploy/deploy.sh              # 完整部署流程"
        echo "  ./deploy/deploy.sh --build-only # 仅构建"
        exit 0
    fi
    
    # 执行部署流程
    if [ "$1" = "--build-only" ]; then
        check_local_env
        build_project
    elif [ "$1" = "--deploy-only" ]; then
        deploy_to_server
        setup_server
        verify_deployment
    elif [ "$1" = "--setup-only" ]; then
        setup_server
        verify_deployment
    else
        # 完整流程
        check_local_env
        build_project
        deploy_to_server
        setup_server
        verify_deployment
    fi
    
    echo ""
    echo "=========================================="
    print_success "部署流程执行完毕！"
    echo "=========================================="
    echo ""
    echo "访问地址:"
    echo "  - 前端页面: http://${REMOTE_HOST}/MahStudio/"
    echo "  - API 接口: http://${REMOTE_HOST}/MahStudio/api/"
    echo "  - 健康检查: http://${REMOTE_HOST}/MahStudio/health"
    echo ""
    echo "常用命令:"
    echo "  查看日志: ssh ${REMOTE_USER}@${REMOTE_HOST} 'pm2 logs webconfig-api'"
    echo "  重启服务: ssh ${REMOTE_USER}@${REMOTE_HOST} 'pm2 restart webconfig-api'"
    echo "  查看状态: ssh ${REMOTE_USER}@${REMOTE_HOST} 'pm2 status'"
}

# 执行主函数
main "$@"
