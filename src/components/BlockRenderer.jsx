import React from 'react';
import BlockWrapper from './BlockWrapper';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoBlock from './blocks/VideoBlock';
import ListBlock from './blocks/ListBlock';
import ChartBlock from './blocks/ChartBlock';
import CodeBlock from './blocks/CodeBlock';

const BlockRenderer = ({ block }) => {
  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return <TextBlock block={block} />;
      case 'image':
        return <ImageBlock block={block} />;
      case 'video':
        return <VideoBlock block={block} />;
      case 'list':
        return <ListBlock block={block} />;
      case 'chart':
        return <ChartBlock block={block} />;
      case 'code':
        return <CodeBlock block={block} />;
      default:
        return <div>Unknown block type: {block.type}</div>;
    }
  };

  return (
    <BlockWrapper block={block}>
      {renderBlock()}
    </BlockWrapper>
  );
};

export default BlockRenderer;