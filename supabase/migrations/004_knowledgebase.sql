-- Knowledgebase Schema
-- Run this migration in Supabase SQL Editor

-- Categories for organizing KB content
CREATE TABLE IF NOT EXISTS kb_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles and product documentation
CREATE TABLE IF NOT EXISTS kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES kb_categories(id) ON DELETE SET NULL,
  content_type VARCHAR(20) NOT NULL DEFAULT 'article' CHECK (content_type IN ('article', 'product_doc')),
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  featured_image_url TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  tags TEXT[] DEFAULT '{}',
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  author_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ entries
CREATE TABLE IF NOT EXISTS kb_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES kb_categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kb_articles_status ON kb_articles(status);
CREATE INDEX IF NOT EXISTS idx_kb_articles_slug ON kb_articles(slug);
CREATE INDEX IF NOT EXISTS idx_kb_articles_category ON kb_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_kb_articles_content_type ON kb_articles(content_type);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_status ON kb_faqs(status);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_category ON kb_faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_kb_categories_slug ON kb_categories(slug);

-- Full-text search index on articles
CREATE INDEX IF NOT EXISTS idx_kb_articles_fts ON kb_articles
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));

-- Updated_at triggers
DROP TRIGGER IF EXISTS update_kb_categories_updated_at ON kb_categories;
CREATE TRIGGER update_kb_categories_updated_at
  BEFORE UPDATE ON kb_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kb_articles_updated_at ON kb_articles;
CREATE TRIGGER update_kb_articles_updated_at
  BEFORE UPDATE ON kb_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kb_faqs_updated_at ON kb_faqs;
CREATE TRIGGER update_kb_faqs_updated_at
  BEFORE UPDATE ON kb_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE kb_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_faqs ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
CREATE POLICY "Public can read kb categories"
  ON kb_categories FOR SELECT
  TO anon
  USING (true);

-- Public read access for published articles
CREATE POLICY "Public can read published kb articles"
  ON kb_articles FOR SELECT
  USING (status = 'published');

-- Public read access for published FAQs
CREATE POLICY "Public can read published kb faqs"
  ON kb_faqs FOR SELECT
  USING (status = 'published');

-- Service role full access
CREATE POLICY "Service role full access kb_categories"
  ON kb_categories FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access kb_articles"
  ON kb_articles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access kb_faqs"
  ON kb_faqs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
