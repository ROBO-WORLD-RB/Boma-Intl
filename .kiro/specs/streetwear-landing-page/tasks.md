# Implementation Plan

- [x] 1. Set up project foundation and utilities






  - [x] 1.1 Install @studio-freight/lenis dependency

    - Run `npm install @studio-freight/lenis` in the my-streetwear-brand directory
    - _Requirements: 1.3_

  - [x] 1.2 Create utility function for className merging

    - Create `src/lib/utils.ts` with `cn()` helper using clsx and tailwind-merge
    - _Requirements: 1.1, 1.2_
  - [x] 1.3 Create gallery data structure


    - Create `src/lib/gallery-data.ts` with GalleryItem interface
    - Export typed array with 6 entries using actual BOMA 2025 image filenames
    - Include varied span values for bento grid effect
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 2. Configure layout and global styles





  - [x] 2.1 Update globals.css with design tokens


    - Set black background (#000) and white text (#fff) as defaults
    - Add CSS custom properties for colors, typography, transitions
    - _Requirements: 1.4, 1.5_
  - [x] 2.2 Create SmoothScroll client component


    - Create `src/components/SmoothScroll.tsx` as client component
    - Initialize Lenis with RAF loop
    - Wrap children and handle cleanup on unmount
    - _Requirements: 1.3_
  - [x] 2.3 Update layout.tsx with fonts and providers


    - Import and configure Oswald and Inter fonts from next/font/google
    - Apply Oswald to headings variable, Inter to body variable
    - Wrap children with SmoothScroll provider
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Build Navbar component




  - [x] 3.1 Create Navbar with scroll detection

    - Create `src/components/Navbar.tsx` as client component
    - Implement useState for scroll state tracking
    - Add useEffect with scroll event listener and cleanup
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Style Navbar with conditional backgrounds
    - Apply fixed positioning at top
    - Transparent background at scroll 0, solid black with blur when scrolled
    - Add transition animation for smooth state change

    - _Requirements: 2.2, 2.3_
  - [x] 3.3 Add navigation links and cart icon

    - Add Shop, Collections, About links with uppercase styling
    - Add cart icon (use SVG or emoji placeholder)
    - _Requirements: 2.4, 2.5, 2.6_

- [x] 4. Build Hero component






  - [x] 4.1 Create Hero section structure

    - Create `src/components/Hero.tsx` as client component
    - Set up full viewport height container with dark background
    - _Requirements: 3.1, 3.2_

  - [x] 4.2 Implement stagger-fade animations


    - Define Framer Motion variants for container and items
    - Apply staggerChildren to container
    - Animate headline with fadeInUp effect

    - _Requirements: 3.3, 3.4_

  - [x] 4.3 Add headline and CTA button

    - Add massive uppercase headline using Oswald font
    - Add CTA button with delayed animation
    - Style with brutalist aesthetic (sharp edges, high contrast)
    - _Requirements: 3.4, 3.5, 3.6_

- [x] 5. Build Marquee component




  - [x] 5.1 Create Marquee with infinite scroll animation


    - Create `src/components/Marquee.tsx` as client component
    - Duplicate content for seamless loop
    - Implement Framer Motion animate with x translation
    - _Requirements: 4.1, 4.2, 4.4_

  - [x] 5.2 Style Marquee text

    - Add specified text content with bullet separators
    - Apply uppercase styling
    - Set appropriate font size and spacing
    - _Requirements: 4.3, 4.5_

- [x] 6. Build Gallery component





  - [x] 6.1 Create Gallery grid structure


    - Create `src/components/Gallery.tsx` as client component
    - Import gallery data from lib
    - Set up CSS Grid with responsive columns
    - _Requirements: 5.1, 5.6_

  - [x] 6.2 Implement variable cell sizes





    - Apply span classes from gallery data to grid items
    - Ensure proper grid flow with varied sizes

    - _Requirements: 5.2_



  - [x] 6.3 Add viewport-triggered animations


    - Use Framer Motion whileInView for scroll animations
    - Implement fade-up and scale-in effects

    - Set viewport options with once: true
    - _Requirements: 5.3_
  - [x] 6.4 Implement hover effects





    - Add image zoom on hover with scale transform
    - Create overlay with title text
    - Animate overlay opacity on hover
    - _Requirements: 5.4, 5.5_

- [x] 7. Assemble landing page






  - [x] 7.1 Update page.tsx with all components

    - Import Navbar, Hero, Marquee, Gallery components
    - Stack components in correct order
    - Ensure consistent black background throughout
    - _Requirements: 7.1, 7.2, 7.3_
