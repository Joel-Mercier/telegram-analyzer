import React, { useContext, useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { TelegramAnalyzerContext } from '../App';
import { UserInfo } from '../services/TelegramAnalyzer';
import UserInfoTableFilter from './UserInfoTableFilter';

const columns: TableColumn<UserInfo>[] = [
  {
    id: 'username',
    name: 'Username',
    selector: row => row.name,
    sortable: true,
  },
  {
    id: 'medianMessagesPerDay',
    name: 'Median message count per day',
    selector: row => row.medianMessagesPerDay,
    sortable: true,
  },
  {
    id: 'averageMessagesPerDay',
    name: 'Average message count per day',
    selector: row => row.averageMessagesPerDay,
    sortable: true,
  },
  {
    id: 'medianCharactersPerDay',
    name: "Median character count per day",
    selector: row => row.medianCharactersPerDay,
    sortable: true,
  },
  {
    id: 'averageCharactersPerDay',
    name: "Average character count per day",
    selector: row => row.averageCharactersPerDay,
    sortable: true,
  },
  {
    id: 'total',
    name: 'Total messages',
    selector: row => row.total,
    sortable: true,
  },
];

const UserInfoTable = () => {
  const [filterText, setFilterText] = useState<string>('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState<boolean>(false);
  const { userInfos, loading } = useContext(TelegramAnalyzerContext);
  const filteredItems = userInfos.filter(
		item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
	);
  const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<UserInfoTableFilter onFilter={e => setFilterText(e.currentTarget.value)} onClear={handleClear} filterText={filterText} />
		);
	}, [filterText, resetPaginationToggle]);
  return (
    <DataTable
      title={"User infos"}
      columns={columns}
      data={filteredItems}
      selectableRows
      defaultSortFieldId={'total'}
      defaultSortAsc={false}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="536px"
      progressPending={loading}
      subHeader
			subHeaderComponent={subHeaderComponentMemo}
    />

  );
}

export default UserInfoTable;