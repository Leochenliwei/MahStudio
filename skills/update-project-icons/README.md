# 更新项目内所有图标 Skill

## 功能说明

此Skill用于更新项目中的图标系统，通过执行一系列脚本完成以下操作：

1. **提取图标名称**：遍历项目中所有.vue文件，提取Icon组件的name属性值
2. **解析sprite.svg文件**：解析sprite.svg文件，提取每个symbol的id和对应的SVG路径数据
3. **生成SVG文件**：为每个图标名称生成对应的SVG文件，并复制到构建输出目录

## 使用方法

### 方法一：直接运行脚本

```bash
# 进入skill目录
cd skills/update-project-icons

# 运行更新脚本
./update_icons.sh
```

### 方法二：通过Skill系统调用

可以通过项目的Skill系统调用此功能。

## 执行流程

1. 运行 `python3 extract_icon_names.py` 提取图标名称
2. 运行 `python3 parse_sprite_svg.py` 解析sprite.svg文件
3. 运行 `python3 generate_svg_files.py` 生成SVG文件

## 输出结果

- **iconlist.md**：生成的图标名称列表文件
- **icon_map.py**：生成的图标映射文件
- **SVG文件**：在 `src/assets/icons` 目录下生成的单个SVG文件
- **构建输出**：复制到 `dist/assets/icons` 目录的图标文件

## 注意事项

- 脚本会自动跳过 `node_modules`、`.git`、`dist`、`build` 等目录
- 如果某些图标在sprite.svg中未找到，会显示警告信息
- 生成的SVG文件使用统一的模板，确保一致的格式和样式
