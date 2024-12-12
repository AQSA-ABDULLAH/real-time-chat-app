import ChatList from "@/app/components/ChatList";
import Contact from "@/app/components/Contact";

const Chats = () => {
  return (
    <div className="main-container flex flex-col md:flex-row h-full">
      {/* Sidebar ChatList */}
      <div className="w-1/3 border-r border-gray-200">
        <ChatList />
      </div>

      {/* Contact Section */}
      <div className="w-2/3">
        <Contact />
      </div>
    </div>
  );
};

export default Chats;

