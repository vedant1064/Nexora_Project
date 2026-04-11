const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

// 1. Existing Analytics Function
export async function getAnalytics(businessId) {
  if (!businessId) throw new Error("No business ID found");
  const res = await fetch(`${BASE_URL}/analytics/${businessId}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Analytics fetch failed");
  return await res.json();
}

// 2. Leads Logic
export async function getLeads(businessId) {
  const res = await fetch(`${BASE_URL}/leads/${businessId}`, {
    headers: getHeaders()
  });
  return await res.json();
}

// 3. Products Logic
export async function getProducts(businessId) {
  const res = await fetch(`${BASE_URL}/products/${businessId}`, {
    headers: getHeaders()
  });
  return await res.json();
}

export async function addProduct(businessId, productData) {
  const res = await fetch(`${BASE_URL}/products/${businessId}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(productData)
  });
  return await res.json();
}

// 4. AI Live Chat Logic
export async function sendChatMessage(businessId, message) {
  const res = await fetch(`${BASE_URL}/chat/${businessId}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ message })
  });
  return await res.json();
}