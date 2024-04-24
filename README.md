# Pasargad IPG Client (2024) - درگاه بانک پاسارگاد (نسخه جدید)
تا این لحظه نسخه رسمی توسط شرکت منتشر نشده پس فعلا با این کار راه بندازید.
سعی کنید کلاینت  singleton بسازید تا از مزایای توکن بهره مند بشید.

## پیش نیاز
برای استفاده به username, password جدید احتیاج دارید که اگه هنوز پیامک نشده میتونید تیکت بزنید. فقط دقت کنید حتما موضوع راهنمایی پیاده سازی درگاه انتخاب کنید تا سریع جواب بگیرید
[my.pep.co.ir](https://my.pep.co.ir/)

## نصب
``` js
npm i @kav3/pep
```

## روش استفاده
برای انجام خرید باید مراحل زیر رو انجام بدید

ارسال درخواست با purchase

ذخیره مقدار urlId و ارسال کاربر به url جهت انجام تراکنش

وقتی کاربر از درگاه به سایت برگشت به یکی از روش های confirm یا verify تراکنش را تایید کنید

CALLBACK_URL?invoiceId=10001&status=success&referenceNumber=142536124562&trackId=123456

با این invoiceId می تونید تراکنش رو از دیتابیس پیدا کنید و تایید کنید. 
در confirm تراکنش درجا تایید میشه ولی در verify زمان میبره و تو این زمان می تونید تراکنش را با reverse برگشت بزنید

با inquiry هم میتونید درهر مرحله وضعیت چک کنید

``` js
// username, password, terminal از شرکت بگیرید
// callback: ادرس برگشت به سایت خودتون
// base: آدرس درگاه ممکنه بعدا توسط بانک عوض بشه
// پیش فرض https://pep.shaparak.ir/dorsa1
// exp: زمان اعتبار توکن به میلی ثانیه
// پیش فرض ۱۵ دقیقه
const pep = new Client({ username, password, terminal, callback });

// amount: مبلغ سفارش به ریال
// invoice: شماره منحصر به فرد سفارش
const { resultCode, data: { urlId, url } } = await pep.purchase({ amount, invoice })

// invoiceId: شماره منحصر به فرد سفارش
const { resultCode } = await pep.inquiry(invoiceId)

// invoice: شماره منحصر به فرد سفارش
// urlId: مقداری که بالاتر گرفتیم و ذخیره کردیم 
const { resultCode } = await pep.verify({invoice, urlId})

// invoice: شماره منحصر به فرد سفارش
// urlId: مقداری که بالاتر گرفتیم و ذخیره کردیم 
const { resultCode } = await pep.confirm({invoice, urlId})

// invoice: شماره منحصر به فرد سفارش
// urlId: مقداری که بالاتر گرفتیم و ذخیره کردیم 
const { resultCode } = await pep.reverse({invoice, urlId})
```

### مهم
تراکنش با invoice تکراری بفرستید خطای 13094 می گیرید

اگه به هر دلیل خواستید اطلاعات درگاه رو بگیرید از تابع get استفاده کنید

لازم نیست توکن دستی بگیرید خودش میگیره و تا زمانی که معتبره همونو استفاده میکنه

بجای بازکردن توکن و خوندن  exp از عدد پیش فرض ۱۵ دقیقه برای منقضی کردن توکن استفاده کردم چون نمیخواستم  dependency داشته باشه ولی اگه خواستید بازکنید از این استفاده کنید [@kav3/jwt](https://www.npmjs.com/package/@kav3/jwt) اگر به هر دلیل خواستید عدد پیش فرض رو تغییر بدید از ورودی های کلاینت استفاده کنید


تمامی متدها پیاده سازی نشده، اگه حس کردید لازمه یا مشکلی و سوالی بود  issues بزنید 

### توضیحات در مورد اسامی
پارامترها را مطابق اسناد نوشتم و فقط ممکنه یکی دو جا مثلا بجای terminalNumber نوشته باشم terminal.
واقعا نمیدونم چرا بعضی جاها invoice نوشته بعضی جاها invoiceId

نمیدونم چرا ادرس درگاه dorsa1 احتمالا بعدا عوض میشه پس میتونید اینو از ورودی های کلاینت تغییر بدید

## official documents
تمامی خطاها در انتهای همین فایل هست
[pdf](https://pep.co.ir/wp-content/uploads/2024/01/Parsa-IPG-2.pdf)

