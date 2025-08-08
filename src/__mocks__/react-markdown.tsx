import React from 'react';

interface ReactMarkdownProps {
  children: string;
  [key: string]: any;
}

const ReactMarkdown: React.FC<ReactMarkdownProps> = ({ children }) => {
  return <div data-testid="react-markdown">{children}</div>;
};

export default ReactMarkdown;
