# Automation Studio - n8n Dashboard & Portfolio

A professional Next.js application for managing and monitoring n8n automation workflows. Built with **shadcn/ui**, TypeScript, and Tailwind CSS.

## Features

### 📊 Dashboard
- **Real-time Monitoring**: View all active workflows and their execution status
- **Performance Metrics**: Track success rates, execution counts, and system uptime
- **Workflow Management**: Activate/deactivate workflows directly from the dashboard
- **Manual Triggers**: Trigger workflows via webhook with custom data
- **Execution History**: View detailed logs of recent automation runs

### 💼 Portfolio
- **Professional Showcase**: Beautiful landing page highlighting automation capabilities
- **Project Gallery**: Display featured automation projects with metrics
- **Services Overview**: Comprehensive list of automation services offered
- **Responsive Design**: Modern, gradient-based UI that works on all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Automation Platform**: n8n

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Access to an n8n instance
- n8n API key

### Installation

1. **Clone or navigate to the project directory**

```bash
cd "AI sprint studio shadcn"
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```bash
# n8n Configuration
N8N_API_URL=https://guidocroon.com/n8n
N8N_API_KEY=your_api_key_here
```

Replace the values with your actual n8n instance URL and API key.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Homepage with navigation
│   ├── portfolio/
│   │   └── page.tsx       # Portfolio showcase page
│   ├── dashboard/
│   │   └── page.tsx       # Automation dashboard
│   └── layout.tsx         # Root layout
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── n8n.ts            # n8n API integration
│   └── utils.ts          # Utility functions
```

## n8n Integration

### API Functions

The `src/lib/n8n.ts` file provides the following functions:

- `getWorkflows()` - Fetch all workflows
- `getWorkflow(id)` - Get a specific workflow
- `getExecutions(workflowId, limit)` - Retrieve execution history
- `getExecutionStats(workflowId)` - Calculate execution statistics
- `triggerWorkflow(webhookUrl, data)` - Manually trigger a workflow
- `toggleWorkflow(id, active)` - Activate/deactivate a workflow

### Setting up n8n API Access

1. **Log in to your n8n instance**
2. **Navigate to Settings > API**
3. **Generate a new API key**
4. **Add the API key to your `.env.local` file**

### Webhook Setup

To trigger workflows from the dashboard:

1. **Create a workflow in n8n with a Webhook trigger node**
2. **Configure the webhook path** (e.g., `/webhook/my-automation`)
3. **Copy the webhook URL** from the node
4. **Use the URL in the dashboard's "Trigger Automation" tab**

## Pages Overview

### Homepage (`/`)
- Landing page with navigation to Portfolio and Dashboard
- Key metrics display
- Modern gradient design

### Portfolio (`/portfolio`)
- Featured automation projects
- Services offered
- Success metrics
- Call-to-action sections

### Dashboard (`/dashboard`)
- **Overview Tab**: Real-time workflow statistics
- **Workflows Tab**: List and manage all workflows
- **Executions Tab**: View execution history and status
- **Trigger Tab**: Manually trigger workflows via webhook

## Customization

### Updating Colors

The project uses shadcn/ui with Neutral color scheme. To change:

```bash
npx shadcn@latest init
```

### Adding Components

```bash
npx shadcn@latest add [component-name]
```

### Modifying Metrics

Edit the stats in:
- `src/app/portfolio/page.tsx` - Portfolio metrics
- `src/app/dashboard/page.tsx` - Dashboard calculations

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `N8N_API_URL` | Your n8n instance URL | Yes |
| `N8N_API_KEY` | n8n API authentication key | Yes |

## Troubleshooting

### API Connection Issues

If you can't connect to n8n:
1. Verify your `N8N_API_URL` is correct (no trailing slash)
2. Check that your API key is valid
3. Ensure your n8n instance is accessible
4. Check CORS settings in n8n if running locally

### Workflow Not Showing

If workflows don't appear:
1. Verify API credentials in `.env.local`
2. Check browser console for errors
3. Ensure n8n API is enabled in your instance
4. Restart the development server after changing `.env.local`

### Trigger Not Working

If webhook triggers fail:
1. Verify the webhook URL is correct
2. Ensure the workflow is **activated** in n8n
3. Check that the webhook trigger node is properly configured
4. Test the webhook directly using curl or Postman first

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure you set the environment variables:
- `N8N_API_URL`
- `N8N_API_KEY`

## Security Notes

⚠️ **Important**: Never commit your `.env.local` file or expose your n8n API key.

- The `.env.local` file is ignored by git
- For client-side access, prefix variables with `NEXT_PUBLIC_`
- Consider implementing authentication for the dashboard in production
- Use environment-specific API keys

## Support

For issues with:
- **n8n**: Visit [n8n documentation](https://docs.n8n.io/)
- **shadcn/ui**: Check [shadcn/ui docs](https://ui.shadcn.com/)
- **Next.js**: See [Next.js documentation](https://nextjs.org/docs)

## License

MIT

## Credits

- Built with [Next.js](https://nextjs.org/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Automation powered by [n8n](https://n8n.io/)
