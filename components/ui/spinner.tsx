// File: components/ui/spinner.tsx

import * as React from 'react';
import { cn } from '@/lib/utils'; // This assumes you have a standard 'cn' utility for class names

const Spinner = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement>
>(({ className, ...props }, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('animate-spin', className)}
      {...props}
      ref={ref}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
});
Spinner.displayName = 'Spinner';

export { Spinner };