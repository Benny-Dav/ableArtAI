'use client';

import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function Skeleton({ className = '', children }: SkeletonProps) {
  return (
    <div className={`skeleton bg-gray-700/50 ${className}`}>
      {children}
    </div>
  );
}

// Pre-built skeleton components for common use cases

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-6 space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

export function ImageSkeleton({ 
  aspectRatio = 'aspect-video',
  className = '' 
}: { 
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <Skeleton className={`w-full ${aspectRatio} rounded-xl ${className}`}>
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 rounded-lg bg-gray-600/50 flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>
    </Skeleton>
  );
}

export function ButtonSkeleton({ 
  size = 'medium',
  className = '' 
}: { 
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const sizeClasses = {
    small: 'h-8 w-20',
    medium: 'h-10 w-24',
    large: 'h-12 w-32',
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-full ${className}`} />
  );
}

export function TextSkeleton({ 
  lines = 3,
  className = '' 
}: { 
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i}
          className={`h-4 ${
            i === lines - 1 ? 'w-3/4' : i % 2 === 0 ? 'w-full' : 'w-5/6'
          }`} 
        />
      ))}
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="lg:h-[10vh] h-[8vh] z-50 bg-dark-bg/80 border-b border-dark-border fixed right-0 top-0 left-0 w-full">
      <div className="flex justify-between items-center px-6 lg:px-8 h-full">
        {/* Logo skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Navigation links skeleton */}
        <div className="hidden lg:flex items-center gap-8">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Right side skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </nav>
  );
}

export function GenerationSkeleton() {
  return (
    <div className="card p-6 space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/4" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
      
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

// Loading state wrapper component
export function LoadingWrapper({ 
  isLoading, 
  skeleton, 
  children 
}: {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}) {
  return isLoading ? <>{skeleton}</> : <>{children}</>;
}