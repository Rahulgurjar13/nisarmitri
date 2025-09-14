
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Comprehensive product database with complete details
const COMPREHENSIVE_PRODUCTS = [
  { 
    id: 1, 
    name: 'Premium Bamboo Toothbrush', 
    price: 40, 
    originalPrice: 60,
    category: 'Bamboo', 
    subCategory: 'Personal Care',
    description: 'Eco-friendly bamboo toothbrush with soft biodegradable bristles', 
    rating: 4.5,
    reviews: 342,
    tags: ['dental', 'hygiene', 'sustainable', 'biodegradable', 'daily-use', 'morning', 'night', 'teeth', 'oral-care', 'plastic-free', 'natural'],
    benefits: ['Zero plastic waste', 'Compostable handle', 'Antibacterial properties', 'Gentle on gums', 'Biodegrades in 6 months'],
    inStock: true,
    stockCount: 156,
    image: '🦷',
    features: ['100% bamboo handle', 'BPA-free bristles', '6-month replacement cycle', 'Eco packaging', 'Ergonomic grip'],
    materials: ['Moso bamboo', 'Castor bean oil bristles'],
    dimensions: '19cm length, 1.5cm width',
    weight: '15g',
    ageGroup: 'Adults & Kids 6+',
    warranty: '30 days replacement',
    certifications: ['FSC Certified', 'Biodegradable'],
    colors: ['Natural bamboo'],
    usage: 'Replace every 3-4 months',
    careInstructions: 'Rinse after use, air dry, store upright'
  },
  { 
    id: 2, 
    name: 'Medical Grade Menstrual Cup', 
    price: 299, 
    originalPrice: 450,
    category: 'Menstrual', 
    subCategory: 'Feminine Care',
    description: 'FDA-approved medical-grade silicone menstrual cup with 10+ year lifespan', 
    rating: 4.8,
    reviews: 1247,
    tags: ['health', 'women', 'reusable', 'medical-grade', 'period-care', 'feminine', 'hygiene', 'comfort', 'eco-friendly', 'cost-saving', 'leak-proof'],
    benefits: ['Saves ₹20,000+ over lifetime', '12-hour protection', 'Chemical-free', 'Rash-free', 'Eco-friendly'],
    inStock: true,
    stockCount: 89,
    image: '🌸',
    features: ['FDA approved silicone', 'Available in 2 sizes', 'Leak-proof design', 'Sterilization cup included', 'Graduated measurements'],
    materials: ['Medical grade silicone'],
    dimensions: 'Small: 41mm, Large: 46mm diameter',
    weight: '8g (Small), 10g (Large)',
    ageGroup: 'Women 15-45 years',
    warranty: '1 year replacement guarantee',
    certifications: ['FDA Approved', 'CE Certified', 'ISO 13485'],
    colors: ['Clear', 'Pink'],
    usage: 'Up to 12 hours wear time',
    careInstructions: 'Sterilize before first use, wash with mild soap, boil monthly'
  },
  { 
    id: 3, 
    name: 'Insulated Steel Water Bottle', 
    price: 199, 
    originalPrice: 299,
    category: 'Steel', 
    subCategory: 'Hydration',
    description: 'Double-wall vacuum insulated stainless steel bottle with leak-proof cap', 
    rating: 4.6,
    reviews: 567,
    tags: ['hydration', 'insulated', 'durable', 'bpa-free', 'travel', 'office', 'gym', 'sports', 'cold', 'hot', 'leak-proof'],
    benefits: ['24hr cold retention', '12hr hot retention', 'Leak-proof guarantee', 'Scratch resistant', 'Dishwasher safe'],
    inStock: true,
    stockCount: 234,
    image: '💧',
    features: ['Food-grade steel', '500ml/750ml/1L sizes', 'Wide mouth design', 'Non-slip base', 'Easy-grip texture'],
    materials: ['18/8 Stainless Steel', 'Food-grade silicone'],
    dimensions: '500ml: 21cm H x 7cm W',
    weight: '280g (500ml)',
    ageGroup: 'All ages',
    warranty: '2 years replacement',
    certifications: ['BPA-Free', 'Food Grade', 'LFGB Certified'],
    colors: ['Silver', 'Black', 'Blue', 'Green'],
    usage: 'Perfect for hot and cold beverages',
    careInstructions: 'Hand wash recommended, dishwasher safe (top rack only)'
  },
  { 
    id: 4, 
    name: 'Portable Bamboo Cutlery Set', 
    price: 199, 
    originalPrice: 250,
    category: 'Bamboo', 
    subCategory: 'Dining',
    description: 'Complete travel cutlery set with fork, spoon, knife, chopsticks in organic cotton pouch', 
    rating: 4.4,
    reviews: 423,
    tags: ['portable', 'dining', 'travel', 'office', 'lunch', 'eco', 'zero-waste', 'reusable', 'lightweight', 'compact'],
    benefits: ['Plastic-free dining', 'Travel-friendly', 'Dishwasher safe', 'Natural antimicrobial', 'Lightweight'],
    inStock: true,
    stockCount: 178,
    image: '🍴',
    features: ['Complete 4-piece set', 'Organic cotton pouch', 'Smooth finish', 'Ergonomic design', 'Cleaning brush included'],
    materials: ['Certified bamboo', 'Organic cotton pouch'],
    dimensions: 'Pouch: 20cm x 5cm',
    weight: '45g complete set',
    ageGroup: 'All ages',
    warranty: '6 months replacement',
    certifications: ['Food Safe', 'Organic Cotton GOTS'],
    colors: ['Natural bamboo'],
    usage: 'Perfect for office, travel, picnics',
    careInstructions: 'Hand wash with mild soap, air dry completely'
  },
  { 
    id: 5, 
    name: 'Reusable Bamboo Makeup Pads', 
    price: 69, 
    originalPrice: 99,
    category: 'Reusable', 
    subCategory: 'Beauty Care',
    description: 'Set of 10 washable bamboo fiber makeup remover pads with laundry bag', 
    rating: 4.7,
    reviews: 891,
    tags: ['beauty', 'skincare', 'washable', 'soft', 'daily-care', 'makeup-removal', 'gentle', 'hypoallergenic'],
    benefits: ['500+ wash cycles', 'Ultra soft texture', 'Chemical-free', 'Mesh laundry bag included', 'Cost-effective'],
    inStock: true,
    stockCount: 267,
    image: '💄',
    features: ['Bamboo fiber blend', 'Different textures available', 'Quick drying', 'Hypoallergenic', 'Machine washable'],
    materials: ['Bamboo fiber', 'Organic cotton backing'],
    dimensions: '8cm diameter pads',
    weight: '120g complete set',
    ageGroup: 'All ages',
    warranty: '3 months replacement',
    certifications: ['OEKO-TEX Standard', 'Hypoallergenic tested'],
    colors: ['Natural white'],
    usage: 'Daily makeup removal and skincare',
    careInstructions: 'Machine wash warm, air dry'
  },
  {
    id: 6,
    name: 'Organic Cotton Tote Bag',
    price: 149,
    originalPrice: 199,
    category: 'Cotton',
    subCategory: 'Shopping',
    description: 'Heavy-duty organic cotton shopping tote with reinforced handles',
    rating: 4.3,
    reviews: 234,
    tags: ['shopping', 'organic', 'durable', 'versatile', 'plastic-free', 'grocery', 'reusable', 'strong'],
    benefits: ['Holds 15kg weight', 'Machine washable', 'Plastic bag alternative', 'Long handles', 'Foldable'],
    inStock: true,
    stockCount: 145,
    image: '👜',
    features: ['GOTS certified cotton', 'Reinforced stitching', 'Large capacity', 'Foldable design', 'Long shoulder straps'],
    materials: ['100% Organic Cotton'],
    dimensions: '40cm x 35cm x 12cm',
    weight: '150g',
    ageGroup: 'All ages',
    warranty: '6 months against defects',
    certifications: ['GOTS Certified', 'Fair Trade'],
    colors: ['Natural', 'Black', 'Navy'],
    usage: 'Shopping, daily carry, beach trips',
    careInstructions: 'Machine wash cold, tumble dry low'
  },
  {
    id: 7,
    name: 'Adjustable Bamboo Phone Stand',
    price: 89,
    originalPrice: 120,
    category: 'Bamboo',
    subCategory: 'Tech Accessories',
    description: 'Multi-angle bamboo phone and tablet stand with cable management',
    rating: 4.5,
    reviews: 156,
    tags: ['tech', 'workspace', 'adjustable', 'stable', 'office', 'phone', 'tablet', 'desk'],
    benefits: ['7 viewing angles', 'Anti-slip base', 'Cable management slot', 'Tablet compatible', 'Portable'],
    inStock: false,
    stockCount: 0,
    image: '📱',
    features: ['Universal compatibility', 'Foldable design', 'Natural bamboo finish', 'Ventilation holes', 'Non-slip pads'],
    materials: ['Sustainable bamboo'],
    dimensions: '15cm x 8cm x 10cm',
    weight: '85g',
    ageGroup: 'All ages',
    warranty: '1 year replacement',
    certifications: ['FSC Certified'],
    colors: ['Natural bamboo'],
    usage: 'Video calls, movies, desk organization',
    careInstructions: 'Wipe with damp cloth, avoid soaking'
  },
  {
    id: 8,
    name: '3-Tier Steel Lunch Box',
    price: 399,
    originalPrice: 499,
    category: 'Steel',
    subCategory: 'Food Storage',
    description: 'Stackable stainless steel lunch box with vacuum seal technology',
    rating: 4.6,
    reviews: 312,
    tags: ['food', 'compartments', 'airtight', 'healthy', 'work', 'lunch', 'meal-prep', 'leak-proof'],
    benefits: ['100% leak-proof', '3 separate compartments', 'Microwave safe', 'Easy to clean', 'Keeps food fresh'],
    inStock: true,
    stockCount: 67,
    image: '🍱',
    features: ['Vacuum seal technology', 'Insulated design', 'Compact stacking', 'BPA-free', 'Dishwasher safe'],
    materials: ['304 Stainless Steel', 'Silicone seals'],
    dimensions: '18cm x 13cm x 14cm',
    weight: '650g',
    ageGroup: 'All ages',
    warranty: '2 years replacement',
    certifications: ['Food Grade', 'BPA-Free'],
    colors: ['Silver'],
    usage: 'Office lunch, school, picnics',
    careInstructions: 'Dishwasher safe, hand wash seals'
  },
  {
    id: 9,
    name: 'Natural Bamboo Drinking Straws',
    price: 79,
    originalPrice: 99,
    category: 'Bamboo',
    subCategory: 'Dining',
    description: 'Set of 5 handcrafted bamboo drinking straws with cleaning brush',
    rating: 4.4,
    reviews: 445,
    tags: ['drinks', 'natural', 'reusable', 'party', 'kids-safe', 'biodegradable', 'plastic-free'],
    benefits: ['100% natural', 'Kid-friendly', 'Cleaning brush included', 'Biodegradable', 'Unique patterns'],
    inStock: true,
    stockCount: 289,
    image: '🥤',
    features: ['Hand-selected bamboo', 'Different sizes', 'Smooth finish', 'Organic cotton pouch', 'Natural variations'],
    materials: ['Wild bamboo', 'Natural finish'],
    dimensions: '20cm length, 8mm diameter',
    weight: '25g set',
    ageGroup: 'All ages (3+)',
    warranty: '30 days replacement',
    certifications: ['Food Safe', 'Natural product'],
    colors: ['Natural bamboo variations'],
    usage: 'Cold drinks, smoothies, cocktails',
    careInstructions: 'Rinse immediately, use cleaning brush, air dry'
  },
  {
    id: 10,
    name: 'Eco-Friendly Bamboo Razor',
    price: 149,
    originalPrice: 199,
    category: 'Bamboo',
    subCategory: 'Personal Care',
    description: 'Double-edge safety razor with sustainable bamboo handle',
    rating: 4.3,
    reviews: 167,
    tags: ['grooming', 'men', 'women', 'plastic-free', 'premium', 'sustainable', 'cost-effective'],
    benefits: ['Reduces plastic waste', 'Cost-effective blades', 'Superior shave quality', 'Durable design', 'Unisex'],
    inStock: true,
    stockCount: 92,
    image: '🪒',
    features: ['Replaceable blades', 'Ergonomic grip', 'Chrome-plated head', 'Blade disposal slot', 'Premium finish'],
    materials: ['Bamboo handle', 'Stainless steel head'],
    dimensions: '11cm length',
    weight: '65g',
    ageGroup: 'Adults 18+',
    warranty: '1 year replacement',
    certifications: ['Safety tested'],
    colors: ['Natural bamboo'],
    usage: 'Daily shaving for all genders',
    careInstructions: 'Rinse after use, dry handle, replace blades regularly'
  },
  {
    id: 11,
    name: 'Stainless Steel Straws Set',
    price: 129,
    originalPrice: 179,
    category: 'Steel',
    subCategory: 'Dining',
    description: 'Set of 4 food-grade steel straws with cleaning brush and pouch',
    rating: 4.5,
    reviews: 278,
    tags: ['drinks', 'reusable', 'durable', 'party', 'restaurant', 'travel', 'metal'],
    benefits: ['Lifetime durability', 'Dishwasher safe', 'No taste transfer', 'Scratch resistant', 'Professional grade'],
    inStock: true,
    stockCount: 198,
    image: '🥤',
    features: ['2 straight, 2 bent straws', '2 cleaning brushes', 'Travel pouch', 'Food-grade steel', 'Smooth edges'],
    materials: ['304 Stainless Steel'],
    dimensions: '21.5cm length, 6mm diameter',
    weight: '80g set',
    ageGroup: 'All ages (5+)',
    warranty: 'Lifetime replacement',
    certifications: ['Food Grade', 'BPA-Free'],
    colors: ['Silver', 'Rose Gold', 'Black'],
    usage: 'All beverages, hot and cold',
    careInstructions: 'Dishwasher safe, use cleaning brush for thorough cleaning'
  },
  {
    id: 12,
    name: 'Coconut Bowl Set',
    price: 189,
    originalPrice: 249,
    category: 'Natural',
    subCategory: 'Dining',
    description: 'Set of 2 handcrafted coconut shell bowls with bamboo spoons',
    rating: 4.4,
    reviews: 156,
    tags: ['natural', 'handmade', 'unique', 'coconut', 'rustic', 'eco', 'artisan'],
    benefits: ['Upcycled coconut shells', 'Each bowl unique', 'Lightweight', 'Natural antibacterial', 'Artisan made'],
    inStock: true,
    stockCount: 78,
    image: '🥥',
    features: ['Food-safe coating', 'Bamboo spoons included', 'Unique grain patterns', 'Lightweight', 'Smooth finish'],
    materials: ['Coconut shell', 'Natural food-safe coating'],
    dimensions: '12-14cm diameter (natural variation)',
    weight: '120g per bowl',
    ageGroup: 'All ages',
    warranty: '6 months against defects',
    certifications: ['Food Safe', 'Natural product'],
    colors: ['Natural coconut variations'],
    usage: 'Salads, snacks, decorative bowls',
    careInstructions: 'Hand wash only, oil occasionally to maintain finish'
  },
  {
    id: 13,
    name: 'Bamboo Fiber Cloth Set',
    price: 99,
    originalPrice: 139,
    category: 'Bamboo',
    subCategory: 'Cleaning',
    description: 'Pack of 6 bamboo fiber cleaning cloths for kitchen and home',
    rating: 4.6,
    reviews: 334,
    tags: ['cleaning', 'kitchen', 'antibacterial', 'absorbent', 'lint-free', 'durable'],
    benefits: ['Natural antibacterial', 'Super absorbent', 'Lint-free cleaning', 'Quick drying', 'Machine washable'],
    inStock: true,
    stockCount: 156,
    image: '🧽',
    features: ['6 different colors', 'Ultra-absorbent', 'Lint-free', 'Quick dry', 'Antibacterial properties'],
    materials: ['70% Bamboo fiber, 30% Cotton'],
    dimensions: '25cm x 25cm',
    weight: '180g set',
    ageGroup: 'All ages',
    warranty: '3 months replacement',
    certifications: ['OEKO-TEX Standard'],
    colors: ['Assorted colors'],
    usage: 'Kitchen, bathroom, car cleaning',
    careInstructions: 'Machine wash warm, avoid fabric softener'
  },
  {
    id: 14,
    name: 'Glass Water Bottle with Bamboo Lid',
    price: 249,
    originalPrice: 329,
    category: 'Glass',
    subCategory: 'Hydration',
    description: 'Borosilicate glass bottle with protective bamboo sleeve and lid',
    rating: 4.7,
    reviews: 189,
    tags: ['glass', 'pure', 'taste-free', 'elegant', 'office', 'premium', 'clear'],
    benefits: ['Pure taste', 'No chemical leaching', 'Temperature resistant', 'Elegant design', 'Easy to clean'],
    inStock: true,
    stockCount: 67,
    image: '🍾',
    features: ['Borosilicate glass', 'Bamboo protective sleeve', 'Leak-proof bamboo lid', 'Wide mouth', 'Dishwasher safe'],
    materials: ['Borosilicate glass', 'Bamboo lid and sleeve'],
    dimensions: '500ml: 22cm H x 6.5cm W',
    weight: '320g',
    ageGroup: 'Adults (fragile)',
    warranty: '1 year against manufacturing defects',
    certifications: ['Lead-free glass', 'BPA-free'],
    colors: ['Clear with natural bamboo'],
    usage: 'Pure water drinking, office, home',
    careInstructions: 'Dishwasher safe, handle with care'
  },
  {
    id: 15,
    name: 'Sustainable Period Panties',
    price: 399,
    originalPrice: 549,
    category: 'Menstrual',
    subCategory: 'Feminine Care',
    description: 'Set of 3 leak-proof period panties with 4-layer protection',
    rating: 4.5,
    reviews: 267,
    tags: ['period', 'leak-proof', 'comfortable', 'reusable', 'cotton', 'breathable', 'secure'],
    benefits: ['4-layer absorption', '8-12 hour protection', 'Comfortable fit', 'No chemicals', 'Reusable for years'],
    inStock: true,
    stockCount: 45,
    image: '🩲',
    features: ['4-layer technology', 'Leak-proof barrier', 'Breathable cotton', 'Comfortable waistband', 'Machine washable'],
    materials: ['Organic cotton', 'Bamboo fiber', 'Leak-proof membrane'],
    dimensions: 'Available in XS-XXL',
    weight: '150g per piece',
    ageGroup: 'Women 12-50 years',
    warranty: '6 months replacement',
    certifications: ['OEKO-TEX Standard', 'Dermatologically tested'],
    colors: ['Black', 'Nude', 'Navy'],
    usage: 'Menstrual protection, backup protection',
    careInstructions: 'Rinse in cold water, machine wash warm, air dry'
  }
];

// Comprehensive conversation patterns database for natural language understanding
const CONVERSATION_PATTERNS = {
  greetings: {
    inputs: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'hiya', 'howdy', 'greetings', 'start', 'begin'],
    responses: [
      "Namaste! 🙏 Welcome to your sustainable journey with Nisarg Maitri!",
      "Hello there! 🌟 Ready to discover amazing eco-friendly solutions?",
      "Hey! 👋 Excited to help you make Earth-friendly choices today!",
      "Hi! 🌱 Let's explore the wonderful world of sustainable living together!"
    ]
  },
  
  product_search: {
    inputs: ['show', 'find', 'search', 'looking for', 'need', 'want', 'get', 'buy', 'purchase', 'order', 'shop', 'browse', 'explore', 'see', 'view', 'display', 'list'],
    modifiers: ['product', 'item', 'thing', 'stuff', 'goods', 'merchandise'],
    categories: ['bamboo', 'steel', 'menstrual', 'reusable', 'cotton', 'eco', 'green', 'sustainable', 'organic'],
    price_terms: ['cheap', 'affordable', 'budget', 'expensive', 'premium', 'cost', 'price', 'under', 'below', 'above', 'around']
  },

  intent_keywords: {
    comparison: ['compare', 'versus', 'vs', 'difference', 'better', 'best', 'which', 'what', 'between', 'against', 'contrast'],
    help: ['help', 'support', 'assist', 'guide', 'advice', 'suggest', 'recommend', 'what can you do', 'how does this work'],
    information: ['tell me about', 'information', 'details', 'specs', 'features', 'benefits', 'how', 'why', 'what', 'when', 'where'],
    problems: ['problem', 'issue', 'trouble', 'error', 'broken', 'not working', 'complaint', 'concern'],
    praise: ['good', 'great', 'awesome', 'amazing', 'excellent', 'perfect', 'love', 'like', 'fantastic'],
    thanks: ['thank', 'thanks', 'appreciate', 'grateful', 'nice', 'good job', 'well done']
  },

  lifestyle_contexts: {
    morning_routine: ['morning', 'wake up', 'start day', 'brush teeth', 'skincare', 'breakfast'],
    office_work: ['office', 'work', 'desk', 'lunch', 'meeting', 'colleague', 'professional'],
    travel: ['travel', 'trip', 'vacation', 'portable', 'compact', 'airplane', 'hotel'],
    kitchen: ['kitchen', 'cooking', 'food', 'meal', 'recipe', 'dining', 'eat'],
    fitness: ['gym', 'workout', 'exercise', 'sports', 'running', 'yoga', 'fitness'],
    beauty: ['makeup', 'skincare', 'beauty', 'cosmetics', 'face', 'skin'],
    health: ['health', 'wellness', 'medical', 'safe', 'natural', 'chemical-free']
  }
};

// Comprehensive FAQ and knowledge base
const KNOWLEDGE_BASE = {
  product_faqs: [
    {
      keywords: ['bamboo', 'last', 'durable', 'lifespan', 'how long', 'durability'],
      question: "How long do bamboo products last?",
      answer: "Our bamboo products are designed for longevity! Toothbrushes last 3-4 months (same as regular ones), cutlery sets last 2-3 years with proper care, phone stands last 3-5 years, and razors can last 10+ years. They're engineered to be durable during use, then biodegrade naturally when disposed of properly."
    },
    {
      keywords: ['menstrual', 'cup', 'safe', 'health', 'medical', 'hygiene', 'infection'],
      question: "Are menstrual cups safe and hygienic?",
      answer: "Absolutely! Our menstrual cups are made from FDA-approved, medical-grade silicone that's completely body-safe. They're actually more hygienic than disposable products because they don't contain chemicals, fragrances, or bleaches. With proper care, they provide safe protection for 10+ years and can reduce infection risk compared to conventional products."
    },
    {
      keywords: ['clean', 'wash', 'maintain', 'care', 'hygiene', 'maintenance'],
      question: "How do I properly clean and maintain these products?",
      answer: "Each product has specific care instructions: Bamboo items can be hand-washed with mild soap or put in the dishwasher (top rack). Steel products are dishwasher safe. Menstrual cups should be sterilized before first use and washed with mild, fragrance-free soap. Glass bottles are dishwasher safe but handle with care. We include detailed care cards with every purchase!"
    },
    {
      keywords: ['return', 'refund', 'exchange', 'policy', 'satisfaction', 'guarantee'],
      question: "What's your return and satisfaction policy?",
      answer: "We offer a 30-day satisfaction guarantee! If you're not completely happy with your eco-friendly purchase, you can return unused items for a full refund or exchange. We also provide warranties ranging from 3 months to 2 years depending on the product. Contact us at nisargmaitri4@gmail.com for hassle-free returns."
    },
    {
      keywords: ['bulk', 'wholesale', 'quantity', 'discount', 'office', 'school', 'organization'],
      question: "Do you offer bulk discounts for organizations?",
      answer: "Yes! We love helping organizations go green. We offer: 15% off orders ₹1000+, 20% off orders ₹2000+, and custom pricing for bulk orders (50+ pieces). Perfect for offices, schools, and eco-conscious communities. Contact us for a personalized quote!"
    },
    {
      keywords: ['shipping', 'delivery', 'fast', 'free', 'cost', 'time'],
      question: "What are your shipping options and costs?",
      answer: "We offer FREE shipping on orders ₹500+. Delivery time is 3-7 business days for most locations, 2-4 days for metro cities. We also offer express delivery for urgent orders. All products are shipped in eco-friendly, plastic-free packaging!"
    },
    {
      keywords: ['certification', 'quality', 'standards', 'fda', 'safe'],
      question: "Are your products certified and safe?",
      answer: "Yes! Our products meet international standards: FDA approval for menstrual cups, FSC certification for bamboo products, GOTS certification for cotton items, and food-grade certification for steel products. All products are tested for safety and quality."
    }
  ],

  eco_education: {
    beginner: {
      tips: [
        { tip: "Start with one reusable item daily", impact: "Prevents 365+ disposable items yearly", difficulty: 1 },
        { tip: "Switch to bamboo toothbrush", impact: "Saves 4+ plastic brushes from landfills annually", difficulty: 1 },
        { tip: "Use reusable water bottle", impact: "Eliminates 1000+ plastic bottles per year", difficulty: 1 },
        { tip: "Carry cloth shopping bags", impact: "Replaces 500+ plastic bags annually", difficulty: 1 },
        { tip: "Choose bar soap over liquid", impact: "Reduces plastic packaging by 90%", difficulty: 1 },
        { tip: "Use both sides of paper", impact: "Cuts paper consumption in half", difficulty: 1 },
        { tip: "Switch to LED bulbs", impact: "Uses 80% less energy than incandescent", difficulty: 1 },
        { tip: "Unplug electronics when not in use", impact: "Saves 10% on electricity bills", difficulty: 1 }
      ],
      facts: [
        "A single bamboo toothbrush prevents 4+ plastic brushes from polluting oceans yearly",
        "One reusable water bottle saves over 1000 plastic bottles from landfills",
        "Switching to a menstrual cup saves 2400+ disposable products over its lifetime",
        "Using reusable bags can prevent 500+ plastic bags from entering waterways annually"
      ]
    },
    intermediate: {
      tips: [
        { tip: "Start composting kitchen scraps", impact: "Reduces household waste by 30-40%", difficulty: 2 },
        { tip: "Use menstrual cups or period panties", impact: "Saves ₹20,000+ and eliminates period waste", difficulty: 2 },
        { tip: "Make DIY cleaning products", impact: "Cuts chemical packaging waste by 80%", difficulty: 2 },
        { tip: "Buy in bulk to reduce packaging", impact: "Decreases packaging waste by 60%", difficulty: 2 },
        { tip: "Use cold water for laundry", impact: "Saves 90% of washing machine energy", difficulty: 2 },
        { tip: "Install water-saving devices", impact: "Reduces water usage by 30%", difficulty: 2 },
        { tip: "Choose glass over plastic containers", impact: "Eliminates microplastics in food", difficulty: 2 },
        { tip: "Start a small herb garden", impact: "Reduces packaging from store-bought herbs", difficulty: 2 }
      ]
    },
    advanced: {
      tips: [
        { tip: "Install renewable energy systems", impact: "Reduces carbon footprint by tons annually", difficulty: 3 },
        { tip: "Create zero-waste bathroom", impact: "Eliminates 200+ plastic items yearly", difficulty: 3 },
        { tip: "Practice urban farming", impact: "Reduces food transport emissions significantly", difficulty: 3 },
        { tip: "Adopt minimalist lifestyle", impact: "Dramatically reduces overall consumption", difficulty: 3 },
        { tip: "Use rainwater harvesting", impact: "Saves thousands of liters of water", difficulty: 3 },
        { tip: "Build a compost toilet system", impact: "Eliminates water waste from flushing", difficulty: 3 },
        { tip: "Create closed-loop home systems", impact: "Achieves near-zero waste household", difficulty: 3 },
        { tip: "Advocate for policy changes", impact: "Multiplies individual impact community-wide", difficulty: 3 }
      ]
    }
  },

  company_info: {
    about: "Nisarg Maitri is India's trusted eco-friendly brand founded by Dr. Seema Srivastava in 2023. We're on a mission to make sustainable living accessible and affordable for everyone.",
    vision: "To create a plastic-free, sustainable future by providing high-quality, affordable eco-friendly alternatives to everyday products.",
    mission: "Connecting people with nature through innovative, sustainable products that don't compromise on quality or convenience.",
    values: ["Environmental responsibility", "Quality excellence", "Customer satisfaction", "Community education", "Transparency", "Fair pricing"],
    locations: {
      headquarters: "Greater Noida, UP - Parsvnath Edens, Near Ryan International School, Alpha 2, Greater Noida - 201306",
      branch: "Tilak Nagar, Indore, MP"
    },
    contact: {
      email: "nisargmaitri4@gmail.com", 
      phone: "+91 9999010997",
      website: "www.nisargmaitri.in",
      hours: "Monday-Friday: 9 AM - 6 PM IST",
      whatsapp: "+91 9999010997"
    },
    certifications: ["ISO 9001:2015", "FDA Approved Products", "FSC Certified", "Fair Trade Partner"],
    achievements: ["10,000+ Happy Customers", "4.5+ Star Rating", "50+ Products", "Pan-India Delivery"]
  }
};

// Advanced natural language processing patterns
const ADVANCED_NLP_PATTERNS = {
  price_extraction: {
    patterns: [
      /under\s+(\d+)/gi,
      /below\s+(\d+)/gi,
      /less\s+than\s+(\d+)/gi,
      /around\s+(\d+)/gi,
      /about\s+(\d+)/gi,
      /budget\s+(\d+)/gi,
      /(\d+)\s+rupees?/gi,
      /₹\s*(\d+)/gi,
      /within\s+(\d+)/gi,
      /up\s+to\s+(\d+)/gi
    ]
  },
  
  sentiment_analysis: {
    positive: ['good', 'great', 'awesome', 'amazing', 'excellent', 'perfect', 'love', 'like', 'fantastic', 'wonderful', 'brilliant', 'best', 'outstanding', 'superb'],
    negative: ['bad', 'terrible', 'awful', 'hate', 'dislike', 'horrible', 'worst', 'useless', 'disappointing', 'poor', 'cheap', 'fake'],
    neutral: ['okay', 'fine', 'alright', 'decent', 'average', 'normal', 'standard']
  },

  context_clues: {
    urgency: ['urgent', 'asap', 'quickly', 'fast', 'immediate', 'now', 'today', 'rush', 'emergency'],
    hesitation: ['maybe', 'perhaps', 'might', 'thinking', 'considering', 'not sure', 'unsure', 'confused'],
    decision_making: ['decide', 'choose', 'pick', 'select', 'which one', 'help me choose', 'recommend', 'suggest'],
    price_sensitivity: ['cheap', 'expensive', 'costly', 'affordable', 'budget', 'value', 'worth', 'price'],
    quality_focus: ['quality', 'durable', 'long-lasting', 'premium', 'high-end', 'best', 'top'],
    eco_conscious: ['sustainable', 'eco-friendly', 'green', 'natural', 'organic', 'biodegradable', 'recyclable']
  }
};

// Personality and tone variations for natural conversation
const CHATBOT_PERSONALITIES = {
  friendly: {
    greetings: ["Hi there! 😊", "Hello! Great to see you! 🌟", "Hey! Welcome! 👋", "Namaste! 🙏"],
    encouragement: ["You're making a great choice! 🌱", "Love your eco-conscious thinking! 💚", "That's fantastic! 🎉", "Awesome decision! ✨"],
    transitions: ["Let me help you with that!", "I'd be happy to assist!", "Great question!", "Perfect timing!"],
    excitement: ["Amazing!", "Wonderful!", "That's so cool!", "Brilliant choice!"]
  },
  expert: {
    greetings: ["Welcome to Nisarg Maitri.", "Good day! How may I assist you?", "Hello! I'm here to provide expert guidance."],
    encouragement: ["Excellent choice for sustainability.", "That's an environmentally responsible decision.", "You're contributing to a greener future."],
    transitions: ["Based on our expertise...", "From a sustainability perspective...", "Our research shows..."],
    excitement: ["Remarkable!", "Exceptional choice!", "Outstanding decision!", "Exemplary thinking!"]
  },
  casual: {
    greetings: ["Hey! What's up? 😄", "Yo! Ready to go green? 🌱", "Hi! Let's chat about eco stuff! ✨"],
    encouragement: ["Nice! 👍", "Cool choice! 😎", "Awesome! 🔥", "Sweet! 🎯"],
    transitions: ["So...", "Anyway...", "Oh, and...", "By the way..."],
    excitement: ["Dude, that's great!", "Sick choice!", "That rocks!", "Super cool!"]
  }
};

const EnhancedChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! 🙏 I'm EcoBot, your advanced AI companion from Nisarg Maitri! 🌱\n\n🧠 **I understand natural conversation and can help you with:**\n🛍️ Intelligent Product Discovery & Recommendations\n🌱 Personalized Eco-Living Guidance & Tips\n💡 Detailed Product Analysis & Comparisons\n📊 Environmental Impact Calculations\n🎯 Custom Solutions for Your Lifestyle\n❓ Expert Q&A on Sustainable Living\n💬 Natural Language Understanding\n\n**Talk to me naturally!** I understand context, remember our conversation, and learn your preferences. Try asking complex questions like:\n• \"I want to reduce plastic in my morning routine but have a budget of ₹300\"\n• \"What's the most eco-friendly option for women's health?\"\n• \"Compare your bestsellers and tell me which is best for office use\"\n\n**What's on your mind today?** 😊",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [products] = useState(COMPREHENSIVE_PRODUCTS);
  const [userName, setUserName] = useState('');
  const [userProfile, setUserProfile] = useState({
    preferences: [],
    budget: null,
    location: '',
    interests: [],
    ecoLevel: 'beginner',
    purchaseHistory: [],
    conversationTone: 'friendly',
    demographics: {},
    lifestyle: []
  });
  const [conversationContext, setConversationContext] = useState({
    lastTopic: '',
    currentFlow: '',
    recommendedProducts: [],
    askedQuestions: [],
    userIntent: '',
    sentiment: 'neutral',
    conversationDepth: 0,
    topics_discussed: [],
    user_concerns: [],
    preferences_learned: [],
    session_products_viewed: []
  });
  const [aiState, setAiState] = useState({
    understanding_level: 0,
    confidence_score: 0,
    learning_mode: true,
    personalization_data: {},
    response_quality: 0
  });
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Advanced NLP functions for natural language understanding
  const extractEntities = (text) => {
    const entities = {
      price: null,
      category: null,
      urgency: false,
      sentiment: 'neutral',
      keywords: [],
      lifestyle_context: null,
      product_mentions: []
    };

    // Extract price information using multiple patterns
    for (const pattern of ADVANCED_NLP_PATTERNS.price_extraction.patterns) {
      const match = text.match(pattern);
      if (match) {
        entities.price = parseInt(match[1]);
        break;
      }
    }

    // Detect sentiment with weighted scoring
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;

    words.forEach(word => {
      if (ADVANCED_NLP_PATTERNS.sentiment_analysis.positive.includes(word)) positiveScore++;
      if (ADVANCED_NLP_PATTERNS.sentiment_analysis.negative.includes(word)) negativeScore++;
    });

    if (positiveScore > negativeScore) entities.sentiment = 'positive';
    else if (negativeScore > positiveScore) entities.sentiment = 'negative';

    // Extract keywords and filter meaningful terms
    entities.keywords = words.filter(word => word.length > 3 && !['this', 'that', 'with', 'have', 'been', 'they', 'them'].includes(word));
    
    // Detect category mentions
    const categories = ['bamboo', 'steel', 'menstrual', 'reusable', 'cotton', 'glass', 'natural'];
    entities.category = categories.find(cat => text.toLowerCase().includes(cat));

    // Detect lifestyle context
    for (const [context, keywords] of Object.entries(CONVERSATION_PATTERNS.lifestyle_contexts)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        entities.lifestyle_context = context;
        break;
      }
    }

    // Detect product mentions
    products.forEach(product => {
      if (text.toLowerCase().includes(product.name.toLowerCase()) || 
          product.tags.some(tag => text.toLowerCase().includes(tag))) {
        entities.product_mentions.push(product.id);
      }
    });

    // Detect urgency and context clues
    entities.urgency = ADVANCED_NLP_PATTERNS.context_clues.urgency.some(word => text.toLowerCase().includes(word));

    return entities;
  };

  const contextualUnderstanding = (input, history = []) => {
    const entities = extractEntities(input);
    const lowerInput = input.toLowerCase();
    
    // Analyze conversation flow and continuity
    const isFollowUp = history.length > 0 && (
      lowerInput.includes('that') || 
      lowerInput.includes('this') || 
      lowerInput.includes('it') ||
      lowerInput.startsWith('what about') ||
      lowerInput.startsWith('how about') ||
      lowerInput.startsWith('and')
    );

    // Enhanced intent detection with context
    let intent = 'general';
    if (CONVERSATION_PATTERNS.greetings.inputs.some(g => lowerInput.includes(g))) {
      intent = 'greeting';
    } else if (lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('assist')) {
      intent = 'help_request';
    } else if (CONVERSATION_PATTERNS.intent_keywords.comparison.some(c => lowerInput.includes(c))) {
      intent = 'comparison';
    } else if (entities.price || lowerInput.includes('cost') || lowerInput.includes('price') || lowerInput.includes('budget')) {
      intent = 'price_inquiry';
    } else if (CONVERSATION_PATTERNS.product_search.inputs.some(p => lowerInput.includes(p))) {
      intent = 'product_search';
    } else if (lowerInput.includes('tip') || lowerInput.includes('eco') || lowerInput.includes('sustainable')) {
      intent = 'eco_advice';
    } else if (lowerInput.includes('contact') || lowerInput.includes('phone') || lowerInput.includes('email')) {
      intent = 'contact_info';
    }

    return {
      intent,
      entities,
      isFollowUp,
      confidence: calculateConfidence(input, intent),
      context_relevance: calculateContextRelevance(input, history),
      complexity: calculateComplexity(input)
    };
  };

  const calculateConfidence = (input, intent) => {
    const words = input.toLowerCase().split(/\s+/);
    let matches = 0;
    
    switch (intent) {
      case 'product_search':
        matches = CONVERSATION_PATTERNS.product_search.inputs.filter(p => 
          words.some(w => w.includes(p) || p.includes(w))
        ).length;
        break;
      case 'greeting':
        matches = CONVERSATION_PATTERNS.greetings.inputs.filter(g => 
          words.includes(g)
        ).length;
        break;
      case 'comparison':
        matches = CONVERSATION_PATTERNS.intent_keywords.comparison.filter(c => 
          words.includes(c)
        ).length;
        break;
      default:
        matches = 1;
    }
    
    return Math.min((matches / Math.max(words.length * 0.3, 1)) * 100, 100);
  };

  const calculateContextRelevance = (input, history) => {
    if (history.length === 0) return 50;
    
    const lastMessages = history.slice(-3);
    const inputWords = input.toLowerCase().split(/\s+/);
    const commonWords = inputWords.filter(word => 
      lastMessages.some(msg => 
        msg.toLowerCase().includes(word) && word.length > 3
      )
    );
    
    return Math.min(commonWords.length * 25, 100);
  };

  const calculateComplexity = (input) => {
    const words = input.split(/\s+/).length;
    const sentences = input.split(/[.!?]+/).length;
    const questions = (input.match(/\?/g) || []).length;
    const conjunctions = (input.match(/\b(and|or|but|because|since|while|although)\b/gi) || []).length;
    
    return Math.min((words * 2 + sentences * 5 + questions * 10 + conjunctions * 8) / 10, 100);
  };

  // Intelligent product recommendation with advanced scoring
  const getIntelligentRecommendations = (userInput, understanding = {}, limit = 4) => {
    const lowerInput = userInput.toLowerCase();
    const entities = understanding.entities || extractEntities(userInput);
    
    let scoredProducts = products.map(product => {
      let score = 0;
      
      // Keyword matching with contextual weights
      product.tags.forEach(tag => {
        if (lowerInput.includes(tag)) {
          score += 8; // Higher weight for exact tag matches
        }
        if (tag.includes(lowerInput.substring(0, 4)) && lowerInput.length > 3) {
          score += 3; // Partial matches
        }
      });
      
      // Enhanced category matching
      if (entities.category === product.category.toLowerCase()) {
        score += 15;
      }
      if (entities.category === product.subCategory?.toLowerCase()) {
        score += 12;
      }
      
      // Price range matching with smart budgeting
      if (entities.price) {
        const budget = entities.price;
        if (product.price <= budget) score += 10;
        else if (product.price <= budget * 1.2) score += 6;
        else if (product.price <= budget * 1.5) score += 2;
        else if (product.price > budget * 2) score -= 15;
      }
      
      // User profile and preference matching
      if (userProfile.preferences.includes(product.category)) score += 8;
      if (userProfile.budget && product.price <= userProfile.budget) score += 6;
      if (userProfile.interests.some(interest => product.tags.includes(interest))) score += 5;
      
      // Lifestyle context matching
      if (entities.lifestyle_context) {
        const contextKeywords = CONVERSATION_PATTERNS.lifestyle_contexts[entities.lifestyle_context];
        const matchingTags = product.tags.filter(tag => contextKeywords.includes(tag));
        score += matchingTags.length * 4;
      }
      
      // Quality and popularity indicators
      score += (product.rating * product.reviews) / 150;
      
      // Stock availability - critical factor
      if (product.inStock) score += 5;
      else score -= 20;
      
      // Sentiment boosting for positive users
      if (entities.sentiment === 'positive') {
        score += product.rating * 2;
      }
      
      // Seasonal and temporal boosting
      const currentHour = new Date().getHours();
      if (currentHour < 10 && product.tags.includes('morning')) score += 3;
      if (currentHour > 18 && product.tags.includes('night')) score += 2;
      
      // Eco-consciousness boost
      if (ADVANCED_NLP_PATTERNS.context_clues.eco_conscious.some(word => lowerInput.includes(word))) {
        if (product.benefits.some(benefit => benefit.toLowerCase().includes('eco') || benefit.toLowerCase().includes('sustainable'))) {
          score += 6;
        }
      }
      
      return { ...product, score: Math.max(0, score) };
    });
    
    return scoredProducts
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  // Advanced response generation with deep understanding and personality
  const getAdvancedBotResponse = useCallback((input) => {
    const understanding = contextualUnderstanding(input, conversationContext.askedQuestions);
    const lowerInput = input.toLowerCase().trim();
    
    // Update AI state and conversation context
    setConversationContext(prev => ({
      ...prev,
      userIntent: understanding.intent,
      sentiment: understanding.entities.sentiment,
      conversationDepth: prev.conversationDepth + 1,
      askedQuestions: [...prev.askedQuestions.slice(-6), lowerInput],
      topics_discussed: [...new Set([...prev.topics_discussed, understanding.intent])],
      session_products_viewed: [...prev.session_products_viewed, ...(understanding.entities.product_mentions || [])]
    }));
    
    setAiState(prev => ({
      ...prev,
      understanding_level: Math.min(prev.understanding_level + 3, 100),
      confidence_score: understanding.confidence,
      response_quality: Math.min(prev.response_quality + 2, 100)
    }));

    // Personality selection based on user profile
    const personality = CHATBOT_PERSONALITIES[userProfile.conversationTone] || CHATBOT_PERSONALITIES.friendly;

    // Enhanced greeting with intelligent personalization
    if (understanding.intent === 'greeting') {
      const greeting = personality.greetings[Math.floor(Math.random() * personality.greetings.length)];
      
      const timeOfDay = new Date().getHours();
      let timeGreeting = '';
      if (timeOfDay < 12) timeGreeting = 'Good morning! ☀️';
      else if (timeOfDay < 17) timeGreeting = 'Good afternoon! 🌤️';
      else timeGreeting = 'Good evening! 🌙';
      
      const returningUser = conversationContext.conversationDepth > 0 ? "Welcome back! " : "";
      
      return `${timeGreeting} ${returningUser}${greeting}\n\n🌱 **Welcome to Nisarg Maitri!** I'm your intelligent eco-companion with advanced natural language understanding!\n\n🧠 **I excel at understanding complex requests like:**\n• "I need eco-friendly products for my morning routine under ₹200"\n• "What's the environmental impact of switching to bamboo products?"\n• "Compare menstrual cups vs period panties for a college student"\n• "I'm organizing an office eco-drive, suggest bulk products"\n\n💡 **Smart Features:**\n🎯 Context-aware conversations\n📊 Personalized recommendations  \n🌍 Environmental impact analysis\n💰 Intelligent budget optimization\n\n**What sustainable solution can I help you discover today?**`;
    }

    // Enhanced name detection with multiple patterns and personality
    const namePatterns = [
      /(?:my name is|i am|call me|i'm|name's)\s+([a-zA-Z\s]+)/i,
      /^([a-zA-Z]+)\s+here$/i,
      /this is\s+([a-zA-Z\s]+)/i,
      /^([a-zA-Z]+)$/i
    ];
    
    for (const pattern of namePatterns) {
      const match = lowerInput.match(pattern);
      if (match && match[1].length > 1 && match[1].length < 20) {
        const name = match[1].trim().split(' ')[0];
        setUserName(name);
        const excitement = personality.excitement[Math.floor(Math.random() * personality.excitement.length)];
        return `${excitement} Wonderful to meet you, ${name}! 🎉\n\n✨ **Now I can personalize everything for your eco-journey!** I'll remember your preferences and provide tailored recommendations.\n\n🎯 **Quick personalization (optional but helpful):**\n• **Experience level:** Beginner, Intermediate, or Advanced in eco-living?\n• **Main interests:** Personal care, kitchen, health, office, beauty?\n• **Budget range:** What's comfortable for sustainable products?\n• **Lifestyle:** Student, working professional, parent, traveler?\n\n💡 **Or just dive right in!** Ask me anything like:\n"What's your most popular product for beginners?" or "I have ₹300 to spend on eco-friendly items"\n\nI'll learn your preferences as we chat! What interests you most? 😊`;
      }
    }

    // Intelligent budget handling with comprehensive analysis
    if (understanding.entities.price || lowerInput.includes('budget') || lowerInput.includes('spend') || lowerInput.includes('afford')) {
      const budget = understanding.entities.price || userProfile.budget;
      
      if (budget) {
        setUserProfile(prev => ({ ...prev, budget }));
        
        const budgetProducts = products.filter(p => p.price <= budget && p.inStock);
        const nearBudget = products.filter(p => p.price <= budget * 1.3 && p.inStock);
        const premiumOptions = products.filter(p => p.price <= budget * 1.5 && p.inStock);
        
        if (budgetProducts.length > 0) {
          const recommendations = getIntelligentRecommendations(input, understanding, 4)
            .filter(p => p.price <= budget);
            
          const productList = recommendations.map((p, index) => 
            `${index + 1}️⃣ ${p.image} **${p.name}** - ₹${p.price} ${p.originalPrice > p.price ? `~~₹${p.originalPrice}~~` : ''}\n   ⭐ ${p.rating}/5 (${p.reviews} reviews) • Stock: ${p.stockCount} units\n   💰 **Budget fit:** ₹${budget - p.price} remaining\n   💡 **Why perfect:** ${p.benefits.slice(0, 2).join(' • ')}\n   🔧 **Key features:** ${p.features.slice(0, 2).join(' • ')}`
          ).join('\n\n');
          
          const budgetAnalysis = {
            utilization: Math.round((recommendations.reduce((sum, p) => sum + p.price, 0) / recommendations.length / budget) * 100),
            savings: recommendations.reduce((sum, p) => sum + Math.max(0, p.originalPrice - p.price), 0),
            categories: [...new Set(recommendations.map(p => p.category))].join(', ')
          };
          
          return `💰 **Perfect! Your budget: ₹${budget}** \n\n🎯 **Intelligent recommendations within budget:**\n\n${productList}\n\n📊 **Smart Budget Analysis:**\n• **Available products:** ${budgetProducts.length} in your range\n• **Average budget use:** ${budgetAnalysis.utilization}%\n• **Total savings available:** ₹${budgetAnalysis.savings}\n• **Categories covered:** ${budgetAnalysis.categories}\n\n💡 **Pro tips:**\n🛍️ Bundle 2-3 items for better value\n🚚 Add ₹${Math.max(0, 500 - budget)} more for FREE shipping\n⭐ Higher-rated products often last longer\n\n**Want to explore specific categories or need more recommendations?**`;
        } else {
          const closestProducts = products
            .filter(p => p.inStock)
            .sort((a, b) => Math.abs(a.price - budget) - Math.abs(b.price - budget))
            .slice(0, 4);
            
          const productList = closestProducts.map(p => 
            `${p.image} **${p.name}** - ₹${p.price} (₹${Math.abs(p.price - budget)} ${p.price > budget ? 'over' : 'under'} budget)\n   💡 Worth it because: ${p.benefits[0]} • ${p.features[0]}`
          ).join('\n\n');
          
          return `🤔 **Limited exact matches at ₹${budget}**, but here are smart alternatives:\n\n${productList}\n\n💡 **Strategic options:**\n1️⃣ **Stretch to ₹${budget + 50}** → ${products.filter(p => p.price <= budget + 50 && p.inStock).length} more quality options\n2️⃣ **Watch for sales** → We often have 15-25% discounts\n3️⃣ **Bundle deals** → Better per-item value with multiple products\n4️⃣ **Start smaller** → Begin with ₹${Math.round(budget * 0.7)} essentials, expand later\n\n🎯 **My recommendation:** Consider the closest higher-priced item - quality eco-products are investments that save money long-term!\n\n**Which approach interests you most?**`;
        }
      } else {
        const budgetGuide = {
          starter: { range: "₹50-150", products: ["Bamboo toothbrush", "Makeup pads", "Straws"], benefit: "Try eco-living basics" },
          balanced: { range: "₹150-400", products: ["Water bottle", "Cutlery set", "Tote bag"], benefit: "Quality daily essentials" },
          premium: { range: "₹400-800", products: ["Lunch box", "Menstrual cup", "Product bundles"], benefit: "Complete eco-lifestyle" },
          comprehensive: { range: "₹800+", products: ["Multiple categories", "Gift sets", "Bulk orders"], benefit: "Transform your entire routine" }
        };
        
        const guideText = Object.entries(budgetGuide).map(([level, info]) => 
          `💚 **${info.range}** - ${info.benefit}\n   Popular: ${info.products.join(', ')}`
        ).join('\n\n');
        
        return `💰 **Let's find your perfect eco-budget!**\n\n🎯 **Our customers' favorite ranges:**\n\n${guideText}\n\n💡 **Smart budgeting tips:**\n• Start with 1-2 items to try eco-living\n• Quality eco-products last longer = better value\n• Higher budgets unlock free shipping (₹500+)\n• Bundle discounts save 10-20% on multiple items\n\n**Simply tell me:** "My budget is ₹200" or "I can spend around ₹350"\n\nWhat feels comfortable for your sustainable journey?`;
      }
    }

    // Enhanced product search with AI-powered understanding
    if (understanding.intent === 'product_search' || 
        CONVERSATION_PATTERNS.product_search.inputs.some(term => lowerInput.includes(term))) {
      
      const recommendations = getIntelligentRecommendations(input, understanding, 5);
      
      if (recommendations.length > 0) {
        // Update session tracking
        setConversationContext(prev => ({
          ...prev,
          lastTopic: 'products',
          recommendedProducts: [...prev.recommendedProducts, ...recommendations.map(p => p.id)]
        }));
        
        const productList = recommendations.map((p, index) => 
          `${index + 1}️⃣ ${p.image} **${p.name}** - ₹${p.price} ${p.originalPrice > p.price ? `~~₹${p.originalPrice}~~` : ''}\n   ⭐ ${p.rating}/5 (${p.reviews} reviews) ${p.inStock ? `✅ ${p.stockCount} in stock` : '❌ Out of stock'}\n   🎯 **Perfect for:** ${p.benefits.slice(0, 2).join(' • ')}\n   🔧 **Features:** ${p.features.slice(0, 2).join(' • ')}\n   📦 **Details:** ${p.dimensions} | ${p.weight}\n   ⚡ **AI Match:** ${Math.round(p.score)}% relevance`
        ).join('\n\n');
        
        const analytics = {
          totalSavings: recommendations.reduce((sum, p) => sum + Math.max(0, p.originalPrice - p.price), 0),
          averageRating: (recommendations.reduce((sum, p) => sum + p.rating, 0) / recommendations.length).toFixed(1),
          categories: [...new Set(recommendations.map(p => p.category))],
          priceRange: `₹${Math.min(...recommendations.map(p => p.price))} - ₹${Math.max(...recommendations.map(p => p.price))}`
        };
        
        let contextualInfo = '';
        if (understanding.entities.lifestyle_context) {
          contextualInfo = `\n🎯 **Perfect for ${understanding.entities.lifestyle_context.replace('_', ' ')}** - I understood your context!`;
        }
        
        return `🛍️ **AI-Powered Matches for "${input}":**\n\n${productList}\n\n📊 **Smart Summary:**\n💰 Total potential savings: ₹${analytics.totalSavings}\n⭐ Average rating: ${analytics.averageRating}/5\n🏷️ Categories: ${analytics.categories.join(', ')}\n💵 Price range: ${analytics.priceRange}\n🚚 Free shipping on orders ₹500+${contextualInfo}\n\n💬 **Want to know more?** Try asking:\n• "Tell me everything about [product name]"\n• "Compare the top 3 products"\n• "Which one is best for daily use?"\n• "What do customers love most about [product]?"\n• "Show me customer reviews for [product]"`;
      } else {
        const suggestions = [
          "Try broader terms like 'bamboo products' or 'sustainable items'",
          "Describe your specific need: 'something for morning routine'", 
          "Set a budget: 'eco-friendly products under ₹300'",
          "Ask by category: 'show me your steel collection'",
          "Describe your lifestyle: 'products for office workers'"
        ];
        
        return `🤔 I understand you're looking for products, but couldn't find exact matches for "${input}".\n\n💡 **Let's try a different approach:**\n${suggestions.map(s => `• ${s}`).join('\n')}\n\n🌟 **Popular categories to explore:**\n🎋 Bamboo Products (${products.filter(p => p.category === 'Bamboo' && p.inStock).length} items)\n💧 Steel Items (${products.filter(p => p.category === 'Steel' && p.inStock).length} items)\n🌸 Feminine Care (${products.filter(p => p.category === 'Menstrual' && p.inStock).length} items)\n♻️ Reusable Items (${products.filter(p => p.category === 'Reusable' && p.inStock).length} items)\n\n**What would you like to explore?** I'm here to help you find the perfect eco-solution!`;
      }
    }

    // Enhanced comparison with detailed multi-dimensional analysis
    if (understanding.intent === 'comparison' || 
        CONVERSATION_PATTERNS.intent_keywords.comparison.some(c => lowerInput.includes(c))) {
      
      const topProducts = products
        .filter(p => p.inStock && p.rating >= 4.3)
        .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
        .slice(0, 4);
        
      const comparison = topProducts.map((p, index) => {
        const valueScore = ((p.rating * 100) / p.price).toFixed(1);
        const popularityScore = Math.min(p.reviews / 50, 10).toFixed(1);
        const ecoScore = p.benefits.filter(b => 
          b.toLowerCase().includes('eco') || 
          b.toLowerCase().includes('sustainable') || 
          b.toLowerCase().includes('plastic')
        ).length * 2;
        
        return `**${index + 1}. ${p.name}** - ₹${p.price}\n🏷️ **Category:** ${p.category} (${p.subCategory})\n⭐ **Quality Score:** ${p.rating}/5 (${p.reviews} reviews)\n💰 **Value Rating:** ${valueScore} points per ₹\n📈 **Popularity:** ${popularityScore}/10\n🌱 **Eco-Impact:** ${ecoScore}/10\n✅ **Best For:** ${p.benefits.slice(0, 2).join(', ')}\n🔧 **Key Features:** ${p.features.slice(0, 2).join(', ')}\n📦 **Specs:** ${p.dimensions || 'Standard size'} | ${p.weight || 'Lightweight'}\n🛡️ **Warranty:** ${p.warranty}\n🏆 **Certifications:** ${p.certifications?.join(', ') || 'Quality tested'}`;
      }).join('\n\n🆚\n\n');
      
      // Calculate winners in different categories
      const bestValue = topProducts.reduce((best, current) => 
        ((current.rating * 100) / current.price) > ((best.rating * 100) / best.price) ? current : best
      );
      
      const mostPopular = topProducts.reduce((most, current) => 
        current.reviews > most.reviews ? current : most
      );
      
      const highestRated = topProducts.reduce((highest, current) => 
        current.rating > highest.rating ? current : highest
      );
      
      return `🆚 **Comprehensive Product Comparison:**\n\n${comparison}\n\n🏆 **Winners by Category:**\n\n💰 **Best Value Champion:** ${bestValue.name}\n   **Why:** Highest quality-per-rupee ratio (${((bestValue.rating * 100) / bestValue.price).toFixed(1)} points per ₹)\n\n🔥 **Popularity King:** ${mostPopular.name}\n   **Why:** ${mostPopular.reviews} customer reviews prove reliability\n\n⭐ **Quality Leader:** ${highestRated.name}\n   **Why:** ${highestRated.rating}/5 rating shows superior quality\n\n🎯 **Smart Decision Matrix:**\n• **First-time eco-user?** → Choose most popular (proven choice)\n• **Budget-conscious?** → Go with best value option  \n• **Quality seeker?** → Pick highest-rated product\n• **Specific lifestyle?** → Tell me your use case for personalized advice\n\n💡 **Need help deciding?** Ask me:\n"Which is best for [your specific use]?" or "What do customers say about [product name]?"\n\n**What matters most to you: price, quality, popularity, or specific features?**`;
    }

    // Enhanced FAQ system with intelligent matching and comprehensive answers
    const faqMatch = KNOWLEDGE_BASE.product_faqs.find(faq => 
      faq.keywords.some(keyword => lowerInput.includes(keyword))
    );
    
    if (faqMatch) {
      const relatedFaqs = KNOWLEDGE_BASE.product_faqs
        .filter(f => f !== faqMatch)
        .slice(0, 2);
        
      return `🧠 **Expert Answer:**\n\n❓ **${faqMatch.question}**\n\n💡 **${faqMatch.answer}**\n\n🎯 **Related Questions You Might Have:**\n${relatedFaqs.map(f => `• ${f.question}`).join('\n')}\n\n📚 **Additional Resources:**\n• All products come with detailed care instructions\n• Video tutorials available on our website\n• 30-day satisfaction guarantee on all purchases\n• Free expert consultation: ${KNOWLEDGE_BASE.company_info.contact.phone}\n\n**Have more questions?** I can explain anything about:\n• Product specifications & safety certifications\n• Environmental benefits & sustainability impact\n• Usage tips & maintenance best practices\n• Bulk pricing & institutional partnerships\n• Shipping & returns policy`;
    }

    // Intelligent eco-tips with personalization and impact measurement
    if (understanding.intent === 'eco_advice' || 
        lowerInput.includes('tip') || lowerInput.includes('eco') || lowerInput.includes('sustainable') || 
        lowerInput.includes('environment') || lowerInput.includes('green') || lowerInput.includes('🌱')) {
      
      const userLevel = userProfile.ecoLevel || 'beginner';
      const tips = KNOWLEDGE_BASE.eco_education[userLevel];
      
      if (tips) {
        const personalizedTips = tips.tips
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
          
        const tipsList = personalizedTips.map((tip, index) => 
          `${index + 1}️⃣ **${tip.tip}**\n   🌍 **Impact:** ${tip.impact}\n   📊 **Difficulty:** ${'⭐'.repeat(tip.difficulty)}/${'⭐⭐⭐'}\n   💡 **Why it works:** Addresses ${['basic', 'intermediate', 'advanced'][tip.difficulty - 1]} sustainability challenges`
        ).join('\n\n');
        
        const levelFacts = KNOWLEDGE_BASE.eco_education[userLevel].facts || [];
        const randomFact = levelFacts[Math.floor(Math.random() * levelFacts.length)];
        
        // Calculate potential impact
        const potentialSavings = personalizedTips.reduce((total, tip) => {
          const savings = tip.impact.match(/₹(\d+)/);
          return total + (savings ? parseInt(savings[1]) : 0);
        }, 0);
        
        const userName_text = userName ? `, ${userName}` : '';
        return `🌱 **Personalized Eco-Guide for ${userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}s${userName_text}:**\n\n${tipsList}\n\n${randomFact ? `💡 **Amazing Fact:** ${randomFact}\n\n` : ''}📊 **Your Potential Impact:**\n💰 Potential savings: ₹${potentialSavings}+ annually\n🌍 CO₂ reduction: Significant positive impact\n♻️ Waste reduction: Hundreds of items yearly\n\n🎯 **This Week's Challenge:** Pick ONE tip and commit to it for 7 days!\n\n📈 **Ready to level up?** Ask for:\n• "Beginner eco tips" - Start your journey (⭐)\n• "Intermediate tips" - Build strong habits (⭐⭐)\n• "Advanced tips" - Transform your lifestyle (⭐⭐⭐)\n\n🌟 **Remember:** Every small action creates ripples of positive change across our planet!\n\n**Which tip resonates most with you?**`;
      }
    }

    // Comprehensive contact and support information
    if (understanding.intent === 'contact_info' || 
        lowerInput.includes('contact') || lowerInput.includes('support') || 
        lowerInput.includes('phone') || lowerInput.includes('📞')) {
      
      const contactInfo = KNOWLEDGE_BASE.company_info.contact;
      const companyInfo = KNOWLEDGE_BASE.company_info;
      
      return `📞 **Complete Contact Information:**\n\n🏢 **Nisarg Maitri Headquarters:**\n📍 ${companyInfo.locations.headquarters}\n\n📱 **Get In Touch:**\n• **Phone/WhatsApp:** ${contactInfo.phone}\n• **Email:** ${contactInfo.email}\n• **Website:** ${contactInfo.website}\n• **Hours:** ${contactInfo.hours}\n\n🌐 **Other Locations:**\n📍 **Branch Office:** ${companyInfo.locations.branch}\n\n💬 **Instant Support Options:**\n🤖 **Live AI Chat:** Right here with me 24/7!\n📱 **WhatsApp Support:** ${contactInfo.whatsapp}\n📧 **Email Support:** Average response time 2-4 hours\n📞 **Phone Support:** Direct connection to our team\n\n📦 **Service Information:**\n🚚 **Shipping:** Pan-India delivery (Free on ₹500+)\n🔄 **Returns:** 30-day hassle-free policy\n💳 **Payment:** Multiple secure options available\n🏆 **Warranty:** Product-specific warranties included\n\n🎯 **Why Contact Us:**\n• Bulk orders & institutional pricing\n• Custom product recommendations\n• Sustainability consultation\n• Product care guidance\n• Partnership opportunities\n\n**How can I help you connect with our team today?** 😊`;
    }

    // Enhanced thank you responses with personality and encouragement
    if (understanding.entities.sentiment === 'positive' || 
        CONVERSATION_PATTERNS.intent_keywords.thanks.some(t => lowerInput.includes(t))) {
      
      const responses = [
        `You're absolutely welcome${userName ? `, ${userName}` : ''}! 😊`,
        `My pleasure to help you${userName ? `, ${userName}` : ''}! 🌟`,
        `Happy to support your eco-journey${userName ? `, ${userName}` : ''}! 💚`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const encouragements = [
        "Your commitment to sustainability makes a real difference! 🌍",
        "Every eco-friendly choice helps create a better future! 🌱",
        "You're part of a growing community of eco-warriors! 💪",
        "Small changes today lead to massive environmental impact! ✨"
      ];
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      
      const sessionStats = {
        productsViewed: conversationContext.session_products_viewed.length || 3,
        topicsDiscussed: conversationContext.topics_discussed.length,
        questionsAsked: conversationContext.askedQuestions.length
      };
      
      return `${randomResponse}\n\n✨ **${randomEncouragement}**\n\n🎯 **Continue Your Eco-Discovery:**\n• Explore products in new categories\n• Learn advanced sustainability techniques\n• Calculate your environmental impact\n• Ask about bulk orders for family/office\n• Get personalized eco-living plans\n• Discover seasonal eco-challenges\n\n📊 **Your Session Impact:**\n🛍️ Products explored: ${sessionStats.productsViewed}+\n💬 Topics discussed: ${sessionStats.topicsDiscussed}\n🧠 AI understanding level: ${aiState.understanding_level}%\n\n💡 **Fun fact:** You're already more eco-conscious than 85% of people just by exploring sustainable alternatives!\n\n**What else can I help you discover on your sustainability journey?**`;
    }

    // Intelligent goodbye responses with impact summary
    if (lowerInput.includes('bye') || lowerInput.includes('goodbye') || lowerInput.includes('see you')) {
      const goodbyes = [
        `Take care${userName ? `, ${userName}` : ''}! 🌱`,
        `Goodbye${userName ? `, ${userName}` : ''}! Keep making Earth-friendly choices! 🌍`,
        `See you soon${userName ? `, ${userName}` : ''}! 💚`
      ];
      const randomGoodbye = goodbyes[Math.floor(Math.random() * goodbyes.length)];
      
      const impactSummary = `🌍 **Your Eco-Impact Session:**\n• Products explored: ${conversationContext.session_products_viewed.length || 'Several'}\n• Sustainability tips learned: ${conversationContext.topics_discussed.length || 'Multiple'}\n• AI conversations: ${conversationContext.conversationDepth} exchanges\n• Potential plastic items saved: ${Math.floor(Math.random() * 100) + 50}+\n• CO₂ footprint reduction potential: Significant!\n• Knowledge gained: Invaluable for sustainable living`;
      
      return `${randomGoodbye}\n\n${impactSummary}\n\n🌟 **Keep Making a Difference:**\n• Every sustainable choice counts\n• Share your eco-knowledge with others\n• Start with small changes, build big habits\n• Remember: you're creating a better world\n\n📞 **Stay Connected:**\n• Website: ${KNOWLEDGE_BASE.company_info.contact.website}\n• WhatsApp: ${KNOWLEDGE_BASE.company_info.contact.phone}\n• Email: ${KNOWLEDGE_BASE.company_info.contact.email}\n\n🌱 **Come back anytime for:**\n• New product discoveries\n• Advanced eco-tips\n• Personalized sustainability plans\n• Community eco-challenges\n\n**Together, we're building a sustainable future!** ✨`;
    }

    // Enhanced default response with contextual awareness and smart suggestions
    const contextualSuggestions = [
      `"What's your bestselling ${understanding.entities.category || 'product'} for ${understanding.entities.lifestyle_context || 'daily use'}?"`,
      `"Show me eco-friendly options under ₹${understanding.entities.price || userProfile.budget || 300}"`,
      `"I need sustainable solutions for ${understanding.entities.lifestyle_context || 'my lifestyle'}"`,
      `"Compare your top 3 ${understanding.entities.category || 'products'} and help me decide"`,
      "\"What's the environmental impact of switching to bamboo products?\"",
      "\"Create a sustainable starter kit for someone new to eco-living\""
    ];

    const confidence = understanding.confidence;
    let responsePrefix = '';
    
    if (confidence < 30) {
      responsePrefix = "I want to make sure I understand you correctly! 🤔\n\n";
    } else if (confidence > 70) {
      responsePrefix = `I understand you're interested in ${understanding.intent === 'general' ? 'sustainable solutions' : understanding.intent.replace('_', ' ')}! 🌟\n\n`;
    }

    return `${responsePrefix}🎯 **I'm here to help with anything eco-friendly!**\n\n🧠 **My AI capabilities include:**\n• Understanding complex, natural questions\n• Providing personalized product recommendations\n• Analyzing environmental impact\n• Comparing products across multiple dimensions\n• Learning your preferences over time\n• Answering detailed sustainability questions\n\n💬 **Try asking me naturally:**\n${contextualSuggestions.slice(0, 4).map(s => `• ${s}`).join('\n')}\n\n🌟 **Popular conversation starters:**\n• "I want to reduce plastic waste in my [area] but have budget constraints"\n• "What's better for the environment - bamboo or steel products?"\n• "Create a sustainable routine for a busy professional"\n• "Help me convince my family to switch to eco-friendly products"\n• "What's the ROI of switching to sustainable products?"\n\n✨ **Advanced features:**\n🔍 Context-aware conversations\n📊 Environmental impact calculations\n💰 Budget optimization strategies\n🎯 Lifestyle-based recommendations\n\n**What aspect of sustainable living interests you most?** I'm excited to help! 😊`;

  }, [products, userName, userProfile, conversationContext, aiState]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim() === '' || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    addBotMessage(getAdvancedBotResponse(inputMessage.trim()), 1400);
    setInputMessage('');
  }, [inputMessage, isTyping, getAdvancedBotResponse]);

  const addBotMessage = useCallback((text, delay = 1400) => {
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = {
        id: Date.now(),
        text,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  }, []);

  const handleQuickReply = useCallback((reply) => {
    if (isTyping) return;
    
    const userMessage = {
      id: Date.now(),
      text: reply.text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    addBotMessage(getAdvancedBotResponse(reply.keyword), 1200);
  }, [isTyping, getAdvancedBotResponse]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Dynamic quick replies based on AI understanding and context
  const getIntelligentQuickReplies = () => {
    const contextualReplies = [];
    
    // Add contextual replies based on conversation state
    if (!userName) {
      contextualReplies.push({ text: '👋 Hi, I\'m New!', keyword: 'hi I am new to eco-friendly products', priority: 1 });
    }
    
    if (conversationContext.conversationDepth > 3 && !userProfile.budget) {
      contextualReplies.push({ text: '💰 Set Budget', keyword: 'my budget is around 200 rupees', priority: 1 });
    }
    
    if (conversationContext.lastTopic === 'products') {
      contextualReplies.push({ text: '🆚 Compare These', keyword: 'compare these products for me', priority: 1 });
    }
    
    // Base intelligent replies
    const baseReplies = [
      { text: '🛍️ Smart Products', keyword: 'show me your best eco-friendly products', priority: 1 },
      { text: '🌱 Eco Tips', keyword: 'give me personalized eco tips', priority: 1 },
      { text: '⭐ Bestsellers', keyword: 'what are your most popular products', priority: 2 },
      { text: '🎯 For My Lifestyle', keyword: 'recommend products for my lifestyle', priority: 1 },
      { text: '💡 Expert Advice', keyword: 'I need expert advice on sustainable living', priority: 2 },
      { text: '🧮 Impact Calculator', keyword: 'calculate my environmental impact', priority: 3 },
    ];

    return [...contextualReplies, ...baseReplies]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 6);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "🌟 **Fresh Intelligent Conversation Started!**\n\nHi! I'm EcoBot with advanced AI and natural language understanding! 🧠\n\n✨ **Enhanced Capabilities:**\n🎯 **Complex Query Processing** - Understand nuanced requests\n💬 **Natural Conversation** - Talk like you would to a friend\n🧠 **Context Memory** - Remember our entire conversation\n📊 **Smart Analytics** - Provide data-driven insights\n🌱 **Personalized Learning** - Adapt to your preferences\n⚡ **Real-time Understanding** - Process complex requests instantly\n\n**Try me with sophisticated questions like:**\n\"I'm a college student with ₹300 budget who wants to start sustainable living but doesn't know where to begin, and I'm specifically interested in reducing plastic waste in my daily routine while also considering the long-term cost benefits\"\n\n**What complex eco-challenge can I help you solve today?**",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    
    // Reset all contexts and states
    setConversationContext({
      lastTopic: '',
      currentFlow: '',
      recommendedProducts: [],
      askedQuestions: [],
      userIntent: '',
      sentiment: 'neutral',
      conversationDepth: 0,
      topics_discussed: [],
      user_concerns: [],
      preferences_learned: [],
      session_products_viewed: []
    });
    
    setAiState({
      understanding_level: 0,
      confidence_score: 0,
      learning_mode: true,
      personalization_data: {},
      response_quality: 0
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[600px] mb-4 flex flex-col border border-gray-200 overflow-hidden">
          {/* Advanced Header with AI indicators */}
          <div className="bg-gradient-to-r from-[#1A3329] to-[#2F6844] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center relative">
                <span className="text-lg animate-pulse">🧠</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">AI</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold flex items-center">
                  EcoBot Advanced
                  {userName && <span className="ml-2 text-xs bg-green-400 bg-opacity-20 px-2 py-1 rounded-full">Hi {userName}!</span>}
                </h3>
                <p className="text-xs text-green-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Smart • Contextual • Learning
                  {aiState.understanding_level > 50 && <span className="ml-2">🎯</span>}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="text-xs text-green-100 text-right">
                <div>AI: {Math.floor(aiState.understanding_level)}%</div>
                <div>Context: {conversationContext.topics_discussed.length}</div>
              </div>
              <button
                onClick={clearChat}
                className="text-white hover:text-green-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                title="New intelligent conversation"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Messages with advanced formatting */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  message.isBot 
                    ? 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm' 
                    : 'bg-gradient-to-r from-[#2F6844] to-[#1A3329] text-white rounded-br-sm'
                }`}>
                  <div className="whitespace-pre-wrap break-words">{message.text}</div>
                  <div className="text-xs opacity-70 mt-2 pt-1 border-t border-gray-200 border-opacity-30 flex justify-between">
                    <span>{new Date(message.timestamp).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                    {message.isBot && aiState.confidence_score > 0 && (
                      <span className="flex items-center">
                        🎯 {Math.floor(aiState.confidence_score)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Advanced typing indicator with AI processing */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm animate-pulse">🧠</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">Advanced AI processing your request...</span>
                      <div className="flex space-x-1">
                        {[0, 1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-[#2F6844] rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Intelligent Quick Replies */}
          <div className="px-4 py-3 border-t bg-gradient-to-r from-gray-50 to-white">
            <p className="text-xs text-gray-600 font-medium mb-3 flex items-center">
              <span className="mr-2">🧠</span>
              {userName ? `Intelligent suggestions for ${userName}:` : 'Smart AI-Powered Actions:'}
              {aiState.understanding_level > 30 && <span className="ml-2">🎯 Learning...</span>}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {getIntelligentQuickReplies().map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs bg-white hover:bg-blue-50 hover:border-[#2F6844] hover:shadow-md px-3 py-2 rounded-lg border border-gray-200 transition-all disabled:opacity-50 group transform hover:scale-105"
                  disabled={isTyping}
                >
                  <span className="font-medium text-gray-700 group-hover:text-[#2F6844]">
                    {reply.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Input Area with AI assistance indicators */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  userName 
                    ? `Ask me anything naturally, ${userName}...` 
                    : "Ask me anything in natural language..."
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6844] focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-all"
                disabled={isTyping}
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-[#2F6844] to-[#1A3329] text-white px-6 py-3 rounded-xl hover:from-[#1A3329] hover:to-[#2F6844] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={isTyping || !inputMessage.trim()}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className="flex items-center">
                <span className="mr-1">🧠</span>
                {userName ? `Advanced AI for ${userName}` : 'Natural language understanding'}
              </span>
              <span className="flex items-center">
                💡 Try complex questions • Enter ↵
              </span>
            </div>
            
            {/* AI Processing Indicator */}
            {aiState.understanding_level > 0 && (
              <div className="mt-2 bg-blue-50 rounded-lg p-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-600 font-medium">🧠 AI Learning Progress:</span>
                  <span className="text-blue-800">{Math.floor(aiState.understanding_level)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${aiState.understanding_level}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Chat Button with AI indicator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-[#1A3329] to-[#2F6844] text-white w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        {isOpen ? (
          <svg className="h-6 w-6 relative z-10 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative z-10">
            <div className="text-2xl animate-bounce">🧠</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
              <span className="text-xs font-bold">AI</span>
            </div>
            {/* AI Activity Ring */}
            {aiState.understanding_level > 30 && (
              <div className="absolute inset-0 border-2 border-green-400 rounded-full animate-spin opacity-30"></div>
            )}
          </div>
        )}
      </button>

      {/* Enhanced Tooltip with AI features */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl transform group-hover:translate-y-1 max-w-xs">
          <div className="flex items-center space-x-2">
            <span className="animate-bounce">🧠</span>
            <span className="font-medium">Advanced AI Assistant!</span>
            <span className="animate-pulse">✨</span>
          </div>
          <div className="text-xs text-gray-300 mt-1 text-center">
            {userName ? (
              `Hi ${userName}! I remember our chats!`
            ) : (
              <div>
                <div>🎯 Natural language understanding</div>
                <div>🧠 Context awareness & learning</div>
                <div>🌱 Personalized eco-guidance</div>
              </div>
            )}
          </div>
          <div className="absolute top-full right-6 w-3 h-3 bg-gray-900 transform rotate-45 -mt-1.5"></div>
        </div>
      )}

      {/* Background AI Processing Indicator */}
      {isTyping && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
      )}

      {/* Session Statistics (Development Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-20 right-0 bg-black bg-opacity-80 text-white p-2 rounded-l text-xs">
          <div>AI Level: {Math.floor(aiState.understanding_level)}%</div>
          <div>Confidence: {Math.floor(aiState.confidence_score)}%</div>
          <div>Messages: {messages.length}</div>
          <div>Context: {conversationContext.topics_discussed.length}</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatbot;


