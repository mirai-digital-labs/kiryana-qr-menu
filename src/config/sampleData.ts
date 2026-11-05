import type { Category, Product } from "../types";

export const SAMPLE_CATEGORIES: Category[] = [
  { id: "cat-flour-rice", nameUr: "آٹا اور چاول", nameEn: "Flour & Rice", emoji: "🍚", sortOrder: 1, active: true },
  { id: "cat-oil-ghee", nameUr: "تیل اور گھی", nameEn: "Oil & Ghee", emoji: "🛢️", sortOrder: 2, active: true },
  { id: "cat-pulses", nameUr: "دالیں اور اناج", nameEn: "Pulses & Grains", emoji: "🫘", sortOrder: 3, active: true },
  { id: "cat-tea-sugar", nameUr: "چائے اور چینی", nameEn: "Tea & Sugar", emoji: "🍵", sortOrder: 4, active: true },
  { id: "cat-dairy", nameUr: "دودھ، مکھن اور انڈے", nameEn: "Dairy & Eggs", emoji: "🥛", sortOrder: 5, active: true },
  { id: "cat-spices", nameUr: "مصالحہ جات", nameEn: "Spices & Salt", emoji: "🧂", sortOrder: 6, active: true },
  { id: "cat-soap", nameUr: "صابن اور سرف", nameEn: "Soap & Detergent", emoji: "🧼", sortOrder: 7, active: true },
  { id: "cat-snacks", nameUr: "بسکٹ اور چپس", nameEn: "Biscuits & Snacks", emoji: "🍪", sortOrder: 8, active: true },
  { id: "cat-drinks", nameUr: "کولڈ ڈرنکس اور شربت", nameEn: "Cold Drinks", emoji: "🥤", sortOrder: 9, active: true },
];

export const SAMPLE_PRODUCTS: Product[] = [
  // Flour & Rice
  { id: "p1", nameUr: "چکی کا آٹا (فریش)", nameEn: "Chakki Atta Fresh", keywords: "atta aata gehu", categoryId: "cat-flour-rice", thumb: "", price: 140, unit: "kg", step: 1, inStock: true, active: true, sortOrder: 1, updatedAt: Date.now() },
  { id: "p2", nameUr: "باسمتی چاول سوپر کرنل", nameEn: "Super Kernel Basmati Rice", keywords: "chawal basmati rice", categoryId: "cat-flour-rice", thumb: "", price: 380, unit: "kg", step: 0.5, inStock: true, active: true, sortOrder: 2, updatedAt: Date.now() },
  { id: "p3", nameUr: "سیلا چاول کائنات", nameEn: "Sella Rice Kainat", keywords: "sella chawal rice", categoryId: "cat-flour-rice", thumb: "", price: 320, unit: "kg", step: 0.5, inStock: true, active: true, sortOrder: 3, updatedAt: Date.now() },
  { id: "p4", nameUr: "سوجی خالص", nameEn: "Suji Pure", keywords: "suji halwa", categoryId: "cat-flour-rice", thumb: "", price: 180, unit: "kg", step: 0.25, inStock: true, active: true, sortOrder: 4, updatedAt: Date.now() },

  // Oil & Ghee
  { id: "p5", nameUr: "ڈالڈا کوکنگ آئل 1 لیٹر پاؤچ", nameEn: "Dalda Cooking Oil 1L", keywords: "dalda oil tel tail", categoryId: "cat-oil-ghee", thumb: "", price: 560, unit: "litre", step: 1, inStock: true, active: true, sortOrder: 5, updatedAt: Date.now() },
  { id: "p6", nameUr: "میزان بناسپتی گھی 1 کلو", nameEn: "Mezan Banaspati Ghee 1kg", keywords: "mezan ghee ghi", categoryId: "cat-oil-ghee", thumb: "", price: 510, unit: "kg", step: 1, inStock: true, active: true, sortOrder: 6, updatedAt: Date.now() },
  { id: "p7", nameUr: "صوفی کوکنگ آئل 1 لیٹر", nameEn: "Sufi Cooking Oil 1L", keywords: "sufi oil tel", categoryId: "cat-oil-ghee", thumb: "", price: 540, unit: "litre", step: 1, inStock: true, active: true, sortOrder: 7, updatedAt: Date.now() },

  // Pulses
  { id: "p8", nameUr: "دال چنا موٹی", nameEn: "Daal Chana Special", keywords: "daal chana dal", categoryId: "cat-pulses", thumb: "", price: 280, unit: "kg", step: 0.25, inStock: true, active: true, sortOrder: 8, updatedAt: Date.now() },
  { id: "p9", nameUr: "دال ماش دھلی ہوئی", nameEn: "Daal Mash Washed", keywords: "daal mash dhuli", categoryId: "cat-pulses", thumb: "", price: 520, unit: "kg", step: 0.25, inStock: true, active: true, sortOrder: 9, updatedAt: Date.now() },
  { id: "p10", nameUr: "دال مسور سرخ", nameEn: "Daal Masoor Red", keywords: "daal masoor red dal", categoryId: "cat-pulses", thumb: "", price: 320, unit: "kg", step: 0.25, inStock: true, active: true, sortOrder: 10, updatedAt: Date.now() },
  { id: "p11", nameUr: "سفید چنے موٹے کابلی", nameEn: "White Kabuli Chana", keywords: "safaid chane chana", categoryId: "cat-pulses", thumb: "", price: 390, unit: "kg", step: 0.25, inStock: true, active: true, sortOrder: 11, updatedAt: Date.now() },

  // Tea & Sugar
  { id: "p12", nameUr: "چینی دیسی سفید", nameEn: "White Sugar", keywords: "cheeni chini sugar", categoryId: "cat-tea-sugar", thumb: "", price: 150, unit: "kg", step: 0.5, inStock: true, active: true, sortOrder: 12, updatedAt: Date.now() },
  { id: "p13", nameUr: "تپال دانہ چائے 450 گرام", nameEn: "Tapal Danedan Tea 450g", keywords: "tapal patti chai", categoryId: "cat-tea-sugar", thumb: "", price: 680, unit: "packet", step: 1, inStock: true, active: true, sortOrder: 13, updatedAt: Date.now() },
  { id: "p14", nameUr: "لپٹن یلو لیبل چائے 400 گرام", nameEn: "Lipton Yellow Label 400g", keywords: "lipton chai patti", categoryId: "cat-tea-sugar", thumb: "", price: 720, unit: "packet", step: 1, inStock: true, active: true, sortOrder: 14, updatedAt: Date.now() },

  // Dairy & Eggs
  { id: "p15", nameUr: "فارمی انڈے تازہ", nameEn: "Farm Fresh Eggs", keywords: "anday ande eggs", categoryId: "cat-dairy", thumb: "", price: 320, unit: "dozen", step: 1, inStock: true, active: true, sortOrder: 15, updatedAt: Date.now() },
  { id: "p16", nameUr: "اولپرز دودھ 1 لیٹر", nameEn: "Olper Milk 1L", keywords: "olpers doodh dudh milk", categoryId: "cat-dairy", thumb: "", price: 290, unit: "piece", step: 1, inStock: true, active: true, sortOrder: 16, updatedAt: Date.now() },
  { id: "p17", nameUr: "ملک پیک دودھ 1 لیٹر", nameEn: "MilkPak 1L", keywords: "milkpak doodh milk", categoryId: "cat-dairy", thumb: "", price: 290, unit: "piece", step: 1, inStock: true, active: true, sortOrder: 17, updatedAt: Date.now() },
  { id: "p18", nameUr: "ڈان بریڈ بڑی", nameEn: "Dawn Plain Bread Large", keywords: "bread double roti roti", categoryId: "cat-dairy", thumb: "", price: 160, unit: "piece", step: 1, inStock: true, active: true, sortOrder: 18, updatedAt: Date.now() },

  // Spices
  { id: "p19", nameUr: "نیشنل نمک آئیوڈین 800 گرام", nameEn: "National Salt 800g", keywords: "namak salt national", categoryId: "cat-spices", thumb: "", price: 60, unit: "packet", step: 1, inStock: true, active: true, sortOrder: 19, updatedAt: Date.now() },
  { id: "p20", nameUr: "لال مرچ پاؤڈر خالص", nameEn: "Red Chilli Powder", keywords: "surkh lal mirch powder", categoryId: "cat-spices", thumb: "", price: 950, unit: "kg", step: 0.25, inStock: true, active: true, sortOrder: 20, updatedAt: Date.now() },
  { id: "p21", nameUr: "ہلدی پاؤڈر خالص", nameEn: "Turmeric Powder Haldi", keywords: "haldi powder", categoryId: "cat-spices", thumb: "", price: 800, unit: "kg", step: 0.25, inStock: true, active: true, sortOrder: 21, updatedAt: Date.now() },
  { id: "p22", nameUr: "نیشنل بمبئی بریانی مصالحہ", nameEn: "National Bombay Biryani Masala", keywords: "biryani masala", categoryId: "cat-spices", thumb: "", price: 110, unit: "packet", step: 1, inStock: true, active: true, sortOrder: 22, updatedAt: Date.now() },

  // Soap & Detergent
  { id: "p23", nameUr: "سرف ایکسل 1 کلو پیکٹ", nameEn: "Surf Excel 1kg", keywords: "surf excel powder", categoryId: "cat-soap", thumb: "", price: 620, unit: "packet", step: 1, inStock: true, active: true, sortOrder: 23, updatedAt: Date.now() },
  { id: "p24", nameUr: "لکس صابن 140 گرام", nameEn: "Lux Beauty Soap 140g", keywords: "lux sabun soap", categoryId: "cat-soap", thumb: "", price: 130, unit: "piece", step: 1, inStock: true, active: true, sortOrder: 24, updatedAt: Date.now() },
  { id: "p25", nameUr: "ڈیٹول صابن 125 گرام", nameEn: "Dettol Soap 125g", keywords: "dettol sabun soap", categoryId: "cat-soap", thumb: "", price: 140, unit: "piece", step: 1, inStock: true, active: true, sortOrder: 25, updatedAt: Date.now() },
  { id: "p26", nameUr: "لیمن میکس ڈش واش 450ml", nameEn: "Lemon Max Liquid 450ml", keywords: "max bartan liquid dishwash", categoryId: "cat-soap", thumb: "", price: 260, unit: "piece", step: 1, inStock: true, active: true, sortOrder: 26, updatedAt: Date.now() },

  // Biscuits & Snacks
  { id: "p27", nameUr: "سوپر بسکٹ فیملی پیک", nameEn: "Peek Freans Sooper Family Pack", keywords: "sooper biscuit super", categoryId: "cat-snacks", thumb: "", price: 120, unit: "packet", step: 1, inStock: true, active: true, sortOrder: 27, updatedAt: Date.now() },
  { id: "p28", nameUr: "لیز چپس کلاسک مصالحہ", nameEn: "Lays Classic Masala Chips", keywords: "lays chips lays papad", categoryId: "cat-snacks", thumb: "", price: 100, unit: "packet", step: 1, inStock: true, active: true, sortOrder: 28, updatedAt: Date.now() },

  // Cold Drinks
  { id: "p29", nameUr: "پیپسی 1.5 لیٹر بوتل", nameEn: "Pepsi 1.5L Bottle", keywords: "pepsi cold drink botal", categoryId: "cat-drinks", thumb: "", price: 180, unit: "piece", step: 1, inStock: true, active: true, sortOrder: 29, updatedAt: Date.now() },
  { id: "p30", nameUr: "جام شیریں 800 ملی لیٹر", nameEn: "Jam-e-Shirin 800ml", keywords: "jam e shirin sharbat", categoryId: "cat-drinks", thumb: "", price: 420, unit: "piece", step: 1, inStock: true, active: true, sortOrder: 30, updatedAt: Date.now() },
];

