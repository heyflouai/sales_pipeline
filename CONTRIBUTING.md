# Contributing to WhatsApp Sales Pipeline

Welcome! This guide will help you get started with contributing to the project.

## Getting Started

### 1. Get Repository Access

Contact the project maintainer to be added as a collaborator:
- Repository: https://github.com/heyflouai/sales_pipeline
- You'll need "Write" access to push changes

### 2. Clone the Repository

```bash
git clone https://github.com/heyflouai/sales_pipeline.git
cd sales_pipeline
```

### 3. Install Dependencies

```bash
npm install
```

Or if you prefer other package managers:
```bash
yarn install
# or
pnpm install
```

### 4. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add the required credentials:
- **Database URL** (Supabase connection string)
- **Clerk API Keys** (for authentication)
- **WhatsApp API credentials** (when implemented)
- Any other service credentials

**Important:** Never commit `.env.local` or any file containing secrets. These are already excluded in `.gitignore`.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Working with Git

#### Option A: Direct Push to Main (Simple, Small Team)

For quick changes and small teams:

```bash
# Always pull latest changes first
git pull origin main

# Make your changes, then:
git add .
git commit -m "description of your changes"
git push origin main
```

#### Option B: Feature Branches (Recommended)

For larger features or when you want code review:

```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "feat: description of your changes"

# Push your branch
git push origin feature/your-feature-name

# Go to GitHub and create a Pull Request
```

### Commit Message Convention

Use clear, descriptive commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add WhatsApp message composer"
git commit -m "fix: resolve lead assignment race condition"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify handoff workflow logic"
```

## Project Structure

```
whatsapp_project/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and helpers
├── supabase/              # Database migrations and types
├── public/                # Static assets
├── CLAUDE.md              # AI assistant instructions
└── CONTRIBUTING.md        # This file
```

## Best Practices

### Before You Start Working

```bash
# Always pull the latest changes
git pull origin main
```

### Making Changes

1. **Read existing code first** - Understand the current implementation before modifying
2. **Keep changes focused** - One feature/fix per commit when possible
3. **Test your changes** - Make sure everything works before pushing
4. **Follow existing patterns** - Match the code style and architecture already in place

### Security

- **Never commit secrets** - API keys, passwords, tokens stay in `.env.local`
- **Validate user input** - Prevent SQL injection, XSS attacks
- **Follow RBAC rules** - Respect user roles and permissions
- **Review sensitive changes** - Get approval for auth, database, or CRM changes

### Code Quality

- Write clean, readable code
- Add comments for complex logic
- Use TypeScript types properly
- Keep components small and focused
- Avoid over-engineering - simple solutions are often best

## Common Tasks

### Update Dependencies

```bash
npm update
```

### Run Database Migrations

```bash
# View pending migrations
npx supabase db diff

# Apply migrations
npx supabase db push
```

### Generate TypeScript Types from Database

```bash
npx supabase gen types typescript --local > supabase/types.ts
```

### Reset Local Database

```bash
npx supabase db reset
```

## Getting Help

### Check Documentation

- Project overview: See `CLAUDE.md` for architecture and requirements
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Clerk docs: https://clerk.com/docs

### Ask Questions

- Create a GitHub Issue for bugs or feature requests
- Reach out to the team in your communication channel
- Check existing Issues and Pull Requests

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** with clear, atomic commits
3. **Test thoroughly** - ensure everything works
4. **Push your branch** to GitHub
5. **Create a Pull Request**:
   - Write a clear title and description
   - Reference any related issues
   - Request review from team members
6. **Address feedback** if any changes are requested
7. **Merge** once approved

## Common Git Commands

```bash
# Check what you've changed
git status
git diff

# Stage changes
git add .                    # Stage all changes
git add path/to/file         # Stage specific file

# Commit changes
git commit -m "your message"

# Push changes
git push origin main         # Push to main branch
git push origin feature-name # Push to feature branch

# Pull latest changes
git pull origin main

# Create and switch to new branch
git checkout -b branch-name

# Switch to existing branch
git checkout branch-name

# See commit history
git log --oneline

# Undo uncommitted changes
git restore path/to/file     # Undo changes to specific file
git restore .                # Undo all changes (careful!)

# Update your branch with latest main
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

## Troubleshooting

### Merge Conflicts

```bash
# When you get a merge conflict:
1. Open the conflicted files
2. Look for conflict markers: <<<<<<<, =======, >>>>>>>
3. Manually resolve by choosing which changes to keep
4. Remove conflict markers
5. Stage and commit the resolved files
git add .
git commit -m "resolve merge conflict"
```

### Reset Local Changes

```bash
# Discard all uncommitted changes (careful!)
git restore .

# Discard changes to specific file
git restore path/to/file
```

### Sync Your Branch with Main

```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

## Environment Variables Reference

Your `.env.local` should include:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret

# WhatsApp (when implemented)
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# (Add other variables as needed)
```

## Questions?

If you have questions or run into issues:
1. Check this guide and `CLAUDE.md`
2. Search existing GitHub Issues
3. Create a new Issue
4. Ask the team

Thank you for contributing to the WhatsApp Sales Pipeline project!
