import * as React from "react";
import Svg, { Path } from "react-native-svg";

function RefundIcon(props) {
    return (
        <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M12 2a10 10 0 00-9.5 6.67.75.75 0 001.42.47A8.5 8.5 0 1112 20.5a.75.75 0 000 1.5 10 10 0 100-20zm-1 5.75V5a.75.75 0 00-1.28-.53l-3.5 3.5a.75.75 0 000 1.06l3.5 3.5a.75.75 0 001.28-.53V9.25a5.25 5.25 0 015.25 5.25.75.75 0 001.5 0A6.75 6.75 0 0011 7.75z"
                fill="#38A4FF"
            />
        </Svg>
    );
}

export default RefundIcon;
