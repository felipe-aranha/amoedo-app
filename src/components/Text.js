import React from 'react';
import { Text as _Text } from 'react-native-elements';

export default class Text extends React.PureComponent{
    render(){
        const props = this.props;
        return <_Text {...props} style={[{fontFamily: props.weight ? `system-${props.weight}` : 'system'},props.style]}>{props.children}</_Text>
    }
}