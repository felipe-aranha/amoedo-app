import React from 'react';
import { Image } from 'react-native';
import { Avatar } from 'react-native-elements';

export class ImageBase64 extends React.PureComponent{
    render(){
        const props = this.props;
        const _Component = props.avatar ? Avatar : Image;
        return <_Component 
            rounded
            source={{uri: `data:image/gif;base64,${props.data}`}}
            {...props}
        />
    }
}