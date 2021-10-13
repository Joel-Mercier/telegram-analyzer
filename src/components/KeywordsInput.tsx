import React, { useCallback, useContext, useState } from 'react';
import UseAnimations from 'react-useanimations';
import classNames from 'classnames';
import trash from 'react-useanimations/lib/trash2';
import { TelegramAnalyzerContext } from '../App';
import { ReactComponent as ChartIcon } from '../assets/chart.svg';

const KeywordsInput = () => {
  const { telegramAnalyzer, keywords, setKeywords, setUserKeywordsCountData, userKeywordsCountData } = useContext(TelegramAnalyzerContext);
  const [value, setValue] = useState<string>("");
  const handleInputChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, [setValue]);
  const handleInputKeyPress = useCallback((e) => {
    if(e.key === "Enter"){
      setKeywords([...keywords, value]);
      setValue("");
    }
  }, [keywords, value, setValue, setKeywords]);
  const handleKeywordDelete = useCallback((keyword) => {
    setKeywords(keywords.filter(word => keyword !== word))
  }, [keywords, setKeywords]);
  const handleButtonClick = useCallback(() => {
    debugger
    setUserKeywordsCountData(telegramAnalyzer.analyzeKeywords(keywords));
  }, [keywords, telegramAnalyzer, setUserKeywordsCountData]);
  return (
    <div className="flex flex-col items-center">
      <input value={value} onChange={handleInputChange} onKeyPress={handleInputKeyPress} className={classNames("w-full p-2 max-w-5xl border", {"rounded-t-lg": keywords.length > 0, "rounded-lg": keywords.length === 0})} placeholder="Enter a keyword and press Enter" />
      <div className="w-full max-w-5xl">
        <ul className="bg-white border-b rounded-b-lg">
          {keywords.map((keyword, index) => {
            return (
              <li key={index} className="p-2 flex justify-between border-b last:border-0">
                <p>
                  <span className="mr-2">{`${index + 1}.`}</span>
                  {keyword}
                </p>
                <div className="flex">
                  <a href={`https://trends.google.fr/trends/explore?q=${encodeURIComponent(keyword)}`} rel="noopener noreferrer" target="_blank" className="mr-2">
                    <ChartIcon />
                  </a>
                  <button onClick={(e) => {handleKeywordDelete(keyword)}}>
                    <UseAnimations animation={trash} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <button className="rounded-lg px-3 py-2" onClick={handleButtonClick}>Start keyword analysis</button>
      <pre>
        {JSON.stringify(userKeywordsCountData)}
      </pre>
    </div>
  );
}

export default KeywordsInput;