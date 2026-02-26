#!/usr/bin/env python3

# 从图标使用清单中提取所有图标名称
def extract_usage_icons():
    usage_icons = set()
    with open('icon_usage_list.md', 'r', encoding='utf-8') as f:
        for line in f:
            if '|' in line:
                parts = line.strip().split('|')
                if len(parts) >= 2:
                    icon_name = parts[1].strip()
                    # 跳过表头和分隔线
                    if icon_name and icon_name != '图标名称' and icon_name != '---------':
                        usage_icons.add(icon_name)
    return usage_icons

# 从sprite.svg中提取所有图标ID
def extract_sprite_icons():
    sprite_icons = set()
    with open('src/assets/icons/sprite.svg', 'r', encoding='utf-8') as f:
        for line in f:
            if '<symbol id="' in line:
                # 提取id值
                start = line.find('id="') + 4
                end = line.find('"', start)
                if start < end:
                    icon_id = line[start:end]
                    sprite_icons.add(icon_id)
    return sprite_icons

if __name__ == '__main__':
    usage_icons = extract_usage_icons()
    sprite_icons = extract_sprite_icons()
    
    missing_icons = usage_icons - sprite_icons
    
    print('使用的图标总数:', len(usage_icons))
    print('sprite中的图标总数:', len(sprite_icons))
    print('缺失的图标:', sorted(missing_icons))
