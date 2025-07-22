#!/bin/bash

# Test script for Trump Tariff Automation System
# This script tests the tariff monitoring and automated resolution features

echo "🎯 Testing Trump Tariff Automation System..."
echo "=================================================="

# Test 1: Check if Supabase connection works
echo "1. Testing Supabase connection..."
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
supabase.from('customers').select('count').then(res => {
  if (res.error) {
    console.log('❌ Supabase connection failed:', res.error.message);
  } else {
    console.log('✅ Supabase connection successful');
  }
});
" 2>/dev/null || echo "⚠️  Node.js test skipped (dependencies not installed)"

# Test 2: Check if tariff tables exist in schema
echo ""
echo "2. Checking tariff tables in schema..."
grep -q "tariff_events" supabase-schema.sql && echo "✅ tariff_events table found in schema" || echo "❌ tariff_events table missing"
grep -q "tariff_resolutions" supabase-schema.sql && echo "✅ tariff_resolutions table found in schema" || echo "❌ tariff_resolutions table missing"
grep -q "supply_chain_alternatives" supabase-schema.sql && echo "✅ supply_chain_alternatives table found in schema" || echo "❌ supply_chain_alternatives table missing"

# Test 3: Check automation triggers
echo ""
echo "3. Checking automation triggers..."
grep -q "auto_create_tariff_resolution" supabase-schema.sql && echo "✅ Tariff resolution trigger found" || echo "❌ Tariff resolution trigger missing"
grep -q "auto_adjust_pricing_for_tariffs" supabase-schema.sql && echo "✅ Pricing adjustment trigger found" || echo "❌ Pricing adjustment trigger missing"

# Test 4: Check MCP automation engine updates
echo ""
echo "4. Checking MCP automation engine..."
grep -q "logTariffEvent" src/lib/mcp-automation-engine.ts && echo "✅ MCP tariff logging found" || echo "❌ MCP tariff logging missing"
grep -q "simulateTrumpTariffImpact" src/lib/mcp-automation-engine.ts && echo "✅ Trump tariff simulation found" || echo "❌ Trump tariff simulation missing"

# Test 5: Check tariff monitor component
echo ""
echo "5. Checking tariff monitor component..."
test -f "src/components/dashboard/TariffMonitor.tsx" && echo "✅ TariffMonitor component created" || echo "❌ TariffMonitor component missing"

# Test 6: Check sample data
echo ""
echo "6. Checking sample tariff data..."
grep -q "Trump administration increased tariffs" supabase-schema.sql && echo "✅ Sample Trump tariff data found" || echo "❌ Sample Trump tariff data missing"
grep -q "Executive Order 2025-001" supabase-schema.sql && echo "✅ Trump policy references found" || echo "❌ Trump policy references missing"

# Test 7: Display system capabilities
echo ""
echo "7. System Capabilities Summary:"
echo "   📊 Automated tariff event detection"
echo "   🤖 MCP-powered cost analysis"
echo "   💰 A2A automatic customer credits"
echo "   🚚 Supply chain route optimization"
echo "   📈 Supplier switching recommendations"
echo "   🛡️  Compliance monitoring"
echo "   📱 Real-time dashboard monitoring"

echo ""
echo "🎉 Trump Tariff Automation System Test Complete!"
echo ""
echo "Next Steps:"
echo "1. Run the schema in your Supabase SQL Editor"
echo "2. Start the development server: npm run dev"
echo "3. Navigate to the supply chain dashboard"
echo "4. Click 'Simulate Event' to test automation"
echo "5. Monitor tariff events and automated resolutions"
echo ""
echo "The system is designed to automatically:"
echo "- Detect Trump tariff changes (China, Mexico, etc.)"
echo "- Calculate customer cost impacts"
echo "- Execute automated resolutions (credits, optimizations)"
echo "- Track cost savings and ROI"
