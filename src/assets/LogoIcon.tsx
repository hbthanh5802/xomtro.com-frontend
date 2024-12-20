import React from 'react';

interface IconProps {
  size?: number; // Kích thước của icon (cả chiều rộng và chiều cao)
}

const LogoIcon: React.FC<IconProps> = ({ size = 512 }) => {
  return (
    <svg height={size} width={size} viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'>
      <g id='Layer_2' data-name='Layer 2'>
        <g id='InterfaceIcon'>
          <g id='_01.Home' data-name='01.Home'>
            <rect
              id='Background'
              fill='#41a5ee'
              height='512'
              rx='131.96'
              transform='matrix(0 1 -1 0 512 0)'
              width='512'
            />
            <path
              d='m512 340.79v39.21a132 132 0 0 1 -132 132h-110.42l-126.51-126.51 12.64-84.05-43.16-43.16 286-30.9z'
              opacity='.25'
            />
            <path
              id='_01.Home-2'
              d='m398.59 227.38-116.25-97.38a41 41 0 0 0 -52.69 0l-116.24 97.38c-14.75 12.36-6 36.4 13.23 36.4h10.54v107.33a20.51 20.51 0 0 0 20.51 20.51h58.76v-69.32a39.54 39.54 0 0 1 39.55-39.55 39.55 39.55 0 0 1 39.55 39.55v69.32h58.76a20.51 20.51 0 0 0 20.51-20.51v-107.33h10.53c19.25 0 27.99-24.04 13.24-36.4z'
              fill='#fff'
              data-name='01.Home'
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default LogoIcon;
