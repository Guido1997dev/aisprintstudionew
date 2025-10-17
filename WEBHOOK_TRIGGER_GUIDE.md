# Webhook Trigger & Runtime Statistics Guide 🚀

## ✅ What's New in Your Dashboard

Your dashboard now has powerful new features for managing and triggering n8n automations!

### 🎯 New Features

1. **Automation Count Display**
   - See total number of automations at a glance
   - View how many are currently active
   - Prominent stat card in the dashboard

2. **Runtime Statistics Per Automation**
   - Average execution time for each workflow
   - Success rate percentage
   - Total execution count
   - Last run timestamp

3. **Webhook Trigger Interface**
   - Trigger workflows directly from the dashboard
   - Support for both GET and POST methods
   - Test and Production URL toggle
   - JSON data payload for POST requests

## 📊 Dashboard Overview

### Stats Cards (Top Row)

1. **Total Automations**: Shows total workflow count and active workflows
2. **Total Executions**: Total runs across all automations
3. **Success Rate**: Average success percentage across all workflows
4. **Avg Runtime**: Average execution time across all automations

### Three Main Tabs

#### 1. **Automations Tab**
Displays a detailed table with:
- ✅ Workflow name (with webhook badge if configured)
- ✅ Status (Active/Inactive)
- ✅ Total execution count
- ✅ Average runtime (in ms, seconds, or minutes)
- ✅ Success rate percentage (color-coded: green >90%, yellow >70%, red <70%)
- ✅ Last execution timestamp
- ✅ Quick action buttons (Trigger, Activate/Deactivate)

#### 2. **Trigger Webhook Tab**
Professional webhook trigger interface with:
- Test URL / Production URL toggle
- Quick workflow selector dropdown
- Webhook URL input with copy button
- **HTTP Method selection (GET or POST)**
- JSON request body editor (for POST requests)
- Trigger button with loading state
- Success/Error feedback alerts

#### 3. **Performance Stats Tab**
Detailed performance cards for each workflow showing:
- Average runtime
- Success rate
- Last execution date
- Total execution count

## 🔌 How to Use Webhooks

### Setting Up in n8n

1. **Create a Workflow** in n8n
2. **Add a Webhook Trigger Node**
3. **Configure the Webhook:**
   - Set HTTP Method (GET or POST)
   - Define the webhook path (e.g., `my-automation`)
   - Set Authentication (None for testing)
   - Set Response mode (Usually "Immediately")
4. **Activate the Workflow**
5. **Copy the Webhook URL** from the node

### GET vs POST Methods

#### **GET Method** (Simple Triggers)
- ✅ Use for: Simple workflow triggers without data
- ✅ Best for: Testing, basic automation starts, scheduled reminders
- ✅ Example: Triggering a daily report generation
- ✅ No request body needed

**When to use GET:**
- Testing webhooks
- Simple triggers that don't need input data
- Public-facing triggers (links in emails, etc.)
- Health checks and monitoring

#### **POST Method** (With Data)
- ✅ Use for: Sending data to your workflow
- ✅ Best for: Form submissions, API integrations, data processing
- ✅ Example: Sending customer information to create a record
- ✅ Requires JSON request body

**When to use POST:**
- Submitting form data
- Creating or updating records
- Sending complex data structures
- API integrations that require payloads

### Example Usage

#### Example 1: GET Request (Simple Trigger)
```
URL: https://guidocroon.com/n8n/webhook/cf0b17f2-527e-4058-9c64-1dfe008e515f
Method: GET
Data: None needed
```
Just click "Trigger Workflow" - that's it!

#### Example 2: POST Request (With Data)
```
URL: https://guidocroon.com/n8n/webhook/customer-signup
Method: POST
Data:
{
  "name": "John Doe",
  "email": "john@example.com",
  "plan": "premium",
  "timestamp": "2025-01-17T10:00:00Z"
}
```

This data will be available in your n8n workflow nodes.

## 🎯 Dashboard Workflow

### Quick Trigger a Webhook:

1. **Go to "Trigger Webhook" tab**
2. **Select Test or Production** using the toggle
3. **Choose a workflow** from the dropdown (or paste URL directly)
4. **Select HTTP Method:**
   - Choose **GET** for simple triggers
   - Choose **POST** if you need to send data
5. **For POST:** Add your JSON data in the request body field
6. **Click "Trigger Workflow"**
7. **See instant feedback** - success message or error details

### View Runtime Statistics:

1. **Go to "Automations" tab** to see overview
2. **Go to "Performance Stats" tab** for detailed metrics
3. **Check color-coded success rates:**
   - 🟢 Green: >90% success (excellent!)
   - 🟡 Yellow: 70-90% success (needs attention)
   - 🔴 Red: <70% success (requires immediate attention)

## 🔧 Technical Details

### What Got Fixed

1. **Environment Variables**: Added `NEXT_PUBLIC_` prefix so API calls work from the browser
2. **n8n API Integration**: Now properly fetches workflows and executions
3. **Webhook Detection**: Automatically detects which workflows have webhook triggers
4. **Runtime Calculation**: Calculates average execution time from actual run data

### New API Functions

- `getWorkflowsWithStats()` - Fetches workflows with runtime and success metrics
- `triggerWorkflow(url, method, data)` - Triggers webhooks with GET or POST
- `formatRuntime(ms)` - Formats milliseconds to human-readable time

### Data You'll See

All data is **live from your n8n instance**:
- Total automation count
- Active/inactive status
- Real execution counts
- Actual runtime averages
- Real success rates
- Live execution timestamps

## 📝 Best Practices

### For GET Webhooks:
- ✅ Use for simple triggers
- ✅ Great for testing
- ✅ No sensitive data in URL
- ✅ Cacheable by browsers/proxies

### For POST Webhooks:
- ✅ Use when sending data
- ✅ Supports complex JSON structures
- ✅ More secure for sensitive data
- ✅ Not cached by default

### Webhook URL Structure:
```
https://guidocroon.com/n8n/webhook/[your-path]
```

The `[your-path]` is defined in your n8n Webhook node configuration.

## 🚀 Quick Start Example

### Example Scenario: Customer Onboarding

**n8n Workflow:**
1. Webhook Trigger (POST)
2. Set customer data
3. Create user account
4. Send welcome email
5. Add to CRM

**Dashboard Trigger:**
```json
{
  "customer": {
    "name": "Jane Smith",
    "email": "jane@company.com",
    "company": "Acme Corp",
    "plan": "enterprise"
  },
  "source": "dashboard",
  "timestamp": "2025-01-17T10:00:00Z"
}
```

## 🎨 UI Features

- **Dark/Light Mode**: Theme toggle in top right (all colors adapt)
- **Color-Coded Status**: Visual indicators for success rates
- **Quick Actions**: One-click trigger from automation table
- **Real-time Feedback**: Instant success/error messages
- **Copy to Clipboard**: Easy webhook URL copying
- **Responsive Design**: Works on all screen sizes

## 🔍 Troubleshooting

### Webhook not triggering?
1. ✅ Check workflow is **activated** in n8n
2. ✅ Verify webhook URL is correct
3. ✅ Ensure HTTP method matches (GET vs POST)
4. ✅ For POST: Check JSON syntax is valid

### No workflows showing?
1. ✅ Check `.env.local` has correct n8n URL and API key
2. ✅ Restart dev server after changing environment variables
3. ✅ Verify n8n API access is enabled

### Runtime shows "--"?
- This means no completed executions yet
- Run the workflow a few times to see statistics

## 🎉 You're Ready!

Your dashboard now has everything you need to:
- ✅ Monitor automation health
- ✅ Track performance metrics
- ✅ Trigger workflows on demand
- ✅ View runtime statistics
- ✅ Manage workflow activation

**Access your enhanced dashboard at:**
http://localhost:3333/dashboard

---

**Happy Automating! 🚀**

