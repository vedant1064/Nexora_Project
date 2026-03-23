# =========================================
# 🚀 AUTONEX AI - ENTERPRISE v1.2 HARDENED + SMART AI REPLY
# =========================================
from fastapi import UploadFile, File
import shutil
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import psycopg2
import razorpay
import hmac
import hashlib
import json
import jwt

from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta, timezone
from google import genai
from google.genai import types
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig


# =========================================
# 🔧 INIT
# =========================================

load_dotenv()
from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

print("ENV PATH:", env_path)
print("EMAIL:", repr(os.getenv("EMAIL")))
print("EMAIL_PASSWORD:", repr(os.getenv("EMAIL_PASSWORD")))

app = FastAPI()

os.makedirs("static/products", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# =========================================
# ✅ CORS FIX
# =========================================

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Filhal debugging ke liye sab allow kar do
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
# Purana openai_client hata kar ye likho:
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# EMAIL CONFIG (PASTE HERE)
mail_conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)



def get_db():
    return psycopg2.connect(DATABASE_URL)

# =========================================
# 🔐 JWT VERIFY FUNCTION
# =========================================

from fastapi import Depends, Header

# main.py ke verify_token function mein
def verify_token(authorization: str = Header(None)):
    # Ye line left se 4 spaces andar honi chahiye
    if not authorization:
        raise HTTPException(401, "Token missing")
    
    try:
        # Ye 'token' wali line 8 spaces andar honi chahiye
        token = authorization.split(" ")[1]
        return {"user_id": "test_user"}
    except Exception as e:
        print(f"Auth Error: {e}")
        return {"user_id": "test_user"}

# =========================================
# 📊 PLAN CONFIG
# =========================================

PLAN_LIMITS = {
    "STARTER": 500,
    "PRO": 2000,
    "PREMIUM": 999999
}

PLAN_DURATION_DAYS = {
    "MONTHLY": 30,
    "YEARLY": 365
}

# main.py mein PLAN_MAPPING ko update karein
PLAN_MAPPING = {
    # STARTER
    "STARTER_MONTHLY": os.getenv("PLAN_STARTER_M"),
    "STARTER_YEARLY": os.getenv("PLAN_STARTER_Y"),

    # PRO
    "PRO_MONTHLY": os.getenv("PLAN_PRO_M"),
    "PRO_YEARLY": os.getenv("PLAN_PRO_Y"),

    # PREMIUM
    "PREMIUM_MONTHLY": os.getenv("PLAN_PREMIUM_M"),
    "PREMIUM_YEARLY": os.getenv("PLAN_PREMIUM_Y")
}



# =========================================
# 📦 MODELS
# =========================================
class ProductCreate(BaseModel):
    business_id: str
    name: str
    price: float # Ye 99 aur 99.50 dono le lega
    description: str | None = "No description"
    image_url: str | None = None
    category: str | None = "General"
    stock_quantity: int | None = 0


class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    description: str | None = None
    category: str | None = None
    stock_quantity: int | None = None


class WhatsAppMessage(BaseModel):
    biz_id: str
    phone: str
    message: str


class SubscriptionRequest(BaseModel):
    biz_id: str
    plan_key: str



# =========================================
# 🔥 LEAD SCORING
# =========================================

def score_lead(message: str):

    score = 30
    msg = message.lower()

    keyword_weights = {
        "price": 20,
        "buy": 25,
        "order": 25,
        "bulk": 20,
        "demo": 15,
        "discount": 15,
        "quotation": 20
    }

    for word, weight in keyword_weights.items():
        if word in msg:
            score += weight

    if score >= 75:
        classification = "Hot"
    elif score >= 50:
        classification = "Warm"
    else:
        classification = "Cold"

    follow_up = score >= 60

    return score, classification, follow_up


# =========================================
# 🚦 RATE LIMIT
# =========================================

def check_rate_limit(cur, biz_id):

    cur.execute("""
        SELECT COUNT(*) as count
        FROM usage_logs
        WHERE business_id=%s
        AND created_at > NOW() - INTERVAL '10 seconds'
    """, (biz_id,))

    result = cur.fetchone()

    if result is None:
        recent = 0
    else:
        recent = result["count"]

    if recent > 5:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please slow down."
        )


# =========================================
# 💳 CREATE SUBSCRIPTION
# =========================================

@app.post("/create-subscription")
def create_subscription(data: SubscriptionRequest):

    try:

        subscription = razorpay_client.subscription.create({
            "plan_id": PLAN_MAPPING[data.plan_key],
            "total_count": 12
        })

        print("Subscription ID:", subscription["id"])

        return {
            "subscription_id": subscription["id"]
        }

    except Exception as e:

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================
# 🔔 RAZORPAY WEBHOOK
# =========================================

@app.post("/webhook")
async def razorpay_webhook(request: Request):

    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")

    generated_signature = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(generated_signature, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    payload = json.loads(body)
    event = payload["event"]

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    if event == "subscription.activated":

        subscription = payload["payload"]["subscription"]["entity"]
        subscription_id = subscription["id"]

        cur.execute("""
            SELECT subscription_interval
            FROM businesses
            WHERE razorpay_subscription_id=%s
        """, (subscription_id,))

        biz = cur.fetchone()

        interval = biz["subscription_interval"] if biz else "MONTHLY"
        days = PLAN_DURATION_DAYS.get(interval, 30)

        cur.execute(f"""
            UPDATE businesses
            SET subscription_status='active',
                subscription_end_date = NOW() + INTERVAL '{days} days'
            WHERE razorpay_subscription_id=%s
        """, (subscription_id,))


    if event == "subscription.charged":

        payment = payload["payload"]["payment"]["entity"]

        amount = payment["amount"] / 100
        payment_id = payment["id"]
        subscription_id = payment["subscription_id"]

        cur.execute("""
            INSERT INTO payments
            (business_id, razorpay_payment_id, razorpay_subscription_id, amount, status)
            SELECT id, %s, %s, %s, 'paid'
            FROM businesses
            WHERE razorpay_subscription_id=%s
        """, (payment_id, subscription_id, amount, subscription_id))

    conn.commit()
    conn.close()

    return {"status": "ok"}

@app.post("/google-login")
async def google_login(data: dict):
    # 1. Frontend se token mil raha hai
    token = data.get("token")
    
    # 2. Testing ke liye hum database se ek real Business ID bhej rahe hain
    # 🚨 APNE DATABASE (PostgreSQL) SE EK REAL UUID COPY KARKE YAHAN DALO
    # Example: "89bd6033-xxxx-xxxx-xxxx"
    
    return {
        "status": "success",
        "token": token,
        "business_id": "622bb52f-af29-4615-874f-ac49b3328b6c" # 👈 TERI REAL ID YAHAN AYEYGI
    }

# =========================================
# 🤖 WHATSAPP AI ENGINE (SMART VERSION)
# =========================================

# main.py - Smart Sales AI Update

@app.post("/whatsapp-webhook")
def whatsapp_webhook(data: WhatsAppMessage, user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    print(f"🚀 Webhook triggered for Biz: {data.biz_id}, Message: {data.message}")

    try:
        # 1. Fetch Business Info
        cur.execute("SELECT name, ai_tone, ai_prompt FROM businesses WHERE id=%s", (data.biz_id,))
        biz = cur.fetchone()
        biz_name = biz["name"] if biz else "Our Store"
        ai_tone = biz.get("ai_tone", "professional") if biz else "professional"

        # 2. Fetch Product Catalog
        cur.execute("SELECT name, price, description FROM products WHERE business_id=%s", (data.biz_id,))
        products = cur.fetchall()
        
        if products:
            catalog_text = "Our Products:\n"
            for p in products:
                catalog_text += f"- {p['name']}: ₹{p['price']} - {p['description']}\n"
        else:
            catalog_text = "Products catalog is being updated."

        # 3. Fetch Last 8 messages (Correct order - ASC)
        cur.execute("""
            SELECT role, content FROM conversation_history 
            WHERE business_id=%s AND customer_phone=%s 
            ORDER BY created_at ASC
            LIMIT 8
        """, (data.biz_id, data.phone))
        history = cur.fetchall()

        # 4. Build conversation history string
        history_lines = []
        for h in history:
            role_label = "Customer" if h["role"] == "user" else "Sales Agent"
            history_lines.append(f"{role_label}: {h['content']}")
        history_text = "\n".join(history_lines) if history_lines else ""

        # 5. Smart System Prompt - Catalog sirf tabhi dikhao jab zaroorat ho
        system_prompt = f"""You are a smart, friendly sales agent for {biz_name}.
Tone: {ai_tone}

STRICT RULES:
1. Detect the customer's language automatically and ALWAYS reply in THAT SAME language.
2. Answer the customer's SPECIFIC question directly. Do NOT give generic responses.
3. ONLY show product catalog/prices when customer EXPLICITLY asks about: products, price, catalog, buy, order, kya milta hai, kya hai, etc.
4. For greetings (Hi, Hello, Namaste, Hii, Hey) - just greet back warmly and ask how you can help. DO NOT show catalog.
5. For complaints or issues - empathize and help solve the problem.
6. For pricing queries - show relevant products from catalog.
7. Keep responses SHORT and conversational (2-4 lines max unless showing catalog).
8. Never repeat the same response. Always respond to what the customer JUST said.

CATALOG (only use when asked):
{catalog_text}

CONVERSATION SO FAR:
{history_text}"""

        # 6. Current customer message
        prompt = f"{system_prompt}\n\nCustomer: {data.message}\nSales Agent:"

        # 7. Gemini API Call
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.0-flash-lite",
                contents=prompt
            )
            
            if (response.candidates and 
                len(response.candidates) > 0 and 
                response.candidates[0].content.parts):
                reply = response.text.strip()
                # Remove "Sales Agent:" prefix agar Gemini ne add kar diya
                if reply.startswith("Sales Agent:"):
                    reply = reply.replace("Sales Agent:", "").strip()
            else:
                print(f"⚠️ Gemini empty response, finish_reason: {response.candidates[0].finish_reason if response.candidates else 'unknown'}")
                reply = f"Hello! I'm from {biz_name}. How can I help you today?"
                
        except Exception as gem_e:
            print(f"❌ Gemini API Error: {gem_e}")
            reply = f"Sorry, I'm having a small issue. Please try again in a moment!"

        # 8. Save conversation history
        cur.execute("""
            INSERT INTO conversation_history 
            (business_id, customer_phone, role, content) 
            VALUES (%s, %s, 'user', %s)
        """, (data.biz_id, data.phone, data.message))
        
        cur.execute("""
            INSERT INTO conversation_history 
            (business_id, customer_phone, role, content) 
            VALUES (%s, %s, 'assistant', %s)
        """, (data.biz_id, data.phone, reply))

        # 9. Lead Scoring
        score, classification, _ = score_lead(data.message)
        cur.execute("""
            INSERT INTO leads (business_id, customer_phone, classification, latest_intent)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (customer_phone) DO UPDATE 
            SET classification=EXCLUDED.classification, 
                latest_intent=EXCLUDED.latest_intent,
                updated_at=NOW()
        """, (data.biz_id, data.phone, classification, data.message[:100]))

        conn.commit()
        print(f"✅ Reply sent: {reply[:80]}...")

    except Exception as e:
        print(f"🔥 Backend Crash: {e}")
        import traceback
        traceback.print_exc()
        reply = "Service temporary issue. Please try again."
    finally:
        conn.close()

    return {"reply": reply}

# =========================================
# 📊 INVESTOR METRICS
# =========================================

@app.get("/admin/investor-metrics")
def investor_metrics():

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute(
        "SELECT COUNT(*) as count FROM businesses WHERE subscription_status='active'"
    )

    active = cur.fetchone()["count"]

    cur.execute("""
        SELECT COUNT(*) as total,
               SUM(CASE WHEN plan_tier='STARTER' THEN 1 ELSE 0 END) as starter,
               SUM(CASE WHEN plan_tier='PRO' THEN 1 ELSE 0 END) as pro,
               SUM(CASE WHEN plan_tier='PREMIUM' THEN 1 ELSE 0 END) as premium
        FROM businesses
        WHERE subscription_status='active'
    """)

    breakdown = cur.fetchone()

    PRICING = {
        "STARTER": 999,
        "PRO": 1999,
        "PREMIUM": 4999
    }

    mrr = (
        breakdown["starter"] * PRICING["STARTER"] +
        breakdown["pro"] * PRICING["PRO"] +
        breakdown["premium"] * PRICING["PREMIUM"]
    )

    arr = mrr * 12

    cur.execute(
        "SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='paid'"
    )

    revenue = cur.fetchone()["total"]

    conn.close()

    return {
        "active_subscribers": active,
        "MRR": mrr,
        "ARR": arr,
        "total_revenue": revenue
    }


# =========================================
# 📊 GET LEADS
# =========================================

@app.get("/leads/{business_id}")
def get_leads(business_id: str, user = Depends(verify_token)):

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT *
        FROM leads
        WHERE business_id=%s
    """, (business_id,))

    leads = cur.fetchall()

    conn.close()

    return leads

@app.put("/products/{product_id}")
def edit_product(product_id: str, data: ProductCreate, user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE products 
        SET name=%s, price=%s, description=%s, image_url=%s, stock_quantity=%s
        WHERE id=%s
    """, (data.name, data.price, data.description, data.image_url, data.stock_quantity, product_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Product updated!"}

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    os.makedirs("static/products", exist_ok=True)
    file_path = f"static/products/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Ye URL return karega jo DB mein save hoga
    return {"url": f"http://127.0.0.1:8000/{file_path}"}

@app.get("/products/{business_id}")
def get_products(business_id: str, user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM products WHERE business_id=%s ORDER BY created_at DESC", (business_id,))
    products = cur.fetchall()
    conn.close()
    return products

@app.post("/products")
def create_product(product: ProductCreate, user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    if product.business_id == "null" or not product.business_id:
        raise HTTPException(status_code=400, detail="Valid Business ID is required")
    cur.execute("""
        INSERT INTO products 
        (business_id, name, price, description, image_url, category, stock_quantity)
        VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *
    """, (product.business_id, product.name, product.price, product.description, 
          product.image_url, product.category, product.stock_quantity))
    new_p = cur.fetchone()
    conn.commit()
    conn.close()
    return new_p

@app.put("/products/{product_id}")
def edit_product(product_id: str, data: ProductCreate, user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE products 
        SET name=%s, price=%s, description=%s, image_url=%s
        WHERE id=%s
    """, (data.name, data.price, data.description, data.image_url, product_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Product updated!"}
# =========================================
# UPDATE AI SETTINGS
# =========================================

class AISettingsUpdate(BaseModel):
    biz_id: str
    ai_tone: str
    ai_language: str | None = "English" # 👈 Ise optional kar do ya default value de do
    ai_prompt: str


@app.put("/ai-settings")
def update_ai_settings(data: AISettingsUpdate):

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        UPDATE businesses
        SET ai_tone=%s,
            ai_language=%s,
            ai_prompt=%s
        WHERE id=%s
    """, (
        data.ai_tone,
        data.ai_language,
        data.ai_prompt,
        data.biz_id
    ))

    conn.commit()
    conn.close()

    return {"status": "updated"}

# =========================================
# 📦 DELETE PRODUCT
# =========================================

@app.delete("/products/{product_id}")
def delete_product(product_id: str):

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM products
        WHERE id=%s
    """, (product_id,))

    conn.commit()
    conn.close()

    return {"status": "deleted"}
# =========================================
# GET BUSINESS
# =========================================

@app.get("/business/{business_id}")
def get_business(business_id: str):
    conn = get_db() # Humara banaya hua function use karo
    cur = conn.cursor(cursor_factory=RealDictCursor) # Dict cursor zaroori hai

    cur.execute(
        "SELECT id, name, plan_tier FROM businesses WHERE id = %s",
        (business_id,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {"id": business_id, "name": "Nexora AI", "plan_tier": "STARTER"}

    return row # Ab ye sahi JSON dega


# =========================================
# GET CHAT HISTORY
# =========================================

@app.get("/chat-history/{business_id}/{phone}")
def get_chat_history(business_id: str, phone: str, user = Depends(verify_token)):

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT role, content, created_at
        FROM conversation_history
        WHERE business_id=%s AND customer_phone=%s
        ORDER BY created_at ASC
    """, (business_id, phone))

    history = cur.fetchall()

    conn.close()

    return history

# =========================================
# GET CURRENT USER INFO
# =========================================

@app.get("/me/{business_id}")
def get_me(business_id: str):

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT name, email
        FROM users
        WHERE business_id=%s
        LIMIT 1
    """, (business_id,))

    user = cur.fetchone()

    cur.execute("""
        SELECT plan_tier, subscription_status
        FROM businesses
        WHERE id=%s
    """, (business_id,))

    biz = cur.fetchone()

    conn.close()

    return {
        "name": user["name"] if user else "",
        "email": user["email"] if user else "",
        "plan": biz["plan_tier"] if biz else "",
        "subscription_status": biz["subscription_status"] if biz else ""
    }

@app.get("/analytics/{business_id}")
def get_analytics(business_id: str, user = Depends(verify_token)):


    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # total messages
    cur.execute("""
        SELECT COUNT(*) as total
        FROM conversation_history
        WHERE business_id=%s AND role='user'
    """, (business_id,))
    total_messages = cur.fetchone()["total"]

    # total replies
    cur.execute("""
        SELECT COUNT(*) as total
        FROM conversation_history
        WHERE business_id=%s AND role='assistant'
    """, (business_id,))
    total_replies = cur.fetchone()["total"]

    # leads
    cur.execute("""
        SELECT COUNT(*) as total
        FROM leads
        WHERE business_id=%s
    """, (business_id,))
    total_leads = cur.fetchone()["total"]

    # hot leads
    cur.execute("""
        SELECT COUNT(*) as total
        FROM leads
        WHERE business_id=%s AND classification='Hot'
    """, (business_id,))
    hot_leads = cur.fetchone()["total"]

    # warm leads
    cur.execute("""
        SELECT COUNT(*) as total
        FROM leads
        WHERE business_id=%s AND classification='Warm'
    """, (business_id,))
    warm_leads = cur.fetchone()["total"]

    # cold leads
    cur.execute("""
        SELECT COUNT(*) as total
        FROM leads
        WHERE business_id=%s AND classification='Cold'
    """, (business_id,))
    cold_leads = cur.fetchone()["total"]

    # products count
    cur.execute("""
        SELECT COUNT(*) as total
        FROM products
        WHERE business_id=%s
    """, (business_id,))
    products = cur.fetchone()["total"]

    conn.close()

    return {
        "total_messages": total_messages,
        "total_replies": total_replies,
        "total_leads": total_leads,
        "hot_leads": hot_leads,
        "warm_leads": warm_leads,
        "cold_leads": cold_leads,
        "products": products
    }
#

# 1. Dashboard ke liye summary route (Missing in your code)
@app.get("/me")
def get_current_user_info(user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT name, email, business_id FROM users WHERE id=%s", (user["user_id"],))
    res = cur.fetchone()
    conn.close()
    return res

# 2. Test Lead Generator (Dashboard ko 0 se hatane ke liye)
@app.post("/generate-test-lead/{biz_id}")
def generate_test_lead(biz_id: str):
    conn = get_db()
    cur = conn.cursor()
    # Ek dummy Hot lead insert karein taaki revenue show ho
    cur.execute("""
        INSERT INTO leads (business_id, customer_phone, classification, latest_intent, conversion_chance)
        VALUES (%s, '919999999999', 'Hot', 'Interested in Premium Plan', 85)
        ON CONFLICT DO NOTHING
    """, (biz_id,))
    conn.commit()
    conn.close()
    return {"status": "Lead generated! Refresh Dashboard."}
@app.put("/update-business/{biz_id}")
def update_business(biz_id: str, data: dict, user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor()
    
    # Business name update query
    cur.execute("UPDATE businesses SET name=%s WHERE id=%s", (data.get("name"), biz_id))
    
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Business name updated!"}
# main.py mein add karein
@app.get("/billing-history/{biz_id}")
def get_billing(biz_id: str, user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    # Maan lijiye aapki table ka naam 'subscriptions' ya 'payments' hai
    cur.execute("SELECT plan_key, status, amount, created_at FROM subscriptions WHERE business_id = %s ORDER BY created_at DESC", (biz_id,))
    history = cur.fetchall()
    conn.close()
    return history

@app.put("/products/{product_id}")
async def update_product(product_id: str, product: ProductCreate, user = Depends(verify_token)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE products 
        SET name=%s, price=%s, description=%s, image_url=%s, stock_quantity=%s
        WHERE id=%s AND business_id=%s
    """, (product.name, product.price, product.description, product.image_url, product.stock_quantity, product_id, product.business_id))
    conn.commit()
    conn.close()
    return {"status": "success"}