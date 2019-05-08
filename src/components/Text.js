import React from 'react';
import { Text } from 'react-native-elements';

export default (props) => {
    return <Text {...props} style={[{fontFamily: props.type ? `system-${type}` : 'system'},props.style]}>{props.children}</Text>
}