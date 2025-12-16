"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { CartBadge } from "@/components/ui/Badge";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu, HamburgerButton } from "@/components/MobileMenu";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemCount } = useCartStore();
  const { user, logout } = useAuth();
  const router = useRouter();
  const count = isHydrated ? itemCount() : 0;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          {/* Left Section - Hamburger on mobile, Logo on desktop */}
          <div className="flex items-center gap-8">
            <HamburgerButton 
              onClick={() => setMobileMenuOpen(true)} 
              className="md:hidden"
            />
            <Link href="/" className="hidden md:block text-white font-bold text-xl tracking-wider">
              BOMA
            </Link>
          </div>

          {/* Center - Logo on mobile */}
          <Link href="/" className="md:hidden text-white font-bold text-xl tracking-wider">
            BOMA
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-white text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="text-white text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="text-white text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              About
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Cart Icon - 44x44px minimum touch target */}
            <Link
              href="/cart"
              aria-label={`Cart with ${count} items`}
              className="relative text-white hover:opacity-70 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <CartBadge count={count} />
            </Link>

            {/* User Menu - Desktop only */}
            {isHydrated && user && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:opacity-70 transition-opacity"
                  aria-label="User menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-neutral-800">
                      <p className="text-white text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-neutral-800 transition-colors"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-neutral-800 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
