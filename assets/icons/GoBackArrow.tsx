import Svg, { Path } from "react-native-svg";

const GoBackArrow = () => {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="#5A5A5A"
        stroke-width={2}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default GoBackArrow;
