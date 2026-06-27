#!/usr/bin/env bash
# ============================================================
# verify.sh —— 只读校验助手（绝不写正式数据）
# 把 RUNBOOK §5/§6 的多次只读校验合并成【一次工具调用】。
# 会写库的 admit --overwrite --write 仍由智能体单独手动执行（保留 dry-run 审查那一停）。
#
# 用法：
#   bash scripts/verify.sh pre  <batchDir>
#       写前门：validate:kimi + admit dry-run(--overwrite，不写)。全绿才允许人工 --write。
#   bash scripts/verify.sh post <batchDir> <philosopherId> [philosopherId...]
#       写后门：validate:data + 克隆逐字节自检（在 /tmp 副本里跑 --write，再 diff 现有正式库）。
#
# 退出码：0=全绿；非0=有门未过（pre 未过禁止 --write；post 未过说明写入有偏差，需修）。
# 安全性：本脚本只对 /tmp 临时副本执行 --write，对真实仓库零写入。
# ============================================================
set -uo pipefail

PHASE="${1:-}"
BATCH="${2:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

usage() {
  echo "用法："
  echo "  bash scripts/verify.sh pre  <batchDir>"
  echo "  bash scripts/verify.sh post <batchDir> <philosopherId> [philosopherId...]"
  exit 2
}
[ -z "$PHASE" ] && usage
[ -z "$BATCH" ] && usage

fail=0
hr() { printf '\n=== %s ===\n' "$1"; }

case "$PHASE" in
  pre)
    hr "门1 validate:kimi（只读）"
    node tools/validate-kimi-research.mjs "$BATCH" || fail=1

    hr "门2 admit dry-run --overwrite（只读，不写正式库）"
    node tools/admit-kimi-thought-systems.mjs "$BATCH" --overwrite || fail=1

    hr "结论"
    if [ "$fail" -eq 0 ]; then
      echo "✅ 写前门全绿：可由智能体单独执行 admit --overwrite --write（看完上面 dry-run 计划再写）"
    else
      echo "❌ 写前门未过：禁止 --write，回 §4 修内容/workId"
    fi
    ;;

  post)
    shift 2 || true
    IDS=("$@")
    if [ "${#IDS[@]}" -eq 0 ]; then
      echo "post 阶段需要至少一个 philosopherId 用于克隆比对"; usage
    fi

    hr "门3 validate:data（只读）"
    node tools/validate-data.mjs || fail=1

    hr "门4 克隆逐字节自检（/tmp 副本跑 --write，再 diff 现有正式库）"
    T="$(mktemp -d)"
    trap 'rm -rf "$T"' EXIT
    rsync -a --exclude node_modules --exclude .git "$ROOT/" "$T/" >/dev/null
    ln -s "$ROOT/node_modules" "$T/node_modules"
    ( cd "$T" && node tools/admit-kimi-thought-systems.mjs "$BATCH" --overwrite --write >/dev/null 2>&1 ) \
      || { echo "  ⚠️ 副本 admit --write 执行失败"; fail=1; }
    for p in "${IDS[@]}"; do
      live="$ROOT/public/data/philosophers/$p.json"
      gen="$T/public/data/philosophers/$p.json"
      if [ ! -f "$gen" ]; then
        echo "  $p ⚠️ 副本未生成该文件"; fail=1; continue
      fi
      if diff -q "$gen" "$live" >/dev/null 2>&1; then
        echo "  $p ✅ 正式库 == admit 应生成（逐字节一致）"
      else
        echo "  $p ⚠️ 正式库 != admit 应生成（有偏差，需修到一致）"; fail=1
      fi
    done

    hr "结论"
    if [ "$fail" -eq 0 ]; then
      echo "✅ 写后门全绿：本批入库内容与 admit 规范输出一致，validate:data 通过"
    else
      echo "❌ 写后门未过：正式库与规范输出有偏差或数据校验失败"
    fi
    ;;

  *)
    echo "未知阶段：$PHASE"; usage
    ;;
esac

exit $fail
