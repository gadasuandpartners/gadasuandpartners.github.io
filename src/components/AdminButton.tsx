
import React from 'react';
import { Link } from 'react-router-dom';

interface AdminButtonProps {
  className?: string;
}

const AdminButton = ({ className }: AdminButtonProps) => {
  return (
    <Link to="/admin" className={className}>
      <span className="hover:text-white transition-colors">G+P Admin</span>
    </Link>
  );
};

export default AdminButton;
