import React from "react";
import "./style/loader.css";

const Loader: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-full gap-2 bg-black/50">
      <div className="rounded-but-right w-20 ml-14 h-12 bg-chat-user-message shadow-md animated-message-top" />
      <div className="rounded-but-left mr-14 h-12 w-20 bg-chat-system-message shadow-md animated-message-bottom" />
    </div>
  );
};

export default Loader;
