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
import { UserService } from '../../service/firebase/UserService';
import { CustomerService } from '../../service/CustomerService';
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
            keyboard: false,
            roommate: props.roommate
        }
        this.listener = null;
        this.customerService = new CustomerService();
    }

    componentDidMount(){
        this.initializeRoom();
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

    async initializeRoom(){
        const db = await this.getDbRoom();
        this.listener = db.onSnapshot( snapshot => {
            const data = snapshot.data();
            if(!this.state.roommate){
                this.loadRoommate(data);
            }
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

    async loadRoommate(data){
        if(this.isProfessional()){
            const client = data.client;
            UserService.getClient(client).then( r => {
                const roommate = {
                    avatar: r.avatar,
                    name: r.name
                }
                this.setState({ roommate })
            });
        } else {
            const professional = data.professional;
            UserService.getProfessionalDoc(professional).get().then(async r => {
                const p = r.data();
                const customer = await this.customerService.getCustomer(professional);
                const roommate = {
                    name: `${customer.firstname} ${customer.lastname}`,
                    avatar: p.user.avatar
                }
                this.setState({ roommate })
            })
        }
    }

    async getDbRoom(){
        const { roommate, roomId } = this.props;
        if(roomId)
            return ChatService.getChatDB().doc(roomId)
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
        return await ChatService.getRoom(users);
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
                alignItems: 'center',
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
        const { roommate } = this.state;
        const avatar = roommate ? roommate.avatar : '';
        const name = roommate ? roommate.name : '';
        return(
            <View style={chatStyle.roomTitle}>
                <Avatar 
                    rounded
                    source={{ uri: avatar != '' ? avatar : null }}
                    // avatarStyle={{ width: 40, height: 40, borderRadius: 20 }}
                    containerStyle={{ marginHorizontal: 20 }}
                />
                <Text numberOfLines={1} color={'#fff'} weight={'medium'} size={14} >{name}</Text>
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
                    backgroundColor={secondaryColor}
                    leftComponent={this.renderBackIcon()}
                    centerContainerStyle={{flex:0}}
                    rightContainerStyle={{flex:0}}
                >
                    
                </Header>
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