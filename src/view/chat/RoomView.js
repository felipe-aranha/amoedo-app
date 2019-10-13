import React from 'react';
import { MainView } from '../MainView';
import { View, TouchableOpacity, Keyboard, Platform } from 'react-native';
import I18n from '../../i18n';
import { MainContext } from '../../reducer';
import AccountStyle from '../../style/AccountStyle';
import { Header, Avatar } from 'react-native-elements';
import { secondaryColor, tertiaryColor, chatStyle } from '../../style';
import { Ionicons } from '@expo/vector-icons';
import { Text, KeyboardSpacer } from '../../components';
import { GiftedChat, Bubble, Composer, Send, InputToolbar } from 'react-native-gifted-chat';
import * as Localization from 'expo-localization';
import { ChatService } from '../../service/firebase/ChatService';
import _ from 'lodash';

export default class RoomView extends MainView{

    static contextType = MainContext;

    barStyle = 'light-content';

    constructor(props,context){
        super(props,context);
        this.state = {
            messages: [],
            initializing: true,
            db: '',
            keyboard: false
        }
        this.listener = null;
    }

    componentDidMount(){
        this.getDbRoom();
        Keyboard.addListener('keyboardDidShow',this.showKeyboard.bind(this));
        Keyboard.addListener('keyboardDidHide',this.hideKeyboard.bind(this));
    }

    showKeyboard(){
        this.setState({
            keyboard: true
        })
    }

    hideKeyboard(){
        this.setState({
            keyboard: false
        })
    }

    componentWillUnmount(){
        Keyboard.removeListener('keyboardDidShow',this.showKeyboard.bind(this));
        Keyboard.removeListener('keyboardDidHide',this.hideKeyboard.bind(this));
        if(this.listener != null)
            this.listener();
    }

    async getDbRoom(){
        const { roommate } = this.props;
        const { user } = this.context;
        const myId = this.isProfessional() ? user.magento.id : user.magento.email;
        const hisId = this.isProfessional() ? roommate.email : roommate.id;
        let users = {};
        if(this.isProfessional()){
            users.professional = myId;
            users.client = hisId;
        } else {
            users.professional = hisId;
            users.client = myId;
        }
        const db = await ChatService.getRoom(users);
        this.listener = db.onSnapshot( snapshot => {
            const data = snapshot.data();
            if(!_.isEqual(data.messages,this.state.messages)){
                this.setState({
                    messages: data.messages.reverse()
                })
            }
        })
        this.setState({
            initializing: false,
            db: db.id
        })
    }

    isProfessional(){
        return this.context.user.isProfessional;
    }

    renderSearch(){
        return <></>
    }

    handleSendMessage(messages){
        if(this.state.initializing) return;
        messages.forEach(message => {
            message.pending = true
        })
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        messages.forEach( message => {
            ChatService.sendMessage(this.state.db,message);
        })
        
    }

    renderBackIcon(){
        return(
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}>
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
                    <Ionicons 
                        name={'ios-arrow-round-back'}
                        color={tertiaryColor}
                        size={40}
                    />
                </TouchableOpacity>
                {this.renderTitle()}
            </View>
        )
    }

    renderTitle(){
        const { roommate } = this.props;
        return(
            <View style={chatStyle.roomTitle}>
                <Avatar 
                    rounded
                    source={{ uri: roommate.avatar != '' ? roommate.avatar : null }}
                    // avatarStyle={{ width: 40, height: 40, borderRadius: 20 }}
                    containerStyle={{ marginHorizontal: 20 }}
                />
                <Text color={'#fff'} weight={'medium'} size={14} >{roommate.name}</Text>
            </View>
        )
    }

    renderBubble(props){
        return(
            <Bubble 
                {...props}
                textStyle={{
                    right: chatStyle.rightText,
                    left: chatStyle.leftText
                }}
                wrapperStyle={{
                    left: chatStyle.leftBubble,
                    right: chatStyle.rightBubble
                }}
            />
        )
    }

    renderSend(props){
        return(
            <Send
                {...props}
                containerStyle={chatStyle.sendArea}
                alwaysShowSend
            >
                <Text color={tertiaryColor} weight={'bold'} size={14} >{I18n.t('chat.send')}</Text>
            </Send>
        )
    }

    renderComposer(props){
        return(
            <Composer 
                {...props}
                placeholder={I18n.t('chat.placeholder')}
                textInputStyle={[chatStyle.leftText,{ margin: 20, borderRadius: 5, overflow: 'hidden' }]}
                
            />
        )
    }

    renderInputToolbar(props){
        return(
            <InputToolbar 
                {...props}
                containerStyle={{
                    marginHorizontal: 20,
                    marginVertical: Platform.OS == 'ios' && this.state.keyboard ? 0 : 20,
                    borderTopWidth: 0,
                }}
            />
        )
    }

    renderIOSSpacer(){
        if(Platform.OS != 'ios')
            return <></>
        return(
            <View 
                style={{
                    height: this.state.keyboard ? 20 : 0
                }}
            />
        )
    }

    renderCenter(){
        const { user } = this.context;
        const _id = this.isProfessional() ? user.magento.id : user.magento.email;
        return(
            <View style={{
                flex:1
            }}>
                <Header 
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    handleBack={this.handleBack.bind(this)}
                    backgroundColor={secondaryColor}
                    leftComponent={this.renderBackIcon()}
                />
                <GiftedChat 
                    showUserAvatar
                    messages={this.state.messages}
                    onSend={this.handleSendMessage.bind(this)}
                    locale={Localization.locale}
                    renderBubble={this.renderBubble.bind(this)}
                    user={{
                        _id,
                        avatar: user.firebase.avatar,
                        name: `${user.magento.firstname} ${user.magento.lastname}`
                    }}
                    renderSend={this.renderSend}
                    renderComposer={this.renderComposer}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    listViewProps={{
                        style: { marginBottom: 30 }
                    }}
                />
                <KeyboardSpacer platform={'android'} />
            </View>
        )
    }

}