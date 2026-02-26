# 游戏目录管理系统规格说明

## Why
当前游戏列表只展示简单的游戏配置列表，无法满足复杂的版本管理和发布流程需求。需要引入游戏目录概念，支持草稿、测试约局、测试金币三种文件类型，实现版本控制和灰度发布能力。

## What Changes
- **重构游戏列表为游戏目录结构**：每个游戏包含多个文件（草稿、测试约局、测试金币）
- **Admin.vue游戏列表移除编辑功能**：游戏列表仅展示基本信息，编辑操作需通过草稿进入工作台
- **支持test/online双环境**：根据左侧菜单选择的环境（test/online），列表页展示不同的交互按钮，当前先实现test环境
- **草稿管理（test环境）**：支持多份草稿，可进行编辑、复制、复制到其他游戏、提测操作
- **测试文件管理（test环境）**：测试约局和测试金币各只有一份，覆盖式更新
- **提测流程（test环境）**：草稿可提测，内容拷贝到测试约局或测试金币
- **灰度发布（test环境）**：测试文件支持发灰度操作
- **复制功能**：支持复制到当前游戏或其他游戏

## Impact
- Affected specs: 游戏管理模块、版本控制、发布系统
- Affected code: 
  - `/Users/zonst/Documents/Programs/WEBconfig/src/views/Admin.vue` - 游戏目录列表页面
  - 新增：游戏目录详情页面（展示文件列表）
  - 新增：草稿编辑页面
  - 新增：复制到弹窗组件
  - 新增：提测确认弹窗组件

## ADDED Requirements

### Requirement: 游戏目录结构
The system SHALL 将游戏配置组织为目录结构，每个游戏包含以下文件类型：
1. 草稿（Draft）：可有多份，用于日常编辑
2. 测试约局（TestMatch）：仅有一份，覆盖式更新
3. 测试金币（TestGold）：仅有一份，覆盖式更新

#### Scenario: 查看游戏目录
- **GIVEN** 用户在Admin页面
- **WHEN** 点击某个游戏
- **THEN** 进入该游戏的目录详情页，展示所有文件列表

#### Scenario: 从草稿进入工作台
- **GIVEN** 用户在目录详情页
- **WHEN** 点击草稿的"编辑"按钮
- **THEN** 进入工作台编辑该草稿

### Requirement: Admin游戏列表
The system SHALL 在游戏列表中移除编辑功能，并支持test/online双环境：

#### Scenario: 查看游戏列表
- **GIVEN** 用户在Admin页面
- **THEN** 游戏列表仅展示游戏基本信息（ID、名称、描述、创建/更新时间）
- **AND** 不包含"编辑"按钮
- **AND** 点击游戏行进入目录详情页

#### Scenario: 切换test/online环境
- **GIVEN** 用户在Admin页面
- **WHEN** 点击左侧"游戏管理-test"菜单
- **THEN** 进入test环境，显示test环境特有的交互按钮（提测、发灰度等）
- **WHEN** 点击左侧"游戏管理-online"菜单
- **THEN** 进入online环境，显示online环境特有的交互按钮（当前版本暂实现test环境）

### Requirement: 草稿管理
The system SHALL 支持草稿的完整生命周期管理：

#### Scenario: 创建草稿
- **GIVEN** 用户在游戏目录详情页
- **WHEN** 点击"新建草稿"
- **THEN** 创建新的草稿文件，进入编辑模式

#### Scenario: 编辑草稿
- **GIVEN** 用户有草稿文件
- **WHEN** 点击"编辑"
- **THEN** 进入草稿编辑页面

#### Scenario: 复制草稿
- **GIVEN** 用户有草稿文件
- **WHEN** 点击"复制"
- **THEN** 在当前游戏创建该草稿的副本

#### Scenario: 复制草稿到其他游戏
- **GIVEN** 用户有草稿文件
- **WHEN** 点击"复制到"并选择目标游戏
- **THEN** 将草稿内容复制到目标游戏的新草稿

#### Scenario: 提测草稿
- **GIVEN** 用户有草稿文件
- **WHEN** 点击"提测"并选择目标类型（测试约局/测试金币）
- **THEN** 将草稿内容覆盖到对应的测试文件

### Requirement: 测试文件管理
The system SHALL 管理测试约局和测试金币文件：

#### Scenario: 查看测试文件
- **GIVEN** 用户在目录详情页
- **THEN** 展示测试约局和测试金币的当前状态

#### Scenario: 复制测试文件
- **GIVEN** 用户有测试文件
- **WHEN** 点击"复制"
- **THEN** 在当前游戏创建该测试文件的草稿副本

#### Scenario: 复制测试文件到其他游戏
- **GIVEN** 用户有测试文件
- **WHEN** 点击"复制到"并选择目标游戏
- **THEN** 将测试文件内容复制到目标游戏的新草稿

#### Scenario: 发灰度
- **GIVEN** 用户有测试文件
- **WHEN** 点击"发灰度"
- **THEN** 触发灰度发布流程

## MODIFIED Requirements
无

## REMOVED Requirements
无
