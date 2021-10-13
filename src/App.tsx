// @ts-nocheck
import React, { useState, Context } from 'react';
import Dropzone from './components/Dropzone';
import UserMessagesCountGraph from './components/graphs/UserMessagesCountGraph';
import UserMessagesCountPerDayGraph from './components/graphs/UserMessagesCountPerDayGraph';
import KeywordsInput from './components/KeywordsInput';
import UserInfoTable from './components/UserInfoTable';
import TelegramAnalyzer, { UserInfo } from './services/TelegramAnalyzer';

interface TelegramAnalyzerContextProps {
  telegramAnalyzer: any,
  loading: boolean,
  setLoading: (value: boolean) => void,
  userMessagesCountData: [],
  setUserMessagesCountData: (value: any) => void,
  userMessagesPerDayData: {}[] | undefined,
  setUserMessagesPerDayData: (value: any) => void,
  userInfos: UserInfo[],
  setUserInfos: (value: any) => void,
  keywords: string[],
  setKeywords: (keywords: string[]) => void,
  userKeywordsCountData: [],
  setUserKeywordsCountData: (value: any) => void,
}

export const TelegramAnalyzerContext: Context<TelegramAnalyzerContextProps> = React.createContext({
  telegramAnalyzer: null,
  loading: false,
  setLoading: null,
  userMessagesCountData: [],
  setUserMessagesCountData: null,
  userMessagesPerDayData: [],
  setUserMessagesPerDayData: null,
  userInfos: [],
  setUserInfos: null,
  keywords: [],
  setKeywords: null,
  userKeywordsCountData: [],
  setUserKeywordsCountData: null,
});

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userMessagesCountData, setUserMessagesCountData] = useState<any[]>([]);
  const [userMessagesPerDayData, setUserMessagesPerDayData] = useState<any[]>([]);
  const [userInfos, setUserInfos] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [userKeywordsCountData, setUserKeywordsCountData] = useState<any[]>([]);
  const telegramAnalyzer = new TelegramAnalyzer();
  return (
    // @ts-ignore
    <TelegramAnalyzerContext.Provider value={{telegramAnalyzer, loading, setLoading, userMessagesCountData, setUserMessagesCountData, userMessagesPerDayData, setUserMessagesPerDayData, userInfos, setUserInfos, keywords, setKeywords, userKeywordsCountData, setUserKeywordsCountData}}>
      <div className="bg-gray-100 min-h-screen">
        <h1 className="text-2xl text-center font-bold pt-4">Telegram Analyzer</h1>
        <div className="container mx-auto">
          <Dropzone />
          <UserInfoTable />
          <UserMessagesCountGraph />
          <UserMessagesCountPerDayGraph />
          <h2 className="text-xl font-bold mt-4 mb-3">Keyword analysis</h2>
          <KeywordsInput />
        </div>

      </div>
    </TelegramAnalyzerContext.Provider>
  );
}

export default App;
