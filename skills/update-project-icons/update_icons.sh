#!/bin/bash

# 更新项目内所有图标脚本
# 按顺序执行图标生成系统的三个步骤

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# 项目根目录（script目录向上两级）
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

echo "===================================="
echo "开始更新项目内所有图标..."
echo "===================================="
echo "项目根目录: $PROJECT_ROOT"

# 步骤1：提取图标名称
echo "\n步骤1：提取图标名称"
echo "------------------------------------"
python3 "$PROJECT_ROOT/extract_icon_names.py"

# 步骤2：解析sprite.svg文件
echo "\n步骤2：解析sprite.svg文件"
echo "------------------------------------"
python3 "$PROJECT_ROOT/parse_sprite_svg.py"

# 步骤3：生成SVG文件
echo "\n步骤3：生成SVG文件"
echo "------------------------------------"
python3 "$PROJECT_ROOT/generate_svg_files.py"

echo "\n===================================="
echo "图标更新完成！"
echo "===================================="
