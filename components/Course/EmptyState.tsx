'use client';

import { FallingLines } from 'react-loader-spinner';

export default function EmptyState() {
  return (
    <div className='course-card justify-center'>
      <FallingLines
        color='#0C54A8'
        width='100'
        visible={true}
      />
    </div>
  );
}
