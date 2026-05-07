const products = [
  {
    id: 1,
    title: "Vintage 90s Oversized Denim Jacket",
    brand: "Levi's",
    price: 455.00,
    size: "L",
    condition: "Excellent",
    category: "Vintage",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=600",
    badge: "Vintage",
    description: "Classic 90s wash Levi's denim jacket. Perfectly worn in, oversized fit. Sustainable fashion choice."
  },
  {
    id: 2,
    title: "Pastel Knit Cardigan",
    brand: "Unbranded",
    price: 599.00,
    size: "M",
    condition: "Good",
    category: "Women",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600",
    badge: "New Arrival",
    description: "Cozy pastel knit cardigan perfect for layering. Features pearl buttons."
  },
  {
    id: 3,
    title: "Graphic Band Tee - The Cure",
    brand: "Vintage",
    price: 499.00,
    size: "XL",
    condition: "Vintage Fade",
    category: "Men",
    image: "images/black_pullover.jpg",
    badge: null,
    description: "Authentic vintage fade. Soft cotton blend with classic band graphic."
  },
  {
    id: 4,
    title: "High-Waisted Corduroy Pants",
    brand: "Urban Outfitters",
    price: 599.00,
    size: "S",
    condition: "Like New",
    category: "Women",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600",
    badge: null,
    description: "Camel colored corduroy pants with a straight leg fit."
  },
  {
    id: 5,
    title: "Chunky Platform Loafers",
    brand: "Doc Martens",
    price: 499.00,
    size: "US 8",
    condition: "Excellent",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600",
    badge: "Trending",
    description: "Classic platform loafers. Minor scuffs but overall excellent condition."
  },

  {
    id: 7,
    title: "Oversized Flannel Shirt",
    brand: "L.L. Bean",
    price: 699.00,
    size: "XXL",
    condition: "Worn",
    category: "Men",
    image: "images/645705844_17875705986533599_8177146625378594847_n.jpg",
    badge: null,
    description: "Super soft, broken-in flannel shirt. Perfect for layering."
  },

  {
    id: 9,
    title: "Vintage Khaki Bomber Jacket with Plaid Trim",
    brand: "Vintage",
    price: 899.00,
    size: "L",
    condition: "Good",
    category: "Vintage",
    image: "images/jacket.jpg",
    badge: "New Arrival",
    description: "Classic vintage bomber jacket in beige. Features stylish plaid detailing on the collar and pockets. Perfect for layering."
  },
  {
    id: 10,
    title: "Black Half-Zip Pullover Sweatshirt",
    brand: "Mein",
    price: 699.00,
    size: "L",
    condition: "Good",
    category: "Men",
    image: "images/black_pullover.jpg",
    badge: "Trending",
    description: "Essential black half-zip sweatshirt with a ring pull detail. Cozy and versatile, perfect for everyday streetwear looks."
  },
  {
    id: 11,
    title: "Classic Checkered Button-Down Shirt",
    brand: "Unbranded",
    price: 499.00,
    size: "M",
    condition: "Like New",
    category: "Men",
    image: "images/checkered_shirt.jpg",
    badge: null,
    description: "Timeless grey and white micro-check button-down shirt. Features a chest pocket and regular fit. Great for casual wear."
  },
  {
    id: 12,
    title: "Vintage Faded Band Graphic Tee",
    brand: "Vintage",
    price: 1199.00,
    size: "XL",
    condition: "Vintage Fade",
    category: "Vintage",
    image: "images/graphic_tee.png",
    badge: "Trending",
    description: "Authentic 90s oversized faded black graphic t-shirt featuring a retro band design. Perfectly broken-in with a streetwear aesthetic."
  },
  {
    id: 13,
    title: "Olive Green Baggy Cargo Pants",
    brand: "Unbranded",
    price: 1499.00,
    size: "M",
    condition: "Good",
    category: "Men",
    image: "images/cargo_pants.png",
    badge: null,
    description: "Relaxed fit olive green cargo pants with multiple utility pockets. A must-have staple for everyday streetwear looks."
  },
  {
    id: 14,
    title: "Classic Oversized Denim Jacket",
    brand: "Levi's",
    price: 1299.00,
    size: "L",
    condition: "Good",
    category: "Vintage",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600",
    badge: "Trending",
    description: "A staple oversized denim jacket with perfectly worn-in details. The ultimate layering piece for any season."
  },
  {
    id: 15,
    title: "Light Wash Mom Jeans",
    brand: "Vintage",
    price: 999.00,
    size: "28",
    condition: "Like New",
    category: "Women",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600",
    badge: null,
    description: "High-waisted 90s style mom jeans in a classic light blue wash. Flattering fit and durable rigid denim."
  },
  {
    id: 16,
    title: "Cozy White Knit Sweater",
    brand: "Unbranded",
    price: 799.00,
    size: "M",
    condition: "Excellent",
    category: "Women",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600",
    badge: "New Arrival",
    description: "Super soft oversized chunky knit sweater. Perfect for chilly evenings or layering over collared shirts."
  },
  {
    id: 17,
    title: "90s Plaid Flannel Shirt",
    brand: "Vintage",
    price: 599.00,
    size: "XL",
    condition: "Vintage Fade",
    category: "Men",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
    badge: null,
    description: "Classic grunge-era flannel shirt in muted earth tones. Worn-in and incredibly soft."
  },
  {
    id: 18,
    title: "Minimalist Grey Hoodie",
    brand: "Unbranded",
    price: 699.00,
    size: "L",
    condition: "Good",
    category: "Men",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
    badge: null,
    description: "Essential grey pullover hoodie. A thick, comfortable daily staple for a relaxed streetwear fit."
  },
  {
    id: 19,
    title: "Canvas Aesthetic Tote Bag",
    brand: "Handmade",
    price: 299.00,
    size: "One Size",
    condition: "Like New",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80&w=600",
    badge: "Trending",
    description: "Eco-friendly heavy canvas tote bag. Perfect for grocery runs, thrifting, or carrying your laptop."
  },
  {
    id: 20,
    title: "Biker Leather Jacket",
    brand: "Vintage",
    price: 2499.00,
    size: "M",
    condition: "Worn",
    category: "Vintage",
    image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=600",
    badge: "Rare Find",
    description: "Authentic heavy leather biker jacket. Shows character with beautiful scuffs and natural fading."
  },
  {
    id: 21,
    title: "Retro High-Top Sneakers",
    brand: "Vintage",
    price: 1599.00,
    size: "10",
    condition: "Good",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1588099768531-a72d4a198538?auto=format&fit=crop&q=80&w=600",
    badge: null,
    description: "Classic retro basketball high-tops. Cleaned and restored, perfect for adding a vintage pop to any outfit."
  },

  {
    id: 23,
    title: "Graphic Skate T-Shirt",
    brand: "Streetwear",
    price: 499.00,
    size: "L",
    condition: "Good",
    category: "Men",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600",
    badge: "New Arrival",
    description: "White short sleeve tee with a vintage-inspired skate graphic on the back. Lightweight and breathable."
  },

  { id: 39, title: "Chunky Platform Boots", brand: "Unbranded", price: 1499.00, size: "8", condition: "Good", category: "Accessories", image: "images/635124505_17874156147533599_2168847670354043053_n.jpg", badge: "Trending", description: "Edgy chunky black platform boots." },
  { id: 40, title: "Cropped Cardigan", brand: "Y2K", price: 399.00, size: "S", condition: "Like New", category: "Women", image: "images/635483279_17873608425533599_1064746108527963599_n.jpg", badge: null, description: "Cute pastel cropped cardigan with button details." },
  { id: 41, title: "Utility Vest", brand: "Streetwear", price: 799.00, size: "L", condition: "Good", category: "Men", image: "images/635574516_17873608161533599_6760611868492109899_n.jpg", badge: "New Arrival", description: "Tactical utility vest with multiple front pockets." },
  { id: 42, title: "Silk Scarf", brand: "Vintage", price: 149.00, size: "One Size", condition: "Excellent", category: "Accessories", image: "images/636664443_17873609625533599_563490176321072145_n.jpg", badge: null, description: "Beautiful vintage silk scarf with a paisley pattern." },
  { id: 43, title: "Corduroy Jacket", brand: "Tommy Hilfiger", price: 1199.00, size: "M", condition: "Good", category: "Vintage", image: "images/636700685_17873607672533599_5876901504156328098_n.jpg", badge: "Trending", description: "Warm and stylish brown corduroy jacket." },
  { id: 44, title: "Striped Long Sleeve", brand: "Unbranded", price: 299.00, size: "L", condition: "Vintage Fade", category: "Unisex", image: "images/638359093_17873608674533599_8698596862663083266_n.jpg", badge: null, description: "Classic black and white striped long sleeve tee." },
  { id: 45, title: "Puffer Jacket", brand: "Streetwear", price: 1599.00, size: "XL", condition: "Excellent", category: "Men", image: "images/638376478_17873608551533599_8038394747399355746_n.jpg", badge: "New Arrival", description: "Thick insulated puffer jacket for winter wear." },
  { id: 46, title: "Floral Midi Skirt", brand: "Vintage", price: 499.00, size: "M", condition: "Good", category: "Women", image: "images/639860801_17874155664533599_5170547510683599836_n.jpg", badge: null, description: "Flowy midi skirt with a delicate floral print." },
  { id: 47, title: "Crossbody Bag", brand: "Handmade", price: 599.00, size: "One Size", condition: "Like New", category: "Accessories", image: "images/640397509_17874155106533599_2615965668648151962_n.jpg", badge: "Trending", description: "Minimalist black faux-leather crossbody bag." },
  { id: 48, title: "Vintage Varsity Jacket", brand: "Vintage", price: 1999.00, size: "L", condition: "Worn", category: "Vintage", image: "images/640464140_17874156573533599_1964969175048427323_n.jpg", badge: "Rare Find", description: "Authentic 80s varsity jacket with leather sleeves." },
  { id: 49, title: "Relaxed Fit Chinos", brand: "Unbranded", price: 699.00, size: "32", condition: "Excellent", category: "Men", image: "images/640622875_17874308547533599_4937478067048389508_n.jpg", badge: null, description: "Comfortable beige chinos perfect for any occasion." },
  { id: 50, title: "Bucket Hat", brand: "Y2K", price: 199.00, size: "One Size", condition: "Like New", category: "Accessories", image: "images/640930613_17874155940533599_2972553049668964101_n.jpg", badge: "Trending", description: "Classic cotton bucket hat for sunny days." },
  { id: 51, title: "Oversized Blazer", brand: "Vintage", price: 899.00, size: "XL", condition: "Good", category: "Women", image: "images/641092948_17874309237533599_4393985157041051239_n.jpg", badge: null, description: "Structured oversized blazer in a grey check." },
  { id: 52, title: "Graphic Hoodie", brand: "Streetwear", price: 999.00, size: "L", condition: "Vintage Fade", category: "Men", image: "images/641116113_17874156390533599_4479353600559063987_n.jpg", badge: "New Arrival", description: "Heavyweight hoodie with an edgy front graphic." },
  { id: 53, title: "Denim Overalls", brand: "Levi's", price: 1199.00, size: "M", condition: "Excellent", category: "Vintage", image: "images/641171634_17874581052533599_7516467668313996932_n.jpg", badge: "Rare Find", description: "Classic blue denim overalls, a timeless staple." },
  { id: 54, title: "Running Shoes", brand: "Nike", price: 899.00, size: "10", condition: "Worn", category: "Accessories", image: "images/641226178_17874581250533599_3621524370408626324_n.jpg", badge: null, description: "Comfortable running shoes with plenty of life left." },
  { id: 55, title: "V-Neck Knit Vest", brand: "Vintage", price: 399.00, size: "M", condition: "Good", category: "Unisex", image: "images/641236160_17874580410533599_3791319663113051831_n.jpg", badge: "Trending", description: "Preppy style knit vest, perfect for layering." },
  { id: 56, title: "Track Pants", brand: "Adidas", price: 499.00, size: "L", condition: "Good", category: "Men", image: "images/641256211_17874581655533599_6508129928799996793_n.jpg", badge: null, description: "Classic track pants with the iconic three stripes." },
  { id: 57, title: "Cat-Eye Sunglasses", brand: "Unbranded", price: 149.00, size: "One Size", condition: "Like New", category: "Accessories", image: "images/641288914_17874582804533599_8877436472356729494_n.jpg", badge: null, description: "Retro-inspired cat-eye sunglasses." },
  { id: 58, title: "Turtleneck Sweater", brand: "Unbranded", price: 599.00, size: "S", condition: "Excellent", category: "Women", image: "images/641716847_17874582408533599_8929072930403594992_n.jpg", badge: "New Arrival", description: "Soft ribbed turtleneck sweater in black." },
  { id: 59, title: "Bandana", brand: "Vintage", price: 99.00, size: "One Size", condition: "Vintage Fade", category: "Accessories", image: "images/642506236_17875036479533599_7568593225436321580_n.jpg", badge: null, description: "Faded red bandana, versatile styling piece." },
  { id: 60, title: "Coach Jacket", brand: "Streetwear", price: 799.00, size: "L", condition: "Good", category: "Men", image: "images/642506888_17874584523533599_548682052219576672_n.jpg", badge: "Trending", description: "Lightweight nylon coach jacket with snap buttons." },
  { id: 61, title: "Maxi Dress", brand: "Vintage", price: 699.00, size: "M", condition: "Excellent", category: "Women", image: "images/642512985_17875036632533599_6574486322318627454_n.jpg", badge: "Rare Find", description: "Beautiful flowing maxi dress with delicate details." },
  { id: 62, title: "Leather Belt", brand: "Unbranded", price: 199.00, size: "One Size", condition: "Worn", category: "Accessories", image: "images/642960537_17875036566533599_6416263378919066083_n.jpg", badge: null, description: "Genuine leather belt with a brass buckle." },
  { id: 63, title: "Quarter-Zip Fleece", brand: "Vintage", price: 699.00, size: "XL", condition: "Good", category: "Men", image: "images/642961641_17874582000533599_392135122252188810_n.jpg", badge: "New Arrival", description: "Extremely cozy and warm fleece pullover." },
  { id: 64, title: "Mom Jeans", brand: "Levi's", price: 1099.00, size: "26", condition: "Good", category: "Women", image: "images/643023653_17875037088533599_4295673893834794766_n.jpg", badge: "Trending", description: "Classic fit high-waisted mom jeans." },
  { id: 65, title: "Baseball Cap", brand: "Vintage", price: 299.00, size: "One Size", condition: "Vintage Fade", category: "Accessories", image: "images/643031585_17875037154533599_6604920870713801852_n.jpg", badge: null, description: "Perfectly worn-in baseball cap with an embroidered logo." },
  { id: 66, title: "Silk Button Down", brand: "Vintage", price: 599.00, size: "L", condition: "Excellent", category: "Unisex", image: "images/643031588_17875036905533599_8307166089012114475_n.jpg", badge: "Rare Find", description: "Luxurious silk shirt in a vibrant color." },
  { id: 67, title: "Skater Jeans", brand: "Streetwear", price: 899.00, size: "34", condition: "Worn", category: "Men", image: "images/643049712_17875036719533599_3643082043328137400_n.jpg", badge: null, description: "Baggy fit denim designed for durability and style." },
  { id: 68, title: "Ankle Boots", brand: "Unbranded", price: 999.00, size: "7", condition: "Good", category: "Accessories", image: "images/643203921_17875036401533599_2596075215180563252_n.jpg", badge: "Trending", description: "Sleek black faux-leather ankle boots." },
  { id: 69, title: "Polo Shirt", brand: "Ralph Lauren", price: 499.00, size: "M", condition: "Excellent", category: "Men", image: "images/643546982_17875036968533599_3967217577403733835_n.jpg", badge: null, description: "Classic pique cotton polo shirt." },
  { id: 70, title: "Faux Fur Coat", brand: "Vintage", price: 2499.00, size: "L", condition: "Good", category: "Women", image: "images/643566035_17875703250533599_3546095389058244681_n.jpg", badge: "Rare Find", description: "Glamorous and incredibly warm faux fur coat." },
  { id: 71, title: "Duffle Bag", brand: "Vintage", price: 899.00, size: "One Size", condition: "Worn", category: "Accessories", image: "images/643567154_17875698867533599_8907717744424228973_n.jpg", badge: null, description: "Spacious duffle bag, great for weekend trips." },
  { id: 72, title: "Hawaiian Shirt", brand: "Vintage", price: 399.00, size: "XL", condition: "Vintage Fade", category: "Men", image: "images/645705844_17875705986533599_8177146625378594847_n.jpg", badge: "Trending", description: "Fun and vibrant floral Hawaiian shirt." },
  { id: 73, title: "Linen Trousers", brand: "Unbranded", price: 599.00, size: "32", condition: "Like New", category: "Men", image: "images/645724797_17875703004533599_6483392393272669813_n.jpg", badge: "New Arrival", description: "Lightweight and breathable linen trousers for summer." },
  { id: 109, title: "Y2K Cargo Pants", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/601093766_17865091791533599_4356209613483916683_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 110, title: "Vintage Band Tee", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/608782742_17867166498533599_1681012355541898338_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 111, title: "Oversized Leather Jacket", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/622822383_17870424063533599_2699089021748553367_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 112, title: "90s Windbreaker", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/624841709_4353177454918703_4038969083609619677_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 113, title: "Distressed Denim Jeans", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/630038496_886300047530159_6522686474615990394_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 114, title: "Retro Knit Sweater", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/631756477_17873607819533599_7156315081089631891_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 115, title: "Chunky Platform Boots", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/645878406_17875704468533599_3450258026088213183_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 116, title: "Plaid Flannel Shirt", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/645893531_17875703754533599_1020044187711446013_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 117, title: "Corduroy Button-Up", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649068802_17876343231533599_5646655434679583642_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 118, title: "Vintage Denim Overalls", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649217702_17876343669533599_4308813476160407218_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 119, title: "Graphic Skate Hoodie", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649223216_17876343402533599_4401704701932938541_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 120, title: "Minimalist Trench Coat", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649227369_17876343531533599_6629138280738614990_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 121, title: "Vintage Track Jacket", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649227531_17876343960533599_7111341955344336589_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 122, title: "Faded Canvas Tote", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649232845_17876344098533599_893626666142170776_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 123, title: "Ribbed Turtleneck", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649234716_17876343804533599_7486477086880602614_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 124, title: "Vintage Silk Scarf", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649243542_17876342835533599_629919556121030330_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 125, title: "Retro Puffer Vest", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649243542_17876687100533599_5278786797949334493_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 126, title: "Utility Work Pants", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649509055_17876685942533599_1862535373367397065_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 127, title: "Classic Varsity Jacket", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649541546_17876686071533599_2034997177643647992_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 128, title: "Patterned Maxi Skirt", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649629106_17876686455533599_4331832523652077179_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 129, title: "Vintage Bowling Shirt", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649640986_17876686626533599_2004682854437613247_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 130, title: "Y2K Rectangle Sunglasses", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649693498_17876686227533599_3742865639871530347_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 131, title: "Oversized Graphic Sweatshirt", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/649867774_17876686365533599_5082591190092604695_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 132, title: "Satin Midi Dress", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/650074925_17876685549533599_6360365066342518038_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 133, title: "Vintage Moto Jacket", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/655757332_17879645490533599_4648897877088776784_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 134, title: "Chunky Knit Cardigan", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/655962824_17879644932533599_1699308210861386573_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 135, title: "Corduroy Mini Skirt", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/656143687_17879646966533599_7804401704942839849_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 136, title: "Retro Sneaker", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/656418855_17879647296533599_5676730510765169770_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 137, title: "Vintage Duffle Bag", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/656640621_17879646081533599_7565426093150247567_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 138, title: "Classic Denim Jacket", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/656818954_17879647092533599_8924302031462977895_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 139, title: "Vintage Graphic Pullover", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/657277873_17879645652533599_3472572575788882107_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 140, title: "Y2K Mini Bag", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/657682155_17879646774533599_4978772339475373366_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 141, title: "Faded Denim Shorts", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/657833657_17879646867533599_968996452672043360_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 142, title: "Cropped Utility Vest", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/657940288_17879646516533599_1542481934678859060_n.jpg", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 143, title: "Vintage Fleece Half-Zip", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/chunky_loafers.png", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 144, title: "Retro Anorak Jacket", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/hero_image.png", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 145, title: "Vintage Graphic Crewneck", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/pastel_cardigan.png", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
  { id: 146, title: "Plaid Pleated Skirt", brand: "Vintage", price: 599.00, size: "One Size", condition: "Good", category: "Unisex", image: "images/vintage_jacket.png", badge: "New Arrival", description: "A unique vintage piece just added to the store." },
];

// Helper to save/load cart from localStorage
const CartService = {
  getCart: () => JSON.parse(localStorage.getItem('thriftCart')) || [],
  saveCart: (cart) => localStorage.setItem('thriftCart', JSON.stringify(cart)),
  addToCart: (productId) => {
    const cart = CartService.getCart();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    CartService.saveCart(cart);
    updateCartCount();
    showToast("Added to Cart!");
  },
  removeFromCart: (productId) => {
    let cart = CartService.getCart();
    cart = cart.filter(item => item.id !== productId);
    CartService.saveCart(cart);
    updateCartCount();
  },
  updateQuantity: (productId, quantity) => {
    const cart = CartService.getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      CartService.saveCart(cart);
    }
  },
  getCartTotal: () => {
    return CartService.getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};

function updateCartCount() {
  const count = CartService.getCart().reduce((acc, item) => acc + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

// Toast notification
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'var(--text-main)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      zIndex: '1000',
      transition: 'opacity 0.3s',
      opacity: '0'
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 2000);
}


