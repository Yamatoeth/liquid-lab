# Screenshot Automation Implementation

## Overview

This document provides the complete implementation for automated screenshot generation using Puppeteer. This replaces manual Shopify screenshots with a scalable, consistent process.

---

## Prerequisites

```bash
# Install required packages
npm install puppeteer sharp @supabase/supabase-js dotenv
```

**Package purposes:**
- `puppeteer`: Browser automation for screenshots
- `sharp`: Image optimization and resizing
- `@supabase/supabase-js`: Upload to Supabase Storage
- `dotenv`: Environment variable management

---

## Project Structure

```
/scripts
  ├── screenshot-generator.js      # Main generator
  ├── upload-to-supabase.js        # Upload helper
  ├── optimize-images.js           # Image optimization
  └── batch-generate.js            # Batch processing

/templates
  └── screenshot-template.html     # HTML template for rendering

/screenshots (temporary)
  ├── {slug}-desktop.png
  ├── {slug}-mobile.png
  └── {slug}-hover.png
```

---

## Core Implementation

### 1. Screenshot Generator (`scripts/screenshot-generator.js`)

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generate screenshots for a snippet
 * @param {Object} snippet - Snippet object with code and metadata
 * @param {Object} options - Screenshot options
 */
async function generateScreenshots(snippet, options = {}) {
  const {
    outputDir = './screenshots',
    viewports = {
      desktop: { width: 1920, height: 1080 },
      mobile: { width: 375, height: 667 }
    },
    captureHover = true,
    debug = false
  } = options;

  console.log(`📸 Generating screenshots for: ${snippet.title}`);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Launch browser
  const browser = await puppeteer.launch({
    headless: !debug,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Build HTML from snippet
    const html = buildSnippetHTML(snippet);
    
    // Set content
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });

    // Wait for any animations to settle
    await page.waitForTimeout(500);

    const screenshots = {};

    // Desktop screenshot
    console.log('  📱 Capturing desktop view...');
    await page.setViewport(viewports.desktop);
    
    // Wait for layout to stabilize
    await page.waitForTimeout(300);
    
    const desktopPath = path.join(outputDir, `${snippet.slug}-desktop.png`);
    await page.screenshot({
      path: desktopPath,
      clip: {
        x: (viewports.desktop.width - 1200) / 2,
        y: 140,
        width: 1200,
        height: 800
      }
    });
    screenshots.desktop = desktopPath;
    console.log('  ✅ Desktop screenshot saved');

    // Mobile screenshot
    console.log('  📱 Capturing mobile view...');
    await page.setViewport(viewports.mobile);
    await page.waitForTimeout(300);
    
    const mobilePath = path.join(outputDir, `${snippet.slug}-mobile.png`);
    await page.screenshot({
      path: mobilePath,
      fullPage: false
    });
    screenshots.mobile = mobilePath;
    console.log('  ✅ Mobile screenshot saved');

    // Hover state (if applicable)
    if (captureHover && snippet.has_hover_state) {
      console.log('  📱 Capturing hover state...');
      await page.setViewport(viewports.desktop);
      
      // Find hoverable element (customize selector per snippet type)
      const hoverSelector = snippet.hover_selector || '.hoverable, a, button';
      
      try {
        await page.hover(hoverSelector);
        await page.waitForTimeout(500); // Wait for hover animation
        
        const hoverPath = path.join(outputDir, `${snippet.slug}-hover.png`);
        await page.screenshot({
          path: hoverPath,
          clip: {
            x: (viewports.desktop.width - 1200) / 2,
            y: 140,
            width: 1200,
            height: 800
          }
        });
        screenshots.hover = hoverPath;
        console.log('  ✅ Hover screenshot saved');
      } catch (err) {
        console.log('  ⚠️  Hover state capture skipped (element not found)');
      }
    }

    return screenshots;

  } catch (error) {
    console.error('❌ Screenshot generation failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Build HTML document from snippet code
 */
function buildSnippetHTML(snippet) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${snippet.title}</title>
  <style>
    /* Reset */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Base styles (Shopify-like) */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                   'Helvetica', 'Arial', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #000000;
      background: #ffffff;
      padding: 40px 20px;
    }

    /* Container */
    .snippet-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Snippet-specific CSS */
    ${snippet.css_code || ''}
  </style>
</head>
<body>
  <div class="snippet-container">
    ${snippet.liquid_code}
  </div>

  <script>
    // Snippet-specific JavaScript
    ${snippet.javascript_code || ''}
  </script>
</body>
</html>
  `.trim();
}

module.exports = { generateScreenshots };
```

---

### 2. Supabase Upload Helper (`scripts/upload-to-supabase.js`)

```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations
);

/**
 * Upload screenshots to Supabase Storage
 * @param {string} snippetSlug - Snippet slug
 * @param {Object} screenshots - Object with paths to screenshot files
 * @returns {Object} - Public URLs of uploaded images
 */
async function uploadScreenshots(snippetSlug, screenshots) {
  console.log(`☁️  Uploading screenshots for: ${snippetSlug}`);

  const urls = {};

  for (const [type, filePath] of Object.entries(screenshots)) {
    try {
      // Read file
      const fileBuffer = await fs.readFile(filePath);
      
      // Define storage path
      const storagePath = `snippets/${snippetSlug}/preview-${type}.png`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('snippet-assets')
        .upload(storagePath, fileBuffer, {
          contentType: 'image/png',
          upsert: true // Replace if exists
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('snippet-assets')
        .getPublicUrl(storagePath);

      urls[type] = publicUrl;
      console.log(`  ✅ Uploaded ${type}: ${publicUrl}`);

    } catch (error) {
      console.error(`  ❌ Failed to upload ${type}:`, error.message);
    }
  }

  return urls;
}

/**
 * Update snippet record with screenshot URLs
 */
async function updateSnippetURLs(snippetId, urls) {
  const { error } = await supabase
    .from('snippets')
    .update({
      preview_image_url: urls.desktop,
      screenshots: [urls.desktop, urls.mobile, urls.hover].filter(Boolean)
    })
    .eq('id', snippetId);

  if (error) {
    console.error('❌ Failed to update snippet record:', error);
    throw error;
  }

  console.log('✅ Snippet record updated with URLs');
}

module.exports = { uploadScreenshots, updateSnippetURLs };
```

---

### 3. Image Optimization (`scripts/optimize-images.js`)

```javascript
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath, outputPath) {
  const stats = await fs.stat(inputPath);
  const originalSize = stats.size;

  await sharp(inputPath)
    .png({
      quality: 90,
      compressionLevel: 9,
      adaptiveFiltering: true
    })
    .toFile(outputPath || inputPath);

  const newStats = await fs.stat(outputPath || inputPath);
  const newSize = newStats.size;
  const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

  console.log(`  📦 Optimized: ${path.basename(inputPath)}`);
  console.log(`     ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`);

  return { originalSize, newSize, savings };
}

/**
 * Optimize all screenshots in a directory
 */
async function optimizeAllScreenshots(directory) {
  console.log(`🔧 Optimizing images in: ${directory}`);

  const files = await fs.readdir(directory);
  const pngFiles = files.filter(f => f.endsWith('.png'));

  let totalOriginal = 0;
  let totalNew = 0;

  for (const file of pngFiles) {
    const filePath = path.join(directory, file);
    const { originalSize, newSize } = await optimizeImage(filePath);
    totalOriginal += originalSize;
    totalNew += newSize;
  }

  const totalSavings = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  console.log(`\n✅ Total optimization: ${(totalOriginal / 1024).toFixed(1)}KB → ${(totalNew / 1024).toFixed(1)}KB (${totalSavings}% reduction)`);
}

module.exports = { optimizeImage, optimizeAllScreenshots };
```

---

### 4. Batch Processing (`scripts/batch-generate.js`)

```javascript
const { createClient } = require('@supabase/supabase-js');
const { generateScreenshots } = require('./screenshot-generator');
const { uploadScreenshots, updateSnippetURLs } = require('./upload-to-supabase');
const { optimizeAllScreenshots } = require('./optimize-images');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Generate screenshots for all published snippets
 */
async function batchGenerateAll() {
  console.log('🚀 Starting batch screenshot generation...\n');

  // Fetch all published snippets
  const { data: snippets, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Failed to fetch snippets:', error);
    return;
  }

  console.log(`📋 Found ${snippets.length} snippets to process\n`);

  let successful = 0;
  let failed = 0;

  for (const snippet of snippets) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${snippet.title} (${snippet.slug})`);
      console.log('='.repeat(60));

      // Generate screenshots
      const screenshots = await generateScreenshots(snippet, {
        outputDir: './screenshots',
        captureHover: true
      });

      // Optimize images
      console.log('\n🔧 Optimizing images...');
      await optimizeAllScreenshots('./screenshots');

      // Upload to Supabase
      const urls = await uploadScreenshots(snippet.slug, screenshots);

      // Update snippet record
      await updateSnippetURLs(snippet.id, urls);

      successful++;
      console.log(`\n✅ Completed: ${snippet.title}\n`);

    } catch (error) {
      failed++;
      console.error(`\n❌ Failed: ${snippet.title}`);
      console.error(`   Error: ${error.message}\n`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Batch Generation Summary');
  console.log('='.repeat(60));
  console.log(`Total snippets: ${snippets.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log('='.repeat(60));
}

/**
 * Generate screenshots for a single snippet by slug
 */
async function generateForSnippet(slug) {
  console.log(`🎯 Generating screenshots for: ${slug}\n`);

  // Fetch snippet
  const { data: snippet, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('❌ Snippet not found:', error);
    return;
  }

  try {
    // Generate
    const screenshots = await generateScreenshots(snippet);

    // Optimize
    await optimizeAllScreenshots('./screenshots');

    // Upload
    const urls = await uploadScreenshots(snippet.slug, screenshots);

    // Update
    await updateSnippetURLs(snippet.id, urls);

    console.log('\n✅ Screenshot generation complete!');

  } catch (error) {
    console.error('\n❌ Generation failed:', error);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--all')) {
    batchGenerateAll();
  } else if (args.includes('--slug')) {
    const slugIndex = args.indexOf('--slug');
    const slug = args[slugIndex + 1];
    if (slug) {
      generateForSnippet(slug);
    } else {
      console.error('❌ Please provide a slug: --slug <snippet-slug>');
    }
  } else {
    console.log(`
Usage:
  node scripts/batch-generate.js --all              Generate for all snippets
  node scripts/batch-generate.js --slug mega-menu   Generate for specific snippet
    `);
  }
}

module.exports = { batchGenerateAll, generateForSnippet };
```

---

## Environment Setup

### `.env` File

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Screenshot settings
SCREENSHOT_OUTPUT_DIR=./screenshots
SCREENSHOT_DEBUG=false
```

---

## Usage

### Generate for Single Snippet

```bash
node scripts/batch-generate.js --slug mega-menu
```

### Generate for All Snippets

```bash
node scripts/batch-generate.js --all
```

### Optimize Existing Images

```bash
node -e "require('./scripts/optimize-images').optimizeAllScreenshots('./screenshots')"
```

---

## Integration with Admin Panel

### Trigger on Snippet Creation

```javascript
// In your admin snippet creation endpoint
app.post('/api/admin/snippets', async (req, res) => {
  // 1. Save snippet to database
  const { data: snippet } = await supabase
    .from('snippets')
    .insert(req.body)
    .select()
    .single();

  // 2. Trigger screenshot generation (async)
  generateForSnippet(snippet.slug)
    .catch(err => console.error('Screenshot generation failed:', err));

  // 3. Return immediately (don't wait for screenshots)
  res.json({ success: true, snippet });
});
```

### Background Job (Recommended)

Use a job queue for production:

```javascript
// Using Bull (Redis-based queue)
const Queue = require('bull');
const screenshotQueue = new Queue('screenshots');

screenshotQueue.process(async (job) => {
  const { slug } = job.data;
  await generateForSnippet(slug);
});

// Trigger job
app.post('/api/admin/snippets', async (req, res) => {
  const snippet = await createSnippet(req.body);
  
  await screenshotQueue.add({ slug: snippet.slug });
  
  res.json({ success: true, snippet });
});
```

---

## Testing

### Test Suite

```javascript
// tests/screenshot-generator.test.js
const { generateScreenshots } = require('../scripts/screenshot-generator');

const mockSnippet = {
  slug: 'test-snippet',
  title: 'Test Snippet',
  liquid_code: '<div class="test">Hello World</div>',
  css_code: '.test { color: red; font-size: 24px; }',
  javascript_code: ''
};

describe('Screenshot Generator', () => {
  it('should generate desktop screenshot', async () => {
    const screenshots = await generateScreenshots(mockSnippet, {
      outputDir: './test-screenshots'
    });

    expect(screenshots.desktop).toBeDefined();
    expect(fs.existsSync(screenshots.desktop)).toBe(true);
  });

  it('should generate mobile screenshot', async () => {
    const screenshots = await generateScreenshots(mockSnippet);
    expect(screenshots.mobile).toBeDefined();
  });
});
```

---

## Troubleshooting

### Common Issues

**1. "Browser failed to launch"**
```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get install -y chromium-browser

# Or use bundled Chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false npm install puppeteer
```

**2. "Screenshot is blank"**
```javascript
// Add longer wait times
await page.waitForTimeout(2000);
await page.waitForNetworkIdle();
```

**3. "Element not found for hover"**
```javascript
// Make hover selector more specific
const hoverSelector = snippet.hover_selector || 'a:first-child';
const element = await page.$(hoverSelector);
if (element) await element.hover();
```

**4. "Upload fails to Supabase"**
```bash
# Check storage bucket exists
# Check RLS policies allow service role uploads
# Verify SUPABASE_SERVICE_ROLE_KEY is correct
```

---

## Performance Optimization

### Parallel Processing

```javascript
// Process multiple snippets in parallel
const chunks = chunkArray(snippets, 3); // 3 at a time

for (const chunk of chunks) {
  await Promise.all(
    chunk.map(snippet => generateForSnippet(snippet.slug))
  );
}
```

### Browser Reuse

```javascript
// Keep browser instance alive between screenshots
let browser;

async function getOrCreateBrowser() {
  if (!browser) {
    browser = await puppeteer.launch();
  }
  return browser;
}

// Close on process exit
process.on('exit', () => {
  if (browser) browser.close();
});
```

---

## Next Steps

1. **Week 1:** Manual screenshots for first 10 snippets
2. **Week 2:** Implement and test automation scripts
3. **Week 3:** Batch generate for all existing snippets
4. **Week 4:** Integrate with admin panel for new snippets
5. **Ongoing:** Monitor quality and optimize as needed
