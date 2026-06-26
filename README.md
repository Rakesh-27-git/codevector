What I chose and why:

Node.js + Express for the backend — familiar stack, lightweight for an API server
PostgreSQL on Neon — free tier, serverless, perfect for this scale
Prisma ORM — type-safe queries, easy migrations
Cursor-based pagination instead of OFFSET — stable pagination even when new products are added/updated. Used a composite cursor (createdAt, id) to handle rows with identical timestamps
Composite indexes on (createdAt DESC, id DESC) and (category, createdAt DESC, id DESC) for fast queries on 200k rows
Vite + React for the bonus UI — simple, fast to build and deploy

What I'd improve with more time:

Add total count per category
Search by product name
Better error handling and input validation
Rate limiting on the API

How I used AI:

Used Claude to scaffold the initial setup and pagination logic
Understood every piece of the cursor pagination logic before writing it
