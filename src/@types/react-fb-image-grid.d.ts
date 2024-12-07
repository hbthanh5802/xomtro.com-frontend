declare module '@joelfernando06/react-fb-image-grid' {
  import React from 'react';

  export interface ImageGridProps {
    images: string[]; // Array of image URLs
  }

  const ImageGrid: React.FC<ImageGridProps>;

  export default ImageGrid;
}
