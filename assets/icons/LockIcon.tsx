import Svg, { ClipPath, G, Path, Rect } from "react-native-svg";

const LockIcon = () => {
  return (
    <Svg width={11} height={11} viewBox="0 0 11 11" fill="none">
      <G clip-path="url(#clip0_42_1978)">
        <Path
          d="M3.20833 5.04163V3.20829C3.20833 2.6005 3.44978 2.01761 3.87955 1.58784C4.30932 1.15807 4.89221 0.916626 5.5 0.916626C6.10779 0.916626 6.69068 1.15807 7.12045 1.58784C7.55022 2.01761 7.79167 2.6005 7.79167 3.20829V5.04163M2.29167 5.04163H8.70833C9.21459 5.04163 9.625 5.45203 9.625 5.95829V9.16663C9.625 9.67289 9.21459 10.0833 8.70833 10.0833H2.29167C1.78541 10.0833 1.375 9.67289 1.375 9.16663V5.95829C1.375 5.45203 1.78541 5.04163 2.29167 5.04163Z"
          stroke="#434343"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
      <ClipPath id="clip0_42_1978">
        <Rect width={11} height={11} fill="white" />
      </ClipPath>
    </Svg>
  );
};

export default LockIcon;
