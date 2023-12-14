import React from 'react';

function SearchBar() {
  return (
    <div className='w-full h-[56px] flex items-center px-2 border border-2 border-secondary-grey rounded-md'>
      <input
        placeholder='What would you like to learn about?'
        className='w-full h-full bg-white outline-none placeholder:text-primary-grey'
      />
      <button className='h-[40px] px-4 text-white bg-primary-blue rounded-md'>
        Create
      </button>
    </div>
  );
}

export default SearchBar;
