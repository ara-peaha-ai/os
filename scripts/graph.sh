#!/bin/bash
# Our knowledge graph of a markdown tree: deterministic extract, graphify clustering, named communities.
# Never `graphify update` / `/graphify` on the same out dir: it overwrites graph.json with graphify's own
# LLM/AST extraction. Design: sovereign content/original/doc/002.development/011.ai/context-engine.pri.md
# usage: npm run graph -- <content dir> <project dir> [depth 2-6]   (writes <project dir>/graphify-out)
set -euo pipefail
[ $# -ge 2 ] || { echo 'usage: npm run graph -- <content dir> <project dir> [depth 2-6]' >&2; exit 1; }
here=$(dirname "$0")
mkdir -p "$2/graphify-out"
node "$here/graph-extract.mjs" "$1" "$2/graphify-out/graph.json" --depth "${3:-6}"
graphify cluster-only "$2" --no-viz
node "$here/graph-labels.mjs" "$2/graphify-out"
