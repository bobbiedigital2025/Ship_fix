# 🤖 Ship_fix AI Assistant

## Overview

The Ship_fix AI Assistant is a comprehensive, intelligent helper that guides users through application setup, troubleshooting, and feature usage. Built with React and integrated with your Supabase backend and MCP services.

## Features

### 🔧 **Automated Diagnostics**
- **Database Connection Testing** - Verifies Supabase connectivity
- **Schema Validation** - Checks all required tables exist
- **Environment Verification** - Validates configuration variables
- **Sample Data Checks** - Ensures test data is properly loaded
- **Service Health Monitoring** - Tests email and MCP integrations

### 💬 **Intelligent Q&A**
- **Natural Language Processing** - Understands setup and technical questions
- **Contextual Responses** - Provides specific help based on user queries
- **Code Examples** - Generates relevant code snippets and configurations
- **Documentation Links** - Direct links to relevant guides and resources

### 📊 **Setup Progress Tracking**
- **Visual Progress Bar** - Shows completion percentage
- **Step-by-Step Guidance** - Breaks down complex setup into manageable tasks
- **Status Indicators** - Clear visual feedback for each setup component
- **Troubleshooting Suggestions** - Specific fixes for common issues

### 🎯 **Quick Actions**
- **Pre-configured Questions** - Common setup scenarios ready to click
- **Resource Links** - Direct access to documentation and external tools
- **One-click Diagnostics** - Instant system health checks

## Usage

### Access the AI Assistant

1. **In the application**: Navigate to `/ai-assistant` or click the "AI Help" button in the header
2. **Quick access**: Available from the user dropdown menu

### Using the Chat Interface

1. **Ask Questions**: Type any setup or troubleshooting question
2. **Run Diagnostics**: Click "Run Diagnostics" to check system health
3. **Follow Suggestions**: Click on suggested actions or copy provided code
4. **Quick Questions**: Use pre-configured questions for common scenarios

### Example Questions

- "How do I set up the database?"
- "What environment variables do I need?"
- "Why is my email service not working?"
- "How do I deploy to production?"
- "What are the MCP AI features?"

## Implementation Details

### Core Components

#### `AISetupAssistant` Class (`src/lib/ai-setup-assistant.ts`)
- **Setup Steps Management** - Defines and tracks setup progress
- **Diagnostics Engine** - Automated testing of system components
- **Question Processing** - Intelligent response generation
- **Knowledge Base Integration** - Accesses FAQ and documentation

#### `AISetupChat` Component (`src/components/ai/AISetupChat.tsx`)
- **Chat Interface** - Real-time conversation with AI
- **Progress Visualization** - Setup completion tracking
- **Quick Actions Panel** - Common tasks and resources
- **Response Formatting** - Rich content display with code examples

### Setup Steps Monitored

1. **Environment Configuration**
   - `.env` file validation
   - Required variables check
   - API key verification

2. **Database Connection**
   - Supabase connectivity test
   - Authentication verification
   - Network accessibility

3. **Database Schema** 
   - Table existence checks
   - Relationship validation
   - Permission verification

4. **Sample Data**
   - Test record availability
   - Data integrity checks
   - Relationship consistency

5. **Email Service**
   - Resend API configuration
   - Template availability
   - Delivery testing

6. **MCP Integration**
   - Server configuration check
   - API key validation
   - Service connectivity

### Knowledge Base Integration

The AI Assistant integrates with your Supabase `support_faqs` table to provide:
- Dynamic FAQ responses
- Category-based help
- User-contributed knowledge
- Searchable documentation

## Configuration

### Environment Variables
```env
# Required for AI Assistant
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional for enhanced features
RESEND_API_KEY=your_resend_key
VITE_MCP_API_KEY=your_mcp_key
```

### MCP Integration
Configure in `src/.vscode/mcp.json`:
```json
{
  "servers": [
    {
      "name": "Supa Brain AI",
      "command": "npx",
      "args": ["-y", "@mcpinky/supa-brain-server@latest"]
    }
  ]
}
```

## Customization

### Adding New Setup Steps
```typescript
// In ai-setup-assistant.ts
const newStep: SetupStep = {
  id: 'custom-step',
  title: 'Custom Configuration',
  description: 'Check custom integration',
  status: 'pending',
  action: async () => {
    // Your validation logic
    return true; // or false
  },
  helpText: 'Help text for users',
  troubleshooting: ['Step 1', 'Step 2']
};
```

### Extending Question Processing
```typescript
// Add to askQuestion method
if (lowerQuestion.includes('custom-feature')) {
  return {
    message: "Help with custom feature",
    suggestions: ["Suggestion 1", "Suggestion 2"],
    codeExample: `// Example code`,
    documentationLink: "/docs/custom"
  };
}
```

## Benefits

### For Users
- **Reduced Setup Time** - Automated diagnostics catch issues quickly
- **Self-Service Support** - Get help without waiting for human assistance
- **Learning Tool** - Understand the system through guided explanations
- **Confidence Building** - Clear progress tracking and validation

### For Developers
- **Reduced Support Load** - Common questions answered automatically
- **Better Onboarding** - New users get up to speed faster
- **Issue Prevention** - Catches configuration problems early
- **Knowledge Capture** - FAQ system grows with user interactions

## Integration with Ship_fix

The AI Assistant is deeply integrated with Ship_fix components:

- **Supabase Backend** - Real-time data validation and FAQ access
- **MCP Services** - Enhanced AI capabilities through brain services
- **Email System** - Helps configure and troubleshoot notifications
- **Support System** - Seamlessly transitions users to human support when needed

## Future Enhancements

- **Advanced AI Models** - Integration with GPT-4 or Claude for more sophisticated responses
- **Voice Interface** - Speech recognition and text-to-speech capabilities
- **Video Tutorials** - Embedded walkthrough videos for complex setups
- **Collaborative Features** - Share setup progress with team members
- **Predictive Issues** - AI predicts potential problems before they occur

---

**The Ship_fix AI Assistant makes complex application setup simple and accessible for users of all technical levels.** 🚀
