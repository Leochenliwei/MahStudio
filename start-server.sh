#!/bin/bash

# 一键启动服务器脚本
# 功能：启动 Express 服务器，提供 API 和前端静态文件服务

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  配置平台服务器启动脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 进入 server 目录
cd "$SCRIPT_DIR/server" || {
    echo -e "${RED}错误：无法进入 server 目录${NC}"
    exit 1
}

# 检查 server 目录的 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}正在安装服务器依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}依赖安装失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}依赖安装完成${NC}"
    echo ""
fi

# 返回项目根目录进行编译
cd "$SCRIPT_DIR" || {
    echo -e "${RED}错误：无法返回项目根目录${NC}"
    exit 1
}

# 检查项目根目录的 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}正在安装项目依赖...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}项目依赖安装失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}项目依赖安装完成${NC}"
    echo ""
fi

# 执行编译
echo -e "${YELLOW}正在编译前端项目...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}编译失败${NC}"
    exit 1
fi
echo -e "${GREEN}编译完成${NC}"
echo ""

# 重新进入 server 目录
cd "$SCRIPT_DIR/server" || {
    echo -e "${RED}错误：无法进入 server 目录${NC}"
    exit 1
}

echo -e "${GREEN}正在启动服务器...${NC}"
echo -e "${YELLOW}访问地址：http://localhost:4174/MahStudio${NC}"
echo -e "${YELLOW}API 地址：http://localhost:4174/api${NC}"
echo ""

# 启动服务器
node server.js
