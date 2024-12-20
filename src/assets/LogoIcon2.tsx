const LogoIcon2 = ({ width = 512, height = 512 }) => {
  return (
    <svg
      height={height}
      width={width}
      viewBox='0 0 512 512'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
    >
      <linearGradient
        id='linear-gradient'
        gradientTransform='matrix(0 -1 1 0 0 512)'
        gradientUnits='userSpaceOnUse'
        x1='38.65'
        x2='473.35'
        y1='38.65'
        y2='473.35'
      >
        <stop offset='0' stopColor='#549eff' />
        <stop offset='1' stopColor='#006db0' />
      </linearGradient>
      <linearGradient
        id='linear-gradient-2'
        gradientUnits='userSpaceOnUse'
        x1='167.61'
        x2='455.55'
        y1='203.22'
        y2='491.15'
      >
        <stop offset='0' stopOpacity='.35' />
        <stop offset='1' stopOpacity='0' />
      </linearGradient>
      <g id='Layer_2' data-name='Layer 2'>
        <g id='InterfaceIcon'>
          <g id='_01.Home' data-name='01.Home'>
            <rect
              id='Background'
              fill='url(#linear-gradient)'
              height='512'
              rx='131.96'
              transform='matrix(0 1 -1 0 512 0)'
              width='512'
            />
            <path
              d='m512 340.79v39.21a132 132 0 0 1 -132 132h-110.42l-126.51-126.51 12.64-84.05-43.16-43.16 286-30.9z'
              fill='url(#linear-gradient-2)'
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

export default LogoIcon2;
