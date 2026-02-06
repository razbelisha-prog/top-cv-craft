
## תוכנית: תשלום בכרטיס אשראי ישיר (PayPal Card Fields) ✅ הושלם

### מה נבנה
נוספה אפשרות לתשלום בכרטיס אשראי ישירות באתר, ללא הפניה ל-PayPal UI.

### ארכיטקטורה

```
Frontend                    Backend (Edge Functions)           PayPal API
   │                              │                               │
   │ 1. loadSDK()                 │                               │
   ├─────────────────────────────►│ get-paypal-client-token       │
   │                              ├──────────────────────────────►│
   │                              │◄──────────────────────────────┤
   │◄─────────────────────────────┤ clientToken + clientId        │
   │                              │                               │
   │ 2. Load SDK with token       │                               │
   │                              │                               │
   │ 3. CardFields.createOrder()  │                               │
   ├─────────────────────────────►│ create-paypal-order           │
   │                              ├──────────────────────────────►│
   │◄─────────────────────────────┤ orderId                       │
   │                              │                               │
   │ 4. SDK handles card input    │                               │
   │    (Tokenization in browser) │                               │
   │                              │                               │
   │ 5. CardFields.submit()       │                               │
   │    (via SDK → PayPal)        ├──────────────────────────────►│
   │                              │◄──────────────────────────────┤
   │◄──────────── onApprove ──────┤                               │
   │                              │                               │
   │ 6. Capture payment           │                               │
   ├─────────────────────────────►│ process-card-payment          │
   │                              ├──────────────────────────────►│
   │◄─────────────────────────────┤ success                       │
```

### Edge Functions

| Function | Purpose |
|----------|---------|
| `get-paypal-client-token` | מחזיר Client Token ו-Client ID לטעינת ה-SDK |
| `create-paypal-order` | יוצר הזמנה ב-PayPal ומחזיר Order ID |
| `process-card-payment` | לוכד את התשלום לאחר אישור הכרטיס |

### קבצים

| File | Purpose |
|------|---------|
| `src/hooks/usePayPalCardFields.ts` | Hook לניהול ה-SDK ושדות הכרטיס |
| `src/components/payment/CardPaymentFields.tsx` | רכיב UI עם שדות התשלום המאובטחים |
| `src/pages/Registration.tsx` | שילוב בזרימת ההרשמה |

### דרישות מוקדמות

לפני השימוש, יש לוודא שבחשבון PayPal:
1. מופעל "Advanced Credit and Debit Card Payments"
2. החשבון הוא Business (לא Personal)
3. המדינה תומכת באפשרות זו

### הערה חשובה

אם PayPal Card Fields לא זמין (בגלל מגבלות אזוריות), המערכת תציג הודעה מתאימה ותאפשר למשתמש לחזור ולבחור תשלום דרך PayPal Checkout.


