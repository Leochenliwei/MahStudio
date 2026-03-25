<template>
  <div class="item-manager-page" :class="{ embedded: embedded }">
    <!-- 基础参数配置 -->
    <BasicParams
      :basic-config="basicConfig"
      @update-player-count-default="$emit('update-player-count-default', $event)"
      @update-round-count-default="$emit('update-round-count-default', $event)"
      @update-basic-config="$emit('update-basic-config')"
      @open-drawer="$emit('open-drawer', $event)"
    />

    <!-- 分组管理 -->
    <GroupManager
      :groups="groups"
      @edit-group="$emit('edit-group', $event)"
      @add-component="(groupId, type) => $emit('add-component', groupId, type)"
      @open-drawer="(drawerId, groupId, componentId) => $emit('open-drawer', drawerId, groupId, componentId)"
      @show-add-group-modal="$emit('show-add-group-modal')"
      @update:group-description="(groupId, description) => $emit('update:group-description', groupId, description)"
    />
  </div>
</template>

<script setup>
import BasicParams from '../components/BasicParams.vue'
import GroupManager from '../components/GroupManager.vue'

defineProps({
  embedded: {
    type: Boolean,
    default: false
  },
  basicConfig: {
    type: Object,
    required: true
  },
  groups: {
    type: Array,
    required: true
  }
})

defineEmits([
  'update-player-count-default',
  'update-round-count-default',
  'update-basic-config',
  'open-drawer',
  'edit-group',
  'add-component',
  'show-add-group-modal',
  'update:group-description'
])
</script>

<style scoped>
.item-manager-page {
  width: 100%;
  height: 100%;
  padding: var(--spacing-6);
  overflow-y: auto;
  background: var(--color-background);
}

.item-manager-page.embedded {
  padding: var(--spacing-4);
}

.item-manager-page::-webkit-scrollbar {
  width: 6px;
}

.item-manager-page::-webkit-scrollbar-track {
  background: var(--color-background);
}

.item-manager-page::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-full);
}

.item-manager-page::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}
</style>
