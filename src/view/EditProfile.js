import React from 'react';
import { MainView } from './MainView';
import { MainContext } from '../reducer';
import { View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Header, MediaSelect, Text } from '../components';
import { AntDesign } from '@expo/vector-icons';
import I18n from '../i18n';
import { secondaryColor, tertiaryColor } from '../style';
import { Avatar } from 'react-native-elements';

export default class EditProfile extends MainView{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.state = {
            avatar: context.user.firebase.avatar || null
        }
    }

    isProfessional(){
        return this.context.user.isProfessional;
    }

    changeAvatar(media){
        if(media.cancelled) return;
        this.openModalLoading();
        this.setState({
            avatar: media.uri
        },() => {
            w
            this.closeModalLoading();
        })
    }

    renderCenter(){
        const { avatar } = this.state;
        return(
            <View style={{backgroundColor: 'rgb(238,238,238)', flex: 1}}>
                <Header
                    title={I18n.t('section.myProfile')}
                    titleStyle={{
                        fontFamily: 'system-bold',
                        fontSize: 16,
                        color: 'rgb(74,74,74)'
                    }}
                    leftIcon={
                        <TouchableOpacity
                            hitSlop={{
                                top:20,
                                bottom: 20,
                                left:20,
                                right:20
                            }}
                            onPress={this.handleBack.bind(this)}
                            style={{
                                marginLeft: 10
                            }}
                        >
                            <AntDesign 
                                name={'close'}
                                color={this.props.leftIconColor}
                                size={24}
                                color={this.isProfessional() ? secondaryColor : tertiaryColor}
                            />
                        </TouchableOpacity>
                    }
                />
                <ScrollView style={{paddingVertical: 20}}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <MediaSelect onMediaSelected={this.changeAvatar.bind(this)}>
                            {avatar != null && avatar != '' ?
                                <Avatar 
                                    rounded
                                    size={'large'}
                                    source={{uri: this.state.avatar}}
                                /> :
                                <Avatar 
                                    rounded
                                    size={'large'}
                                    source={require('../../assets/images/icons/personal-data-x2.png')}
                                    imageProps={{
                                        resizeMode: 'contain',
                                        tintColor: 'rgb(71,71,71)',
                                        style:{
                                            width: 30,
                                            height: 30,
                                            alignSelf: 'center',
                                        }
                                    }}
                                />
                            }
                            <Text 
                                weight={'medium'} 
                                size={14} 
                                color={'rgb(121,121,121)'} 
                                style={{
                                    textAlign: 'center'
                                }}
                            >
                                {I18n.t('editProfile.changeProfilePicture')}
                            </Text>
                        </MediaSelect>
                    </View>
                </ScrollView>
            </View>
        )
    }

}

{/* <Avatar 
                                    rounded
                                    size={'large'}
                                    source={require('../../assets/images/icons/personal-data-x2.png')}
                                    imageProps={{
                                        resizeMode: 'contain',
                                        tintColor: 'rgb(71,71,71)',
                                    }}
                                /> */}