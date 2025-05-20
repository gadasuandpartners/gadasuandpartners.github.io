
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'short';
  className?: string;
  color?: 'black' | 'white';
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full',
  className,
  color = 'black'
}) => {
  return (
    <Link 
      to="/" 
      className={cn(
        "font-montserrat font-medium tracking-tighter",
        color === 'white' ? 'text-white' : 'text-black',
        className
      )}
    >
      {variant === 'full' ? 'GADASU+PARTNERS' : 'G+P'}
    </Link>
  );
};

export default Logo;
