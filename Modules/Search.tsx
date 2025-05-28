import React from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoFilter } from 'react-icons/io5';
import { RiFolderDownloadFill } from 'react-icons/ri';

const Search: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-2 py-1 border-b border-gray-200 bg-gray-100 h-12 w-full">

      <div className="flex items-center gap-2">
        <RiFolderDownloadFill className="text-green-600" size={18} />
        <span className="text-green-600 font-semibold text-sm">Custom filter</span>
        <button className="text-sm border px-2 py-1 rounded bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
          Save
        </button>
      </div>

  
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="flex items-center bg-white px-1 py-1 rounded-md border border-gray-300">
          <CiSearch className="text-gray-900" size={15} />
          <input
            type="text"
            placeholder="Search"
            className="ml-1 bg-transparent text-sm text-gray-900 placeholder-gray-600 outline-none w-[50px]"
          />
        </div>

  
        <div className="flex items-center bg-white px-3 py-1 rounded-md border border-gray-300 text-green-600 text-sm font-medium ">
          <IoFilter size={16} className="mr-1" />
          Filter
        </div>
      </div>

    </div>
  );
};

export default React.memo(Search);
