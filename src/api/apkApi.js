const mockApks = [
  { id: 1, apk_id: 1001, apk_name: '麻将游戏-通用版' },
  { id: 2, apk_id: 1002, apk_name: '麻将游戏-广东版' },
  { id: 3, apk_id: 1003, apk_name: '麻将游戏-四川版' },
  { id: 4, apk_id: 1004, apk_name: '麻将游戏-湖南版' },
  { id: 5, apk_id: 1005, apk_name: '麻将游戏-湖北版' }
];

export async function getAllApks() {
  return mockApks;
}
