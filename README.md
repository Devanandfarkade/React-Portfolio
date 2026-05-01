# 🚀 MERN Developer Portfolio

A modern, fully 3D, animated developer portfolio built with React, Tailwind CSS, Framer Motion, and React Three Fiber.

---

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── favicon.svg
│   └── resume.pdf              ← PUT YOUR RESUME HERE
├── src/
│   ├── components/
│   │   ├── DotField.jsx        ← Interactive dot field (Hero background)
│   │   ├── Navbar.jsx          ← Sticky nav with scroll spy
│   │   ├── Hero.jsx            ← Hero section (DotField + 3D scene)
│   │   ├── About.jsx           ← About section
│   │   ├── Skills.jsx          ← Skills with animated progress bars
│   │   ├── Projects.jsx        ← Project cards with filter
│   │   ├── Experience.jsx      ← Timeline-based experience
│   │   ├── Education.jsx       ← Education cards
│   │   ├── Certifications.jsx  ← Certification cards
│   │   ├── Contact.jsx         ← Contact form
│   │   ├── Footer.jsx          ← Site footer
│   │   ├── SectionTitle.jsx    ← Reusable section heading
│   │   ├── CustomCursor.jsx    ← Custom cursor effect
│   │   └── 3D/
│   │       └── Scene3D.jsx     ← React Three Fiber 3D scene
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## ⚡ Quick Start

```bash
# 1. Clone / unzip the project
cd portfolio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🔧 Personalization Checklist

### 1. Replace placeholder content in each component:

| File | What to change |
|------|---------------|
| `Hero.jsx` | Your name, socials (GitHub/LinkedIn/Twitter/Email URLs) |
| `About.jsx` | Your bio paragraph, tech stack tags |
| `Skills.jsx` | Skill names + proficiency levels (0–100) |
| `Projects.jsx` | Project title, description, tags, GitHub/live URLs |
| `Experience.jsx` | Role, company, period, responsibilities, tech stack |
| `Education.jsx` | Degree, institution, grade, highlights |
| `Certifications.jsx` | Cert name, issuer, date, credential ID, link |
| `Contact.jsx` | Your email, phone, location |
| `Footer.jsx` | Your name, social links |
| `Navbar.jsx` | Social links |

### 2. Add your resume
Place your resume PDF at: `public/resume.pdf`

### 3. EmailJS Setup (real contact form)
```bash
npm install @emailjs/browser
```

In `Contact.jsx`, uncomment and fill in:
```js
import emailjs from '@emailjs/browser';

// Replace with your IDs from https://www.emailjs.com/
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  form,
  'YOUR_PUBLIC_KEY'
);
```
Sign up free at: https://www.emailjs.com/

---

## 🎨 3D Scene - Using a Custom GLTF/GLB Model

The current 3D scene (`Scene3D.jsx`) uses built-in Three.js geometries. To use a real 3D model:

### Step 1: Download a free model

| Model | Description | Download Link |
|-------|-------------|---------------|
| 🚀 **Astronaut** | Perfect for dev portfolio | https://market.pmnd.rs/model/astronaut |
| 💻 **Laptop** | Tech-themed | https://sketchfab.com/search?q=laptop+low+poly&type=models&features=downloadable |
| 🤖 **Robot** | Animated character | https://market.pmnd.rs/model/robot-drone |
| 🌍 **Earth** | Globe/3D sphere | https://sketchfab.com/search?q=earth+low+poly&type=models&features=downloadable |
| ⚡ **Brain** | Creative dev concept | https://sketchfab.com/search?q=brain+low+poly&type=models&features=downloadable |

### Step 2: Place model in `public/` folder
```
public/
└── astronaut.glb
```

### Step 3: Update `Scene3D.jsx`
```jsx
import { useGLTF } from '@react-three/drei';

function AstronautModel() {
  const { scene } = useGLTF('/astronaut.glb');
  return (
    <Float speed={2} floatIntensity={1.5}>
      <primitive object={scene} scale={2} position={[0, -1, 0]} />
    </Float>
  );
}
```
Then replace `<FloatingOrb />` with `<AstronautModel />` in the Canvas.

**Preload the model** at the bottom of the file:
```js
useGLTF.preload('/astronaut.glb');
```

---

## 🎭 Customizing Colors & Theme

Edit `tailwind.config.js` and `src/index.css` CSS variables:

```css
:root {
  --bg: #060411;         /* Main background */
  --surface: #0f0b1a;    /* Card background */
  --accent: #a855f7;     /* Purple accent */
  --accent-2: #06b6d4;   /* Cyan accent */
  --gold: #f59e0b;       /* Gold accent */
}
```

---

## 🚀 Deployment

### Vercel (Recommended - Free)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag /dist folder to https://app.netlify.com/drop
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"
npm run deploy
```

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations & transitions |
| React Three Fiber | 3D graphics engine |
| @react-three/drei | Three.js helpers |
| Three.js | 3D library |
| Lucide React | Icons |
| React Icons | Brand icons (Si*) |
| EmailJS | Contact form email |

---

## 🌐 ReactBits Components (Optional Enhancements)

From https://reactbits.dev, you can add:

- **TextPressure** — pressure-sensitive text animation for hero title
- **SplitText** — letter-by-letter reveal animations
- **MagneticButton** — magnetic hover effect on CTA buttons  
- **Noise** — grain texture overlay
- **Ribbons** — animated ribbon background
- **Aurora** — aurora borealis background effect

Install ReactBits:
```bash
npx jsrepo add https://reactbits.dev/[component-name]
```

---

## 💡 Tips

- Run `npm run dev` and open http://localhost:5173
- Replace all `Your Name` text across components with your actual name
- All social href values are placeholders — update with your real URLs
- The 3D scene auto-rotates and responds to orbit controls (drag to rotate)
- Custom cursor is desktop-only and hides on mobile automatically
