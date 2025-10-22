import * as React from 'react';

interface NewMessageEmailProps {
  senderName: string;
  messageContent: string;
  conversationUrl: string;
}

export const NewMessageEmail: React.FC<Readonly<NewMessageEmailProps>> = ({ senderName, messageContent, conversationUrl }) => (
  <div>
    <h1>New Message from {senderName}</h1>
    <p>You have received a new message:</p>
    <blockquote>{messageContent}</blockquote>
    <p>
      <a href={conversationUrl}>Click here to view the conversation and reply</a>
    </p>
  </div>
);
