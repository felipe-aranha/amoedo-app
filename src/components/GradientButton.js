import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import { LinearGradient } from 'expo';

export class GradientButton extends React.PureComponent{
    render(){
        const { vertical, colors, title, titleStyle, onPress, loading, width, height } = this.props;
        currHeight = height || 50;
        return(
            <TouchableOpacity onPress={onPress}>
                    <LinearGradient
                        start={vertical? undefined : { x: 0, y: 1 }}
                        end={vertical? undefined : { x: 1, y: 1 }}
                        colors={colors}
                        style={{
                            width: width || 200,
                            height: currHeight,
                            borderRadius: currHeight/2,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {loading ? 
                            <ActivityIndicator size={'small'} color={'#fff'} /> :
                            <Text style={titleStyle}>{title}</Text>
                        }
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}