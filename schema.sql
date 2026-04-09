-- 1. UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing types to avoid conflicts
DROP TYPE IF EXISTS plan_enum CASCADE;
DROP TYPE IF EXISTS tone_enum CASCADE;
DROP TYPE IF EXISTS lead_enum CASCADE;
DROP TYPE IF EXISTS role_enum CASCADE;
DROP TYPE IF EXISTS subscription_status_enum CASCADE;

-- 3. Create ENUM Types
CREATE TYPE plan_enum AS ENUM ('STARTER', 'PRO', 'PREMIUM');
CREATE TYPE tone_enum AS ENUM ('Friendly', 'Premium', 'Formal');
CREATE TYPE lead_enum AS ENUM ('Hot', 'Warm', 'Cold');
CREATE TYPE role_enum AS ENUM ('user', 'assistant');
CREATE TYPE subscription_status_enum AS ENUM ('inactive', 'active', 'cancelled', 'past_due');

-- 4. Businesses Table (Added AI settings columns)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    brand_tone tone_enum DEFAULT 'Friendly',
    location TEXT,
    plan_tier plan_enum DEFAULT 'STARTER',
    razorpay_customer_id TEXT,
    razorpay_subscription_id TEXT,
    subscription_status subscription_status_enum DEFAULT 'inactive',
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    subscription_interval VARCHAR(20),
    monthly_message_count INT DEFAULT 0,
    monthly_token_usage INT DEFAULT 0,
    whatsapp_api_token TEXT,
    is_active BOOLEAN DEFAULT true,
    -- AI Settings added here
    ai_tone TEXT DEFAULT 'friendly',
    ai_language TEXT DEFAULT 'auto',
    ai_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Products Table (Added image_url)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(500), -- Added
    stock_quantity INT DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Leads Table (Added conversion and intent columns)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20) NOT NULL,
    classification lead_enum DEFAULT 'Cold',
    conversion_probability INT CHECK (conversion_probability BETWEEN 0 AND 100),
    follow_up_needed BOOLEAN DEFAULT false,
    ai_summary TEXT,
    -- New Analytics columns added here
    latest_intent TEXT,
    conversion_chance INTEGER DEFAULT 50,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (business_id, customer_phone)
);

-- 7. Google Login Users Table (Removed passwords)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    google_id TEXT UNIQUE, 
    profile_pic TEXT,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20) NOT NULL,
    customer_name VARCHAR(255),
    address TEXT,
    pincode VARCHAR(10),
    total_amount DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    order_status VARCHAR(20) DEFAULT 'created',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Remaining Tables
CREATE TABLE IF NOT EXISTS conversation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20) NOT NULL,
    role role_enum NOT NULL,
    content TEXT NOT NULL,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT,
    razorpay_subscription_id TEXT,
    amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);