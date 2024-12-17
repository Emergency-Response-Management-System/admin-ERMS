import React from "react";

const Message = ({ variant, children }) => {
  return (
    <div 
      className="message-toast d-flex justify-content-center col-12">
      <div className={`alert ${variant}`}>{children}</div>
    </div>
  );
};

Message.defaultProps = {
  variant: "alert-info",
};

export default Message;
