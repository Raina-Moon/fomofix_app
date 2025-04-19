import Svg, { ClipPath, G, Path, Rect } from "react-native-svg";

const LogoutIcon = () => {
  return (
    <Svg width={11} height={11} viewBox="0 0 11 11" fill="none">
      <G clip-path="url(#clip0_42_1980)">
        <Path
          d="M4.125 9.625H2.29167C2.04855 9.625 1.81539 9.52842 1.64349 9.35651C1.47158 9.18461 1.375 8.95145 1.375 8.70833V2.29167C1.375 2.04855 1.47158 1.81539 1.64349 1.64349C1.81539 1.47158 2.04855 1.375 2.29167 1.375H4.125M7.33333 7.79167L9.625 5.5M9.625 5.5L7.33333 3.20833M9.625 5.5H4.125"
          stroke="#C00F0C"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>

      <ClipPath id="clip0_42_1980">
        <Rect width={11} height={11} fill="white" />
      </ClipPath>
    </Svg>
  );
};

export default LogoutIcon;
