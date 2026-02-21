import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CrossIcon(props) {
  return (
    <Svg
      width={17}
      height={17}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14.906 12.402a7.5 7.5 0 10-2.192 2.303M10.67 6.33L6.33 10.67m4.338 0L6.33 6.33"
        stroke="#A0A0A0"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CrossIcon;
