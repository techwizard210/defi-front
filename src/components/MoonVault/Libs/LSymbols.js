/// ///////////////////////////////////////
// LSymbols
const divStyle = {
  display: 'flex',
};

export const LSymbols = {
  calculator(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 24 24"
        width="18px"
      >
        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" />
        <path d="M11.25 7.72H6.25V9.22H11.25V7.72Z" />
        <path d="M18 15.75H13V17.25H18V15.75Z" />
        <path d="M18 13.25H13V14.75H18V13.25Z" />
        <path d="M8 18H9.5V16H11.5V14.5H9.5V12.5H8V14.5H6V16H8V18Z" />
        <path d="M14.09 10.95L15.5 9.54L16.91 10.95L17.97 9.89L16.56 8.47L17.97 7.06L16.91 6L15.5 7.41L14.09 6L13.03 7.06L14.44 8.47L13.03 9.89L14.09 10.95Z" />
      </svg>
    );
  },

  exclamation(_class, _onClick) {
    return (
      <svg className={_class} onClick={_onClick} viewBox="0 0 512 512">
        <path d="M 256 8 C 119.043 8 8 119.083 8 256 C 8 392.997 119.043 504 256 504 C 392.957 504 504 392.997 504 256 C 504 119.083 392.957 8 256 8 Z M 256 456 C 145.468 456 56 366.569 56 256 C 56 145.505 145.472 56 256 56 C 366.491 56 456 145.471 456 256 C 456 366.53 366.569 456 256 456 Z" />
        <path d="M 298 368 C 298 391.159 279.159 410 256 410 C 232.841 410 214 391.159 214 368 C 214 344.841 232.841 326 256 326 C 279.159 326 298 344.841 298 368 Z" />
        <path d="M 204.538 122.406 L 218.138 285.558 C 218.777 298.331 229.319 308.359 242.108 308.359 L 271.778 308.359 C 284.567 308.359 295.109 298.331 295.748 285.558 L 309.348 122.406 C 310.033 108.697 299.104 97.207 285.378 97.207 L 228.508 97.207 C 214.782 97.207 203.853 108.697 204.538 122.406 Z" />
      </svg>
    );
  },

  info(_class, _onClick) {
    return (
      <svg className={_class} onClick={_onClick} viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
      </svg>
    );
  },

  refresh(_class, _onClick) {
    return (
      <svg className={_class} onClick={_onClick} viewBox="0 0 64 64">
        <path d="M39.777 28.593l12.26 11.273L62 26l-4.63-3.103-3.332 4.11A26.995 26.995 0 0 0 28 6C13.48 6 2 18.488 2 33a25.791 25.791 0 0 0 26 26 26.924 26.924 0 0 0 18.953-7.719l-4.244-4.241A20.967 20.967 0 0 1 28 53 19.786 19.786 0 0 1 8 33c0-11.203 8.788-21 20-21a20.979 20.979 0 0 1 20.126 16.12l-4.288-3.943z" />
      </svg>
    );
  },

  question(_class, _onClick, _tooltip, _ref) {
    return (
      <div title={_tooltip} style={divStyle} ref={_ref}>
        <svg className={_class} onClick={_onClick} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 16H13V18H11V16ZM12.61 6.04C10.55 5.74 8.73 7.01 8.18 8.83C8 9.41 8.44 10 9.05 10H9.25C9.66 10 9.99 9.71 10.13 9.33C10.45 8.44 11.4 7.83 12.43 8.05C13.38 8.25 14.08 9.18 14 10.15C13.9 11.49 12.38 11.78 11.55 13.03C11.55 13.04 11.54 13.04 11.54 13.05C11.53 13.07 11.52 13.08 11.51 13.1C11.42 13.25 11.33 13.42 11.26 13.6C11.25 13.63 11.23 13.65 11.22 13.68C11.21 13.7 11.21 13.72 11.2 13.75C11.08 14.09 11 14.5 11 15H13C13 14.58 13.11 14.23 13.28 13.93C13.3 13.9 13.31 13.87 13.33 13.84C13.41 13.7 13.51 13.57 13.61 13.45C13.62 13.44 13.63 13.42 13.64 13.41C13.74 13.29 13.85 13.18 13.97 13.07C14.93 12.16 16.23 11.42 15.96 9.51C15.72 7.77 14.35 6.3 12.61 6.04Z" />
        </svg>
      </div>
    );
  },

  check(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 24 24"
        width="18px"
      >
        <path d="M23 12L20.56 9.21L20.9 5.52L17.29 4.7L15.4 1.5L12 2.96L8.6 1.5L6.71 4.69L3.1 5.5L3.44 9.2L1 12L3.44 14.79L3.1 18.49L6.71 19.31L8.6 22.5L12 21.03L15.4 22.49L17.29 19.3L20.9 18.48L20.56 14.79L23 12ZM9.38 16.01L7 13.61C6.61 13.22 6.61 12.59 7 12.2L7.07 12.13C7.46 11.74 8.1 11.74 8.49 12.13L10.1 13.75L15.25 8.59C15.64 8.2 16.28 8.2 16.67 8.59L16.74 8.66C17.13 9.05 17.13 9.68 16.74 10.07L10.82 16.01C10.41 16.4 9.78 16.4 9.38 16.01Z" />
      </svg>
    );
  },

  link(_class, _onClick, _tooltip) {
    return (
      <div title={_tooltip} style={divStyle}>
        <svg className={_class} onClick={_onClick} viewBox="0 0 24 24">
          <path d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z" />
        </svg>
      </div>
    );
  },

  gitbook(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 1067 769"
        width="32px"
        height="32px"
        preserveAspectRatio="xMidYMid meet"
        stroke="none"
      >
        <g>
          <path
            fillRule="evenodd"
            d="M480.026 640.677c17.205 0 31.2 13.997 31.2 31.194s-13.995 31.193-31.2 31.193c-17.197 0-31.193-13.996-31.193-31.193 0-17.197 13.996-31.194 31.193-31.194m489.93-193.226c-17.203 0-31.2-13.998-31.2-31.195 0-17.204 13.997-31.2 31.2-31.2 17.198 0 31.194 13.996 31.194 31.2 0 17.197-13.996 31.195-31.193 31.195m0-127.804c-53.269 0-96.609 43.34-96.609 96.609 0 10.373 1.723 20.702 5.123 30.741L559.328 616.879c-18.132-26.128-47.521-41.617-79.302-41.617-36.821 0-70.391 21.065-86.63 54.003L106.68 478.109c-30.288-15.927-52.965-65.817-50.56-111.223 1.248-23.687 9.438-42.071 21.897-49.17 7.916-4.493 17.436-4.099 27.526 1.188l1.916 1.01c75.96 40.022 324.6 170.981 335.063 175.844 16.157 7.47 25.14 10.5 52.659-2.547l513.958-267.3c7.53-2.844 16.315-10.062 16.315-21.023 0-15.205-15.72-21.199-15.765-21.199-29.218-14.018-74.163-35.054-117.987-55.57C798.033 84.26 691.861 34.547 645.23 10.132c-40.253-21.072-72.655-3.311-78.432.282l-11.227 5.555C345.727 119.743 64.898 258.826 48.911 268.553 20.278 285.973 2.547 320.679.252 363.768c-3.586 68.304 31.261 139.506 81.069 165.634l303.172 156.354c6.83 47.306 47.55 82.725 95.532 82.725 52.78 0 95.808-42.546 96.603-95.14L910.541 492.38c16.93 13.233 37.92 20.486 59.416 20.486 53.268 0 96.61-43.341 96.61-96.61s-43.342-96.61-96.61-96.61"
          />
        </g>
      </svg>
    );
  },

  telegram(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 16 16"
        width="32px"
        height="32px"
      >
        <g>
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
        </g>
      </svg>
    );
  },

  twitter(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 256 209"
        width="32px"
        height="32px"
      >
        <g>
          <path d="M256,25.4500259 C246.580841,29.6272672 236.458451,32.4504868 225.834156,33.7202333 C236.678503,27.2198053 245.00583,16.9269929 248.927437,4.66307685 C238.779765,10.6812633 227.539325,15.0523376 215.57599,17.408298 C205.994835,7.2006971 192.34506,0.822 177.239197,0.822 C148.232605,0.822 124.716076,24.3375931 124.716076,53.3423116 C124.716076,57.4586875 125.181462,61.4673784 126.076652,65.3112644 C82.4258385,63.1210453 43.7257252,42.211429 17.821398,10.4359288 C13.3005011,18.1929938 10.710443,27.2151234 10.710443,36.8402889 C10.710443,55.061526 19.9835254,71.1374907 34.0762135,80.5557137 C25.4660961,80.2832239 17.3681846,77.9207088 10.2862577,73.9869292 C10.2825122,74.2060448 10.2825122,74.4260967 10.2825122,74.647085 C10.2825122,100.094453 28.3867003,121.322443 52.413563,126.14673 C48.0059695,127.347184 43.3661509,127.988612 38.5755734,127.988612 C35.1914554,127.988612 31.9009766,127.659938 28.694773,127.046602 C35.3777973,147.913145 54.7742053,163.097665 77.7569918,163.52185 C59.7820257,177.607983 37.1354036,186.004604 12.5289147,186.004604 C8.28987161,186.004604 4.10888474,185.75646 0,185.271409 C23.2431033,200.173139 50.8507261,208.867532 80.5109185,208.867532 C177.116529,208.867532 229.943977,128.836982 229.943977,59.4326002 C229.943977,57.1552968 229.893412,54.8901664 229.792282,52.6381454 C240.053257,45.2331635 248.958338,35.9825545 256,25.4500259" />
        </g>
      </svg>
    );
  },

  shield(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 28 28"
        width="32px"
        height="32px"
      >
        <path d="M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.73 12,23C17.16,21.73 21,16.55 21,11V5L12,1Z" />
      </svg>
    );
  },

  home(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 512 512"
        width="32px"
        height="32px"
      >
        <path d="M426.783 174.916V69.871H325.558v28.05l-69.559-52.909L0 239.736l61.795 81.243 23.421-17.814v163.823h147.007V356.195h47.554v110.792h147.007V303.161l23.421 17.815L512 239.734l-85.217-64.818zm-30.034 262.037h-86.938V326.161H202.189v110.792H115.25V280.32l140.751-107.06 140.748 107.057v156.636zm47.732-158.064l-188.48-143.364L67.517 278.891l-25.431-33.433 213.912-162.71 99.593 75.753V99.905h41.157v89.901l73.163 55.65-25.43 33.433z" />
      </svg>
    );
  },

  vault(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 364 364"
        width="32px"
        height="32px"
      >
        <path d=" M 5.58 0.00 L 358.37 0.00 C 360.77 1.76 362.92 3.94 364.00 6.78 L 364.00 356.46 C 362.86 360.58 359.30 363.20 355.22 364.00 L 9.37 364.00 C 5.04 363.48 1.21 360.82 0.00 356.53 L 0.00 6.75 C 1.08 3.93 3.22 1.79 5.58 0.00 M 31.35 40.15 C 28.27 41.34 26.86 44.85 26.99 47.96 C 26.97 55.45 27.03 62.94 27.00 70.44 C 22.20 72.45 17.68 75.61 15.25 80.34 C 12.04 85.65 12.62 92.08 12.55 98.02 C 12.70 106.32 12.27 114.65 12.78 122.94 C 13.25 131.28 19.54 138.13 27.00 141.23 C 26.99 168.26 27.02 195.29 26.99 222.32 C 22.12 224.26 17.73 227.60 15.23 232.28 C 11.86 237.92 12.67 244.74 12.55 251.01 C 12.74 259.36 12.14 267.75 12.92 276.08 C 13.86 283.90 19.97 290.08 27.00 293.04 C 27.43 302.30 26.02 311.72 27.92 320.85 C 29.95 322.40 32.18 324.10 34.88 323.98 C 132.60 324.03 230.33 323.96 328.05 324.02 C 331.11 324.33 333.81 322.73 336.07 320.86 C 336.57 318.61 337.03 316.33 337.01 314.02 C 336.98 280.86 337.01 247.71 337.00 214.56 C 340.37 214.55 343.76 214.24 346.96 213.08 C 347.87 210.82 349.14 208.58 349.01 206.05 C 349.01 190.02 348.98 173.98 349.02 157.95 C 349.08 155.29 348.48 152.36 346.36 150.57 C 343.84 148.20 340.12 149.18 337.00 148.94 C 336.98 114.94 337.03 80.93 336.98 46.93 C 337.01 42.68 333.27 39.05 328.95 39.68 C 231.30 39.63 133.64 39.69 35.99 39.65 C 34.44 39.70 32.86 39.74 31.35 40.15 Z" />
        <path d=" M 41.00 53.01 C 135.00 53.01 229.00 53.01 323.00 53.01 C 323.00 85.00 323.00 117.00 323.00 148.99 C 317.97 149.04 312.93 148.88 307.91 149.01 C 305.43 148.81 303.73 150.88 301.91 152.19 C 301.11 158.11 301.46 164.09 301.40 170.05 C 301.45 182.37 301.32 194.70 301.44 207.02 C 301.38 210.02 302.96 213.37 306.13 214.06 C 311.70 214.89 317.37 214.27 322.99 214.44 C 323.01 246.29 322.99 278.15 323.00 310.00 C 229.00 310.00 135.00 310.00 41.00 310.00 C 41.00 304.36 41.00 298.73 41.00 293.10 C 47.74 290.18 53.64 284.44 54.95 276.99 C 55.90 270.36 55.32 263.64 55.47 256.98 C 55.34 250.62 55.89 244.20 54.91 237.89 C 53.42 230.71 47.83 224.84 41.02 222.33 C 40.97 195.30 41.02 168.28 41.00 141.26 C 45.81 139.01 50.41 135.79 52.86 130.94 C 56.15 125.20 55.37 118.34 55.48 112.00 C 55.31 104.02 55.80 96.02 55.19 88.06 C 54.54 79.97 48.44 73.20 41.00 70.44 C 41.00 64.63 41.00 58.82 41.00 53.01 M 169.43 97.50 C 151.49 100.20 134.43 108.72 121.73 121.71 C 108.39 134.94 99.75 152.75 97.50 171.40 C 95.11 191.09 99.73 211.65 110.77 228.19 C 123.23 247.29 143.55 261.09 166.00 265.29 C 188.89 269.93 213.54 264.15 232.28 250.28 C 249.23 237.80 261.50 218.95 265.45 198.21 C 269.58 177.99 265.83 156.33 255.32 138.59 C 244.11 119.44 225.18 104.93 203.66 99.40 C 192.55 96.35 180.81 96.15 169.43 97.50 Z" />
        <path d=" M 31.33 83.42 C 36.26 81.36 42.02 85.65 41.95 90.87 C 42.07 100.62 42.00 110.37 41.98 120.12 C 42.20 123.43 39.68 125.84 37.67 128.10 C 35.23 128.35 32.77 128.35 30.33 128.10 C 28.30 125.83 25.80 123.39 26.02 120.07 C 25.96 110.69 26.01 101.31 26.00 91.93 C 25.87 88.37 27.81 84.60 31.33 83.42 Z" />
        <path d=" M 136.61 126.59 C 147.35 117.47 160.97 111.79 175.00 110.58 C 175.00 116.72 175.00 122.86 175.00 129.00 C 167.35 130.53 159.67 132.75 153.22 137.30 C 151.82 137.97 150.05 139.91 148.52 138.53 C 144.37 134.74 140.50 130.64 136.61 126.59 Z" />
        <path d=" M 189.00 110.58 C 203.04 111.79 216.68 117.46 227.40 126.60 C 223.52 130.60 219.71 134.68 215.59 138.44 C 214.01 140.01 212.16 137.96 210.70 137.25 C 204.28 132.72 196.61 130.54 189.00 129.00 C 189.00 122.86 189.00 116.72 189.00 110.58 Z" />
        <path d=" M 125.82 137.63 C 126.53 136.07 128.02 137.55 128.72 138.21 C 132.51 141.88 136.11 145.75 139.94 149.37 C 134.37 156.88 130.64 165.72 129.39 175.01 C 123.19 174.98 116.99 175.02 110.80 174.97 C 112.14 161.47 117.22 148.17 125.82 137.63 Z" />
        <path d=" M 236.57 137.14 C 236.80 137.08 237.27 136.98 237.50 136.93 C 246.61 147.46 251.77 161.19 253.20 174.96 C 247.01 174.86 240.79 175.35 234.63 174.74 C 233.19 165.58 229.63 156.80 224.05 149.37 C 228.35 145.42 232.15 140.94 236.57 137.14 Z" />
        <path d=" M 178.23 142.31 C 195.56 140.44 213.18 151.57 219.02 167.99 C 223.63 180.38 221.50 195.04 213.40 205.53 C 203.72 218.75 185.30 224.47 169.79 219.23 C 157.61 215.39 147.79 205.22 144.17 193.00 C 141.45 183.61 142.17 173.20 146.50 164.40 C 152.34 152.21 164.80 143.64 178.23 142.31 M 178.35 165.44 C 171.56 167.04 165.93 173.09 165.50 180.15 C 164.31 189.47 172.52 198.70 181.98 198.16 C 191.49 198.71 199.68 189.46 198.50 180.11 C 197.96 170.54 187.63 162.93 178.35 165.44 Z" />
        <path d=" M 315.00 163.00 C 321.67 163.00 328.33 163.00 335.00 163.00 C 335.00 175.66 335.00 188.32 335.00 200.98 C 328.35 200.96 321.70 201.03 315.05 200.93 C 314.93 188.29 315.03 175.64 315.00 163.00 Z" />
        <path d=" M 110.80 188.35 C 117.01 188.33 123.22 188.32 129.43 188.36 C 130.71 197.67 134.29 206.64 140.07 214.07 C 135.43 218.14 131.88 223.63 126.31 226.52 C 117.53 215.69 112.02 202.24 110.80 188.35 Z" />
        <path d=" M 234.56 188.37 C 240.77 188.31 246.99 188.33 253.20 188.35 C 251.85 201.95 246.82 215.51 237.88 225.95 C 237.43 225.94 236.53 225.93 236.07 225.93 C 231.72 222.32 228.04 217.96 223.93 214.07 C 229.69 206.63 233.29 197.68 234.56 188.37 Z" />
        <path d=" M 136.57 236.99 C 141.07 232.73 145.04 227.77 149.95 224.03 C 157.44 229.22 165.93 232.98 175.00 234.27 C 175.00 240.54 175.01 246.81 174.99 253.09 C 169.47 252.04 163.87 251.19 158.56 249.25 C 150.56 246.54 143.25 242.12 136.57 236.99 Z" />
        <path d=" M 189.00 234.27 C 198.10 232.98 206.63 229.20 214.12 223.96 C 218.77 227.98 223.11 232.42 227.23 236.98 C 216.52 246.15 202.86 251.17 189.01 253.09 C 188.99 246.81 189.00 240.54 189.00 234.27 Z" />
        <path d=" M 31.46 234.98 C 33.15 234.98 34.85 234.98 36.55 234.98 C 38.11 236.16 40.07 237.10 40.95 238.96 C 42.29 241.41 41.98 244.27 42.04 246.95 C 41.92 255.32 42.10 263.70 41.98 272.08 C 42.06 276.32 38.45 280.68 33.97 280.22 C 30.99 280.48 28.23 278.60 26.98 275.97 C 25.56 273.20 26.08 269.99 25.97 267.00 C 26.15 258.65 25.77 250.29 26.13 241.95 C 26.34 238.72 28.86 236.51 31.46 234.98 Z" />
      </svg>
    );
  },

  trade(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 28 28"
        width="32px"
        height="32px"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.86 4.86003L21.65 7.65003C21.84 7.84003 21.84 8.16003 21.64 8.35003L18.85 11.14C18.54 11.46 18 11.24 18 10.79V9.00003H4C3.45 9.00003 3 8.55003 3 8.00003C3 7.45003 3.45 7.00003 4 7.00003H18V5.21003C18 4.76003 18.54 4.54003 18.86 4.86003ZM5.14001 19.14L2.35001 16.35C2.16001 16.16 2.16001 15.84 2.36001 15.65L5.15001 12.86C5.46001 12.54 6.00001 12.76 6.00001 13.21V15H20C20.55 15 21 15.45 21 16C21 16.55 20.55 17 20 17H6.00001V18.79C6.00001 19.24 5.46001 19.46 5.14001 19.14Z"
        />
      </svg>
    );
  },

  viewMode_grid(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 24 24"
        width="32px"
        height="32px"
      >
        <path d="M4.5 12H7.5C8.05 12 8.5 11.55 8.5 11V7C8.5 6.45 8.05 6 7.5 6H4.5C3.95 6 3.5 6.45 3.5 7V11C3.5 11.55 3.95 12 4.5 12ZM4.5 19H7.5C8.05 19 8.5 18.55 8.5 18V14C8.5 13.45 8.05 13 7.5 13H4.5C3.95 13 3.5 13.45 3.5 14V18C3.5 18.55 3.95 19 4.5 19ZM10.5 19H13.5C14.05 19 14.5 18.55 14.5 18V14C14.5 13.45 14.05 13 13.5 13H10.5C9.95 13 9.5 13.45 9.5 14V18C9.5 18.55 9.95 19 10.5 19ZM16.5 19H19.5C20.05 19 20.5 18.55 20.5 18V14C20.5 13.45 20.05 13 19.5 13H16.5C15.95 13 15.5 13.45 15.5 14V18C15.5 18.55 15.95 19 16.5 19ZM10.5 12H13.5C14.05 12 14.5 11.55 14.5 11V7C14.5 6.45 14.05 6 13.5 6H10.5C9.95 6 9.5 6.45 9.5 7V11C9.5 11.55 9.95 12 10.5 12ZM15.5 7V11C15.5 11.55 15.95 12 16.5 12H19.5C20.05 12 20.5 11.55 20.5 11V7C20.5 6.45 20.05 6 19.5 6H16.5C15.95 6 15.5 6.45 15.5 7Z" />
      </svg>
    );
  },

  viewMode_table(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 24 24"
        width="32px"
        height="32px"
      >
        <path d="M4.5 14H6.5C7.05 14 7.5 13.55 7.5 13V11C7.5 10.45 7.05 10 6.5 10H4.5C3.95 10 3.5 10.45 3.5 11V13C3.5 13.55 3.95 14 4.5 14ZM4.5 19H6.5C7.05 19 7.5 18.55 7.5 18V16C7.5 15.45 7.05 15 6.5 15H4.5C3.95 15 3.5 15.45 3.5 16V18C3.5 18.55 3.95 19 4.5 19ZM4.5 9H6.5C7.05 9 7.5 8.55 7.5 8V6C7.5 5.45 7.05 5 6.5 5H4.5C3.95 5 3.5 5.45 3.5 6V8C3.5 8.55 3.95 9 4.5 9ZM9.5 14H19.5C20.05 14 20.5 13.55 20.5 13V11C20.5 10.45 20.05 10 19.5 10H9.5C8.95 10 8.5 10.45 8.5 11V13C8.5 13.55 8.95 14 9.5 14ZM9.5 19H19.5C20.05 19 20.5 18.55 20.5 18V16C20.5 15.45 20.05 15 19.5 15H9.5C8.95 15 8.5 15.45 8.5 16V18C8.5 18.55 8.95 19 9.5 19ZM8.5 6V8C8.5 8.55 8.95 9 9.5 9H19.5C20.05 9 20.5 8.55 20.5 8V6C20.5 5.45 20.05 5 19.5 5H9.5C8.95 5 8.5 5.45 8.5 6Z" />
      </svg>
    );
  },

  wallet_metaMask(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 40 40"
        width="32px"
      >
        <path
          d="M36.0112 3.33337L22.1207 13.6277L24.7012 7.56091L36.0112 3.33337Z"
          fill="#E17726"
        />
        <path
          d="M4.00261 3.33337L17.7558 13.7238L15.2989 7.56091L4.00261 3.33337Z"
          fill="#E27625"
        />
        <path
          d="M31.0149 27.2023L27.3227 32.8573L35.2287 35.0397L37.4797 27.3258L31.0149 27.2023Z"
          fill="#E27625"
        />
        <path
          d="M2.53386 27.3258L4.77116 35.0397L12.6772 32.8573L8.9987 27.2023L2.53386 27.3258Z"
          fill="#E27625"
        />
        <path
          d="M12.2518 17.6496L10.0419 20.9712L17.8793 21.3281L17.6048 12.8867L12.2518 17.6496Z"
          fill="#E27625"
        />
        <path
          d="M27.762 17.6494L22.3129 12.7905L22.1207 21.3279L29.9581 20.9711L27.762 17.6494Z"
          fill="#E27625"
        />
        <path
          d="M12.6772 32.8574L17.3989 30.5652L13.336 27.3809L12.6772 32.8574Z"
          fill="#E27625"
        />
        <path
          d="M22.6009 30.5652L27.3226 32.8574L26.6637 27.3809L22.6009 30.5652Z"
          fill="#E27625"
        />
        <path
          d="M27.3226 32.8575L22.6009 30.5653L22.9715 33.6399L22.9303 34.9301L27.3226 32.8575Z"
          fill="#D5BFB2"
        />
        <path
          d="M12.6772 32.8575L17.0694 34.9301L17.042 33.6399L17.3989 30.5653L12.6772 32.8575Z"
          fill="#D5BFB2"
        />
        <path
          d="M17.1518 25.3495L13.2262 24.1965L15.9988 22.92L17.1518 25.3495Z"
          fill="#233447"
        />
        <path
          d="M22.848 25.3495L24.001 22.92L26.801 24.1965L22.848 25.3495Z"
          fill="#233447"
        />
        <path
          d="M12.6773 32.8573L13.3635 27.2023L8.99876 27.3258L12.6773 32.8573Z"
          fill="#CC6228"
        />
        <path
          d="M26.6364 27.2023L27.3227 32.8573L31.0149 27.3258L26.6364 27.2023Z"
          fill="#CC6228"
        />
        <path
          d="M29.9581 20.9709L22.1207 21.3278L22.8482 25.3495L24.0011 22.92L26.8012 24.1965L29.9581 20.9709Z"
          fill="#CC6228"
        />
        <path
          d="M13.2263 24.1965L15.9989 22.92L17.1519 25.3495L17.8793 21.3278L10.0419 20.9709L13.2263 24.1965Z"
          fill="#CC6228"
        />
        <path
          d="M10.0419 20.9709L13.3361 27.3809L13.2263 24.1965L10.0419 20.9709Z"
          fill="#E27525"
        />
        <path
          d="M26.8011 24.1965L26.6638 27.3809L29.958 20.9709L26.8011 24.1965Z"
          fill="#E27525"
        />
        <path
          d="M17.8793 21.3278L17.1519 25.3494L18.0715 30.0985L18.2637 23.8396L17.8793 21.3278Z"
          fill="#E27525"
        />
        <path
          d="M22.1205 21.3278L21.7499 23.8258L21.9283 30.0985L22.848 25.3494L22.1205 21.3278Z"
          fill="#E27525"
        />
        <path
          d="M22.848 25.3496L21.9284 30.0987L22.601 30.5654L26.6638 27.381L26.8011 24.1967L22.848 25.3496Z"
          fill="#F5841F"
        />
        <path
          d="M13.2262 24.1967L13.336 27.381L17.3989 30.5654L18.0714 30.0987L17.1518 25.3496L13.2262 24.1967Z"
          fill="#F5841F"
        />
        <path
          d="M22.9303 34.93L22.9715 33.6398L22.6284 33.3378H17.3714L17.042 33.6398L17.0694 34.93L12.6772 32.8574L14.2145 34.1202L17.3302 36.2751H22.6696L25.7853 34.1202L27.3226 32.8574L22.9303 34.93Z"
          fill="#C0AC9D"
        />
        <path
          d="M22.601 30.5653L21.9284 30.0986H18.0715L17.3989 30.5653L17.0421 33.6399L17.3715 33.3379H22.6285L22.9716 33.6399L22.601 30.5653Z"
          fill="#161616"
        />
        <path
          d="M36.5875 14.3003L37.7542 8.61779L36.011 3.33337L22.6009 13.2846L27.7618 17.6493L35.0365 19.7768L36.6424 17.8964L35.9424 17.3886L37.0679 16.3728L36.2169 15.7003L37.3287 14.863L36.5875 14.3003Z"
          fill="#763E1A"
        />
        <path
          d="M2.24573 8.61779L3.42615 14.3003L2.67123 14.863L3.78302 15.7003L2.93202 16.3728L4.05753 17.3886L3.35752 17.8964L4.96343 19.7768L12.2518 17.6493L17.399 13.2846L4.00263 3.33337L2.24573 8.61779Z"
          fill="#763E1A"
        />
        <path
          d="M35.0365 19.777L27.7619 17.6495L29.958 20.9712L26.6638 27.3811L31.0149 27.3262H37.4797L35.0365 19.777Z"
          fill="#F5841F"
        />
        <path
          d="M12.2517 17.6495L4.96332 19.777L2.53386 27.3262H8.99869L13.336 27.3811L10.0419 20.9712L12.2517 17.6495Z"
          fill="#F5841F"
        />
        <path
          d="M22.1205 21.3276L22.6009 13.2843L24.701 7.56067H15.2988L17.3988 13.2843L17.8792 21.3276L18.0577 23.8531L18.0714 30.0984H21.9283L21.9421 23.8531L22.1205 21.3276Z"
          fill="#F5841F"
        />
      </svg>
    );
  },

  wallet_walletConnect(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 40 40"
        width="32px"
      >
        <path
          d="M8.68096 12.4756C14.9323 6.39698 25.0677 6.39698 31.3191 12.4756L32.0714 13.2071C32.384 13.511 32.384 14.0038 32.0714 14.3077L29.4978 16.8103C29.3415 16.9622 29.0881 16.9622 28.9318 16.8103L27.8965 15.8036C23.5354 11.563 16.4647 11.563 12.1036 15.8036L10.9948 16.8817C10.8385 17.0336 10.5851 17.0336 10.4288 16.8817L7.85517 14.3791C7.54261 14.0752 7.54261 13.5824 7.85517 13.2785L8.68096 12.4756ZM36.6417 17.6511L38.9322 19.8783C39.2448 20.1823 39.2448 20.675 38.9322 20.979L28.6039 31.022C28.2913 31.3259 27.7846 31.3259 27.472 31.022C27.472 31.022 27.472 31.022 27.472 31.022L20.1416 23.8942C20.0634 23.8182 19.9367 23.8182 19.8586 23.8942C19.8586 23.8942 19.8586 23.8942 19.8586 23.8942L12.5283 31.022C12.2157 31.3259 11.709 31.3259 11.3964 31.022C11.3964 31.022 11.3964 31.022 11.3964 31.022L1.06775 20.9788C0.755186 20.6749 0.755186 20.1821 1.06775 19.8782L3.35833 17.6509C3.6709 17.347 4.17767 17.347 4.49024 17.6509L11.8208 24.7789C11.8989 24.8549 12.0256 24.8549 12.1038 24.7789C12.1038 24.7789 12.1038 24.7789 12.1038 24.7789L19.4339 17.6509C19.7465 17.347 20.2533 17.347 20.5658 17.6509C20.5658 17.6509 20.5658 17.6509 20.5658 17.6509L27.8964 24.7789C27.9745 24.8549 28.1012 24.8549 28.1794 24.7789L35.5098 17.6511C35.8223 17.3471 36.3291 17.3471 36.6417 17.6511Z"
          fill="#3389FB"
        />
      </svg>
    );
  },

  arrow_down(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        viewBox="0 0 24 24"
        width="32px"
      >
        <path d="M11 5V16.17L6.11997 11.29C5.72997 10.9 5.08997 10.9 4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7L11.29 19.29C11.68 19.68 12.31 19.68 12.7 19.29L19.29 12.7C19.68 12.31 19.68 11.68 19.29 11.29C18.9 10.9 18.27 10.9 17.88 11.29L13 16.17V5C13 4.45 12.55 4 12 4C11.45 4 11 4.45 11 5Z" />
      </svg>
    );
  },

  fuel(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="18"
        height="20"
        viewBox="0 0 18 20"
      >
        <path d="M13.5215 0.618164L12.6818 1.57302L15.933 4.37393V13.2435C15.9114 13.6891 15.5239 14.0498 15.0502 14.0286C14.6196 14.0074 14.2751 13.6679 14.2536 13.2435V7.28093C14.2536 6.21998 13.3923 5.37122 12.3158 5.37122H11.8421V2.67641C11.8421 1.61546 10.9808 0.766697 9.90428 0.766697H1.93779C0.861242 0.766697 0 1.61546 0 2.67641V18.4421C0 18.9089 0.387559 19.2909 0.861242 19.2909H10.9808C11.4545 19.2909 11.8421 18.9089 11.8421 18.4421V6.64436H12.3158C12.6818 6.64436 12.9617 6.92021 12.9617 7.28093V13.2435C13.0048 14.4105 13.9737 15.3017 15.1579 15.2805C16.2775 15.2381 17.1818 14.3469 17.2248 13.2435V3.80102L13.5215 0.618164ZM9.66744 8.89358H2.17464V3.10079H9.66744V8.89358Z" />
      </svg>
    );
  },

  shieldLock(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="24"
        height="24"
        viewBox="0 0 16 16"
      >
        <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
        <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z" />
      </svg>
    );
  },

  clipboard(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="24"
        height="24"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
        />
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
      </svg>
    );
  },

  checkCircle(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="24"
        height="24"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
      </svg>
    );
  },

  settings(_class, _onClick, _tooltip) {
    return (
      <div title={_tooltip} style={divStyle}>
        <svg className={_class} onClick={_onClick} viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
        </svg>
      </div>
    );
  },

  error(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="64"
        height="64"
        viewBox="0 0 24 24"
      >
        <path d="M12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7ZM11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM13 17H11V15H13V17Z" />
      </svg>
    );
  },

  success(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="64"
        height="64"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
      </svg>
    );
  },

  loading(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="64"
        height="64"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
        />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
      </svg>
    );
  },

  submitted(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="64"
        height="64"
        viewBox="0 0 24 24"
      >
        <path d="M13 19V7.83001L17.88 12.71C18.27 13.1 18.91 13.1 19.3 12.71C19.69 12.32 19.69 11.69 19.3 11.3L12.71 4.71001C12.32 4.32001 11.69 4.32001 11.3 4.71001L4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7C5.08997 13.09 5.71997 13.09 6.10997 12.7L11 7.83001V19C11 19.55 11.45 20 12 20C12.55 20 13 19.55 13 19Z" />
      </svg>
    );
  },

  cart(_class, _onClick) {
    return (
      <div className={_class}>
        <svg className={_class} onClick={_onClick} viewBox="0 0 16 16">
          <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
        </svg>
      </div>
    );
  },

  eye(_class, _onClick) {
    return (
      <svg className={_class} onClick={_onClick} viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
      </svg>
    );
  },

  roadmap(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="32"
        height="32"
        viewBox="0 0 16 16"
      >
        <path d="M7.293.707A1 1 0 0 0 7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586A1 1 0 0 0 7.293.707z" />
      </svg>
    );
  },

  team(_class, _onClick) {
    return (
      <svg
        className={_class}
        onClick={_onClick}
        width="32"
        height="32"
        viewBox="0 0 16 16"
      >
        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      </svg>
    );
  },
};
/// ///////////////////////////////////////