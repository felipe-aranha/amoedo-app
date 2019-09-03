import React from 'react';
import { MainView } from './MainView';
import { MainContext } from '../reducer';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Header, MediaSelect, Text } from '../components';
import { AntDesign } from '@expo/vector-icons';
import I18n from '../i18n';
import { secondaryColor, tertiaryColor, accountStyle } from '../style';
import { Avatar, ListItem, Divider } from 'react-native-elements';
import { UserService } from '../service/firebase/UserService';

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
        },async () => {
            await UserService.updateAvatar(this.context.user.firebase, this.state.avatar, this.isProfessional());
            this.context.user.firebase.avatar = this.state.avatar;
            this.closeModalLoading();
        })
    }

    handlePhoneChange(){

    }

    handlePasswordChange(){

    }

    handleDeleteAccount(){
        Alert.alert(
            I18n.t('editProfile.deleteAccount'),
            I18n.t('editProfile.deleteAccountText'),
            [
                { text: I18n.t('editProfile.no'), style: 'cancel' },
                { text: I18n.t('editProfile.yes'), onPress: this.logout.bind(this) }
            ]
        )
    }

    renderCenter(){
        const { avatar } = this.state;
        const { user } = this.context;
        const { magento, firebase } = user;
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
                            alignItems: 'center',
                            marginBottom: 30
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
                                    textAlign: 'center',
                                    marginTop: 10
                                }}
                            >
                                {I18n.t('editProfile.changeProfilePicture')}
                            </Text>
                        </MediaSelect>
                    </View>
                    <View 
                        style={{
                            backgroundColor: '#fff',
                            paddingHorizontal: 20
                        }}
                    >
                        <_ListItem 
                            title={(
                                <Text style={accountStyle.editProfileTitle}>
                                    {I18n.t('editProfile.personal')}
                                    <Text style={[accountStyle.editProfileTitle, { color: this.isProfessional() ? secondaryColor : tertiaryColor}]}>
                                        {I18n.t('editProfile.data')}
                                    </Text>
                                </Text>
                            )}
                            subtitle={`${magento.firstname} ${magento.lastname}`}
                        />
                        <_Divider />
                        <_ListItem 
                            title={I18n.t('editProfile.email')}
                            subtitle={magento.email}
                        />
                        <_Divider />
                        <_ListItem 
                            title={I18n.t('editProfile.telephone')}
                            subtitle={firebase.cellphone}
                            chevron={{
                                color: this.isProfessional() ? secondaryColor : tertiaryColor,
                                type: 'entypo',
                                name: 'chevron-right',
                                size: 20
                            }}
                            onPress={this.handlePhoneChange.bind(this)}
                        />
                        <_Divider />
                        <_ListItem 
                            title={I18n.t('editProfile.password')}
                            chevron={{
                                color: this.isProfessional() ? secondaryColor : tertiaryColor,
                                type: 'entypo',
                                name: 'chevron-right',
                                size: 20
                            }}
                            onPress={this.handlePasswordChange.bind(this)}
                        />
                    </View>
                    <View 
                        style={{
                            backgroundColor: 'rgb(238,238,238)',
                            height: 10,
                            width: '100%'
                        }}
                    />
                    <View 
                        style={{
                            backgroundColor: '#fff',
                            paddingHorizontal: 20
                        }}
                    >
                        
                        <_ListItem 
                            title={I18n.t('editProfile.deleteAccount')}
                            chevron={{
                                color: this.isProfessional() ? secondaryColor : tertiaryColor,
                                type: 'entypo',
                                name: 'chevron-right',
                                size: 20
                            }}
                            onPress={this.handleDeleteAccount.bind(this)}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }

}

class _ListItem extends React.PureComponent{
    render(){
        return(
            <ListItem 
                {...this.props}
                titleStyle={accountStyle.editProfileTitle}
                subtitleStyle={accountStyle.editProfileSubtitle}
            />
        )
    }
}

class _Divider extends React.Component{

    shouldComponentUpdate(){
        return false;
    }

    render(){
        return <Divider 
        style={{
            marginHorizontal: 20
        }}
        />
    }
}