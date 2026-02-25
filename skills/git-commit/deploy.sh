#!/bin/bash

# Git 提交工具
# 用于将项目提交到 GitHub

echo "=== Git 提交工具 ==="
echo ""

# 检查 git 命令是否可用
echo "1. 检查 Git 环境..."
if ! command -v git &> /dev/null; then
    echo "❌ 错误: 未安装 Git"
    echo "请先安装 Git 后重试"
    exit 1
fi
echo "✅ Git 环境正常"
echo ""

# 检查是否在 git 仓库中
echo "2. 检查 Git 仓库..."
if [ ! -d ".git" ]; then
    echo "❌ 错误: 未找到 .git 目录"
    echo "请确保在项目根目录执行此脚本"
    exit 1
fi
echo "✅ 已在 Git 仓库中"
echo ""

# 检查远程仓库配置
echo "3. 检查远程仓库..."
if ! git remote -v | grep -q origin; then
    echo "❌ 错误: 未配置远程仓库 origin"
    echo "请先配置远程仓库: git remote add origin <GitHub 仓库 URL>"
    exit 1
fi
echo "✅ 远程仓库已配置"
echo ""

# 查看状态
echo "4. 查看文件状态..."
git status
echo ""

# 添加文件
echo "5. 添加文件到暂存区..."
git add .
if [ $? -ne 0 ]; then
    echo "❌ 错误: 添加文件失败"
    exit 1
fi
echo "✅ 文件添加成功"
echo ""

# 生成提交信息
COMMIT_MSG="feat: 更新项目配置和组件"
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
fi

# 提交文件
echo "6. 提交文件..."
git commit -m "$COMMIT_MSG"
if [ $? -ne 0 ]; then
    echo "❌ 错误: 提交文件失败"
    exit 1
fi
echo "✅ 文件提交成功"
echo ""

# 推送到 GitHub
echo "7. 推送到 GitHub..."
git push origin main
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 推送成功！"
    echo "项目已成功提交到 GitHub"
else
    echo ""
    echo "❌ 推送失败"
    echo "请检查网络连接或 GitHub 权限"
    exit 1
fi
echo ""
echo "=== Git 提交完成 ==="
