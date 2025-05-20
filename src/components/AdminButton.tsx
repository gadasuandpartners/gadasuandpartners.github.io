
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdminButtonProps {
  className?: string;
}

const AdminButton = ({ className }: AdminButtonProps) => {
  return (
    <Link to="/admin" className={className}>
      <Button variant="outline" size="sm">
        G+P Admin
      </Button>
    </Link>
  );
};

export default AdminButton;
