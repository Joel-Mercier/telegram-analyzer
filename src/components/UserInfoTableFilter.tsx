import React from 'react';

interface UserInfoTableFilterProps {
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onClear: () => void,
  filterText: string
}

const UserInfoTableFilter = ({ onFilter, onClear, filterText }: UserInfoTableFilterProps) => {
  return (
    <div className="relative flex align-items-center">
      <input value={filterText} onChange={onFilter} className="border border-1 rounded-xl px-2" placeholder="Search" />
      <button className="absolute right-0" onClick={onClear}>x</button>
    </div>
  );
}

export default UserInfoTableFilter;