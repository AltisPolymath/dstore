#!/usr/bin/env bash
# Deploy dstore static site to /var/www/dstore (Caddy serves src/ separately).
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/AltisPolymath/dstore.git}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/dstore}"
BRANCH="${BRANCH:-main}"

if ! command -v git >/dev/null 2>&1; then
  echo "error: git is not installed" >&2
  exit 1
fi

if [[ -d "${DEPLOY_DIR}/.git" ]]; then
  echo "Updating ${DEPLOY_DIR} (${BRANCH})..."
  git -C "${DEPLOY_DIR}" fetch --prune origin
  git -C "${DEPLOY_DIR}" checkout "${BRANCH}"
  git -C "${DEPLOY_DIR}" reset --hard "origin/${BRANCH}"
else
  echo "Cloning into ${DEPLOY_DIR} (${BRANCH})..."
  mkdir -p "$(dirname "${DEPLOY_DIR}")"
  git clone --branch "${BRANCH}" --depth 1 "${REPO_URL}" "${DEPLOY_DIR}"
fi

echo "Deployed. Site files:"
ls -la "${DEPLOY_DIR}/src"
