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

# Avoid "dubious ownership" when deploy dir is owned by another user (e.g. www-data).
git_repo() {
  git -c "safe.directory=${DEPLOY_DIR}" -C "${DEPLOY_DIR}" "$@"
}

_sync_repo() {
  git_repo fetch --prune origin "${BRANCH}"
  git_repo checkout -B "${BRANCH}" "origin/${BRANCH}"
  git_repo reset --hard "origin/${BRANCH}"
}

if [[ -d "${DEPLOY_DIR}/.git" ]]; then
  echo "Updating ${DEPLOY_DIR} (${BRANCH})..."
  _sync_repo
elif [[ -e "${DEPLOY_DIR}" ]]; then
  echo "Adopting existing ${DEPLOY_DIR} into git (${BRANCH})..."
  git_repo init -b "${BRANCH}"
  git_repo remote add origin "${REPO_URL}" 2>/dev/null || \
    git_repo remote set-url origin "${REPO_URL}"
  git_repo fetch --depth 1 origin "${BRANCH}"
  _sync_repo
else
  echo "Cloning into ${DEPLOY_DIR} (${BRANCH})..."
  mkdir -p "$(dirname "${DEPLOY_DIR}")"
  git -c "safe.directory=${DEPLOY_DIR}" clone --branch "${BRANCH}" --depth 1 "${REPO_URL}" "${DEPLOY_DIR}"
fi

echo "Deployed. Site files:"
ls -la "${DEPLOY_DIR}/src"
