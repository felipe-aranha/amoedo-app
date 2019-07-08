import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

export class GradientButton extends React.PureComponent{

    renderCenter(){
        const { vertical, colors, title, titleStyle, loading, width, icon } = this.props;
        return(
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
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: vertical? 'column' : 'row'
                            }}>
                                {typeof(icon) !== 'undefined' &&
                                    icon
                                }
                                <Text style={titleStyle}>{title}</Text>
                            </View>
                        }
                </LinearGradient>
        )
    }

    render(){
        const { onPress, height } = this.props;
        currHeight = height || 50;
        if(onPress)
            return(
                <TouchableOpacity onPress={onPress}>
                        {this.renderCenter()}
                </TouchableOpacity>
            )
        else return this.renderCenter();
    }
}