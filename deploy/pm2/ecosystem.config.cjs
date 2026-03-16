/**
 * PM2 进程管理配置文件
 * 用于管理 Node.js 应用的启动、停止和监控
 * 注意：使用 .cjs 后缀因为项目启用了 ES Module
 */

module.exports = {
  apps: [
    {
      name: 'webconfig-api',           // 应用名称
      script: './server/server.js',    // 启动脚本路径
      cwd: '/var/www/webconfig',       // 工作目录
      instances: 1,                    // 实例数量
      exec_mode: 'fork',               // 执行模式
      
      // 环境变量
      env: {
        NODE_ENV: 'production',
        PORT: 4174,
        API_PORT: 4174
      },
      
      // 日志配置
      log_file: '/var/log/pm2/webconfig-api.log',
      out_file: '/var/log/pm2/webconfig-api-out.log',
      error_file: '/var/log/pm2/webconfig-api-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 重启策略
      restart_delay: 3000,             // 重启延迟
      max_restarts: 10,                // 最大重启次数
      min_uptime: '10s',               // 最小运行时间
      
      // 监控配置
      watch: false,                    // 不监听文件变化（生产环境）
      ignore_watch: ['node_modules', 'logs', 'dist'],
      
      // 资源限制
      max_memory_restart: '500M',      // 内存超过500M自动重启
      
      // 自动启动
      autorestart: true,
      
      // 优雅关闭
      kill_timeout: 5000,
      listen_timeout: 10000
    }
  ]
};
