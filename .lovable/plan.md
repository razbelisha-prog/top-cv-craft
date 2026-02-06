

# תיקון פרטי PayPal - Client ID

## הבעיה שזוהתה

ה-PayPal Client ID בקובץ `index.html` שונה מהערך שסיפקת. יש טעויות קטנות באותיות:

| מיקום | ערך נוכחי | ערך נכון |
|-------|-----------|----------|
| index.html | `Adqk6iO**I**DqJPdQ6U2IA1CF5kdTcyZOwa6A_RaVXCAObHqZ_6mQ2aFUz3IEreq-qPRthEog1bGj7LS**I**SK` | `Adqk6iO**l**DqJPdQ6U2IA1CF5kdTcyZOwa6A_RaVXCAObHqZ_6mQ2aFUz3IEreq-qPRthEog1bGj7LS**i**SK` |

שני הבדלים עיקריים:
- האות `I` (גדולה) צריכה להיות `l` (L קטנה) במיקום אחד
- האות `I` (גדולה) צריכה להיות `i` (קטנה) במיקום נוסף

## שלבי התיקון

### שלב 1: עדכון Client ID בקובץ index.html
עדכון שורה 9 עם ה-Client ID הנכון:
```html
<script src="https://www.paypal.com/sdk/js?client-id=Adqk6iOlDqJPdQ6U2IA1CF5kdTcyZOwa6A_RaVXCAObHqZ_6mQ2aFUz3IEreq-qPRthEog1bGj7LSiSK&currency=ILS&enable-funding=card,venmo&disable-funding=paylater"></script>
```

### שלב 2: עדכון Secrets ב-Backend
יש לוודא שהסודות מעודכנים עם הערכים הנכונים:
- `PAYPAL_CLIENT_ID` = `Adqk6iOlDqJPdQ6U2IA1CF5kdTcyZOwa6A_RaVXCAObHqZ_6mQ2aFUz3IEreq-qPRthEog1bGj7LSiSK`
- `PAYPAL_SECRET_KEY` = `EA5LQva5cIoGYzBi6KmwMevL_L8e6QJFvwDXEHVe_ZCSzhQ5WfZwsefSNvOnvfUs1BOKiceinKVse0yV`

## קובץ שיושפע

| פעולה | קובץ |
|-------|------|
| עדכון | `index.html` |

## פעולות נוספות נדרשות
לאחר אישור התוכנית, אבקש ממך לעדכן גם את הסודות עם הערכים הנכונים דרך כלי ה-secrets.

