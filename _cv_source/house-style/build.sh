#!/usr/bin/env bash
set -euo pipefail

artifact="${1:-all}"

build_one() {
  local source_file="$1"
  local log_file="${source_file%.tex}.log"

  latexmk -pdf -interaction=nonstopmode -halt-on-error "$source_file"

  if rg -i 'undefined references|undefined citations|citation.+undefined|reference.+undefined|overfull \\hbox' "$log_file"; then
    printf 'Validation failed for %s\n' "$source_file" >&2
    return 1
  fi
}

case "$artifact" in
  document)
    build_one document-example.tex
    ;;
  slides)
    build_one slides-example.tex
    ;;
  all)
    build_one document-example.tex
    build_one slides-example.tex
    ;;
  *)
    printf 'Usage: %s [document|slides|all]\n' "$0" >&2
    exit 2
    ;;
esac
