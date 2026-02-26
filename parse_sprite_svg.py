#!/usr/bin/env python3
"""
sprite.svg解析脚本

功能：
1. 解析sprite.svg文件
2. 提取每个symbol的id和对应的SVG路径数据
3. 存储为图标名称到SVG路径的映射
"""

import os
import re

# sprite.svg文件路径
SPRITE_SVG_PATH = "/Users/zonst/Documents/Programs/WEBconfig/public/icons/sprite.svg"

# 正则表达式模式，用于提取symbol元素
SYMBOL_PATTERN = re.compile(r'<symbol id="([^"]+)"[^>]*>([\s\S]*?)</symbol>', re.IGNORECASE)


def parse_sprite_svg():
    """
    解析sprite.svg文件，提取每个symbol的id和SVG路径数据
    """
    icon_map = {}
    
    try:
        with open(SPRITE_SVG_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # 提取所有symbol元素
            matches = SYMBOL_PATTERN.findall(content)
            
            for match in matches:
                icon_name = match[0]
                svg_content = match[1].strip()
                
                # 清理SVG内容，去除多余的空白字符
                svg_content = re.sub(r'\s+', ' ', svg_content)
                svg_content = svg_content.strip()
                
                icon_map[icon_name] = svg_content
                
        print(f"成功解析sprite.svg文件")
        print(f"共找到 {len(icon_map)} 个图标")
        return icon_map
        
    except Exception as e:
        print(f"解析sprite.svg文件时出错: {e}")
        return {}


def save_icon_map(icon_map):
    """
    保存图标映射到文件
    """
    output_file = os.path.join(os.path.dirname(SPRITE_SVG_PATH), "icon_map.py")
    
    content = "# 图标映射文件\n\n"
    content += "icon_map = {\n"
    
    for icon_name, svg_content in icon_map.items():
        # 转义SVG内容中的引号
        svg_content = svg_content.replace('"', '\\"')
        content += f'    "{icon_name}": "{svg_content}",\n'
    
    content += "}\n"
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"图标映射已保存到 {output_file}")
    except Exception as e:
        print(f"保存图标映射时出错: {e}")


def main():
    """
    主函数
    """
    print("开始解析sprite.svg文件...")
    icon_map = parse_sprite_svg()
    if icon_map:
        save_icon_map(icon_map)
    print("解析完成！")


if __name__ == "__main__":
    main()
