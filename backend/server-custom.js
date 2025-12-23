const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ static: path.join(__dirname, 'public') });
const db = router.db;

const slugify = (name = '') => name.toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '');

// Enable CORS for all origins
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom search endpoint: /search?q=keyword
server.get('/search', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase();
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  const results = (db.products || []).filter(p => {
    return (
      p.name.toString().toLowerCase().includes(q) ||
      (p.description || '').toString().toLowerCase().includes(q) ||
      (p.category || '').toString().toLowerCase().includes(q)
    );
  });
  res.json(results);
});

// Categories list endpoint: /categories
server.get('/categories', (req, res) => {
  const categories = db.get('categories').value() || [];
  res.json(categories);
});

// Categories create endpoint: POST /categories
server.post('/categories', (req, res) => {
  const name = (req.body?.name || '').toString().trim();
  const parentSlug = req.body?.parentSlug ? req.body.parentSlug.toString().trim() : undefined;
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  const slug = slugify(name);
  const categories = db.get('categories').value() || [];
  const duplicate = categories.find(c => c.slug === slug || (c.name || '').toLowerCase() === name.toLowerCase());
  if (duplicate) return res.status(409).json({ message: 'Category already exists' });

  // If parentSlug is provided, check if parent exists
  if (parentSlug) {
    const parent = categories.find(c => c.slug === parentSlug);
    if (!parent) return res.status(400).json({ message: 'Parent category not found' });
  }

  const newCategory = { slug, name };
  if (parentSlug) newCategory.parentSlug = parentSlug;
  db.get('categories').push(newCategory).write();
  res.status(201).json(newCategory);
});

// Categories update endpoint: PUT /categories/:slug
server.put('/categories/:slug', (req, res) => {
  const currentSlug = req.params.slug;
  const name = (req.body?.name || '').toString().trim();
  const parentSlug = req.body?.parentSlug ? req.body.parentSlug.toString().trim() : undefined;
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  const categories = db.get('categories').value() || [];
  const idx = categories.findIndex(c => c.slug === currentSlug);
  if (idx === -1) return res.status(404).json({ message: 'Category not found' });

  const nextSlug = slugify(name);
  const duplicate = categories.find((c, i) => i !== idx && (c.slug === nextSlug || (c.name || '').toLowerCase() === name.toLowerCase()));
  if (duplicate) return res.status(409).json({ message: 'Category already exists' });

  // If parentSlug is provided, check if parent exists and not self
  if (parentSlug) {
    if (parentSlug === currentSlug) return res.status(400).json({ message: 'Category cannot be its own parent' });
    const parent = categories.find(c => c.slug === parentSlug);
    if (!parent) return res.status(400).json({ message: 'Parent category not found' });
  }

  const updated = { slug: nextSlug, name };
  if (parentSlug) updated.parentSlug = parentSlug;
  categories[idx] = updated;
  db.set('categories', categories).write();
  res.json(updated);
});

// Categories delete endpoint: DELETE /categories/:slug
server.delete('/categories/:slug', (req, res) => {
  const currentSlug = req.params.slug;
  const categories = db.get('categories').value() || [];
  const products = db.get('products').value() || [];
  const offers = db.get('offers').value() || [];
  
  const idx = categories.findIndex(c => c.slug === currentSlug);
  if (idx === -1) return res.status(404).json({ message: 'Category not found' });

  // Check if any products use this category
  const linkedProducts = products.filter(p => p.category === currentSlug);
  if (linkedProducts.length > 0) {
    return res.status(409).json({ message: `Cannot delete category: ${linkedProducts.length} products are linked to it` });
  }

  // Check if any subcategories exist
  const subcategories = categories.filter(c => c.parentSlug === currentSlug);
  if (subcategories.length > 0) {
    return res.status(409).json({ message: `Cannot delete category: ${subcategories.length} subcategories exist under it` });
  }

  // Check if any offers reference this category
  const linkedOffers = offers.filter(o => o.categorySlug === currentSlug);
  if (linkedOffers.length > 0) {
    return res.status(409).json({ message: `Cannot delete category: ${linkedOffers.length} offers are linked to it` });
  }

  categories.splice(idx, 1);
  db.set('categories', categories).write();
  res.status(204).send();
});

// Fallback to json-server router for standard REST endpoints
server.use((req, res, next) => {
  // simple logging
  console.log(`${req.method} ${req.url}`);
  next();
});

server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Custom JSON Server running on port ${PORT}`);
});
