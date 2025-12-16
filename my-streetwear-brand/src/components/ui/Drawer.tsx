'use client';

import { useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function Drawer({
  isOpen,
  onClose,
  children,
  side = 'right',
  className,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: DrawerProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  const drawerVariants = {
    hidden: { x: side === 'left' ? '-100%' : '100%' },
    visible: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            aria-hidden="true"
          />
          
          {/* Drawer Content */}
          <motion.div
            className={cn(
              'absolute top-0 h-full w-full max-w-md bg-gray-900 shadow-xl',
              'flex flex-col overflow-hidden',
              side === 'left' ? 'left-0' : 'right-0',
              className
            )}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'absolute top-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10',
                  side === 'left' ? 'right-2' : 'left-2'
                )}
                aria-label="Close drawer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
