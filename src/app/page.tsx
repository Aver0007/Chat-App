import Iconsbar from "../../Modules/Iconsbar";
import RightBar from "../../Modules/RightBar";
import TopBar from "../../Modules/TopBar";


export default function Home() {
  return (
    <div className="flex h-screen">

      {/* 🟦 Sidebar 1: Left vertical icon bar (FULL HEIGHT) */}
      <div className="w-[3.5rem] bg-white border-r border-gray-300 flex flex-col items-center py-2">
        <Iconsbar/>
      </div>

      {/* Right side content: vertical layout with Top Bar + rest */}
      <div className="flex flex-col flex-1">

        {/* 🟩 Top Bar */}
        <div className="h-12 w-full bg-white border-b border-gray-300 flex items-center justify-between px-4">
          <TopBar/>
        </div>

        {/* 🟨 Main Content under Top Bar */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar 2: Chat list */}
          <div className="w-[24rem] border-r border-gray-300 overflow-y-auto">
            chat sidebar
          </div>

          {/* Chat Window */}
          <div className="flex-1 bg-[#f0f2f5] overflow-y-auto">
            chat window
          </div>

          {/* Sidebar 4: Right narrow sidebar */}
          <div className="w-[3rem] bg-white border-l border-gray-300 flex flex-col items-center py-2">
            <RightBar/>
          </div>

        </div>

      </div>
    </div>
  );
}
