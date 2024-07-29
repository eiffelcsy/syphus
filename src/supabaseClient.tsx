import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jtieyiowgrokkxqgpkox.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aWV5aW93Z3Jva2t4cWdwa294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzNTcxMzksImV4cCI6MjAzNjkzMzEzOX0.bW3lqV_2cjcY4PXxhbb3E_e0KTdoPi5fbSIq9QzJJm8'

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)
