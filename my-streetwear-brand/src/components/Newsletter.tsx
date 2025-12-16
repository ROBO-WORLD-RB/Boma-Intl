'use client';

import { useState, FormEvent } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { api } from '@/lib/api';

export interface NewsletterProps {
  variant?: 'footer' | 'popup' | 'inline';
}

type SubmissionState = 'idle' | 'loading' | 'success' | 'error' | 'already-subscribed';

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function Newsletter({ variant = 'footer' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setValidationError(undefined);
    setErrorMessage('');
    
    // Validate email
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    setSubmissionState('loading');
    
    try {
      await api.newsletter.subscribe(email);
      setSubmissionState('success');
      setEmail('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      
      // Check if already subscribed
      if (message.toLowerCase().includes('already subscribed') || 
          message.toLowerCase().includes('already exists')) {
        setSubmissionState('already-subscribed');
      } else {
        setSubmissionState('error');
        setErrorMessage(message);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(undefined);
    }
    // Reset submission state if user starts typing after success/error
    if (submissionState !== 'idle' && submissionState !== 'loading') {
      setSubmissionState('idle');
    }
  };

  const containerStyles = {
    footer: 'w-full',
    popup: 'w-full max-w-md mx-auto p-6 bg-gray-900 rounded-lg',
    inline: 'w-full max-w-lg',
  };

  return (
    <div className={containerStyles[variant]}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-oswald)]">
          JOIN THE MOVEMENT
        </h3>
        <p className="text-gray-400 text-sm">
          Subscribe for exclusive drops, early access, and behind-the-scenes content.
        </p>
      </div>

      {submissionState === 'success' ? (
        <div className="p-4 bg-green-900/30 border border-green-500 rounded-md" role="status">
          <p className="text-green-400 font-medium">
            Welcome to the family! Check your inbox for confirmation.
          </p>
        </div>
      ) : submissionState === 'already-subscribed' ? (
        <div className="p-4 bg-yellow-900/30 border border-yellow-500 rounded-md" role="status">
          <p className="text-yellow-400 font-medium">
            You&apos;re already part of the movement! Stay tuned for updates.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                error={validationError}
                aria-label="Email address"
                disabled={submissionState === 'loading'}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              isLoading={submissionState === 'loading'}
              className="whitespace-nowrap"
            >
              SUBSCRIBE
            </Button>
          </div>
          
          {submissionState === 'error' && (
            <div className="p-3 bg-red-900/30 border border-red-500 rounded-md" role="alert">
              <p className="text-red-400 text-sm">
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default Newsletter;
