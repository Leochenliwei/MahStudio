<template>
  <div class="modal-container">
    <!-- Header -->
    <div class="modal-header">
      <div class="header-left">
        <span class="page-title">番数/分数修正</span>
      </div>
      <div class="header-right">
        <div class="close-icon" title="关闭" @click="$emit('close')">✕</div>
      </div>
    </div>

    <!-- Body -->
    <div class="modal-body">
      <div class="modifier-section">
        <div class="modifier-header">番数/分数修正（变量名：最终番数）</div>
        <label class="checkbox-label">
          <input type="checkbox" style="margin-right: 8px;" v-model="hasModifier"> 存在封顶或金顶场景，进行番数修正
        </label>

        <!-- Modifier Case 1 -->
        <div v-for="(modifier, index) in modifierCards" :key="modifier.id" class="rule-card" :class="{ expanded: modifier.expanded }" @contextmenu="showContextMenuHandler($event, modifier, 'modifier')">
          <div class="card-header" @click="toggleCard(modifier)">
            <div class="header-content">
              <span class="seq-num">{{ index + 1 }}</span>
              <input 
                type="text" 
                class="card-title" 
                v-model="modifier.title" 
                @click.stop
              />
            </div>
            <div class="card-tools">⚙️</div>
          </div>
          <div class="card-body">
            <div class="logic-row">
              <span class="logic-label">当</span>
              <div class="formula-container">
                   <div class="chip-group">
                    <span class="chip chip-obj" @click="handleChipClick($event, 'obj', '当前玩家')">当前玩家</span>
                    <span class="chip chip-text">的</span>
                    <span class="chip chip-attr" @click="handleChipClick($event, 'attr', '金顶状态')">金顶状态</span>
                  </div>
                   <span class="chip chip-logic" @click="handleChipClick($event, 'logic', '成立')">成立</span>
              </div>
            </div>
            <div class="logic-row">
              <span class="logic-label">就</span>
              <div class="formula-container">
                <span class="chip chip-val" @click="handleChipClick($event, 'val', '7')">7</span>
              </div>
            </div>
          </div>
        </div>

         <!-- Modifier Else -->
         <div class="else-section" style="background: #fff; border-color: #ddd; margin-top: 10px;">
            <span class="section-tag">否则就</span>
            <div class="logic-row">
              <span style="font-size:13px; font-weight:bold; margin-right: 10px; margin-top: 8px;">确认出分番数</span>
              <div class="formula-container">
                <span class="chip chip-val" @click="handleChipClick($event, 'val', 'Min')">Min</span>
                <span class="chip chip-text">(</span>
                <span class="chip chip-val" @click="handleChipClick($event, 'val', '6')">6</span>
                <span class="chip chip-text">,</span>
                <div class="chip-group" style="margin-left: 5px;">
                  <span class="chip chip-obj" @click="handleChipClick($event, 'obj', '出分玩家')">出分玩家</span>
                  <span class="chip chip-text">的</span>
                  <span class="chip chip-attr" @click="handleChipClick($event, 'attr', '计算番数')">计算番数</span>
                </div>
                <span class="chip chip-text">的值</span>
                <span class="chip chip-text">)</span>
              </div>
            </div>
         </div>

      </div>

    </div>

    <!-- Footer -->
    <div class="modal-footer">
      <button class="btn btn-secondary" @click="$emit('close')">取消</button>
      <button class="btn btn-primary" @click="saveAndClose">保存并关闭</button>
    </div>

    <!-- 右键菜单 -->
    <div class="context-menu" :class="{ show: showContextMenu }" :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }">
      <div class="context-menu-item rename" data-action="rename" @click="handleMenuAction('rename')">
        <span>重命名</span>
        <span class="context-menu-icon">⚙️</span>
      </div>
      <div class="context-menu-item" data-action="copy" @click="handleMenuAction('copy')">
        <span>复制</span>
        <span class="context-menu-icon">⚙️</span>
      </div>
      <div class="context-menu-item" data-action="add" @click="handleMenuAction('add')">
        <span>下方新增一行</span>
        <span class="context-menu-icon">⚙️</span>
      </div>
      <div class="context-menu-item" data-action="delete" @click="handleMenuAction('delete')">
        <span>删除</span>
        <span class="context-menu-icon">⚙️</span>
      </div>
      <div class="context-menu-item" data-action="moveUp" @click="handleMenuAction('moveUp')">
        <span>上移</span>
        <span class="context-menu-icon">⚙️</span>
      </div>
      <div class="context-menu-item" data-action="moveDown" @click="handleMenuAction('moveDown')">
        <span>下移</span>
        <span class="context-menu-icon">⚙️</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';

// 定义props和emit
const emit = defineEmits(['close', 'save']);

// 修正卡片数据
const modifierCards = reactive([
  {
    id: 1,
    title: '情况一 这里可以写对自己看的说明',
    expanded: true
  }
]);

// 是否存在修正场景
const hasModifier = ref(false);

// 右键菜单状态
const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const currentCard = ref(null);
const currentSection = ref(null);

/**
 * 切换卡片展开/折叠状态
 * @param {Object} card 卡片对象
 */
const toggleCard = (card) => {
  card.expanded = !card.expanded;
};

/**
 * 显示右键菜单
 * @param {Event} e 鼠标事件
 * @param {Object} card 卡片对象
 * @param {string} section 卡片所在区域
 */
const showContextMenuHandler = (e, card, section) => {
  e.preventDefault();
  currentCard.value = card;
  currentSection.value = section;
  
  // 计算位置
  let x = e.clientX;
  let y = e.clientY;

  // 防止菜单超出屏幕
  const menuWidth = 160; // 预估菜单宽度
  const menuHeight = 180; // 预估菜单高度
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (x + menuWidth > screenWidth) {
    x = screenWidth - menuWidth;
  }
  if (y + menuHeight > screenHeight) {
    y = screenHeight - menuHeight;
  }

  contextMenuX.value = x;
  contextMenuY.value = y;
  showContextMenu.value = true;
};

/**
 * 关闭右键菜单
 */
const closeContextMenu = () => {
  showContextMenu.value = false;
  currentCard.value = null;
  currentSection.value = null;
};

/**
 * 处理菜单操作
 * @param {string} action 操作类型
 */
const handleMenuAction = (action) => {
  if (!currentCard.value || !currentSection.value) return;

  switch (action) {
    case 'rename':
      // 重命名逻辑：聚焦到卡片标题输入框
      renameCard(currentCard.value, currentSection.value);
      break;
    case 'copy':
      // 复制逻辑
      copyCard(currentCard.value, currentSection.value);
      break;
    case 'add':
      // 新增逻辑
      addCardBelow(currentCard.value, currentSection.value);
      break;
    case 'delete':
      // 删除逻辑
      deleteCard(currentCard.value, currentSection.value);
      break;
    case 'moveUp':
      // 上移逻辑
      moveCardUp(currentCard.value, currentSection.value);
      break;
    case 'moveDown':
      // 下移逻辑
      moveCardDown(currentCard.value, currentSection.value);
      break;
  }

  closeContextMenu();
};

/**
 * 重命名卡片
 * @param {Object} card 卡片对象
 * @param {string} section 卡片所在区域
 */
const renameCard = (card, section) => {
  // 这里可以添加更复杂的重命名逻辑
  console.log('Rename card:', card.title);
};

/**
 * 复制卡片
 * @param {Object} card 卡片对象
 * @param {string} section 卡片所在区域
 */
const copyCard = (card, section) => {
  if (section === 'modifier') {
    const index = modifierCards.findIndex(c => c.id === card.id);
    if (index !== -1) {
      const clonedCard = { 
        ...card, 
        id: Date.now(), 
        title: card.title + ' (复制)', 
        expanded: false 
      };
      modifierCards.splice(index + 1, 0, clonedCard);
    }
  }
};

/**
 * 在下方新增卡片
 * @param {Object} card 卡片对象
 * @param {string} section 卡片所在区域
 */
const addCardBelow = (card, section) => {
  if (section === 'modifier') {
    const index = modifierCards.findIndex(c => c.id === card.id);
    if (index !== -1) {
      const newCard = {
        id: Date.now(),
        title: '新情况',
        expanded: false
      };
      modifierCards.splice(index + 1, 0, newCard);
    }
  }
};

/**
 * 删除卡片
 * @param {Object} card 卡片对象
 * @param {string} section 卡片所在区域
 */
const deleteCard = (card, section) => {
  if (confirm('确定要删除这张卡片吗？')) {
    if (section === 'modifier') {
      const index = modifierCards.findIndex(c => c.id === card.id);
      if (index !== -1) {
        modifierCards.splice(index, 1);
      }
    }
  }
};

/**
 * 上移卡片
 * @param {Object} card 卡片对象
 * @param {string} section 卡片所在区域
 */
const moveCardUp = (card, section) => {
  if (section === 'modifier') {
    const index = modifierCards.findIndex(c => c.id === card.id);
    if (index > 0) {
      [modifierCards[index], modifierCards[index - 1]] = [modifierCards[index - 1], modifierCards[index]];
    }
  }
};

/**
 * 下移卡片
 * @param {Object} card 卡片对象
 * @param {string} section 卡片所在区域
 */
const moveCardDown = (card, section) => {
  if (section === 'modifier') {
    const index = modifierCards.findIndex(c => c.id === card.id);
    if (index < modifierCards.length - 1) {
      [modifierCards[index], modifierCards[index + 1]] = [modifierCards[index + 1], modifierCards[index]];
    }
  }
};

/**
 * Chip 点击事件处理
 * @param {Event} e 鼠标事件
 * @param {string} chipType Chip类型
 * @param {string} chipText Chip文本
 */
const handleChipClick = (e, chipType, chipText) => {
  e.stopPropagation(); // 防止触发 Card 折叠
  // 模拟点击效果
  const chip = e.target;
  chip.style.opacity = '0.5';
  setTimeout(() => chip.style.opacity = '1', 100);
  console.log('Edit chip:', chipType, chipText);
  
  // 这里可以添加Chip的编辑逻辑
  // 例如：显示一个下拉菜单，让用户选择不同的选项
  // 或者：显示一个弹窗，让用户输入新的内容
  // 暂时使用 alert 模拟编辑功能
  const newValue = prompt(`编辑 ${chipType} 类型的 Chip:`, chipText);
  if (newValue) {
    console.log('Chip 新值:', newValue);
    // 这里可以更新 Chip 的值
  }
};

/**
 * 保存并关闭
 */
const saveAndClose = () => {
  emit('save', {
    hasModifier: hasModifier.value,
    modifierCards: modifierCards
  });
  emit('close');
};

/**
 * 点击文档其他地方关闭右键菜单
 */
const handleDocumentClick = () => {
  closeContextMenu();
};

// 在组件挂载时添加事件监听器
onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

// 在组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<style scoped>
:root {
  /* 语义色盘 - 提取自原图 */
  --color-obj-bg: #fca5a5;    /* 对象背景 (粉) */
  --color-obj-text: #fff;
  --color-attr-bg: #f59e0b;   /* 属性/变量背景 (橙) */
  --color-logic-bg: #4ade80;  /* 逻辑/判定背景 (绿) */
  --color-val-bg: #60a5fa;    /* 数值/函数背景 (蓝) */
  --color-bg-gray: #f3f4f6;   /* 卡片背景 */
  --color-border: #e5e7eb;
  --color-text-main: #1f2937;
  --color-primary: #2563eb;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

/* --- 弹窗容器 --- */
.modal-container {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- 头部 Header --- */
.modal-header {
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  z-index: 10;
  height: 60px;
}

.header-left { display: flex; align-items: center; gap: 8px; }
.header-right { display: flex; align-items: center; gap: 12px; }

.page-title { font-size: 16px; font-weight: bold; color: #111; }
.sub-title { font-size: 14px; color: #666; }
.separator { color: #d1d5db; margin: 0 4px; }

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid transparent;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary {
  background: #fff;
  border-color: #d1d5db;
  color: #374151;
}
.btn-secondary:hover { background-color: #f9fafb; border-color: #9ca3af; }

.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.btn-primary:hover { background-color: #1d4ed8; }

.close-icon {
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-left: 8px;
  transition: all 0.2s;
}
.close-icon:hover { background-color: #f3f4f6; color: #4b5563; }

/* --- 主内容区 Scroll Area --- */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #f9fafb;
}

/* --- 页脚 Footer --- */
.modal-footer {
  padding: 12px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #fff;
  height: 60px;
  align-items: center;
}

/* --- 规则卡片 Rule Card --- */
.rule-card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  margin-bottom: 12px;
  transition: all 0.2s;
  overflow: hidden;
}
.rule-card.expanded {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--color-primary); /* 高亮展开项 */
}

/* 卡片头部（可点击折叠） */
.card-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  cursor: pointer;
}
.card-header:hover { background-color: #f9fafb; }

.header-content { display: flex; align-items: center; gap: 10px; flex: 1; }
.seq-num {
  background: blue;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
.card-title {
  font-size: 14px;
  color: var(--color-text-main);
  font-weight: 500;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
}
.card-tools {
  color: #9ca3af;
  cursor: pointer;
  font-size: 14px;
}

/* 卡片内容区 */
.card-body {
  padding: 16px;
  background-color: #ecfeff; /* 浅青色背景，模拟原图 */
  border-top: 1px solid var(--color-border);
  display: none; /* 默认折叠 */
}
.rule-card.expanded .card-body { display: block; }

/* 逻辑行 Layout */
.logic-row {
  display: flex;
  align-items: flex-start; /* 对齐顶部，防止多行错位 */
  margin-bottom: 12px;
  line-height: 32px;
}
.logic-label {
  font-weight: bold;
  font-size: 14px;
  margin-right: 12px;
  min-width: 20px;
  padding-top: 4px; 
}

/* --- 核心组件：公式编辑器/Chip容器 --- */
.formula-container {
  flex: 1;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  min-height: 38px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.formula-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

/* 下拉选框模拟 */
.dropdown-trigger {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0 10px;
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 13px;
  min-width: 120px;
  justify-content: space-between;
  cursor: pointer;
}
.dropdown-trigger::after {
  content: "▼";
  font-size: 10px;
  color: #999;
  margin-left: 8px;
}

/* --- Chips (拼图块) --- */
.chip {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  height: 26px;
  border-radius: 2px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.chip:hover { opacity: 0.9; }
.chip::after {
  content: "▼";
  font-size: 8px;
  margin-left: 6px;
  opacity: 0.7;
}

/* Chip 变体 */
.chip-obj { background-color: var(--color-obj-bg); }
.chip-attr { background-color: var(--color-attr-bg); }
.chip-logic { background-color: var(--color-logic-bg); margin: 0 4px; }
.chip-val { background-color: var(--color-val-bg); }
.chip-text { 
  color: #374151; 
  font-weight: normal; 
  padding: 0 2px;
  background: transparent;
  box-shadow: none;
  cursor: text;
}
.chip-text::after { content: none; }

.chip-group {
  display: inline-flex;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-right: 4px;
}
.chip-group .chip {
  border-radius: 0;
  box-shadow: none;
  margin: 0;
  border-right: 1px solid rgba(255,255,255,0.2);
}
.chip-group .chip:last-child { border-right: none; }

/* 运算符块 + */
.operator-box {
  display: inline-flex;
  width: 24px;
  height: 24px;
  background: var(--color-logic-bg);
  color: white;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 2px;
  margin: 0 4px;
  cursor: pointer;
}

/* --- 否则 (Else) 模块 --- */
.else-section {
  background: #ecfeff;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
  margin-top: 20px;
  position: relative;
}
.section-tag {
  font-weight: bold;
  margin-bottom: 12px;
  display: block;
}
.split-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #666;
  cursor: pointer;
}

/* --- 修正模块 (Modifer Section) --- */
.modifier-section {
  margin-top: 30px;
  border-top: 1px solid #ccc;
  padding-top: 20px;
}
.modifier-header {
  font-weight: bold;
  color: #4b5563;
  margin-bottom: 10px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
}
.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  accent-color: var(--color-primary);
}

/* --- 右键菜单 --- */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  min-width: 160px;
  display: none;
}
.context-menu.show {
  display: block;
}
.context-menu-item {
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.context-menu-item:hover {
  background-color: #f3f4f6;
}
.context-menu-item:first-child {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.context-menu-item:last-child {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.context-menu-item.rename {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 500;
}
.context-menu-item.rename:hover {
  background-color: #bfdbfe;
}
.context-menu-icon {
  font-size: 14px;
  color: #9ca3af;
}

/* --- 响应式设计 --- */
@media (max-width: 768px) {
  .modal-body {
    padding: 16px;
  }
  
  .modal-header,
  .modal-footer {
    padding: 12px 16px;
  }
  
  .card-header {
    padding: 12px 16px;
  }
  
  .card-body {
    padding: 16px;
  }
  
  .logic-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .logic-label {
    margin-right: 0;
    padding-top: 0;
  }
  
  .btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>