import { parseStringPromise } from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';

interface MediumArticle {
  title: string;
  slug: string;
  description: string;
  date: string;
  url: string;
  tags: string[];
  image: string;
  imageUrl?: string;
}

interface MediumConfig {
  username: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50);
}

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download image: ${response.status}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`  ✓ Downloaded: ${path.basename(filepath)}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed to download image:`, error);
    return false;
  }
}

async function fetchMediumArticles(username: string): Promise<MediumArticle[]> {
  const feedUrl = `https://medium.com/feed/@${username}`;

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xml = await response.text();
    const result = await parseStringPromise(xml);

    const items = result.rss.channel[0].item || [];

    const articles: MediumArticle[] = items.map((item: any) => {
      // Extract title
      const title = item.title?.[0] || '';
      const slug = slugify(title);

      // Extract URL (clean the RSS tracking params)
      let url = item.link?.[0] || '';
      url = url.split('?')[0]; // Remove query params

      // Extract and format date
      const pubDate = item.pubDate?.[0] || '';
      const date = new Date(pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Extract content for description and image
      const content = item['content:encoded']?.[0] || item.description?.[0] || '';

      // Extract first image URL from content
      const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
      const imageUrl = imgMatch ? imgMatch[1] : undefined;

      // Get first paragraph as description (skip if it's just an image)
      let description = '';
      const paragraphs = content.match(/<p[^>]*>(.*?)<\/p>/g) || [];
      for (const p of paragraphs) {
        const text = p.replace(/<[^>]*>/g, '').trim();
        if (text && text.length > 20 && !text.startsWith('http')) {
          description = text;
          break;
        }
      }

      // Truncate if too long
      if (description.length > 200) {
        description = description.substring(0, 197) + '...';
      }

      // Extract tags/categories
      const tags = item.category?.map((cat: any) => {
        if (typeof cat === 'string') return cat;
        return cat._ || cat;
      }) || [];

      // Format tags nicely (capitalize words)
      const formattedTags = tags.map((tag: string) =>
        tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      );

      return {
        title,
        slug,
        description,
        date,
        url,
        tags: formattedTags,
        image: `./images/${slug}.jpg`,
        imageUrl
      };
    });

    return articles;
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    throw error;
  }
}

async function loadConfig(): Promise<MediumConfig> {
  const configPath = path.join(process.cwd(), 'medium.config.ts');

  if (!fs.existsSync(configPath)) {
    console.error('Error: medium.config.ts not found.');
    console.error('Please create a medium.config.ts file with your Medium username.');
    process.exit(1);
  }

  const { config } = await import(configPath);
  return config;
}

function parseExistingArticles(content: string): { frontmatter: string; existingUrls: Set<string> } {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[0] : '---\nlabel: Medium\ntitle: Articles\ndescription: Thoughts on design, development, and the creative process.\n---\n';

  // Extract existing article URLs (more reliable than slugs)
  const urlMatches = content.matchAll(/^url: (.+)$/gm);
  const existingUrls = new Set<string>();
  for (const match of urlMatches) {
    existingUrls.add(match[1].trim());
  }

  return { frontmatter, existingUrls };
}

function generateArticleMarkdown(article: MediumArticle): string {
  const lines = [
    `# ${article.title}`,
    `slug: ${article.slug}`,
    `image: ${article.image}`,
    `description: ${article.description}`,
    `date: ${article.date}`,
    `url: ${article.url}`,
    `tags: ${article.tags.join(', ')}`,
    ''
  ];
  return lines.join('\n');
}

async function main() {
  const config = await loadConfig();
  const username = config.username;
  const contentDir = path.join(process.cwd(), 'src/content/articles');
  const imagesDir = path.join(contentDir, 'images');
  const indexPath = path.join(contentDir, 'index.md');

  // Ensure directories exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log(`Fetching articles from Medium (@${username})...\n`);

  try {
    const articles = await fetchMediumArticles(username);
    console.log(`Found ${articles.length} articles.\n`);

    // Read existing index.md
    let existingContent = '';
    let frontmatter = '---\nlabel: Medium\ntitle: Articles\ndescription: Thoughts on design, development, and the creative process.\n---\n';
    let existingUrls = new Set<string>();

    if (fs.existsSync(indexPath)) {
      existingContent = fs.readFileSync(indexPath, 'utf-8');
      const parsed = parseExistingArticles(existingContent);
      frontmatter = parsed.frontmatter;
      existingUrls = parsed.existingUrls;
    }

    // Find new articles (by URL to avoid duplicates with different slugs)
    const newArticles = articles.filter(a => !existingUrls.has(a.url));

    if (newArticles.length === 0) {
      console.log('No new articles found.\n');
    } else {
      console.log(`Found ${newArticles.length} new article(s):\n`);

      // Download images for new articles
      for (const article of newArticles) {
        console.log(`• ${article.title.substring(0, 60)}...`);

        if (article.imageUrl) {
          const filename = `${article.slug}.jpg`;
          const filepath = path.join(imagesDir, filename);

          if (!fs.existsSync(filepath)) {
            await downloadImage(article.imageUrl, filepath);
          } else {
            console.log(`  ✓ Image already exists`);
          }
        } else {
          console.log(`  ⚠ No image found`);
        }
      }

      // Generate new content
      const newArticlesMarkdown = newArticles
        .map(a => generateArticleMarkdown(a))
        .join('\n');

      // Append new articles after frontmatter
      const bodyStart = existingContent.indexOf('---\n', 4);
      const existingBody = bodyStart !== -1
        ? existingContent.substring(bodyStart + 4).trim()
        : '';

      const newContent = frontmatter + '\n' + newArticlesMarkdown + (existingBody ? '\n' + existingBody : '');

      // Write updated index.md
      fs.writeFileSync(indexPath, newContent);
      console.log(`\n✓ Updated ${indexPath}`);
    }

    console.log('\nDone!');

  } catch (error) {
    console.error('Failed to fetch articles:', error);
    process.exit(1);
  }
}

main();
