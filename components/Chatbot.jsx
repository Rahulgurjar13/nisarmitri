import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Comprehensive product data based on real Nisarg Maitri offerings
const SAMPLE_PRODUCTS = [
  { 
    id: 1, 
    name: 'Bamboo Toothbrush', 
    price: 40, 
    originalPrice: 60,
    category: 'Bamboo', 
    description: 'Eco-friendly bamboo toothbrush with soft bristles', 
    rating: 4.5,
    reviews: 342,
    tags: ['dental', 'hygiene', 'sustainable', 'biodegradable', 'daily-use'],
    benefits: ['Zero plastic', 'Compostable handle', 'Antibacterial properties', 'Soft on gums'],
    inStock: true,
    stockCount: 156,
    image: '🦷',
    features: ['100% bamboo handle', 'BPA-free bristles', '6-month replacement cycle', 'Eco packaging']
  },
  { 
    id: 2, 
    name: 'Medical Grade Menstrual Cup', 
    price: 299, 
    originalPrice: 450,
    category: 'Menstrual', 
    description: 'Medical-grade silicone menstrual cup - 10+ year lifespan', 
    rating: 4.8,
    reviews: 1247,
    tags: ['health', 'women', 'reusable', 'medical-grade', 'period-care'],
    benefits: ['Saves ₹20,000+ over lifetime', '12-hour protection', 'Chemical-free', 'Eco-friendly'],
    inStock: true,
    stockCount: 89,
    image: '🌸',
    features: ['FDA approved silicone', 'Available in 2 sizes', 'Leak-proof design', 'Sterilization cup included']
  },
  { 
    id: 3, 
    name: 'Insulated Steel Water Bottle', 
    price: 199, 
    originalPrice: 299,
    category: 'Steel', 
    description: 'Double-wall insulated stainless steel bottle', 
    rating: 4.6,
    reviews: 567,
    tags: ['hydration', 'insulated', 'durable', 'bpa-free', 'travel'],
    benefits: ['24hr cold retention', '12hr hot retention', 'Leak-proof', 'Scratch resistant'],
    inStock: true,
    stockCount: 234,
    image: '💧',
    features: ['Food-grade steel', '500ml/750ml/1L sizes', 'Wide mouth design', 'Non-slip base']
  },
  { 
    id: 4, 
    name: 'Portable Bamboo Cutlery Set', 
    price: 199, 
    originalPrice: 250,
    category: 'Bamboo', 
    description: 'Travel-friendly bamboo cutlery with organic cotton pouch', 
    rating: 4.4,
    reviews: 423,
    tags: ['portable', 'dining', 'travel', 'lightweight', 'zero-waste'],
    benefits: ['Ultra portable', 'Dishwasher safe', 'Plastic alternative', 'Includes cleaning brush'],
    inStock: true,
    stockCount: 178,
    image: '🍴',
    features: ['Fork, spoon, knife, chopsticks', 'Organic cotton pouch', 'Lightweight design', 'Natural finish']
  },
  { 
    id: 5, 
    name: 'Reusable Bamboo Makeup Pads', 
    price: 69, 
    originalPrice: 99,
    category: 'Reusable', 
    description: 'Set of 10 washable bamboo fiber makeup remover pads', 
    rating: 4.7,
    reviews: 891,
    tags: ['beauty', 'skincare', 'washable', 'soft', 'daily-care'],
    benefits: ['500+ wash cycles', 'Ultra soft texture', 'Chemical-free', 'Mesh laundry bag included'],
    inStock: true,
    stockCount: 267,
    image: '💄',
    features: ['Bamboo fiber blend', 'Different textures available', 'Quick drying', 'Hypoallergenic']
  },
  {
    id: 6,
    name: 'Organic Cotton Tote Bag',
    price: 149,
    originalPrice: 199,
    category: 'Cotton',
    description: 'Heavy-duty organic cotton shopping tote bag',
    rating: 4.3,
    reviews: 234,
    tags: ['shopping', 'organic', 'durable', 'versatile', 'plastic-free'],
    benefits: ['Holds 15kg weight', 'Machine washable', 'Plastic bag alternative', 'Long handles'],
    inStock: true,
    stockCount: 145,
    image: '👜',
    features: ['GOTS certified cotton', 'Reinforced stitching', 'Large capacity', 'Foldable design']
  },
  {
    id: 7,
    name: 'Adjustable Bamboo Phone Stand',
    price: 89,
    originalPrice: 120,
    category: 'Bamboo',
    description: 'Multi-angle bamboo phone and tablet stand',
    rating: 4.5,
    reviews: 156,
    tags: ['tech', 'workspace', 'adjustable', 'stable', 'office'],
    benefits: ['7 viewing angles', 'Anti-slip base', 'Cable management slot', 'Tablet compatible'],
    inStock: false,
    stockCount: 0,
    image: '📱',
    features: ['Universal compatibility', 'Foldable design', 'Natural bamboo finish', 'Ventilation holes']
  },
  {
    id: 8,
    name: '3-Tier Steel Lunch Box',
    price: 399,
    originalPrice: 499,
    category: 'Steel',
    description: 'Stackable stainless steel lunch box with airtight seal',
    rating: 4.6,
    reviews: 312,
    tags: ['food', 'compartments', 'airtight', 'healthy', 'work'],
    benefits: ['100% leak-proof', '3 separate compartments', 'Microwave safe', 'Easy to clean'],
    inStock: true,
    stockCount: 67,
    image: '🍱',
    features: ['Vacuum seal technology', 'Insulated design', 'Compact stacking', 'BPA-free']
  },
  {
    id: 9,
    name: 'Natural Bamboo Drinking Straws',
    price: 79,
    originalPrice: 99,
    category: 'Bamboo',
    description: 'Set of 5 handcrafted bamboo drinking straws',
    rating: 4.4,
    reviews: 445,
    tags: ['drinks', 'natural', 'reusable', 'party', 'kids-safe'],
    benefits: ['100% natural', 'Kid-friendly', 'Cleaning brush included', 'Biodegradable'],
    inStock: true,
    stockCount: 289,
    image: '🥤',
    features: ['Hand-selected bamboo', 'Different sizes', 'Smooth finish', 'Organic cotton pouch']
  },
  {
    id: 10,
    name: 'Eco-Friendly Bamboo Razor',
    price: 149,
    originalPrice: 199,
    category: 'Bamboo',
    description: 'Double-edge bamboo handle safety razor',
    rating: 4.3,
    reviews: 167,
    tags: ['grooming', 'men', 'women', 'plastic-free', 'premium'],
    benefits: ['Reduces plastic waste', 'Cost-effective blades', 'Superior shave quality', 'Durable design'],
    inStock: true,
    stockCount: 92,
    image: '🪒',
    features: ['Replaceable blades', 'Ergonomic grip', 'Chrome-plated head', 'Blade disposal slot']
  }
];

// Comprehensive eco-tips database
const ECO_TIPS_DATABASE = {
  beginner: [
    { tip: "Start with one reusable item daily", impact: "Reduces 365+ plastic items yearly" },
    { tip: "Use bamboo toothbrush", impact: "Prevents 4+ plastic brushes in landfills yearly" },
    { tip: "Carry reusable water bottle", impact: "Saves 1000+ plastic bottles annually" },
    { tip: "Switch to LED bulbs", impact: "Uses 80% less energy than traditional bulbs" },
    { tip: "Use both sides of paper", impact: "Reduces paper consumption by 50%" }
  ],
  intermediate: [
    { tip: "Start composting kitchen waste", impact: "Reduces household waste by 30%" },
    { tip: "Use menstrual cups instead of disposables", impact: "Saves ₹20,000+ and reduces waste" },
    { tip: "Make DIY cleaning products", impact: "Eliminates chemical packaging waste" },
    { tip: "Buy in bulk to reduce packaging", impact: "Cuts packaging waste by 60%" },
    { tip: "Use cold water for washing clothes", impact: "Saves 90% of washing energy" }
  ],
  advanced: [
    { tip: "Install solar panels or use renewable energy", impact: "Reduces carbon footprint by tons" },
    { tip: "Create a zero-waste bathroom", impact: "Eliminates 100+ plastic items yearly" },
    { tip: "Start urban gardening", impact: "Reduces transport emissions & plastic packaging" },
    { tip: "Use electric or hybrid vehicles", impact: "Reduces transport emissions by 50%+" },
    { tip: "Practice minimalism in purchases", impact: "Dramatically reduces overall consumption" }
  ]
};

// FAQ Database
const FAQ_DATABASE = [
  {
    question: "How long do bamboo products last?",
    answer: "Bamboo toothbrushes last 3-4 months, cutlery sets last 2-3 years, and other bamboo items typically last 1-5 years depending on usage. They're designed to be durable yet biodegradable."
  },
  {
    question: "Are menstrual cups safe?",
    answer: "Yes! Our menstrual cups are made from medical-grade silicone, FDA approved, and completely safe. They can be used for 10+ years with proper care and provide 12-hour protection."
  },
  {
    question: "How do I clean bamboo products?",
    answer: "Most bamboo products are dishwasher safe or can be hand-washed with mild soap. For toothbrushes, rinse with water and let air dry. Avoid soaking in water for extended periods."
  },
  {
    question: "What's your return policy?",
    answer: "We offer 30-day returns for unused products. If you're not satisfied with your eco-friendly purchase, contact us at support@nisargmaitri.com for hassle-free returns."
  },
  {
    question: "Do you offer bulk discounts?",
    answer: "Yes! We offer 15% off on orders above ₹1000, 20% off above ₹2000, and custom pricing for bulk orders. Perfect for offices, schools, and organizations going green!"
  }
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! 🙏 I'm EcoBot, your personal sustainability companion from Nisarg Maitri! 🌱\n\n✨ **I'm here to help you with:**\n🛍️ Smart Product Recommendations\n🌱 Personalized Eco Tips & Advice\n💡 Sustainable Living Guidance\n📊 Product Comparisons & Reviews\n🎯 Eco-Impact Calculations\n❓ Expert Q&A on Green Living\n\n**Ready to start your eco-journey?** Ask me anything or try the quick buttons below! 😊",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [products] = useState(SAMPLE_PRODUCTS);
  const [userName, setUserName] = useState('');
  const [userProfile, setUserProfile] = useState({
    preferences: [],
    budget: null,
    location: '',
    interests: [],
    ecoLevel: 'beginner', // beginner, intermediate, advanced
    purchaseHistory: []
  });
  const [conversationContext, setConversationContext] = useState({
    lastTopic: '',
    currentFlow: '',
    recommendedProducts: [],
    askedQuestions: [],
    userIntent: ''
  });
  const [chatPersonality, setChatPersonality] = useState('friendly'); // friendly, expert, casual
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Dynamic quick replies based on context and user profile
  const getDynamicQuickReplies = () => {
    const contextualReplies = [];
    
    if (!userName) {
      contextualReplies.push({ text: '👋 Hi, I\'m new!', keyword: 'new_user', priority: 1 });
    }
    
    if (!userProfile.budget) {
      contextualReplies.push({ text: '💰 Set My Budget', keyword: 'set_budget', priority: 2 });
    }
    
    // Base replies
    const baseReplies = [
      { text: '🛍️ Show Products', keyword: 'products', priority: 1 },
      { text: '🌱 Eco Tips', keyword: 'tips', priority: 1 },
      { text: '⭐ Best Sellers', keyword: 'bestsellers', priority: 2 },
      { text: '🆚 Compare Items', keyword: 'compare', priority: 3 },
      { text: '❓ Ask Expert', keyword: 'expert', priority: 2 },
      { text: '🎯 For Me', keyword: 'personalized', priority: 1 },
    ];

    return [...contextualReplies, ...baseReplies]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 6);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = useCallback((text, delay = 1200, suggestions = []) => {
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = {
        id: Date.now(),
        text,
        isBot: true,
        timestamp: new Date(),
        suggestions: suggestions
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  }, []);

  // Advanced NLP for better intent recognition
  const detectUserIntent = (input) => {
    const lowerInput = input.toLowerCase();
    
    const intents = {
      greeting: /^(hi|hello|hey|namaste|start|sup|yo)/,
      product_search: /(show|find|search|looking for|need|want).*(product|item)/,
      price_inquiry: /(price|cost|how much|expensive|cheap|budget)/,
      comparison: /(compare|versus|vs|difference|better)/,
      eco_tips: /(tip|advice|help|guide|sustainable|eco|green)/,
      support: /(help|support|problem|issue|contact)/,
      goodbye: /(bye|goodbye|see you|exit|close)/,
      thanks: /(thank|thanks|appreciate)/
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(lowerInput)) {
        return intent;
      }
    }
    return 'general';
  };

  // Smart product recommendation engine
  const getSmartRecommendations = (userInput = '', context = {}) => {
    const lowerInput = userInput.toLowerCase();
    let scored = products.map(product => {
      let score = 0;
      
      // Keyword matching
      product.tags.forEach(tag => {
        if (lowerInput.includes(tag)) score += 3;
      });
      
      // Category matching
      if (lowerInput.includes(product.category.toLowerCase())) score += 4;
      
      // Name matching
      if (lowerInput.includes(product.name.toLowerCase())) score += 5;
      
      // Budget preference
      if (userProfile.budget) {
        if (product.price <= userProfile.budget) score += 2;
        if (product.price > userProfile.budget * 1.5) score -= 3;
      }
      
      // Rating and popularity
      score += (product.rating * product.reviews) / 500;
      
      // Stock availability
      if (product.inStock) score += 1;
      else score -= 5;
      
      // User profile matching
      if (userProfile.preferences.includes(product.category)) score += 2;
      
      return { ...product, score };
    });
    
    return scored
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  // Enhanced response system with personality and context awareness
  const getBotResponse = useCallback((input) => {
    const lowerInput = input.toLowerCase().trim();
    const intent = detectUserIntent(input);
    
    // Update conversation context
    setConversationContext(prev => ({
      ...prev,
      userIntent: intent,
      askedQuestions: [...prev.askedQuestions.slice(-4), lowerInput] // Keep last 5
    }));

    // Greeting with personality
    if (intent === 'greeting' || lowerInput.match(/^(hi|hello|hey|namaste|start)/)) {
      const greetings = [
        "Namaste! 🙏 Welcome to your sustainable journey!",
        "Hello there! 🌟 Ready to make Earth-friendly choices?",
        "Hey! 👋 Excited to help you go green today!",
        "Hi! 🌱 Let's explore amazing eco-friendly solutions together!"
      ];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      
      return `${randomGreeting}\n\n💚 **I'm EcoBot from Nisarg Maitri** - your guide to sustainable living!\n\n🎯 **Tell me about yourself to get personalized recommendations:**\n• What's your eco-experience level?\n• Any specific products you're interested in?\n• What's your typical budget range?\n\n💬 **Or simply ask:** "Show me your best products" or "Give me beginner eco tips"`;
    }

    // Enhanced name collection with onboarding
    const nameMatch = lowerInput.match(/(?:my name is|i am|call me|i'm)\s+([a-zA-Z\s]+)/);
    if (nameMatch) {
      const name = nameMatch[1].trim().split(' ')[0];
      setUserName(name);
      return `Wonderful to meet you, ${name}! 🎉\n\n🌟 **Welcome to the Nisarg Maitri family!** Now I can give you much more personalized help!\n\n🎯 **Quick setup to serve you better:**\n1️⃣ What's your eco-experience? (Beginner/Intermediate/Advanced)\n2️⃣ Any specific interests? (Health, Kitchen, Personal Care, etc.)\n3️⃣ Preferred budget range?\n\n💡 **Or jump right in:** "Show me popular products" or "I need something under ₹200"`;
    }

    // New user onboarding
    if (intent === 'greeting' && lowerInput.includes('new')) {
      return `Welcome to Nisarg Maitri! 🌱 **India's trusted eco-friendly brand since 2023!**\n\n✨ **Why choose us?**\n• 🏆 4.5+ star rated products\n• 🚚 Free shipping on ₹500+\n• 🔄 30-day easy returns\n• 🌍 10,000+ happy eco-warriors\n• 📞 Expert support: +91 9999010997\n\n🎯 **Perfect for beginners:**\n• Bamboo Toothbrush (₹40)\n• Reusable Water Bottle (₹199)\n• Makeup Remover Pads (₹69)\n\n**Ready to start?** What type of product interests you most?`;
    }

    // Budget setting with intelligence
    if (lowerInput.includes('budget') || lowerInput.includes('set') && lowerInput.includes('budget')) {
      const budgetRanges = [
        { range: "Under ₹100", desc: "Essential eco-starters", products: "Bamboo toothbrush, Makeup pads, Straws" },
        { range: "₹100-300", desc: "Quality daily-use items", products: "Water bottles, Cutlery sets, Cotton bags" },
        { range: "₹300-500", desc: "Premium eco-solutions", products: "Lunch boxes, Menstrual cups, Razor sets" },
        { range: "₹500+", desc: "Complete eco-lifestyle", products: "Product bundles, Gift sets, Bulk orders" }
      ];
      
      const budgetList = budgetRanges.map(b => 
        `💰 **${b.range}** - ${b.desc}\n   ${b.products}`
      ).join('\n\n');
      
      return `💰 **Let's find your perfect budget range!**\n\n${budgetList}\n\n🎯 **Just tell me:** "My budget is ₹200" or "I want to spend around ₹150"\n\n💡 **Pro tip:** Higher budgets often mean better durability and longer-lasting products!`;
    }

    // Enhanced budget parsing
    const budgetMatch = lowerInput.match(/budget.*?(\d+)|(\d+).*?budget|spend.*?(\d+)|around.*?(\d+)|under.*?(\d+)|below.*?(\d+)/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4] || budgetMatch[5] || budgetMatch[6]);
      setUserProfile(prev => ({ ...prev, budget }));
      
      const budgetProducts = products.filter(p => p.price <= budget && p.inStock);
      const perfectMatches = budgetProducts.slice(0, 3);
      const nearBudget = products.filter(p => p.price <= budget * 1.2 && p.inStock).slice(0, 2);
      
      if (perfectMatches.length > 0) {
        const productList = perfectMatches.map(p => 
          `${p.image} **${p.name}** - ₹${p.price} ${p.originalPrice > p.price ? `~~₹${p.originalPrice}~~` : ''}\n   ⭐${p.rating} (${p.reviews} reviews) | ${p.benefits.slice(0, 2).join(' • ')}`
        ).join('\n\n');
        
        const savings = perfectMatches.reduce((sum, p) => sum + (p.originalPrice - p.price), 0);
        
        return `Perfect! 🎯 **Your budget: ₹${budget}** \n\n🛍️ **Top ${perfectMatches.length} matches for you:**\n\n${productList}\n\n💰 **Total savings available: ₹${savings}**\n🚚 **Free shipping** ${budget >= 500 ? '✅' : 'on ₹500+ orders'}\n\n💡 **Want specific recommendations?** Try: "Show me bamboo products under ₹${budget}"`;
      } else if (nearBudget.length > 0) {
        const productList = nearBudget.map(p => `${p.image} ${p.name} - ₹${p.price}`).join('\n');
        return `🤔 **Limited options at ₹${budget}**, but here are close matches:\n\n${productList}\n\n💡 **Suggestions:**\n• Increase to ₹${budget + 50} for ${products.filter(p => p.price <= budget + 50).length} more options\n• Check our combo offers for better value\n• Look for seasonal discounts\n\nWhat would you prefer?`;
      }
    }

    // Expert Q&A system
    if (lowerInput.includes('expert') || lowerInput.includes('question') || lowerInput.includes('ask')) {
      const faqMatch = FAQ_DATABASE.find(faq => 
        lowerInput.includes(faq.question.toLowerCase().split(' ').slice(0, 2).join(' '))
      );
      
      if (faqMatch) {
        return `🧠 **Expert Answer:**\n\n❓ **${faqMatch.question}**\n\n💡 ${faqMatch.answer}\n\n🎯 **More questions?** Ask about:\n• Product safety and certifications\n• Usage and maintenance tips\n• Environmental impact\n• Bulk pricing and discounts`;
      }
      
      return `🧠 **Ask Our Eco-Expert!**\n\n🔥 **Popular Questions:**\n\n${FAQ_DATABASE.slice(0, 3).map(faq => `❓ ${faq.question}`).join('\n')}\n\n💬 **Or ask anything about:**\n• Product safety & quality\n• Environmental benefits\n• Usage & maintenance\n• Bulk orders & discounts\n\n**Just ask naturally!** Like "Are bamboo products durable?" or "How to clean menstrual cups?"`;
    }

    // Enhanced product search with AI
    if (intent === 'product_search' || lowerInput.includes('product') || lowerInput.includes('show') || lowerInput.includes('🛍️')) {
      setConversationContext(prev => ({ ...prev, lastTopic: 'products' }));
      const recommendations = getSmartRecommendations(lowerInput);
      const topPicks = recommendations.slice(0, 4);
      
      if (topPicks.length > 0) {
        const productList = topPicks.map(p => 
          `${p.image} **${p.name}** - ₹${p.price} ${p.originalPrice > p.price ? `~~₹${p.originalPrice}~~` : ''}\n   ⭐${p.rating}/5 (${p.reviews} reviews) • ${p.inStock ? '✅ In Stock' : '❌ Out of Stock'}\n   💡 ${p.benefits.slice(0, 2).join(' • ')}\n   🏷️ ${p.features.slice(0, 2).join(' • ')}`
        ).join('\n\n');
        
        const totalSavings = topPicks.reduce((sum, p) => sum + Math.max(0, p.originalPrice - p.price), 0);
        
        return `🛍️ **Perfect matches for you:**\n\n${productList}\n\n💰 **You save: ₹${totalSavings} total**\n🚚 **Free shipping on ₹500+**\n\n🎯 **Want more specific results?** Try:\n• "Show me bamboo products"\n• "I need something for daily use"\n• "What's best for ₹200?"`;
      }
    }

    // Bestsellers and trending
    if (lowerInput.includes('best') || lowerInput.includes('popular') || lowerInput.includes('trending') || lowerInput.includes('bestsellers')) {
      const bestsellers = products
        .filter(p => p.inStock)
        .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
        .slice(0, 3);
        
      const productList = bestsellers.map((p, index) => 
        `${index + 1}️⃣ ${p.image} **${p.name}** - ₹${p.price}\n   🔥 ${p.reviews} happy customers • ⭐${p.rating}/5\n   ✨ ${p.benefits[0]} • ${p.features[0]}`
      ).join('\n\n');
      
      return `🔥 **Top 3 Bestsellers** (Most loved by customers):\n\n${productList}\n\n🏆 **Why customers choose these:**\n• Proven quality & durability\n• Excellent user reviews  \n• Great value for money\n• Fast shipping & support\n\n**Want details about any of these?** Just ask! Or try "Compare these products"`;
    }

    // Enhanced category searches with detailed info
    const categories = {
      'bamboo': {
        emoji: '🎋',
        name: 'Bamboo Collection',
        products: products.filter(p => p.category === 'Bamboo'),
        benefits: ['100% Natural & Renewable', 'Biodegradable in 2-3 years', 'Antibacterial Properties', 'Carbon Negative Growth'],
        facts: 'Bamboo grows 3x faster than trees and produces 35% more oxygen!'
      },
      'steel': {
        emoji: '💧',
        name: 'Stainless Steel Range',
        products: products.filter(p => p.category === 'Steel'),
        benefits: ['Food-Grade Safety', '100% Recyclable', 'Lifetime Durability', 'Temperature Retention'],
        facts: 'Steel can be recycled infinitely without losing quality!'
      },
      'menstrual': {
        emoji: '🌸',
        name: 'Feminine Care',
        products: products.filter(p => p.category === 'Menstrual'),
        benefits: ['Medical-Grade Safe', 'Saves ₹20,000+ Lifetime', '10+ Year Lifespan', 'Chemical-Free'],
        facts: 'One menstrual cup replaces 2,400+ disposable products!'
      }
    };

    for (const [category, info] of Object.entries(categories)) {
      if (lowerInput.includes(category)) {
        const availableProducts = info.products.filter(p => p.inStock);
        if (availableProducts.length > 0) {
          const productList = availableProducts.map(p => 
            `${p.image} **${p.name}** - ₹${p.price} ${p.originalPrice > p.price ? `~~₹${p.originalPrice}~~` : ''}\n   ${p.benefits.slice(0, 2).join(' • ')} ⭐${p.rating}`
          ).join('\n\n');
          
          return `${info.emoji} **${info.name}:**\n\n${productList}\n\n🌟 **Why Choose ${category.charAt(0).toUpperCase() + category.slice(1)}:**\n${info.benefits.map(b => `✅ ${b}`).join('\n')}\n\n💡 **Did you know?** ${info.facts}\n\n🌍 **Environmental Impact:** Every purchase helps reduce plastic waste significantly!`;
        }
      }
    }

    // Enhanced comparison with detailed analysis
    if (lowerInput.includes('compare') || lowerInput.includes('vs') || lowerInput.includes('🆚')) {
      const topProducts = products.filter(p => p.rating >= 4.5 && p.inStock).slice(0, 3);
      const comparison = topProducts.map((p, index) => 
        `**${index + 1}. ${p.name}** - ₹${p.price}\n🏷️ **Category:** ${p.category}\n⭐ **Rating:** ${p.rating}/5 (${p.reviews} reviews)\n💰 **Value:** ${((p.rating * 100) / p.price).toFixed(1)} points per ₹\n✅ **Top Benefits:** ${p.benefits.slice(0, 2).join(', ')}\n🔧 **Features:** ${p.features.slice(0, 2).join(', ')}`
      ).join('\n\n🆚\n\n');
      
      return `🆚 **Smart Product Comparison:**\n\n${comparison}\n\n🎯 **Quick Decision Matrix:**\n• **Best Value:** Product with highest rating-to-price ratio\n• **Most Popular:** Based on customer reviews\n• **Best for Beginners:** Easiest to use and maintain\n• **Premium Choice:** Highest rated overall\n\n💡 **Need help choosing?** Tell me your priority: budget, quality, or specific use case!`;
    }

    // Personalized recommendations
    if (lowerInput.includes('personalized') || lowerInput.includes('for me') || lowerInput.includes('recommend')) {
      const level = userProfile.ecoLevel;
      const personalizedProducts = getSmartRecommendations('', { userProfile }).slice(0, 3);
      
      const levelTips = ECO_TIPS_DATABASE[level] || ECO_TIPS_DATABASE.beginner;
      const todaysTip = levelTips[Math.floor(Math.random() * levelTips.length)];
      
      const productList = personalizedProducts.map(p => 
        `${p.image} **${p.name}** - ₹${p.price}\n   Perfect for: ${p.benefits.slice(0, 2).join(' & ')}`
      ).join('\n\n');
      
      const userName_text = userName ? `, ${userName}` : '';
      return `🎯 **Personalized Just For You${userName_text}:**\n\n📦 **Your Recommended Products:**\n${productList}\n\n🌱 **Today's Eco-Tip for ${level}s:**\n💡 ${todaysTip.tip}\n🌍 Impact: ${todaysTip.impact}\n\n✨ **Based on your profile:** ${level} level eco-warrior\n\n**Want more personalized suggestions?** Tell me about your lifestyle, interests, or specific needs!`;
    }

    // Enhanced eco tips with levels and impact
    if (lowerInput.includes('tip') || lowerInput.includes('eco') || lowerInput.includes('sustainable') || lowerInput.includes('🌱')) {
      const userLevel = userProfile.ecoLevel || 'beginner';
      const tips = ECO_TIPS_DATABASE[userLevel];
      const randomTips = tips.sort(() => 0.5 - Math.random()).slice(0, 4);
      
      const tipsList = randomTips.map((tip, index) => 
        `${index + 1}️⃣ **${tip.tip}**\n   🌍 Impact: ${tip.impact}`
      ).join('\n\n');
      
      const userName_text = userName ? `, ${userName}` : '';
      return `🌱 **Eco Tips for ${userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}s${userName_text}:**\n\n${tipsList}\n\n💡 **This Week's Challenge:** Pick ONE tip to implement!\n\n🎯 **Want tips for different levels?** Ask for:\n• "Beginner eco tips" - Getting started\n• "Intermediate tips" - Building habits  \n• "Advanced tips" - Lifestyle transformation\n\n🌟 Small consistent actions create massive environmental impact!`;
    }

    // Contact and support with real info
    if (lowerInput.includes('contact') || lowerInput.includes('support') || lowerInput.includes('help') || lowerInput.includes('📞')) {
      return `📞 **Contact Nisarg Maitri:**\n\n🏢 **Head Office:** Greater Noida, UP\nParsvnath Edens, Near Ryan International School\nAlpha 2, Greater Noida - 201306\n\n📧 **Email:** nisargmaitri4@gmail.com\n📱 **WhatsApp/Call:** +91 9999010997\n⏰ **Hours:** Monday-Friday, 9 AM - 6 PM IST\n\n🌐 **Website:** www.nisargmaitri.in\n📍 **Other Location:** Tilak Nagar, Indore\n\n💬 **Live Chat:** Right here with me!\n🚚 **Shipping:** Pan-India delivery\n🔄 **Returns:** 30-day hassle-free policy\n\n**How can I help you today?** 😊`;
    }

    // Thank you with personality
    if (intent === 'thanks' || lowerInput.includes('thank')) {
      const responses = [
        `You're absolutely welcome${userName ? `, ${userName}` : ''}! 😊`,
        `My pleasure to help${userName ? `, ${userName}` : ''}! 🌟`,
        `Happy to support your eco-journey${userName ? `, ${userName}` : ''}! 💚`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return `${randomResponse}\n\n🌱 **I love helping people embrace sustainable living!** Your choices make a real difference for our planet! 🌍\n\n✨ **Keep exploring:**\n• Discover new product categories\n• Get personalized eco-tips\n• Learn about environmental impact\n• Ask for bulk pricing\n\n💡 **Remember:** Every eco-friendly choice counts towards a better future!`;
    }

    // Goodbye with warmth
    if (intent === 'goodbye' || lowerInput.includes('bye')) {
      const goodbyes = [
        `Take care${userName ? `, ${userName}` : ''}! 🌱`,
        `Goodbye${userName ? `, ${userName}` : ''}! Keep being awesome! 🌟`,
        `See you soon${userName ? `, ${userName}` : ''}! 💚`
      ];
      const randomGoodbye = goodbyes[Math.floor(Math.random() * goodbyes.length)];
      
      return `${randomGoodbye}\n\n🌍 **Thank you for choosing sustainable living with Nisarg Maitri!** Together we're making Earth healthier! \n\n💚 **Your Eco Impact Summary:**\n• Products viewed: ${conversationContext.recommendedProducts.length || 'Several'}\n• Tips learned: Multiple sustainability practices\n• Potential CO₂ savings: Significant positive impact!\n\n🌱 **Come back anytime for more eco-discoveries!** ✨`;
    }

    // Enhanced default response with smart suggestions
    const contextualSuggestions = [
      "What's your bestselling product?",
      `Show me products under ₹${userProfile.budget || 200}`,
      "Give me eco tips for beginners",
      "Compare your top 3 products",
      "How do I start living sustainably?"
    ];

    return `I'd love to help you find the perfect eco-solution! 🌟\n\n🎯 **Here's what I can do:**\n• 🛍️ Find products by budget, category, or need\n• 🌱 Share personalized sustainability tips\n• ⭐ Show bestsellers & customer favorites\n• 🆚 Compare products with detailed analysis\n• 💡 Calculate environmental impact\n• 🧠 Answer expert questions\n\n💬 **Try asking:**\n${contextualSuggestions.map(s => `• "${s}"`).join('\n')}\n\n✨ **Or describe what you need!** Like:\n"Something for my morning routine" or "Eco-friendly kitchen essentials"\n\nWhat's on your mind today?`;

  }, [products, userName, userProfile, conversationContext]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim() === '' || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    addBotMessage(getBotResponse(inputMessage.trim()), 1000);
    setInputMessage('');
  }, [inputMessage, isTyping, getBotResponse, addBotMessage]);

  const handleQuickReply = useCallback((reply) => {
    if (isTyping) return;
    
    const userMessage = {
      id: Date.now(),
      text: reply.text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    addBotMessage(getBotResponse(reply.keyword), 800);
  }, [isTyping, getBotResponse, addBotMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "Fresh start! 🌟 Welcome back to Nisarg Maitri!\n\n🌱 **I'm EcoBot, ready to help you discover amazing sustainable solutions!**\n\n✨ **Popular today:**\n🔥 Bamboo products trending\n💰 Budget-friendly options available\n🎯 Personalized recommendations ready\n\n**What brings you here today?** New to eco-living or looking for something specific?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    setConversationContext({
      lastTopic: '',
      currentFlow: '',
      recommendedProducts: [],
      askedQuestions: [],
      userIntent: ''
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[600px] mb-4 flex flex-col border border-gray-200 overflow-hidden">
          {/* Enhanced Header with status */}
          <div className="bg-gradient-to-r from-[#1A3329] to-[#2F6844] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                🤖
              </div>
              <div>
                <h3 className="font-semibold flex items-center">
                  EcoBot AI 
                  {userName && <span className="ml-2 text-xs bg-green-400 bg-opacity-20 px-2 py-1 rounded-full">Hi {userName}!</span>}
                </h3>
                <p className="text-xs text-green-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Smart • Expert • Always Learning
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearChat}
                className="text-white hover:text-green-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                title="New conversation"
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

          {/* Enhanced Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  message.isBot 
                    ? 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm' 
                    : 'bg-gradient-to-r from-[#2F6844] to-[#1A3329] text-white rounded-br-sm'
                }`}>
                  <div className="whitespace-pre-wrap break-words">{message.text}</div>
                  <div className="text-xs opacity-70 mt-2 pt-1 border-t border-gray-200 border-opacity-30">
                    {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm animate-pulse">🧠</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">EcoBot is thinking smartly...</span>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map(i => (
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

          {/* Dynamic Quick Replies */}
          <div className="px-4 py-3 border-t bg-gradient-to-r from-gray-50 to-white">
            <p className="text-xs text-gray-600 font-medium mb-3 flex items-center">
              <span className="mr-2">⚡</span>
              {userName ? `Smart suggestions for ${userName}:` : 'Quick Actions:'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {getDynamicQuickReplies().map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs bg-white hover:bg-green-50 hover:border-[#2F6844] hover:shadow-md px-3 py-2 rounded-lg border border-gray-200 transition-all disabled:opacity-50 group transform hover:scale-105"
                  disabled={isTyping}
                >
                  <span className="font-medium text-gray-700 group-hover:text-[#2F6844]">
                    {reply.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="p-4 border-t bg-white">            
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  userName 
                    ? `Hey ${userName}, what can I help you discover today?` 
                    : "Ask me anything about eco-friendly products..."
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
                <span className="mr-1">🌱</span>
                {userName ? `AI-powered help for ${userName}` : 'Intelligent eco-assistant'}
              </span>
              <span className="flex items-center">
                💡 Press Enter ↵
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-[#1A3329] to-[#2F6844] text-white w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        {isOpen ? (
          <svg className="h-6 w-6 relative z-10 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative z-10">
            <div className="text-2xl animate-bounce">🤖</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
              <span className="text-xs font-bold">AI</span>
            </div>
          </div>
        )}
      </button>

      {/* Enhanced Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl transform group-hover:translate-y-1 max-w-xs">
          <div className="flex items-center space-x-2">
            <span className="animate-bounce">🤖</span>
            <span className="font-medium">Hi! I'm your intelligent eco-assistant!</span>
            <span className="animate-pulse">✨</span>
          </div>
          <div className="text-xs text-gray-300 mt-1 text-center">
            {userName ? `Welcome back ${userName}! Click to chat!` : 'Click for smart product recommendations & eco-tips!'}
          </div>
          <div className="absolute top-full right-6 w-3 h-3 bg-gray-900 transform rotate-45 -mt-1.5"></div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
