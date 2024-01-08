'use client';

import { headerLinks } from '@/constants/index';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavItems = () => {
  const currentPath = usePathname();
  return (
    <ul className='flex flex-row gap-8'>
      {headerLinks.map((item) => {
        const isActive = currentPath === item.route;
        return (
          <li key={item.route}>
            <Link href={item.route}>
              <p
                className={`text-secondary-black hover:text-tertiary-black font-rosario font-medium ${
                  isActive ? 'underline font-medium' : 'no-underline'
                }`}
              >
                {item.label}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
