

## ייבוא נתוני נרשמים מ-PayPal למערכת

מהתמונה שהעלית, אני רואה 3 נרשמים ששילמו דרך PayPal:
1. **ליאן אבו אלהיג'א** - 12/02/2026, 17:56
2. **Nasr Assi** - 11/02/2026, 15:32
3. **רותם גרוסמן** - 10/02/2026, 15:43

### מה נעשה

אצור פונקציית שרת זמנית בשם `import-paypal-transactions` שתתחבר ל-PayPal API, תשלוף את כל העסקאות האחרונות (כולל שם, אימייל, טלפון, סכום, מטבע), ותשמור אותן בטבלת ה-registrations.

### שלבים:
1. **יצירת Edge Function** - `import-paypal-transactions` שתבצע:
   - חיבור ל-PayPal Transactions API (`/v1/reporting/transactions`) עם טווח תאריכים מ-10/02 עד היום
   - שליפת כל פרטי העסקה: שם משלם, אימייל, טלפון, סכום, מטבע, מזהה עסקה
   - שמירת כל עסקה מוצלחת בטבלת `registrations` (עם upsert לפי `paypal_order_id` כדי למנוע כפילויות)
2. **הרצת הפונקציה** פעם אחת לייבוא הנתונים
3. **מחיקת הפונקציה** לאחר ההרצה (שמירה על אבטחה)
4. **רענון דף האדמין** - הנתונים יופיעו בטבלה

### פרטים טכניים
- שימוש ב-PayPal Reporting/Transactions API עם ה-credentials הקיימים (`PAYPAL_CLIENT_ID`, `PAYPAL_SECRET_KEY`)
- Endpoint: `GET /v1/reporting/transactions` עם `start_date` ו-`end_date`
- שמירה באמצעות Supabase Service Role Key (עקיפת RLS)
- שדות שיישלפו: `payer_info.payer_name`, `payer_info.email_address`, `payer_info.phone`, `transaction_amount`, `transaction_id`

