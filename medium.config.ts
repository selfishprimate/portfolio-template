/**
 * Medium Article Fetcher Configuration
 * =====================================
 *
 * This script automatically fetches articles from your Medium profile
 * and adds them to your portfolio.
 *
 * Usage:
 *   npx tsx scripts/fetch-medium-articles.ts
 *
 * What it does:
 *   1. Fetches articles from the specified Medium profile's RSS feed
 *   2. Downloads cover images to src/content/articles/images/
 *   3. Adds new articles to src/content/articles/index.md
 *   4. Skips existing articles (detected by URL)
 *
 * Note: Only new articles are added. Existing content is preserved.
 */

export const config = {
  // Replace with your Medium username
  username: "your-medium-username"
};
