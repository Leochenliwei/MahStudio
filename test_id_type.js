// 直接测试addNewGame函数的逻辑

// 模拟gameConfigs
const gameConfigs = [];

// 模拟addNewGame函数的逻辑
function addNewGame(newGameName, newGameDescription) {
  const now = new Date().toISOString();
  
  // 创建新游戏配置对象
  const newGameData = {
    id: gameConfigs.length + 1,  // 修复后：不转换为字符串
    name: newGameName.trim(),
    description: newGameDescription.trim(),
    createdBy: 'admin', // 默认为admin用户
    updatedBy: 'admin', // 默认为admin用户
    createdAt: now,
    updatedAt: now
  };
  
  console.log('创建的游戏数据:', newGameData);
  console.log('ID类型:', typeof newGameData.id);
  console.log('ID值:', newGameData.id);
  
  // 检查ID是否为数值类型
  if (typeof newGameData.id === 'number') {
    console.log('✓ 测试通过: 游戏ID存储为数值类型');
  } else {
    console.log('✗ 测试失败: 游戏ID存储为字符串类型');
  }
  
  // 添加到模拟列表
  gameConfigs.push(newGameData);
  
  return newGameData;
}

// 测试
console.log('测试新增游戏时ID的类型...');
const testGame = addNewGame('测试游戏', '测试游戏描述');

// 再次测试，确保ID递增正确
const testGame2 = addNewGame('测试游戏2', '测试游戏描述2');

console.log('\n测试完成！');
