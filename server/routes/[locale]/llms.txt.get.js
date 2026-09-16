// ponytail: local/preview-only convenience alias — mirrors how every page
// gets a /:locale/ prefix in preview. Production never links here; the real,
// prod-accurate address is the bare /llms.txt (domain carries the locale).
export default defineEventHandler(buildLlmsTxt)
