
## תוכנית אינטגרציית PayPal Checkout לסדנה

### מטרה
שלב PayPal Checkout Button בכפתור "אני נרשם/ת עכשיו" ב-DetailsSection כדי לאפשר תשלום עבור הסדנה בחזית ובאופן מאובטח.

### שלבים

#### 1️⃣ הפעלת Lovable Cloud (חזית)
- הפעל Lovable Cloud בהגדרות הפרויקט (Project Settings > Cloud)
- זה יאפשר אחסון מאובטח של מפתחות PayPal ויצירת Edge Functions

#### 2️⃣ אחסון מפתחות PayPal בCloud (חזית)
- שמור את PayPal Client ID ו-Secret Key בהגדרות Cloud Secrets
- המפתחות יהיו זמינים לקוד האתר ול-Edge Functions בצורה מאובטחת

#### 3️⃣ יצירת Edge Function לתשלום PayPal (Backend)
- נוצור Edge Function בשם `create-paypal-order` ב-`supabase/functions/create-paypal-order/index.ts`
- הפונקציה תקבל פרטי הסדנה (תאריך, שם משתתף וכו')
- תשדר בקשה ל-PayPal API כדי ליצור order וההחזר את ה-order ID
- Edge Function תכללו CORS headers כי היא תיקראת מהדפדפן

#### 4️⃣ עדכון DetailsSection
- הוסף state עבור פרטי משתתף (שם, אימייל וכו')
- החלף את כפתור "אני נרשם/ת עכשיו" בPayPal Checkout Button
- כשמשתמש לוחץ על הכפתור:
  - ValidationCallbacks יוודא שפרטי משתתף חוקיים
  - יקרא ל-`create-paypal-order` Edge Function
  - יאתחל PayPal Checkout עם ה-Order ID שהתקבל
  - לאחר אישור התשלום, יציג הודעת הצלחה

#### 5️⃣ הצגת טופס הרשמה (Frontend)
- קודם ל-PayPal Button, הוסף שדות קלט קטנים (שם, אימייל, מספר טלפון)
- זה יאפשר לך לקשר בקלות כל תשלום למשתתף בפועל

### ארכיטקטורה

```text
┌─────────────────────────────────────────┐
│      DetailsSection (React)             │
│  ┌──────────────────────────────────┐   │
│  │  Participant Info Form           │   │
│  │  (Name, Email, Phone)            │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  PayPal Checkout Button          │   │
│  │  onClick -> Create Order         │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         │ API Call
         ▼
┌─────────────────────────────────────────┐
│  Edge Function: create-paypal-order     │
│  (Secure Backend)                       │
│  - Validates participant data           │
│  - Calls PayPal API                     │
│  - Returns Order ID                     │
└─────────────────────────────────────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────────────────────────┐
│      PayPal Servers                     │
│  - Creates payment order                │
│  - Returns authorization details       │
└─────────────────────────────────────────┘
```

### הימנעויות מסכנות
- **לא** נשמור סודות PayPal בקוד (צד ישן)
- **לא** נקרא ישירות מה-SDK של PayPal צד ישן כי זה לא בטוח
- **לא** נשלח כספים בדרך כלשהי מ-Edge Function

### דברים שלא יתבררו בשלב זה
- טיפול בהצלחת/כישלון התשלום (יעשה בשלב ההטמעה)
- שמירת נתוני משתתפים למסד נתונים
- דוחות תשלומות

### סדר ביצוע
1. הפעל Lovable Cloud ושמור את מפתחות PayPal
2. צור את Edge Function `create-paypal-order`
3. עדכן את DetailsSection להכלול form + PayPal Button
4. בדוק שהתוכנית מעבדת סדר הזמנה מהbrowser
