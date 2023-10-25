import { createSvgIcon } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import IconButton from "@mui/material/IconButton";

// Create a logo svg component
const LogoIcon = createSvgIcon(
  <svg
    id="Logo"
    data-name="Logo"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 500 500"
    fill="currentColor"
  >
    <path d="M217.22,290.83q-1-6-2.36-12.18A294.85,294.85,0,0,0,199,228a226.85,226.85,0,0,0-23.78,7.38c-16.94,6.3-34,12.22-51.12,18.11-11.25,3.88-16.09,1.15-19.75-10.4-14.41-45.56,8.08-99.09,50.94-121.23,44.89-23.2,100.53-10.69,129.91,28.76a110.83,110.83,0,0,1,13,21.34c5.7,12.87,3.28,18.71-9.91,23.44-18.32,6.58-36.76,12.85-55.06,19.49-.7.26-5,2.13-11,4.48L218,221c11.22,32.56,19.65,56.4,22,62.56a9.64,9.64,0,0,0,3,4.42c3.25,2.59,7.9,2,12.24,2.24,33.63,1.59,66.36,6.88,96.31,23.67,14.28,8,27.56,17.1,37,31,6.39,9.4,9.77,19.29,4.14,30.07-5.47,10.47-14.73,14.8-26.37,14.79q-116.18-.08-232.35,0c-12.36,0-21.89-4.91-27.19-15.86-6.11-12.65-.73-23.55,7.69-33.17,23.53-26.86,54.75-38.83,88.52-45.74C207.8,294,213.13,294.5,217.22,290.83ZM373.6,366.1a41.34,41.34,0,0,0-1.54-4.31,47.94,47.94,0,0,0-9.43-13.56c-15-15-37.92-22.7-37.92-22.7-48.41-16.72-97-17.62-145.74-1.31,0,0-27.51,9.06-44.54,27.32A32.22,32.22,0,0,0,128,362a26,26,0,0,0-1,4c59.07.05,144.09.09,203.16.1Zm-198.72-228c-5.3,25.18-.94,47.63,7.35,70.5,12.61-3.41,24-6.57,34.38-12.34C207.41,168,191.79,145.42,174.88,138.07Zm99.78,38.07c-12.34-26.09-40.93-44.19-65.44-41.52a323.9,323.9,0,0,1,30,53.69C251.73,185.19,263,181.72,274.66,176.14ZM150.23,156c-22,12.71-33.87,50.13-24.12,72.63,11.32-2.94,22.63-6,33.08-12.89C155.68,196.1,149.81,177.4,150.23,156Z" />
    <path d="M351.25,182.76c27.83.33,49.5,22.63,48.73,50.15-.76,27.08-23.66,48.51-51.29,48-27.45-.52-48.27-22.87-47.67-51.18C301.59,202.86,323.44,182.44,351.25,182.76Zm25.56,49.37c.17-16.36-10.74-27.44-26.87-27.28-14.87.14-26.3,11.42-26.81,26.45-.5,14.74,12.2,27.48,27.42,27.51S376.65,247.75,376.81,232.13Z" />
  </svg>,
  "Logo"
);

// This component is used to display a logo with hover animation
const Logo = () => {
  // Make it smoother
  const rotateGradient = keyframes`
   0% {
     background: linear-gradient(-135deg, #f2afa8 0%, #f1a49c 11%, #ed8278 49%, #eb6e61 80%, #ea6659 100%) no-repeat;
   }
   25% {
     background: linear-gradient(-180deg, #f2afa8 0%, #f1a49c 11%, #ed8278 49%, #eb6e61 80%, #ea6659 100%) no-repeat;
   }
   50% {
     background: linear-gradient(-225deg, #f2afa8 0%, #f1a49c 11%, #ed8278 49%, #eb6e61 80%, #ea6659 100%) no-repeat;
   }
   75% {
     background: linear-gradient(-270deg, #f2afa8 0%, #f1a49c 11%, #ed8278 49%, #eb6e61 80%, #ea6659 100%) no-repeat;
   }
   100% {
     background: linear-gradient(135deg, #f2afa8 0%, #f1a49c 11%, #ed8278 49%, #eb6e61 80%, #ea6659 100%) no-repeat;
   }
 `;

  const RotatingIconButton = styled(IconButton)`
    padding: 3px;
    background: linear-gradient(
        -135deg,
        #f2afa8 0%,
        #f1a49c 11%,
        #ed8278 49%,
        #eb6e61 80%,
        #ea6659 100%
      )
      no-repeat;
    &:hover {
      animation: ${rotateGradient} 0.5s forwards;
    }
  `;
  return (
    <RotatingIconButton>
      <LogoIcon fontSize="large" color="white" />
    </RotatingIconButton>
  );
};

export default Logo;
