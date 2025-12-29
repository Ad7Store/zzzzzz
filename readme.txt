ecommerce-project/
├── package.json
├── next.config.js
├── .env.local.example
├── vercel.json
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.ico
└── src/
    ├── components/
    │   ├── Layout/
    │   │   └── Navbar.js
    │   ├── Home/
    │   │   ├── HeroSection.js
    │   │   └── ProductCard.js
    │   └── Admin/
    │       ├── AdminLayout.js
    │       ├── ItemsManagement.js
    │       ├── UsersManagement.js
    │       └── CheckoutsManagement.js
    ├── pages/
    │   ├── _app.js
    │   ├── index.js
    │   ├── login.js
    │   ├── admin.js
    │   ├── cart.js
    │   ├── checkout.js
    │   └── api/
    │       ├── auth/
    │       │   └── login.js
    │       ├── items.js
    │       ├── checkouts.js
    │       ├── users.js
    │       └── cloudinary.js
    ├── utils/
    │   ├── auth.js
    │   ├── cloudinary.js
    │   └── github-api.js
    ├── hooks/
    │   ├── useAuth.js
    │   └── useCart.js
    ├── contexts/
    │   ├── AuthContext.js
    │   └── CartContext.js
    └── styles/
        └── globals.css
