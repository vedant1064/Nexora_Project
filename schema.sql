CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------
-- ENUM TYPES
-- -----------------------------
CREATE TYPE plan_enum AS ENUM ('STARTER', 'PRO', 'PREMIUM');
CREATE TYPE tone_enum AS ENUM ('Friendly', 'Premium', 'Formal');
CREATE TYPE lead_enum AS ENUM ('Hot', 'Warm', 'Cold');
CREATE TYPE role_enum AS ENUM ('user', 'assistant');
CREATE TYPE subscription_status_enum AS ENUM ('inactive', 'active', 'cancelled', 'past_due');

-- -----------------------------
-- BUSINESSES TABLE
-- -----------------------------
CREATE TABLE businesses (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------
-- PRODUCTS
-- -----------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    stock_quantity INT DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------
-- LEADS
-- -----------------------------
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20) NOT NULL,
    classification lead_enum DEFAULT 'Cold',
    conversion_probability INT CHECK (conversion_probability BETWEEN 0 AND 100),
    follow_up_needed BOOLEAN DEFAULT false,
    ai_summary TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (business_id, customer_phone)
);

-- -----------------------------
-- CONVERSATION HISTORY
-- -----------------------------
CREATE TABLE conversation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20) NOT NULL,
    role role_enum NOT NULL,
    content TEXT NOT NULL,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------
-- USAGE LOGS
-- -----------------------------
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------
-- PAYMENTS
-- -----------------------------
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT,
    razorpay_subscription_id TEXT,
    amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
