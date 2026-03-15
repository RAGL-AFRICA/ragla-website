# RAGLA - Royal Academy of Governance and Leadership Africa

A modern, professional website for the Royal Academy of Governance and Leadership Africa (RAGLA). Built with React, TypeScript, Vite, and Tailwind CSS.

## About RAGLA

The Royal Academy of Governance and Leadership Africa (RAGLA) is dedicated to fostering the highest standards of excellence in governance and leadership in Africa. This is a responsive, feature-rich website showcasing RAGLA's mission, membership categories, and leadership initiatives.

## ✨ Features

- **Professional Design**: Elegant dark theme with gold accents
- **Fully Responsive**: Mobile-first design that works perfectly on all devices
- **Modern Animations**: Smooth transitions and interactive elements
- **Hero Section**: Compelling introduction with clear CTAs
- **About Section**: Mission statement and five core pillars with icons
- **Featured Content**: Leadership achievements and inductions showcase
- **Membership Tiers**: Six membership categories with detailed benefits
- **Gallery**: Portfolio of RAGLA events and activities
- **Navigation**: Responsive header with professional logo and menu
- **Footer**: Complete contact information and social links
- **SEO Optimized**: Meta tags, favicon, and structured data
- **Form Integration**: Direct links to membership application forms

## 🛠️ Tech Stack

- **Frontend**: React 18.3 with TypeScript 5.8
- **Build Tool**: Vite 5.4 (fast bundling and HMR)
- **Styling**: Tailwind CSS 3.4 with custom theme
- **UI Components**: shadcn/ui for professional components
- **Animations**: Framer Motion for smooth interactions
- **Routing**: React Router 6.30
- **Testing**: Vitest 3.2 and Playwright 1.57
- **Package Manager**: npm (supports bun.lockb)

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Navigation with RAGLA branding
│   ├── HeroSection.tsx         # Landing hero content
│   ├── AboutSection.tsx        # Mission and five pillars
│   ├── FeaturedSection.tsx     # Featured achievements
│   ├── MembershipSection.tsx   # Membership categories
│   ├── GallerySection.tsx      # Image gallery
│   ├── UpcomingSection.tsx     # Upcoming events
│   ├── Footer.tsx              # Footer with links
│   └── ui/                     # shadcn/ui components
├── pages/
│   ├── Index.tsx               # Homepage
│   ├── AboutUs.tsx             # About page
│   ├── MembershipBenefits.tsx  # Membership details
│   ├── ContactUs.tsx           # Contact form
│   ├── Gallery.tsx             # Gallery showcase
│   └── SignIn.tsx              # Login page
├── assets/                     # Images and media
├── lib/                        # Utilities
├── hooks/                      # Custom React hooks
└── App.tsx                     # Main app
```

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ 
- npm (or yarn/bun)

### Installation

```sh
# Clone repository
git clone <repository-url>
cd africa-site-clone

# Install dependencies
npm install

# Start development server
npm run dev
```

The site opens at `http://localhost:8081` (or next available port)

## 📝 Available Commands

```sh
npm run dev          # Start dev server with hot reload
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
```

## 🎨 Design System

**Color Palette**
- Primary (Gold): `#E8B923` - Professional and institutional
- Background: `#0E0E0E` - Modern dark theme
- Foreground: `#FFFFFF` - High contrast readability

**Typography**
- Headlines: Bold/Black with tight tracking
- Navigation: Uppercase with letter spacing
- Body: Semi-bold for emphasis, regular for content

**Components**
- Responsive grid layouts
- Animated cards on scroll
- Touch-friendly mobile menu
- Professional footer

## 📱 Responsive Breakpoints

- Mobile: Default (320px+)
- Tablet: `md` breakpoint (768px+)
- Desktop: Large devices (1024px+)

## ✅ Key Features Implemented

- Professional RAGLA logo with text branding
- Responsive navigation with mobile menu
- Hero section with action buttons
- Five mission pillars with icons and descriptions
- Featured achievement showcase
- Six membership tiers with criteria
- High-quality gallery
- Complete contact information
- Social media integration
- Google Forms membership application
- Favicon with RAGLA branding
- SEO meta tags

## 🔧 Customization

### Update Colors
Edit `src/index.css` CSS variables:
```css
:root {
  --primary: 45 93% 47%;       /* Gold */
  --background: 0 0% 7%;       /* Dark */
  --foreground: 0 0% 100%;     /* White */
}
```

### Update Content
- Modify `src/components/` files
- Update membership tiers in `MembershipSection.tsx`
- Edit navigation links in `Header.tsx`
- Update contact info in `Footer.tsx`

## 🚢 Deployment

```sh
# Build for production
npm run build

# Output: /dist directory
# Deploy to Vercel, Netlify, GitHub Pages, or any static host
```

## 📞 Contact Information

- **Phone**: +233 (0)256257507
- **Email**: Info@ragl-africa.org
- **Address**: GA – 334 – 8177 2nd Bissau Street, East Legon, Accra – Ghana

## 📄 License

Professional clone created for RAGLA's web presence.

---

**Built with ❤️ for the Royal Academy of Governance and Leadership Africa**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
