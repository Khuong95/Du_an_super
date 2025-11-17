import React, { useState } from 'react';
import ChatIcon from './icons/ChatIcon';
import CloseIcon from './icons/CloseIcon';

const ChatbotPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`fixed bottom-5 right-5 z-40 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'} flex items-center gap-3 cursor-pointer`} onClick={toggleChat}>
        <div className="bg-white text-slate-800 px-4 py-2 rounded-xl shadow-lg font-semibold">
            <p>Bạn thắc mắc gì về gói sinh?</p>
        </div>
        <button
          className="bg-pink-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          aria-label="Mở cửa sổ chat"
        >
          <ChatIcon />
        </button>
      </div>

      <div
        className={`fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] h-[calc(100%-2.5rem)] sm:w-[380px] sm:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <header className="flex items-center justify-between p-4 bg-pink-600 text-white rounded-t-2xl">
          <h3 className="font-bold text-lg">Trợ lý ảo</h3>
          <button
            onClick={toggleChat}
            className="p-1 rounded-full hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Đóng cửa sổ chat"
          >
            <CloseIcon />
          </button>
        </header>
        <div className="flex-grow">
          <iframe
            src="https://goisinhcuadongdeep.netlify.app/"
            title="Chatbot tư vấn"
            className="w-full h-full border-0"
            allow="microphone"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default ChatbotPopup;