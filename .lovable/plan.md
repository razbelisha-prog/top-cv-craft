
## תוכנית: הוספת שדות כרטיס אשראי באתר (PayPal Card Fields) ✅ הושלם

### מה נבנה
נוספה אפשרות לתשלום בכרטיס אשראי ישירות באתר, ללא הפניה ל-PayPal.

### שינויים שבוצעו

#### Edge Functions חדשות
- `get-paypal-client-id/index.ts` - מחזיר את ה-Client ID לטעינת ה-SDK
- `process-card-payment/index.ts` - לוכד את התשלום לאחר אישור הכרטיס

#### קבצים חדשים
- `src/hooks/usePayPalCardFields.ts` - Hook לניהול PayPal SDK ושדות הכרטיס
- `src/components/payment/CardPaymentFields.tsx` - רכיב שדות התשלום

#### עדכונים
- `src/pages/Registration.tsx` - שילוב שדות הכרטיס בזרימת התשלום

### דרישות מוקדמות
לפני השימוש, יש לוודא שבחשבון PayPal:
1. מופעל "Advanced Credit and Debit Card Payments"
2. החשבון הוא Business (לא Personal)
3. המדינה תומכת באפשרות זו

