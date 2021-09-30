import React, { useContext } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { TelegramAnalyzerContext } from '../App';
import { UserInfo } from '../services/TelegramAnalyzer';

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
    id: 'total',
    name: 'Total messages',
    selector: row => row.total,
    sortable: true,
  },
];

const UserInfoTable = () => {
  const { userInfos, loading } = useContext(TelegramAnalyzerContext);
  console.log(loading)
  return (
    <DataTable
      title={"User infos"}
      columns={columns}
      data={userInfos}
      selectableRows
      defaultSortFieldId={'total'}
      defaultSortAsc={false}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="536px"
      progressPending={loading}
    />

  );
}

export default UserInfoTable;