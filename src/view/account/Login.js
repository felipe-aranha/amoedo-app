import React from 'react';
import { AccountBase } from './AccountBase';
import { ImageBackground, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class Login extends AccountBase{
    imageBackground = require('../../../assets/images/account/login-bg-x2.png');

    renderContent(){
        return(
            <View style={{flex:1}}>
                <ImageBackground
                    source={require('../../../assets/images/account/login-navbar-x2.png')}
                    resizeMode={'stretch'}
                    style={{
                        width: '100%',
                        height: 200
                    }}
                >
                    <View style={{flex:1}}>
                        <View style={{
                            marginTop: 35,
                            marginLeft: 20
                        }}>
                            <Ionicons 
                                name={'ios-arrow-round-back'}
                                color={'#fff'}
                                size={40}
                            />
                        </View>
                        <View style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            top: -30
                        }}>
                            <Image 
                                source={require('../../../assets/images/brand-logo-x2.png')}
                                style={{
                                    width: 150
                                }}
                                resizeMode={'contain'}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}