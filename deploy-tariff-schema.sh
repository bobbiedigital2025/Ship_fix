#!/bin/bash

# 🎯 Deploy Trump Tariff Automation Schema to Supabase
# This script helps you deploy the complete schema with tariff automation

echo "🚀 Trump Tariff Automation Schema Deployment"
echo "============================================="
echo ""

# Check if schema file exists
if [ ! -f "supabase-schema.sql" ]; then
    echo "❌ Error: supabase-schema.sql not found!"
    echo "Make sure you're in the Ship_fix directory"
    exit 1
fi

echo "✅ Schema file found: supabase-schema.sql"
echo ""

# Display instructions
echo "📋 DEPLOYMENT INSTRUCTIONS:"
echo ""
echo "1. 🌐 Go to your Supabase Dashboard:"
echo "   https://supabase.com/dashboard"
echo ""
echo "2. 🎯 Select your project"
echo ""
echo "3. 📊 Click 'SQL Editor' in the left sidebar"
echo ""
echo "4. 📝 Create a new query and paste the schema below"
echo ""
echo "5. ▶️  Click 'Run' to execute the schema"
echo ""

# Ask user if they want to see the schema
read -p "🤔 Would you like to display the schema content? (y/n): " show_schema

if [[ $show_schema =~ ^[Yy]$ ]]; then
    echo ""
    echo "📄 SCHEMA CONTENT TO COPY:"
    echo "=========================="
    echo ""
    cat supabase-schema.sql
    echo ""
    echo "=========================="
    echo "📄 END OF SCHEMA"
    echo ""
fi

# Show what the schema includes
echo "🎯 WHAT THIS SCHEMA INCLUDES:"
echo ""
echo "Core Tables:"
echo "  ✅ customers - Customer data and profiles"
echo "  ✅ support_tickets - Support ticket management"
echo "  ✅ email_logs - Email tracking and automation"
echo ""
echo "🆕 TRUMP TARIFF AUTOMATION TABLES:"
echo "  🎯 tariff_events - Trump tariff changes and impacts"
echo "  🤖 tariff_resolutions - Automated MCP cost mitigation"
echo "  🚚 supply_chain_alternatives - Tariff-exempt suppliers"
echo ""
echo "Automation Features:"
echo "  ⚡ Auto-detect Trump tariff changes"
echo "  💰 A2A customer credits for high impacts (>15%)"
echo "  🚚 Route optimization for medium impacts (5-15%)"
echo "  📧 Customer notifications for low impacts (<5%)"
echo "  🔍 MCP authentication and tracking"
echo ""

# Test automation after deployment
echo "🧪 AFTER DEPLOYMENT - TEST THE SYSTEM:"
echo ""
echo "1. Start your app: npm run dev"
echo "2. Navigate to: http://localhost:8082"
echo "3. Go to Supply Chain Dashboard"
echo "4. Click 'Simulate Event' to test Trump tariff automation"
echo "5. Watch automated resolutions and cost savings"
echo ""

# Quick deployment option
read -p "🚀 Would you like to open Supabase Dashboard now? (y/n): " open_supabase

if [[ $open_supabase =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌐 Opening Supabase Dashboard..."
    
    # Try different ways to open browser
    if command -v xdg-open > /dev/null; then
        xdg-open "https://supabase.com/dashboard"
    elif command -v open > /dev/null; then
        open "https://supabase.com/dashboard"
    elif command -v start > /dev/null; then
        start "https://supabase.com/dashboard"
    else
        echo "Please manually open: https://supabase.com/dashboard"
    fi
fi

echo ""
echo "✨ TRUMP TARIFF AUTOMATION READY!"
echo ""
echo "💡 Remember:"
echo "   - High tariff impact (>15%) = Automatic A2A credits"
echo "   - Medium impact (5-15%) = Route optimization"
echo "   - Low impact (<5%) = Customer notification"
echo ""
echo "📞 Support: marketing-support@bobbiedigital.com"
echo ""
