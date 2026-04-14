# =========================================
# 🚀 AUTONEX AI - ENTERPRISE v1.2 HARDENED + SMART AI REPLY
# =========================================
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
import shutil
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path

import os
import psycopg2
import razorpay
import hmac
import hashlib
import json
import jwt

from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta, timezone
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import Optional


# =========================================
# 🔧 INIT
# =========================================

load_dotenv()
from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)


app = FastAPI()

os.makedirs("static/products", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# =========================================
# ✅ CORS FIX
# =========================================

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://api.nexoragent.com",
        "https://nexoragent.com",
        "https://www.nexoragent.com",
        "https://nexora-project-one.vercel.app",
    ],  # Filhal debugging ke liye sab allow kar do
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "postgresql://neondb_owner:npg_8ThJBiRqEG9U@ep-blue-leaf-a1yg3384.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")
BUSINESS_ACCOUNT_ID = os.getenv("BUSINESS_ACCOUNT_ID")

from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
# EMAIL CONFIG (PASTE HERE)
mail_conf = ConnectionConfig(
    MAIL_USERNAME="vedantojha22@gmail.com", # Apna email yahan likh do
    MAIL_PASSWORD="Hello@021",         # Abhi ke liye kuch bhi likh do
    MAIL_FROM="vedantojha22@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)



def get_db():
    return psycopg2.connect(DATABASE_URL)

# =========================================
# 🏗️ AUTO-CREATE TABLES ON NEON (Line 78 ke baad dalo)
# =========================================
def init_db():
    conn = get_db()
    cur = conn.cursor()
    try:
        # Apni schema.sql file ko read karo
        with open("schema.sql", "r") as f:
            cur.execute(f.read())
        conn.commit()
        print("✅ Tables initialized on Neon Cloud!")
    except Exception as e:
        print(f"❌ DB Init Error: {e}")
    finally:
        cur.close()
        conn.close()

# Is line ko FastAPI app start hone se pehle execute karo
init_db()

# =========================================
# 🔐 JWT VERIFY FUNCTION
# =========================================

from fastapi import Depends, Header

# main.py ke verify_token function mein
def verify_token(authorization: str = Header(None)):
    # Abhi ke liye sirf ye check karo ki token hai ya nahi
    if not authorization:
        raise HTTPException(401, "Token missing")
    return {"user_id": "authorized"}

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

# =========================================
# 📞 WHATSAPP WEBHOOK VERIFICATION (GET)
# =========================================
from fastapi.responses import Response # <-- Ye sabse upar hona chahiye

@app.get("/whatsapp-webhook")
async def verify_webhook(request: Request):
    params = request.query_params
    if params.get("hub.verify_token") == "nexora_secret_123":
        challenge = params.get("hub.challenge")
        return Response(
            content=challenge, 
            media_type="text/plain",
            headers={"ngrok-skip-browser-warning": "true"}
        )
    return {"error": "Invalid token"}
import uuid 

class PaymentVerifyRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str  # Ab ye frontend se real aayega
    razorpay_signature: str # Ab ye frontend se real aayega
    plan_name: str
    business_id: str

@app.post("/verify-payment")
async def verify_payment(data: PaymentVerifyRequest):
    # 🔐 ASLI SECURITY: Razorpay Signature Check
    try:
        # Ye verify karta hai ki payment sach mein Razorpay se hui hai
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': data.razorpay_order_id,
            'razorpay_payment_id': data.razorpay_payment_id,
            'razorpay_signature': data.razorpay_signature
        })
    except Exception as e:
        print(f"❌ Signature Verification Failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid Payment Signature")

    # 1️⃣ Step: Naya Token Generate Karo (Jo purana 'null' tha wo hat jayega)
    unique_suffix = str(uuid.uuid4())[:8]
    timestamp = int(datetime.now(timezone.utc).timestamp())
    new_whatsapp_token = f"NEX_{data.business_id[:4]}_{unique_suffix}_{timestamp}"

    # 2️⃣ Step: Database Update
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE businesses 
            SET subscription_status = 'active',
                plan_tier = %s,
                whatsapp_token = %s,
                subscription_end_date = NOW() + INTERVAL '30 days'
            WHERE id = %s
        """, (data.plan_name.upper(), new_whatsapp_token, data.business_id))
        
        conn.commit()
        print(f"✅ Subscription Activated for Biz: {data.business_id}")
        return {
            "status": "success",
            "new_token": new_whatsapp_token
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

@app.post("/google-login")
async def google_login(data: dict):
    token = data.get("credential").strip()
    client_id = os.getenv("VITE_GOOGLE_CLIENT_ID") or os.getenv("GOOGLE_CLIENT_ID")
    
    try:
        # Audience fix added here
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            audience=os.getenv("VITE_GOOGLE_CLIENT_ID") or os.getenv("GOOGLE_CLIENT_ID")
        )
        email = idinfo["email"]
        name = idinfo.get("name", "Nexora User")
    except Exception as e:
        print(f"Google Token Verify Error: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute("SELECT business_id FROM users WHERE email=%s", (email,))
        user = cur.fetchone()

        if not user:
            import uuid
            new_biz_id = f"BIZ_{str(uuid.uuid4())[:8]}"
            # Business aur User dono create honge
            cur.execute("INSERT INTO businesses (id, name, plan_tier) VALUES (%s, %s, %s)",
                        (new_biz_id, f"{name}'s Store", "STARTER"))
            cur.execute("INSERT INTO users (email, name, business_id) VALUES (%s, %s, %s)",
                        (email, name, new_biz_id))
            conn.commit()
            business_id = new_biz_id
        else:
            business_id = user["business_id"]

        return {"status": "success", "business_id": business_id}
    finally:
        cur.close()
        conn.close()

# =========================================
# 🤖 WHATSAPP AI ENGINE (SMART VERSION)
# =========================================

# main.py - Smart Sales AI Update

@app.post("/whatsapp-webhook")
async def whatsapp_webhook(request: Request):
    conn = None # 🌟 Pehle hi define kar diya taaki finally block na phate
    try:
        body = await request.json()
        
        # --- BLOCK 1: Meta Webhook Logic ---
        if "entry" in body:
            for entry in body["entry"]:
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    if "messages" in value:
                        message_obj = value["messages"][0]
                        
                        # 🚨 YE LINE ADD KARO (Loop isi se rukega):
                        if "text" not in message_obj:
                            return Response(content="EVENT_RECEIVED", status_code=200)

                        customer_phone = message_obj["from"]
                        text = message_obj.get("text", {}).get("body", "")
                        biz_id = os.getenv("TEST_BIZ_ID")

                        print(f"🚀 AI Processing for: {customer_phone}, Msg: {text}")

                        conn = get_db()
                        cur = conn.cursor(cursor_factory=RealDictCursor)

                        # 1️⃣ Database se 'plan_tier' uthao
                        cur.execute("SELECT name, ai_tone, plan_tier FROM businesses WHERE id=%s", (biz_id,))
                        biz = cur.fetchone()

                        biz_name = biz["name"] if biz else "Our Store"
                        ai_tone = biz.get("ai_tone", "professional") if biz else "professional"
                        current_plan = biz.get("plan_tier", "STARTER") if biz else "STARTER"

                        # 2️⃣ Ab current month ka usage check karo (Ki kitne messages bheje hain)
                        cur.execute("""
                            SELECT COUNT(*) as usage 
                            FROM conversation_history 
                            WHERE business_id=%s AND role='assistant' 
                            AND created_at > date_trunc('month', CURRENT_DATE)
                        """, (biz_id,))
                        usage_data = cur.fetchone()
                        current_usage = usage_data["usage"] if usage_data else 0

                        # 3️⃣ PLAN LIMIT CHECK 🚨
                        # PLAN_LIMITS tumhare code mein upar defined hain (STARTER: 500, PRO: 2000)
                        limit = PLAN_LIMITS.get(current_plan, 500)

                        if current_usage >= limit:
                            print(f"🛑 Limit Reached for {biz_name} ({current_usage}/{limit})")
                            # Customer ko reply nahi jayega, bas Meta ko 200 OK bhej do taaki wo retry na kare
                            return Response(content="PLAN_LIMIT_EXCEEDED", status_code=200)

                        print(f"✅ Plan: {current_plan} | Usage: {current_usage}/{limit}")

                        cur.execute("SELECT name, price, description FROM products WHERE business_id=%s", (biz_id,))
                        products = cur.fetchall()
                        
                        if products:
                            catalog_text = "Our Products:\n" + "\n".join([f"- {p['name']}: ₹{p['price']}" for p in products])
                        else:
                            catalog_text = "Currently updating our catalog with fresh items."

                        system_prompt = f"""You are a sales agent for {biz_name}. 
                        Tone: {ai_tone}. 
                        STRICT RULES: 
                        1. Keep replies under 2-3 short sentences. 
                        2. Use bullet points for products.
                        3. Don't be too robotic.
                        CATALOG: {catalog_text}"""
                        prompt = f"{system_prompt}\n\nCustomer: {text}\nSales Agent:"

                        response = client.models.generate_content(
                            model="gemini-3-flash-preview",
                            contents=[{"role": "user", "parts": [{"text": prompt}]}]
                        )
                        reply = response.text.strip() if response and response.text else "Hello!"

                        import requests
                        url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
                        headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}
                        payload = {
                            "messaging_product": "whatsapp",
                            "to": customer_phone,
                            "type": "text",
                            "text": {"body": reply}
                        }

                        res = requests.post(url, json=payload, headers=headers)
                        print(f"📡 ACTUAL Meta Response: {res.status_code} - {res.json()}")
                        
                        conn.commit()
                        # Yahan close karne ki zaroorat nahi kyunki finally handle karega
                        print(f"✅ Reply Sent and DB Updated")

            # Status updates ke liye response
            return Response(content="EVENT_RECEIVED", status_code=200)

        # --- BLOCK 2: Dashboard Chat Logic (Optional/Legacy) ---
        # Note: Agar data frontend se aa raha hai (WhatsAppMessage model)
        # Ye block tabhi chalega jab upar wala condition fail ho
        data = body # Assuming body matches WhatsAppMessage structure if not from Meta
        
        if not conn:
            conn = get_db()
            cur = conn.cursor(cursor_factory=RealDictCursor)

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=[{"role": "user", "parts": [{"text": data.get("message", "")}]}]
        )
        reply = response.text.strip() if response.text else "Main aapki kya madad kar sakta hoon?"

        cur.execute("INSERT INTO conversation_history (business_id, customer_phone, role, content) VALUES (%s, %s, 'user', %s)", (data.get("biz_id"), data.get("phone"), data.get("message")))
        cur.execute("INSERT INTO conversation_history (business_id, customer_phone, role, content) VALUES (%s, %s, 'assistant', %s)", (data.get("biz_id"), data.get("phone"), reply))

        conn.commit()
        return {"reply": reply}

    except Exception as e:
        print(f"🔥 Error: {e}")
        import traceback
        traceback.print_exc()
        return Response(content="OK", status_code=200)
    finally:
        if conn is not None: # 🔌 Safety Check: Sirf tabhi close hoga jab open hua ho
            conn.close()
            print("🔌 Connection closed safely")

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
async def upload_image(request: Request, file: UploadFile = File(...)):
    os.makedirs("static/products", exist_ok=True)
    file_path = f"static/products/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Ye line VS Code ka error khatam kar degi
    base_url = str(request.base_url).rstrip("/")
    return {"url": f"{base_url}/{file_path}"}

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