import React from 'react';
import { MainView } from './MainView';
import { MainContext } from '../reducer';
import { View, TouchableOpacity, ScrollView, Alert, Platform, Modal, StyleSheet } from 'react-native';
import { Header, MediaSelect, Text, Input } from '../components';
import { AntDesign } from '@expo/vector-icons';
import I18n from '../i18n';
import { secondaryColor, tertiaryColor, accountStyle, mainStyle, projectStyle } from '../style';
import { Avatar, ListItem, Divider, Button } from 'react-native-elements';
import { UserService } from '../service/firebase/UserService';
import { TextInputMask } from 'react-native-masked-text';
import { CustomerService } from '../service';
import { AppStorage } from '../storage';

export default class EditProfile extends MainView{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        const { firebase } = context.user;
        this.customerService = new CustomerService(context.user.token)
        this.state = {
            avatar: firebase.avatar || null,
            modal: false,
            section: null,
            telephone: firebase.cellphone,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            loading: false,
            cpError: '',
            npError: '',
            coError: ''
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
        this.setState({
            section: 'telephone'
        },() => {
            this.toggleModal();
        })
    }

    handlePasswordChange(){
        this.setState({
            section: 'password'
        },() => {
            this.toggleModal();
        })
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

    toggleModal(){
        const { user } = this.context;
        this.setState({
            modal: !this.state.modal,
            telephone: user.firebase.cellphone,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            loading: false
        })
    }

    renderTelephoneChange(){
        return (
            <View style={accountStyle.formRow}>
                <_MaskInput 
                    value={this.state.telephone}
                    onChangeText={this.handleTelephoneChange.bind(this)}
                />
            </View>
        )
    }

    handleTelephoneChange(telephone){
        this.setState({ telephone })
    }

    handleCurrentPasswordChange(currentPassword){
        this.setState({currentPassword, cpError: ''})
    }
    handleNewPasswordChange(newPassword){
        this.setState({newPassword, npError: ''})
    }
    handleConfirmPasswordChange(confirmPassword){
        this.setState({confirmPassword, coError: ''})
    }

    renderPasswordChange(){
        return (
            <View>
                <View style={accountStyle.formRow}>
                    <Password 
                        placeholder={I18n.t('editProfile.currentPassword')}
                        onChangeText={this.handleCurrentPasswordChange.bind(this)}
                        errorMessage={this.state.cpError}
                    />
                </View>
                <View style={accountStyle.formRow}>
                    <Password 
                        placeholder={I18n.t('editProfile.newPassword')}
                        onChangeText={this.handleNewPasswordChange.bind(this)}
                        errorMessage={this.state.npError}
                    />
                </View>
                <View style={accountStyle.formRow}>
                    <Password 
                        placeholder={I18n.t('editProfile.confirmPassword')}
                        onChangeText={this.handleConfirmPasswordChange.bind(this)}
                        errorMessage={this.state.coError}
                    />
                </View>
            </View>
        )
    }

    handleChangeSubmit(){
        const { section, loading } = this.state; 
        if(loading) return;
        if(section == 'telephone')
            this.changeTelephone()
        else 
            this.changePassword()
    }

    changeTelephone(){
        const { telephone } = this.state;
        if(telephone == ''){
            this.context.message(I18n.t('editProfile.error.telephone'));
            return;
        } else {
            this.setState({
                loading: true
            },() => {
                this.context.user.firebase.cellphone = telephone;
                this.setState({
                    loading: false
                })
            })
        }
    }

    changePassword(){
        const { currentPassword, newPassword, confirmPassword } = this.state;
        if(currentPassword < 6){
            this.setState({
                cpError: I18n.t('editProfile.error.passwordLength')
            }) 
            return;
        } 
        if(newPassword < 6){
            this.setState({
                npError: I18n.t('editProfile.error.passwordLength')
            }) 
            return;
        } 
        if(newPassword != confirmPassword){
            this.setState({
                coError: I18n.t('editProfile.error.passwordConfirmation')
            }) 
            return;
        }
        this.setState({
            loading: true
        },() => {
            this.customerService.changePassword(currentPassword,newPassword).then(response => {
                if(response == true){
                    this.toggleModal();
                    this.context.message(I18n.t('editProfile.passwordSuccess'));
                    AppStorage.setPassword(newPassword);
                } else {
                    this.setState({
                        loading: false,
                        cpError: I18n.t('editProfile.error.wrongPassword')
                    })
                }
            }).catch(e => {
                console.log(e);
                this.setState({
                    loading: false
                })
            })
        })
    }

    renderModal(){
        const { section } = this.state;
        return(
            <Modal
                visible={this.state.modal}
                onRequestClose={() => {}}
                animationType={'slide'}
                transparent={false}
            >
                <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                    <Header 
                        containerStyle={Platform.OS == 'android' ? {
                            borderBottomWidth: 0,
                            paddingTop:20,
                            height: 60
                        } : undefined}
                        title={I18n.t(`editProfile.${section}`)}
                        handleBack={this.toggleModal.bind(this)}
                        leftIconColor={!this.isProfessional() ? tertiaryColor : secondaryColor}
                        titleStyle={[accountStyle.registerHeaderText,{color: 'rgb(57,57,57)'}]}
                        backgroundColor={'transparent'}
                    />
                    <View style={{flex:1,padding: 20}}>
                        {section == 'telephone' ?
                            this.renderTelephoneChange() :
                            this.renderPasswordChange()
                        }
                    </View>
                    <View style={{margintop: 20, marginBottom: 30, marginHorizontal: 20}}>
                        <Button 
                            title={I18n.t('editProfile.update')}
                            containerStyle={accountStyle.accountTypeButtonContainer}
                            buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton, {backgroundColor: !this.isProfessional() ? tertiaryColor : secondaryColor}]}
                            titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                            onPress={this.handleChangeSubmit.bind(this)}
                            loading={this.state.loading}
                        />
                    </View>
                </View>
            </Modal>
        )
    }

    renderCenter(){
        const { avatar, telephone } = this.state;
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
                            subtitle={telephone}
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
                {this.renderModal()}
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

class Password extends React.PureComponent {

    constructor(props,state){
        super(props,state);
        this.state = {
            showPassword: false
        }
    }

    togglePasswordField(){
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    render(){
        return(
            <Input 
                {...this.props}
                secureTextEntry={!this.state.showPassword}
                autoCapitalize={'none'}
                rightIcon={{
                    name: this.state.showPassword ? 'eye' : 'eye-slash',
                    type:'font-awesome',
                    color: 'rgb(77,77,77)',
                    size: 18,
                    onPress: this.togglePasswordField.bind(this)
                }}
            />
        )
    }

}

class _MaskInput extends React.PureComponent{

    render(){
        return(
            <View style={accountStyle.maskedInputArea}>
                <TextInputMask 
                    {...this.props}
                    autoCapitalize={'none'}
                    placeholderTextColor={'rgb(77,77,77)'}
                    containerStyle={{flex:1}}
                    labelStyle={accountStyle.inputLabel}
                    inputContainerStyle={accountStyle.inputContainter}
                    inputStyle={accountStyle.input}
                    errorStyle={accountStyle.inputError}
                    errorProps={{
                        numberOfLines: 1
                    }}
                    type={'cel-phone'}
                    options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) '
                    }}
                    keyboardType={'number-pad'}
                    placeholder={I18n.t('form.phone')}
                />
            </View>
        )
    }

}