#!/usr/bin/env bash
# Pull latest src/ from GitHub and overwrite /var/www/dstore/src
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/AltisPolymath/dstore.git}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/dstore}"
BRANCH="${BRANCH:-main}"
SRC_DIR="${DEPLOY_DIR}/src"

if ! command -v git >/dev/null 2>&1; then
  echo "error: git is not installed" >&2
  exit 1
fi

tmp="$(mktemp -d)"
trap 'rm -rf "${tmp}"' EXIT

echo "Fetching ${REPO_URL} (${BRANCH})..."
git clone --depth 1 --branch "${BRANCH}" "${REPO_URL}" "${tmp}/repo"

mkdir -p "${SRC_DIR}"
rsync -a --delete "${tmp}/repo/src/" "${SRC_DIR}/"

echo "Deployed to ${SRC_DIR}:"
ls -la "${SRC_DIR}"
