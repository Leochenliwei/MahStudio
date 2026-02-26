#!/usr/bin/env python3
"""
图标名称提取脚本

功能：
1. 遍历项目中所有.vue文件
2. 提取Icon组件的name属性值
3. 去重处理，确保每个图标名称只出现一次
4. 生成iconlist.md文件，按字母顺序排列图标名称
"""

import os
import re

# 项目根目录
PROJECT_ROOT = "/Users/zonst/Documents/Programs/WEBconfig"
# 输出文件路径
OUTPUT_FILE = os.path.join(PROJECT_ROOT, "iconlist.md")
# 要搜索的文件扩展名
FILE_EXTENSION = ".vue"

# 正则表达式模式，用于提取Icon组件的name属性
# 匹配 <Icon name="icon-name" /> 或 <Icon :name="iconName" /> 等形式
# 排除包含表达式的情况
ICON_PATTERN = re.compile(r'<Icon\s+[^>]*name=["\']([a-zA-Z0-9-]+)["\']', re.IGNORECASE)


def extract_icon_names():
    """
    提取项目中所有Icon组件的name属性值
    """
    icon_names = set()  # 使用集合去重
    
    # 遍历项目目录
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # 跳过node_modules等目录
        dirs[:] = [d for d in dirs if d not in ["node_modules", ".git", "dist", "build"]]
        
        for file in files:
            if file.endswith(FILE_EXTENSION):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # 提取所有匹配的图标名称
                        matches = ICON_PATTERN.findall(content)
                        for match in matches:
                            icon_names.add(match)
                except Exception as e:
                    print(f"处理文件 {file_path} 时出错: {e}")
    
    return sorted(icon_names)  # 按字母顺序排序


def generate_iconlist(icon_names):
    """
    生成iconlist.md文件
    """
    # 生成文件内容
    content = "# 图标名称列表\n\n"
    content += "## 所有使用的图标名称\n\n"
    
    if icon_names:
        for icon_name in icon_names:
            content += f"- {icon_name}\n"
    else:
        content += "没有找到使用的图标\n"
    
    # 写入文件
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"图标名称列表已生成到 {OUTPUT_FILE}")
        print(f"共找到 {len(icon_names)} 个图标名称")
    except Exception as e:
        print(f"生成文件时出错: {e}")


def main():
    """
    主函数
    """
    print("开始提取图标名称...")
    icon_names = extract_icon_names()
    generate_iconlist(icon_names)
    print("提取完成！")


if __name__ == "__main__":
    main()
