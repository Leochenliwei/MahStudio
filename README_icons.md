# 图标生成系统使用说明

## 系统概述

本项目包含一套图标生成系统，用于自动提取项目中使用的图标名称，并生成对应的SVG图标文件。

## 脚本文件

### 1. `extract_icon_names.py`

**功能**：
- 遍历项目中所有.vue文件
- 提取Icon组件的name属性值
- 去重处理，确保每个图标名称只出现一次
- 生成iconlist.md文件，按字母顺序排列图标名称

**使用方法**：
```bash
python3 extract_icon_names.py
```

**输出**：
- 生成 `iconlist.md` 文件，包含所有提取的图标名称

### 2. `parse_sprite_svg.py`

**功能**：
- 解析sprite.svg文件
- 提取每个symbol的id和对应的SVG路径数据
- 存储为图标名称到SVG路径的映射

**使用方法**：
```bash
python3 parse_sprite_svg.py
```

**输出**：
- 生成 `src/assets/icons/icon_map.py` 文件，包含图标名称到SVG路径的映射

### 3. `generate_svg_files.py`

**功能**：
- 读取iconlist.md文件，获取所有图标名称
- 读取icon_map.py文件，获取图标名称到SVG路径的映射
- 为每个图标名称生成对应的SVG文件
- 确保生成的SVG文件具有一致的格式和样式
- 将生成的SVG文件保存到src/assets/icons目录

**使用方法**：
```bash
python3 generate_svg_files.py
```

**输出**：
- 在 `src/assets/icons` 目录中生成对应的SVG图标文件

## 使用流程

1. **提取图标名称**：运行 `extract_icon_names.py` 脚本，提取项目中所有使用的图标名称
2. **解析sprite.svg**：运行 `parse_sprite_svg.py` 脚本，解析sprite.svg文件，生成图标映射
3. **生成SVG文件**：运行 `generate_svg_files.py` 脚本，根据图标列表生成对应的SVG文件

## 常见问题

### 1. 图标名称提取不全

**原因**：可能是Icon组件的使用方式与正则表达式不匹配
**解决方案**：检查Icon组件的使用方式，确保符合 `<Icon name="icon-name" />` 格式

### 2. 生成的SVG文件缺少某些图标

**原因**：这些图标可能在sprite.svg中不存在
**解决方案**：检查sprite.svg文件，确保包含所有需要的图标

### 3. 脚本运行出错

**原因**：可能是文件权限问题或文件路径错误
**解决方案**：检查文件权限，确保脚本有读取和写入权限

## 注意事项

- 确保sprite.svg文件存在于 `src/assets/icons` 目录中
- 确保脚本运行时的工作目录是项目根目录
- 生成的SVG文件将覆盖同名文件，请谨慎操作
- 对于sprite.svg中不存在的图标，脚本会发出警告

## 维护

当项目中添加新的图标时，建议重新运行整个流程，确保所有使用的图标都有对应的SVG文件。