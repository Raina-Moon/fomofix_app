import ConfettiCannon from "react-native-confetti-cannon";

const Confetti = () => (
  <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut autoStart />
);

export default Confetti;
