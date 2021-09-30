// @ts-nocheck
import React, { useState } from 'react';
import Dropzone from './components/Dropzone';
import UserMessagesCountGraph from './components/graphs/UserMessagesCountGraph';
import UserMessagesCountPerDayGraph from './components/graphs/UserMessagesCountPerDayGraph';
import UserInfoTable from './components/UserInfoTable';

export const TelegramAnalyzerContext = React.createContext({
  loading: false,
  setLoading: null,
  userMessagesCountData: [],
  setUserMessagesCountData: null,
  userMessagesPerDayData: [],
  setUserMessagesPerDayData: null,
  userInfos: [],
  setUserInfos: null,
});

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userMessagesCountData, setUserMessagesCountData] = useState([]);
  const [userMessagesPerDayData, setUserMessagesPerDayData] = useState([]);
  const [userInfos, setUserInfos] = useState([]);
  return (
    // @ts-ignore
    <TelegramAnalyzerContext.Provider value={{loading, setLoading, userMessagesCountData, setUserMessagesCountData, userMessagesPerDayData, setUserMessagesPerDayData, userInfos, setUserInfos}}>
      <div className="bg-gray-100 min-h-screen">
        <h1 className="text-xl text-center font-bold pt-4">Telegram Analyzer</h1>
        <div className="container mx-auto">
          <Dropzone />
          <UserInfoTable />
          <UserMessagesCountGraph />
          <UserMessagesCountPerDayGraph />
        </div>

      </div>
    </TelegramAnalyzerContext.Provider>
  );
}

export default App;
