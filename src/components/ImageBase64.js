import React from 'react';
import { Image } from 'react-native';

export class ImageBase64 extends React.PureComponent{
    render(){
        const props = this.props;
        return <Image 
            source={{uri: `data:image/gif;base64,${props.data}`}}
            {...props}
        />
    }
}