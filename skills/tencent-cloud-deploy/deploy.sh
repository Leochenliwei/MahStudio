#!/bin/bash

# 腾讯云部署脚本
# 用于自动化部署 WEBconfig 项目到腾讯云

echo "=== 腾讯云部署工具 ==="
echo ""

# 检查是否安装了 tcb 命令行工具
echo "1. 检查 tcb 命令行工具..."
if ! command -v tcb &> /dev/null; then
    echo "❌ 错误: 未安装 tcb 命令行工具"
    echo "请先安装: npm install -g @cloudbase/cli"
    exit 1
fi
echo "✅ tcb 命令行工具已安装"
echo ""

# 检查项目依赖
echo "2. 检查项目依赖..."
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到 package.json 文件"
    echo "请确保在项目根目录执行此脚本"
    exit 1
fi
echo "✅ 项目依赖配置已找到"
echo ""

# 构建项目
echo "3. 构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 错误: 项目构建失败"
    exit 1
fi
echo "✅ 项目构建成功"
echo ""

# 检查构建产物
echo "4. 检查构建产物..."
if [ ! -d "dist" ]; then
    echo "❌ 错误: 未找到 dist 目录"
    echo "构建可能未生成正确的产物"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ 错误: 未找到 dist/index.html 文件"
    echo "构建产物不完整"
    exit 1
fi
echo "✅ 构建产物检查通过"
echo ""

# 部署到腾讯云
echo "5. 部署到腾讯云..."
echo "执行命令: tcb hosting deploy dist /MahStudio -e dev-1gjaefwhe1e8a952"
echo ""
tcb hosting deploy dist /MahStudio -e dev-1gjaefwhe1e8a952

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署成功！"
    echo "项目已成功部署到腾讯云 /MahStudio 路径"
    echo ""
    echo "请访问您的腾讯云域名查看部署结果"
else
    echo ""
    echo "❌ 部署失败"
    echo "请检查错误信息并重试"
    exit 1
fi

echo ""
echo "=== 部署完成 ==="
