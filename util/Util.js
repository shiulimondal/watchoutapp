import AsyncStorage from "@react-native-async-storage/async-storage";
import * as mime from "react-native-mime-types";

export const getFileData = (obj) => {
    let uri = obj.uri || "";

    let arr = uri.split("/");
    let fileName = arr[arr.length - 1];

    return {
        uri: uri,
        name: fileName,
        type: mime.lookup(fileName),
    };
};

export const readData = async (key) => {
    try {
        let rawData = await AsyncStorage.getItem(key);
        return rawData !== null ? JSON.parse(rawData) : null;
    } catch (e) {
        throw new Error("failed to retrieve data from storage");
    }
};

/**
 * Stores data in async storage
 * @param {string} key
 * @param {*} value
 */
// export const writeData = async (key, value) => {
//   try {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//   } catch (e) {
//     throw new Error("failed to write data in storage");
//   }
// };

export const writeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        // console.log(`📝 Saving to AsyncStorage — key: ${key}, value:`, jsonValue);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error("❌ Error writing to AsyncStorage:", e);
        throw new Error("failed to write data in storage");
    }
};

export const clearUserData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        throw new Error("failed to remove data from device");
    }
};

export const debounceSearch = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const msToTime = (duration) => {
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${hours} Hour${hours !== 1 ? "s" : ""} ${minutes} Minute${minutes !== 1 ? "s" : ""
        }`;
};

export const getPlaybackPosition = async (videoId) => {
    try {
        const position = await AsyncStorage.getItem(
            `@playback_position_${videoId}`
        );
        return position ? parseFloat(position) : 0;
    } catch (e) {
        console.error("Failed to fetch playback position:", e);
        return 0;
    }
};

export const setPlaybackPosition = async (videoId, position) => {
    try {
        await AsyncStorage.setItem(
            `@playback_position_${videoId}`,
            position.toString()
        );
    } catch (e) {
        console.error("Failed to save playback position:", e);
    }
};
