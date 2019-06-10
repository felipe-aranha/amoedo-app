import { Dimensions, PixelRatio } from 'react-native';

import variables from '../utils';
const style = variables.style;
export default style;
export const primaryColor = style.primaryColor;
export const secondaryColor = style.secondaryColor;
export const tertiaryColor = style.tertiaryColor;
export const quaternaryColor = style.quaternaryColor;
export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
export const relativeHeight = (h) => {
    return PixelRatio.roundToNearestPixel(deviceHeight*(h/100));
};

export const relativeWidth = (w) => {
    return PixelRatio.roundToNearestPixel(deviceWidth*(w/100));
};