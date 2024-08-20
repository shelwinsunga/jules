'use client'

import React from 'react';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="flex  items-center">
    <div className="flex items-center py-3 pl-5">
      <Link href="/" className="text-lg text-foreground font-medium">
        Skaarf
      </Link>
    </div>
  </nav>
  );
};
