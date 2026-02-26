#!/usr/bin/env python3
"""
SVG文件生成脚本

功能：
1. 读取iconlist.md文件，获取所有图标名称
2. 读取icon_map.py文件，获取图标名称到SVG路径的映射
3. 为每个图标名称生成对应的SVG文件
4. 确保生成的SVG文件具有一致的格式和样式
5. 将生成的SVG文件保存到src/assets/icons目录
6. 确保sprite.svg文件被正确处理和输出
"""

import os
import re
import shutil

# 项目根目录
PROJECT_ROOT = "/Users/zonst/Documents/Programs/WEBconfig"
# 图标列表文件路径
ICONLIST_PATH = os.path.join(PROJECT_ROOT, "iconlist.md")
# 图标映射文件路径
ICON_MAP_PATH = os.path.join(PROJECT_ROOT, "public", "icons", "icon_map.py")
# sprite.svg文件路径
SPRITE_SVG_PATH = os.path.join(PROJECT_ROOT, "public", "icons", "sprite.svg")
# SVG文件输出目录
SVG_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "src", "assets", "icons")
# 构建输出目录
BUILD_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "dist")
# 构建输出资源目录
BUILD_ASSETS_DIR = os.path.join(BUILD_OUTPUT_DIR, "assets")
# 构建输出图标目录
BUILD_ICONS_DIR = os.path.join(BUILD_ASSETS_DIR, "icons")


def read_iconlist():
    """
    读取iconlist.md文件，获取所有图标名称
    """
    icon_names = []
    
    try:
        with open(ICONLIST_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            # 提取所有图标名称
            # 匹配以 "- " 开头的行
            matches = re.findall(r'-\s+([a-zA-Z0-9-]+)', content)
            icon_names = matches
        
        print(f"成功读取iconlist.md文件")
        print(f"共找到 {len(icon_names)} 个图标名称")
        return icon_names
        
    except Exception as e:
        print(f"读取iconlist.md文件时出错: {e}")
        return []


def load_icon_map():
    """
    加载icon_map.py文件，获取图标名称到SVG路径的映射
    """
    icon_map = {}
    
    try:
        # 动态导入icon_map模块
        import sys
        sys.path.insert(0, os.path.dirname(ICON_MAP_PATH))
        from icon_map import icon_map as loaded_icon_map
        icon_map = loaded_icon_map
        
        print(f"成功加载icon_map.py文件")
        print(f"共加载 {len(icon_map)} 个图标映射")
        return icon_map
        
    except Exception as e:
        print(f"加载icon_map.py文件时出错: {e}")
        return {}


def generate_svg_file(icon_name, svg_content, output_dir):
    """
    为单个图标生成SVG文件
    """
    # 生成SVG文件路径
    svg_file_path = os.path.join(output_dir, f"{icon_name}.svg")
    
    # SVG文件模板
    svg_template = '''<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
{svg_content}
</svg>
'''
    
    # 生成SVG内容
    svg_content = svg_template.format(svg_content=svg_content)
    
    # 写入文件
    try:
        with open(svg_file_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        # print(f"生成SVG文件: {svg_file_path}")
        return True
    except Exception as e:
        print(f"生成SVG文件 {svg_file_path} 时出错: {e}")
        return False


def copy_sprite_svg():
    """
    复制sprite.svg文件到构建输出目录
    """
    try:
        # 确保构建输出图标目录存在
        os.makedirs(BUILD_ICONS_DIR, exist_ok=True)
        
        # 复制sprite.svg文件
        target_path = os.path.join(BUILD_ICONS_DIR, "sprite.svg")
        shutil.copy2(SPRITE_SVG_PATH, target_path)
        print(f"成功复制sprite.svg到构建输出目录: {target_path}")
        return True
    except Exception as e:
        print(f"复制sprite.svg文件时出错: {e}")
        return False


def copy_generated_svgs():
    """
    复制生成的SVG文件到构建输出目录
    """
    try:
        # 确保构建输出图标目录存在
        os.makedirs(BUILD_ICONS_DIR, exist_ok=True)
        
        # 复制所有SVG文件
        svg_files = [f for f in os.listdir(SVG_OUTPUT_DIR) if f.endswith('.svg')]
        for svg_file in svg_files:
            source_path = os.path.join(SVG_OUTPUT_DIR, svg_file)
            target_path = os.path.join(BUILD_ICONS_DIR, svg_file)
            shutil.copy2(source_path, target_path)
        
        print(f"成功复制 {len(svg_files)} 个SVG文件到构建输出目录")
        return True
    except Exception as e:
        print(f"复制SVG文件时出错: {e}")
        return False


def main():
    """
    主函数
    """
    print("开始生成SVG文件...")
    
    # 读取图标列表
    icon_names = read_iconlist()
    if not icon_names:
        print("没有找到图标名称，退出")
        return
    
    # 加载图标映射
    icon_map = load_icon_map()
    if not icon_map:
        print("没有找到图标映射，退出")
        return
    
    # 确保输出目录存在
    os.makedirs(SVG_OUTPUT_DIR, exist_ok=True)
    
    # 生成SVG文件
    success_count = 0
    missing_count = 0
    
    for icon_name in icon_names:
        if icon_name in icon_map:
            svg_content = icon_map[icon_name]
            if generate_svg_file(icon_name, svg_content, SVG_OUTPUT_DIR):
                success_count += 1
        else:
            print(f"警告: 图标 {icon_name} 在sprite.svg中未找到")
            missing_count += 1
    
    print(f"SVG文件生成完成！")
    print(f"成功生成 {success_count} 个SVG文件")
    print(f"缺少 {missing_count} 个图标")
    
    # 复制sprite.svg到构建输出目录
    copy_sprite_svg()
    
    # 复制生成的SVG文件到构建输出目录
    copy_generated_svgs()


if __name__ == "__main__":
    main()
