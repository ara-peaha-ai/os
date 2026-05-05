#!/bin/bash
set -e

if [ ! -f .env ]; then
  echo "Error: .env file not found"
  exit 1
fi

declare -A ENV_VARS
while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
  ENV_VARS["$key"]="$value"
done < .env

if [ -n "${ENV_VARS[CLOUDFLARE_D1_DATABASE_ID]}" ]; then
  gh variable set CLOUDFLARE_D1_DATABASE_ID --body "${ENV_VARS[CLOUDFLARE_D1_DATABASE_ID]}" --env github-cloudflare
  echo "GitHub variable set: CLOUDFLARE_D1_DATABASE_ID (environment: github-cloudflare)"
fi

if [ -n "${ENV_VARS[NUXT_WISE_API_TOKEN]}" ]; then
  printf '{"NUXT_WISE_API_TOKEN":"%s"}' "${ENV_VARS[NUXT_WISE_API_TOKEN]}" | \
    npx wrangler@4 pages secret bulk --project-name=p2pagos-website
  echo "Cloudflare Pages secret set: NUXT_WISE_API_TOKEN"
fi

echo "Done. Run git push to trigger deploy."
