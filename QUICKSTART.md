# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Verify Environment Configuration

The `.env.local` file has been created with your n8n credentials:

```bash
N8N_API_URL=https://guidocroon.com/n8n
N8N_API_KEY=eyJhbGc... (your actual API key)
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3333**

### 3. Explore the Application

#### 🏠 **Homepage** (`/`)
- Landing page with navigation cards
- Quick access to Portfolio and Dashboard

#### 💼 **Portfolio** (`/portfolio`)
- Beautiful showcase of automation capabilities
- Featured projects with metrics
- Services overview
- Professional design

#### 📊 **Dashboard** (`/dashboard`)
- **Overview**: Real-time statistics (workflows, executions, success rate)
- **Workflows Tab**: View and manage all n8n workflows
  - Activate/deactivate workflows
  - View workflow tags and status
- **Executions Tab**: Monitor recent automation runs
  - Execution status (success, error, waiting)
  - Execution duration
  - Workflow names
- **Trigger Tab**: Manually trigger workflows
  - Enter webhook URL from your n8n workflow
  - Provide optional JSON data
  - Instant execution

## 🔧 How to Trigger Workflows

1. **In n8n**: Create a workflow with a **Webhook trigger node**
2. **Copy the webhook URL** (shown in the node)
3. **Activate the workflow** in n8n
4. **Go to Dashboard** → **Trigger Automation** tab
5. **Paste the webhook URL** and click "Trigger Workflow"

## 📦 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── portfolio/page.tsx    # Portfolio showcase
│   └── dashboard/page.tsx    # Automation dashboard
├── components/ui/            # shadcn/ui components
└── lib/
    └── n8n.ts               # n8n API integration
```

## ✨ Features Implemented

- ✅ Full n8n API integration
- ✅ Real-time workflow monitoring
- ✅ Execution history and statistics
- ✅ Workflow activation/deactivation
- ✅ Manual webhook triggers
- ✅ Beautiful, responsive UI with shadcn/ui
- ✅ Professional portfolio page
- ✅ TypeScript throughout
- ✅ Production-ready build

## 🎨 UI Components Used

- **Card** - Information containers
- **Button** - Interactive actions
- **Badge** - Status indicators
- **Table** - Data display
- **Tabs** - Navigation between views
- **Alert** - Important messages
- **Input/Label** - Form fields

## 🔥 Next Steps

1. **Customize the Portfolio**: Edit `src/app/portfolio/page.tsx`
2. **Add More Metrics**: Extend `src/lib/n8n.ts`
3. **Style Adjustments**: Modify Tailwind classes
4. **Add Authentication**: Protect the dashboard
5. **Deploy to Production**: Use Vercel or your preferred platform

## 📝 Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Add new shadcn component
npx shadcn@latest add [component-name]
```

## 🐛 Troubleshooting

**Dashboard shows no data?**
- Check `.env.local` file exists with correct credentials
- Verify n8n instance is accessible
- Restart the dev server after changing `.env.local`

**Workflow trigger fails?**
- Ensure workflow is activated in n8n
- Verify webhook URL is correct
- Check n8n logs for errors

**Build fails?**
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run build`

## 🎉 You're All Set!

Your n8n automation dashboard is ready to use. Start by running:

```bash
npm run dev
```

Then visit **http://localhost:3333** and explore! 🚀

