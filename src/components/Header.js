import React from 'react';
import { Header } from 'react-native-elements';
import { deviceHeight } from '../style';
import { Platform, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class AppHeader extends React.PureComponent{

    render(){
        return (
            <Header 
                containerStyle={[{
                    alignItems: 'center',
                    ...Platform.select({
                        ios: {
                            height: deviceHeight === 896 || deviceHeight === 812 ? 80 : 80
                        },
                        android: {
                            paddingTop: StatusBar.currentHeight
                        }
                    })
                },this.props.containerStyle]}
                backgroundColor={this.props.backgroundColor || 'transparent'}
                centerComponent={<Text style={this.props.titleStyle}>{this.props.title}</Text>}
                rightComponent={this.props.drawerOpened && this.props.leftIcon}
                leftComponent={this.props.leftIcon ||
                    <TouchableOpacity
                        hitSlop={{
                            top:20,
                            bottom: 20,
                            left:20,
                            right:20
                        }}
                        onPress={this.props.handleBack}
                        style={{
                            marginLeft: 10
                        }}
                    >
                        <Ionicons 
                            name={'ios-arrow-round-back'}
                            color={this.props.leftIconColor}
                            size={40}
                        />
                    </TouchableOpacity>
                }
            />
        )
    }
}