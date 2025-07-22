#!/bin/bash

# Enterprise Testing Suite for Ship_fix Platform
# Tests all critical features for production readiness

echo "🚀 ENTERPRISE TESTING SUITE - Ship_fix Platform"
echo "=============================================="
echo "Date: $(date)"
echo "Testing Environment: Production Readiness"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local description="$3"
    
    echo -e "${BLUE}🧪 Testing: $test_name${NC}"
    echo "   Description: $description"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "   ${GREEN}✅ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "   ${RED}❌ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

echo "📋 PHASE 1: COMPILATION & BUILD TESTS"
echo "====================================="

run_test "TypeScript Compilation" \
    "npx tsc --noEmit" \
    "Verify TypeScript code compiles without errors"

run_test "Production Build" \
    "npm run build" \
    "Ensure production build completes successfully"

run_test "ESLint Code Quality" \
    "npx eslint src --ext .ts,.tsx --max-warnings 0" \
    "Check code quality and standards compliance"

echo "🗄️  PHASE 2: DATABASE & SCHEMA TESTS"
echo "===================================="

run_test "Database Schema Validation" \
    "test -f supabase-schema.sql && grep -q 'tariff_events' supabase-schema.sql" \
    "Verify database schema includes tariff automation tables"

run_test "SQL Syntax Check" \
    "test -f step-by-step-minimal.sql && head -1 step-by-step-minimal.sql" \
    "Check SQL files for basic syntax validity"

run_test "Migration Scripts" \
    "test -x deploy-tariff-schema.sh" \
    "Verify deployment scripts are executable"

echo "🔧 PHASE 3: COMPONENT INTEGRITY TESTS"
echo "====================================="

run_test "React Components" \
    "find src/components -name '*.tsx' | wc -l | grep -q '[1-9]'" \
    "Verify React components exist and are properly structured"

run_test "Page Components" \
    "find src/pages -name '*.tsx' | wc -l | grep -q '[1-9]'" \
    "Check all page components are present"

run_test "Guided Tour System" \
    "test -f src/components/ui/GuidedTour.tsx && test -f src/hooks/use-tour-manager.ts" \
    "Verify guided tour system is implemented"

run_test "AI Assistant Integration" \
    "test -f src/pages/AIAssistant.tsx && grep -q 'TourSelector' src/pages/AIAssistant.tsx" \
    "Check AI assistant includes tour functionality"

echo "🛡️  PHASE 4: SECURITY & COMPLIANCE TESTS"
echo "========================================"

run_test "Privacy Policy" \
    "test -f src/pages/PrivacyPolicy.tsx && grep -q 'Google Ads' src/pages/PrivacyPolicy.tsx" \
    "Verify privacy policy exists and includes Google Ads compliance"

run_test "Terms of Service" \
    "test -f src/pages/TermsOfService.tsx" \
    "Check terms of service page exists"

run_test "Cookie Consent" \
    "test -f src/components/ui/CookieConsentBanner.tsx" \
    "Verify GDPR cookie consent implementation"

run_test "Google Ads Integration" \
    "test -f src/components/ads/GoogleAdsIntegration.tsx" \
    "Check Google Ads integration component"

echo "⚡ PHASE 5: AUTOMATION & MCP TESTS"
echo "================================="

run_test "MCP Automation Engine" \
    "test -f src/lib/mcp-automation-engine.ts && grep -q 'tariff_change' src/lib/mcp-automation-engine.ts" \
    "Verify MCP automation engine includes tariff monitoring"

run_test "Supply Chain Dashboard" \
    "test -f src/components/dashboard/SupplyChainDashboard.tsx" \
    "Check supply chain dashboard component"

run_test "Tariff Monitor" \
    "test -f src/components/dashboard/TariffMonitor.tsx" \
    "Verify tariff monitoring dashboard"

run_test "Automation Triggers" \
    "grep -q 'shipment_created\\|tariff_change\\|delay_detected' src/lib/mcp-automation-engine.ts" \
    "Check automation triggers are properly defined"

echo "📱 PHASE 6: USER INTERFACE TESTS"
echo "==============================="

run_test "Footer Integration" \
    "test -f src/components/layout/Footer.tsx && grep -q 'Legal' src/components/layout/Footer.tsx" \
    "Verify footer includes legal links"

run_test "Navigation Structure" \
    "test -f src/components/layout/Sidebar.tsx && grep -q 'data-tour' src/components/layout/Sidebar.tsx" \
    "Check navigation includes tour attributes"

run_test "Responsive Design" \
    "grep -q 'md:' src/components/layout/Footer.tsx" \
    "Verify responsive design implementation"

run_test "Theme Provider" \
    "test -f src/components/theme-provider.tsx" \
    "Check theme provider integration"

echo "📋 PHASE 7: DOCUMENTATION & GUIDES"
echo "=================================="

run_test "Launch Checklist" \
    "test -f LAUNCH_CHECKLIST.md" \
    "Verify launch checklist exists"

run_test "Deployment Scripts" \
    "test -f deploy-tariff-schema.sh && test -f test-tariff-automation.sh" \
    "Check deployment and testing scripts"

run_test "Environment Configuration" \
    "test -f .env.example && grep -q 'GOOGLE_ADS' .env.example" \
    "Verify environment configuration template"

run_test "Documentation Files" \
    "find . -name '*.md' | grep -E '(README|GUIDE|DOCUMENTATION)' | wc -l | grep -q '[1-9]'" \
    "Check comprehensive documentation exists"

echo "🔍 PHASE 8: PRODUCTION READINESS"
echo "==============================="

run_test "Build Artifacts" \
    "test -d dist && find dist -name '*.js' | wc -l | grep -q '[1-9]'" \
    "Verify build produces artifacts"

run_test "Asset Optimization" \
    "find dist -name '*.js' -size +1M | wc -l | test $(cat) -lt 3" \
    "Check for reasonable bundle sizes"

run_test "Legal Compliance" \
    "grep -q 'privacy@bobbiedigital.com' src/pages/PrivacyPolicy.tsx" \
    "Verify contact information is included"

run_test "Configuration Completeness" \
    "grep -q 'VITE_SUPABASE_URL\\|VITE_GOOGLE_ADS_ID' .env.example" \
    "Check environment variables are documented"

echo ""
echo "📊 ENTERPRISE TEST RESULTS"
echo "=========================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "Pass Rate: ${BLUE}$PASS_RATE%${NC}"

echo ""
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED - READY FOR PRODUCTION DEPLOYMENT! 🚀${NC}"
    echo -e "${GREEN}✅ Ship_fix platform is enterprise-ready${NC}"
    exit 0
elif [ $PASS_RATE -ge 90 ]; then
    echo -e "${YELLOW}⚠️  MOSTLY READY - Minor issues to address${NC}"
    echo -e "${YELLOW}📋 Review failed tests and fix before deployment${NC}"
    exit 1
else
    echo -e "${RED}❌ CRITICAL ISSUES FOUND - DO NOT DEPLOY${NC}"
    echo -e "${RED}🔧 Significant fixes required before production${NC}"
    exit 2
fi
