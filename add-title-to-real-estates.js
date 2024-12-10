const { MongoClient } = require('mongodb');
const neighbourhoods = [
    {
        "nameEn": "Shemiran",
        "nameFa": "شمیران"
    },
    {
        "nameEn": "Niavaran",
        "nameFa": "نیاوران"
    },
    {
        "nameEn": "Qeytarieh",
        "nameFa": "قیطریه"
    },
    {
        "nameEn": "Darak",
        "nameFa": "درکه"
    },
    {
        "nameEn": "Velenjak",
        "nameFa": "ولنجک"
    },
    {
        "nameEn": "Darband",
        "nameFa": "دربند"
    },
    {
        "nameEn": "Zaferanieh",
        "nameFa": "زعفرانیه"
    },
    {
        "nameEn": "Elahieh",
        "nameFa": "الهیه"
    },
    {
        "nameEn": "Farmanieh",
        "nameFa": "فرمانیه"
    },
    {
        "nameEn": "Dibaji",
        "nameFa": "دیباجی"
    },
    {
        "nameEn": "Kamranieh",
        "nameFa": "کامرانیه"
    },
    {
        "nameEn": "Pasdaran",
        "nameFa": "پاسداران"
    },
    {
        "nameEn": "Vanak",
        "nameFa": "ونک"
    },
    {
        "nameEn": "Zargandeh",
        "nameFa": "زرگنده"
    },
    {
        "nameEn": "Qolleh-ye Kollah",
        "nameFa": "قلهک"
    },
    {
        "nameEn": "Aryashahr",
        "nameFa": "آریاشهر"
    },
    {
        "nameEn": "Saadat Abad",
        "nameFa": "سعادت آباد"
    },
    {
        "nameEn": "Tajrish",
        "nameFa": "تجریش"
    },
    {
        "nameEn": "Dorous",
        "nameFa": "دروس"
    },
    {
        "nameEn": "Lavasan",
        "nameFa": "لواسان"
    },
    {
        "nameEn": "Farahzad",
        "nameFa": "فرشته"
    },
    {
        "nameEn": "Ekbatan",
        "nameFa": "اکباتان"
    },
    {
        "nameEn": "Gisha",
        "nameFa": "گیشا"
    },
    {
        "nameEn": "Mehrshahr",
        "nameFa": "مهرشهر"
    },
    {
        "nameEn": "Pardis",
        "nameFa": "پردیس"
    },
    {
        "nameEn": "Shahrak-e Gharb",
        "nameFa": "شهرک غرب"
    },
    {
        "nameEn": "Khayyam-e Villa",
        "nameFa": "خیابان ویلا"
    },
    {
        "nameEn": "Jamaran",
        "nameFa": "جماران"
    },
    {
        "nameEn": "Golbarg",
        "nameFa": "گلبرگ"
    },
    {
        "nameEn": "Baharistan",
        "nameFa": "بهارستان"
    },
    {
        "nameEn": "Ovin",
        "nameFa": "اوین"
    },
    {
        "nameEn": "Louizan",
        "nameFa": "لویزان"
    },
    {
        "nameEn": "Damavand",
        "nameFa": "دماوند"
    },
    {
        "nameEn": "Sarkheh Hasar",
        "nameFa": "سرخه حصار"
    },
    {
        "nameEn": "Shahr-e Iran",
        "nameFa": "شهران"
    },
    {
        "nameEn": "Pardisan",
        "nameFa": "پردیسان"
    }
]

const realEstateFaData = {
    "amenityStatus": {
        "full": "فول",
        "full+": "فول پلاس"
    },
    "accessibility": {
        "office": "دفتر",
        "public": "تعاون",
        "private": "شخصی"
    },
    "occupancyStatus": {
        "vacant": "تخلیه",
        "occupied": "در دست مستجر",
        "underRenovation": "در حال بازسازی"
    },
    "suitability": {
        "singles": "مجرد",
        "couples": "زوج",
        "families": "خانواده",
        "students": "دانشجو"
    },
    "category": {
        "apartment": "آپارتمان",
        "villa": "ویلا",
        "office": "اداری و تجاری",
        "land": "زمین و کلنگی",
        "shop": "مغازه"
    },
    "type": {
        "sell": "فروش",
        "rent": "اجاره",
        "presell": "پیش فروش",
        "apartment": "realEstate.type.apartment"
    },
    "isChangeable": {
        "true": "هست",
        "false": "نیست"
    },
    "errors": {
        "not_found": "فایل یافت نشد"
    }
}

const customerFaData = {
    "type": {
        "buy": "خرید",
        "rent": "اجاره",
        "prebuy": "پیش فروش"
    },
    "accessibility": {
        "office": "دفتر",
        "public": "تعاون",
        "private": "شخصی"
    },
    "isChangeable": {
        "true": {
            "list": "قابل تبدیل",
            "details": "هست"
        },
        "false": {
            "list": "غیر قابل تبدیل",
            "details": "نیست"
        }
    },
    "errors": {
        "not_found": "مشتری یافت نشد"
    }
}

// Replace 'your-mongodb-uri' with your actual MongoDB connection URI
// const uri = 'mongodb://levi-stage:ihFZZ6oCO1EDqEn@188.121.101.97:27017/melkapo_core?authSource=melkapo_core';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to generate a real estate title
function generateCustomerTitle(
    type,
    category
) {
    return `نیاز به ${customerFaData.type[type]} ${realEstateFaData.category[category]}`
}

async function updateRealEstateTitles() {
    try {
        await client.connect();

        const database = client.db('melkapo_core');
        const customersCollection = database.collection('customers');

        // Fetch all real estates from the "realestates" collection
        const customersCursor = customersCollection.find();
        const customers = await customersCursor.toArray();
        // Update each real estate document with a new title
        for (const customer of customers) {
            const { _id, type, category, title } = customer;
            const [prefix, ...rest] = title.split(' ')
            const keys = [...rest, ...customer.neighbourhoods.map(neighbourhood => {
                return neighbourhoods.find(n => n.nameEn === neighbourhood).nameFa
            })]
            let suffixes = makeSuffixes(keys);
            // const newTitle = generateCustomerTitle(type, category)
            // Update the document with the new title
            await customersCollection.updateOne({ _id }, { $set: { suffixes } });

            console.log(`Updated title for customres ${_id}`);
        }

        console.log('All titles updated successfully.');
    } catch (error) {
        console.error('Error updating titles:', error);
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
}

function makeSuffixes(values) {
    const resultSet = new Set()

    values
        .sort()
        .reverse()
        .forEach((val) => {
            let tmp
            for (let i = val.length - 1; i > 2; i--) {
                tmp = val.substr(0, i)
                resultSet.add(tmp)
            }
        })

    return [...resultSet, ...values]
}

// Call the function to update real estate titles
updateRealEstateTitles();
