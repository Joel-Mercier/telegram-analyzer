// @ts-nocheck
import React, { useRef, useCallback, useContext } from 'react';
import { useDropZone } from 'beautiful-react-hooks';
import UseAnimations from 'react-useanimations';
import download from 'react-useanimations/lib/download';
import classNames from 'classnames';
import { TelegramAnalyzerContext } from '../App';
import TelegramAnalyzer from '../services/TelegramAnalyzer'

const Dropzone = (): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>();
  const dropRef = useRef<HTMLDivElement>();
  const { isOver, onDrop } = useDropZone(dropRef);
  const { setLoading, setUserMessagesCountData, setUserMessagesPerDayData, setUserInfos } = useContext(TelegramAnalyzerContext);

  onDrop((event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (evt) => {
      setLoading(true);
      const telegramAnalyzer = new TelegramAnalyzer()
      telegramAnalyzer.reset();
      telegramAnalyzer.initialize(evt.target.result);
      setUserMessagesCountData(telegramAnalyzer.getMessagesCountPerUser());
      setUserMessagesPerDayData(telegramAnalyzer.getMessagesPerUserPerDay());
      setUserInfos(telegramAnalyzer.getUserInfos());
      setLoading(false);
    }
    reader.onerror = (evt) => {
      console.log("FileReader error", evt)
    }
   
  });

  const handleDropzoneClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const filesSelected = useCallback(() => {
    if (fileInputRef.current.files.length) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        setLoading(true);
        const telegramAnalyzer = new TelegramAnalyzer()
        telegramAnalyzer.reset();
        telegramAnalyzer.initialize(evt.target.result);
        setUserMessagesCountData(telegramAnalyzer.getMessagesCountPerUser());
        setUserMessagesPerDayData(telegramAnalyzer.getMessagesPerUserPerDay());
        setUserInfos(telegramAnalyzer.getUserInfos());
        setLoading(false);
      }
      reader.onerror = (evt) => {
        console.log("FileReader error", evt)
      }
    }
  }, [setUserMessagesCountData, setUserMessagesPerDayData, setUserInfos, setLoading]);
  
  return (
    <div>
      <div
        ref={dropRef}
        className={
          classNames(
            "mt-8 w-full flex justify-center align-center border-2 border-indigo-600 hover:border-indigo-500 transition-all duration-300 dark:bg-opacity-10 border-dashed rounded-xl min-w-4xl p-24 bg-opacity-50 cursor-pointer",
            {
              "bg-indigo-100": isOver,
            }
          )
        }
        onClick={handleDropzoneClick}
      >
        <div className="flex flex-col items-center">
          <UseAnimations animation={download} size={64} strokeColor={"#5046E4"} autoPlay={isOver} loop={isOver} className="pointer-events-none"/>
          <p className="text-lg font-light text-gray-500 dark:text-gray-200">Click or drag & drop a 'messages.html' file located inside the Telegram export folder in this zone to start an analysis.</p>
        </div>
        <input
          ref={fileInputRef}
          className="hidden invisible"
          type="file"
          onChange={filesSelected}
        />
      </div>
      <a href="https://telegram.org/blog/export-and-more" className="block my-4 text-center text-gray-500 hover:text-gray-700">How to export a Telegram conversation for analysis with this tool ?</a>
    </div>
  );
}

export default Dropzone;