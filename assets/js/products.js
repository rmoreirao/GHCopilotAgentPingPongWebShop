// Product data
const productsData = [
    { 
        id: 1, 
        name: "Butterfly Tenergy 05", 
        description: "The world's most popular high-performance rubber featuring Spring Sponge technology. Provides exceptional spin and speed with unmatched control for offensive players.",
        category: "rubbers", 
        price: 89.99, 
        icon: "sports_tennis", 
        image: "../assets/img/products/tenergy_05.png" 
    },
    { 
        id: 2, 
        name: "Butterfly Dignics 09C", 
        description: "Premium rubber with Spring Sponge X technology and increased surface tension for maximum spin potential and explosive power on offensive strokes.",
        category: "rubbers", 
        price: 99.99, 
        icon: "sports_tennis", 
        image: "../assets/img/products/dignics_09c.png" 
    },
    { 
        id: 3, 
        name: "Butterfly Rozena", 
        description: "All-round performance rubber with Spring Sponge technology offering excellent balance between speed, spin and control at an affordable price point.",
        category: "rubbers", 
        price: 59.99, 
        icon: "sports_tennis", 
        image: "../assets/img/products/rozena.png" 
    },
    { 
        id: 4, 
        name: "Butterfly Bryce Speed", 
        description: "High-speed rubber designed for players who prioritize velocity over spin, featuring a harder sponge and tacky top sheet for direct attacking play.",
        category: "rubbers", 
        price: 64.99, 
        icon: "sports_tennis", 
        image: "../assets/img/products/bryce_speed.png" 
    },
    { 
        id: 5, 
        name: "Butterfly Sriver FX", 
        description: "Classic rubber trusted by players worldwide for decades, offering consistent performance with good spin, speed and exceptional control.",
        category: "rubbers", 
        price: 49.99, 
        icon: "sports_tennis", 
        image: "../assets/img/products/sriver_fx.png" 
    },
    { 
        id: 6, 
        name: "Butterfly Viscaria", 
        description: "Legendary 5-ply wood with ALC (Arylate Carbon) layers offering perfect balance of speed, feel and vibration absorption. Used by many world champions.",
        category: "blades", 
        price: 249.99, 
        icon: "dashboard", 
        image: "../assets/img/products/viscaria.png" 
    },
    { 
        id: 7, 
        name: "Butterfly Timo Boll ALC", 
        description: "Professional 5+2 ply blade with Arylate Carbon layers designed with input from German superstar Timo Boll, offering excellent control with adequate speed.",
        category: "blades", 
        price: 219.99, 
        icon: "dashboard", 
        image: "../assets/img/products/timo_boll_alc.png" 
    },
    { 
        id: 8, 
        name: "Butterfly Zhang Jike Super ZLC", 
        description: "High-end 5+2 ply blade featuring ZL Carbon for extraordinary power and feeling, designed with Olympic champion Zhang Jike.",
        category: "blades", 
        price: 289.99, 
        icon: "dashboard", 
        image: "../assets/img/products/zhang_jike_super_zlc.png" 
    },
    { 
        id: 9, 
        name: "Butterfly Cypress S", 
        description: "All-wood 5-ply blade crafted from premium materials offering exceptional feel and control for players who prefer pure wood characteristics.",
        category: "blades", 
        price: 119.99, 
        icon: "dashboard", 
        image: "../assets/img/products/cypress_s.png" 
    },
    { 
        id: 10, 
        name: "Butterfly Innerforce Layer ZLC", 
        description: "7-ply blade with ZL Carbon positioned deeper within the blade for balanced offensive play with excellent feedback and consistency.",
        category: "blades", 
        price: 259.99, 
        icon: "dashboard", 
        image: "../assets/img/products/innerforce_layer_zlc.png" 
    },
    { 
        id: 11, 
        name: "Butterfly Atamy Shirt", 
        description: "Tournament-grade table tennis shirt featuring moisture-wicking fabric and ergonomic design for maximum comfort and performance during intense gameplay.",
        category: "clothing", 
        price: 59.99, 
        icon: "checkroom", 
        image: "../assets/img/products/atamy_shirt.png" 
    },
    { 
        id: 12, 
        name: "Butterfly Mito Tracksuit", 
        description: "Professional tracksuit worn by world-class athletes, featuring breathable material, adjustable components and stylish Butterfly branding.",
        category: "clothing", 
        price: 129.99, 
        icon: "checkroom", 
        image: "../assets/img/products/mito_tracksuit.png" 
    },
    { 
        id: 13, 
        name: "Butterfly Melowa Shorts", 
        description: "Lightweight competition shorts with elastic waistband and side pockets, designed for unrestricted movement during play.",
        category: "clothing", 
        price: 39.99, 
        icon: "checkroom", 
        image: "../assets/img/products/melowa_shorts.png" 
    },
    { 
        id: 14, 
        name: "Butterfly Amaranth Polo", 
        description: "Classic polo shirt with modern performance fabrics, suitable for both competition and casual wear with elegant Butterfly styling.",
        category: "clothing", 
        price: 49.99, 
        icon: "checkroom", 
        image: "../assets/img/products/amaranth_polo.png" 
    },
    { 
        id: 15, 
        name: "Butterfly Laurett Shirt", 
        description: "Women's competition shirt with tailored fit, featuring advanced moisture management and stylish design for tournament play.",
        category: "clothing", 
        price: 54.99, 
        icon: "checkroom", 
        image: "../assets/img/products/laurett_shirt.png" 
    },
    { 
        id: 16, 
        name: "Butterfly Lezoline Rifones", 
        description: "Professional table tennis shoes with exceptional grip and stability, featuring lightweight construction and shock absorption for quick lateral movements.",
        category: "shoes", 
        price: 129.99, 
        icon: "directions_walk", 
        image: "../assets/img/products/lezoline_rifones.png" 
    },
    { 
        id: 17, 
        name: "Butterfly Lezoline Mach", 
        description: "Tournament-grade footwear with specialized rubber soles designed for maximum grip on indoor courts while providing superior comfort during extended play.",
        category: "shoes", 
        price: 119.99, 
        icon: "directions_walk", 
        image: "../assets/img/products/lezoline_mach.png" 
    },
    { 
        id: 18, 
        name: "Butterfly Lezoline Groovy", 
        description: "Mid-range table tennis shoes combining affordability with professional features including non-marking soles and breathable upper materials.",
        category: "shoes", 
        price: 89.99, 
        icon: "directions_walk", 
        image: "../assets/img/products/lezoline_groovy.png" 
    },
    { 
        id: 19, 
        name: "Butterfly Lezoline Gigu", 
        description: "Lightweight performance shoes designed with input from professional players, featuring responsive cushioning and exceptional stability for aggressive movement.",
        category: "shoes", 
        price: 109.99, 
        icon: "directions_walk", 
        image: "../assets/img/products/lezoline_gigu.png" 
    },
    { 
        id: 20, 
        name: "Butterfly Lezoline SAL", 
        description: "Entry-level professional shoes with durable construction and excellent court grip, perfect for club players seeking reliability and comfort.",
        category: "shoes", 
        price: 79.99, 
        icon: "directions_walk", 
        image: "../assets/img/products/lezoline_sal.png" 
    },
    { 
        id: 21, 
        name: "Butterfly G40+ 3-Star Balls", 
        description: "Official competition balls meeting ITTF standards, featuring perfectly balanced seam and consistent bounce for tournament play. Box of 12 balls.",
        category: "equipment", 
        price: 29.99, 
        icon: "circle", 
        image: "../assets/img/products/g40_plus_3_star_balls.png" 
    },
    { 
        id: 22, 
        name: "Butterfly Centrefold 25 Table", 
        description: "ITTF-approved competition table featuring 25mm playing surface, sturdy undercarriage, and easy folding mechanism for storage and transportation.",
        category: "equipment", 
        price: 1999.99, 
        icon: "table_bar", 
        image: "../assets/img/products/centrefold_25_table.png" 
    },
    { 
        id: 23, 
        name: "Butterfly Europa Net Set", 
        description: "Professional net and post set used in major competitions, featuring precise tension adjustment and secure clamping mechanism.",
        category: "equipment", 
        price: 89.99, 
        icon: "fence", 
        image: "../assets/img/products/europa_net_set.png" 
    },
    { 
        id: 24, 
        name: "Butterfly Liner II Bag", 
        description: "Spacious equipment bag with dedicated compartments for rackets, balls, shoes and clothing. Features durable construction and comfortable carrying straps.",
        category: "equipment", 
        price: 69.99, 
        icon: "backpack", 
        image: "../assets/img/products/liner_ii_bag.png" 
    },
    { 
        id: 25, 
        name: "Butterfly Match Case", 
        description: "Protective case for storing and transporting up to two complete rackets, featuring hard shell construction and plush interior lining.",
        category: "equipment", 
        price: 34.99, 
        icon: "work_outline", 
        image: "../assets/img/products/match_case.png" 
    }
];

// Export the products data
export { productsData };