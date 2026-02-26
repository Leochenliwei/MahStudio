<template>
  <div class="icon-test-container">
    <h2>Icon Component Test</h2>
    
    <div class="icon-test-item">
      <Icon name="edit" size="24" />
      <span>Edit icon</span>
    </div>
    
    <div class="icon-test-item">
      <Icon name="copy" size="24" />
      <span>Copy icon</span>
    </div>
    
    <div class="icon-test-item">
      <Icon name="send" size="24" />
      <span>Send icon</span>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'
</script>

<style scoped>
.icon-test-container {
  padding: 20px;
  border: 1px solid #ccc;
  margin: 20px;
}

.icon-test-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.icon-test-item svg {
  margin-right: 10px;
}
</style>
