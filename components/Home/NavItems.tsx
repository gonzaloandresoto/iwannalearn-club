'use client';

import { headerLinks } from '@/constants/index';
import { link } from 'fs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavItems = () => {
  return (
    <ul className='flex flex-row gap-8'>
      {headerLinks.map((item) => {
        const isActive = usePathname() === item.route;
        return (
          <li
            key={item.route}
            className={`${
              isActive ? 'text-primary-blue' : 'text-primary-grey'
            }`}
          >
            <Link href={item.route}>{item.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
