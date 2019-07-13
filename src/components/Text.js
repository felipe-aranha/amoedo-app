import React from 'react';
import { Text as _Text } from 'react-native-elements';

export default class Text extends React.PureComponent{
    render(){
        const props = this.props;
        return <_Text {...props} style={[{
            color: 'rgb(77,77,77)',
            fontFamily: props.weight ? `system-${props.weight}` : 'system',
            fontSize: props.size ? props.size : undefined
            },props.style
        ]}>{props.children}</_Text>
    }
}