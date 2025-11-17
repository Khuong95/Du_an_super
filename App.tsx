
import React from 'react';
import KioskForm from './components/KioskForm';
import ChatbotPopup from './components/ChatbotPopup';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans text-slate-800 antialiased">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <header className="text-center mb-8">
          <img 
            src="https://www.hoteljob.vn/uploads/images/2023/01/06/63b7cf582e8463_18375884.png" 
            alt="Logo Bệnh viện"
            className="h-24 w-auto mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-700">Chào mừng đến với Khoa Phụ Sản</h1>
          <p className="mt-2 text-lg text-slate-500">Vui lòng cung cấp thông tin của bạn dưới đây</p>
        </header>
        
        <div className="w-full max-w-lg">
          <KioskForm />
        </div>
      </main>
      
      <ChatbotPopup />
    </div>
  );
};

export default App;