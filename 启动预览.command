#!/bin/bash
# 双击启动"决定性时刻"本地预览（Vite dev server）
cd "$(dirname "$0")"
echo "🚀 启动开发服务器（Ctrl+C 停止）..."
npm run dev -- --open
