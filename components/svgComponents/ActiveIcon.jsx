import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ActiveIcon(props) {
  return (
    <Svg
      width={10}
      height={9}
      viewBox="0 0 10 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M5.016 9a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" fill="#3CD856" />
    </Svg>
  );
}

export default ActiveIcon;
