import Svg, { Path } from "react-native-svg";

const PaperPlaneIcon = () => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 20V4L22 12L3 20ZM5 17L16.85 12L5 7V10.5L11 12L5 13.5V17ZM5 17V12V7V10.5V13.5V17Z"
        fill="#1A9C67"
      />
    </Svg>
  );
};

export default PaperPlaneIcon;
