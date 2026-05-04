#!/bin/bash
set -e

if [ ! -f .env ]; then
  echo "Error: .env file not found"
  exit 1
fi

while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
  case "$key" in
    WISE_API_TOKEN)
      gh secret set "$key" --body "$value"
      echo "Secret set: $key"
      ;;
    CLOUDFLARE_D1_DATABASE_ID)
      gh secret set "$key" --body "$value"
      echo "Secret set: $key"
      ;;
  esac
done < .env

echo "Done. Run git push to trigger deploy."
