# 🚨 Schema Troubleshooting Guide

## 🎯 **If you're still having issues with the schema, try this:**

### **Option 1: Use the Simple Basic Schema (RECOMMENDED)**

**Problem**: The full schema might have complex triggers causing issues
**Solution**: Use `supabase-schema-basic.sql` instead

#### **Steps:**
1. **Copy ONLY the basic schema**: `supabase-schema-basic.sql`
2. **Go to**: https://supabase.com/dashboard/project/ujzedaxzqpglrccqojbh/sql/new
3. **Paste the entire content**
4. **Click "Run"**

### **Option 2: Run in Smaller Chunks**

If the basic schema still fails, break it down:

#### **Chunk 1: Core Tables Only**
```sql
-- Just the table creation parts (no triggers, no sample data)
CREATE TABLE IF NOT EXISTS customers (...);
CREATE TABLE IF NOT EXISTS support_tickets (...);
CREATE TABLE IF NOT EXISTS support_responses (...);
CREATE TABLE IF NOT EXISTS support_faqs (...);
-- etc.
```

#### **Chunk 2: Indexes**
```sql
-- Add indexes after tables are created
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
-- etc.
```

#### **Chunk 3: Sample Data**
```sql
-- Add sample data last
INSERT INTO customers (...) VALUES (...);
-- etc.
```

### **Option 3: Check Common Issues**

#### **A. Wrong Project?**
- Make sure you're in: `ujzedaxzqpglrccqojbh`
- URL should be: https://supabase.com/dashboard/project/ujzedaxzqpglrccqojbh

#### **B. Permissions?**
- Are you logged in as the project owner?
- Try refreshing the page and logging in again

#### **C. Syntax Errors?**
- Check for extra characters when copying
- Make sure you copied the ENTIRE file
- Look for missing semicolons

### **Option 4: Try Via VS Code Extension**

1. **Command Palette**: `Ctrl+Shift+P`
2. **Type**: `Supabase: Connect to Project`
3. **Enter URL**: `https://ujzedaxzqpglrccqojbh.supabase.co`
4. **Enter API Key**: (from your .env file)
5. **Select schema file** and run

## 🔍 **What specific error are you seeing?**

Tell me the exact error message and I can help you fix it specifically!

**Common errors:**
- "permission denied" → Try logging out/in
- "column does not exist" → Use the basic schema
- "syntax error" → Check for copy/paste issues
- "relation already exists" → Tables might already be created

## 🚀 **Quick Test**

Try this minimal test first:
```sql
CREATE TABLE IF NOT EXISTS test_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL
);

SELECT 'Test successful! 🎉' as status;
```

If this works, your connection is fine and we can debug the schema step by step.
