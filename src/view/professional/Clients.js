import React from 'react';
import { Image, View, FlatList } from 'react-native';
import Professional from "../Professional";
import I18n from '../../i18n';
import { primaryColor, deviceWidth, mainStyle } from '../../style';
import { Input, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { MainContext } from '../../reducer';
import { Text, ImageBase64, AppListItem } from '../../components';
import { UserService } from '../../service/firebase/UserService';

export default class Clients extends Professional{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.state = {
            items:  context.user.clients || []
        }   
    }

    barStyle = 'dark-content';
    barColor=primaryColor;
    titleStyle = {
        color: 'rgb(57,57,57)'
    }
    title = I18n.t('section.client');
    showFloatingButton = true;
    floatingButtonTitle = I18n.t('floatButton.newClient');
    floatButtonTextStyle = mainStyle.floatButtonTextStyle;

    icon = require('../../../assets/images/icons/user-add-x2.png');

    onFloatButtonPress(){
        Actions.push('_addClient');
    }

    componentDidMount(){
        UserService.getProfessionalDoc(this.context.user.magento.id.toString()).onSnapshot(doc => {
            const { clients } = doc.data();
            clients.forEach(client => {
                items = this.state.items || [];
                found = items.find(c => c.email == client.email);
                if(!found){
                    newClient = UserService.getClient(client.email);
                    currClients = items.slice(0);
                    currClients.push(newClient);
                    this.setState({
                        items: currClients
                    })
                    this.context.user.clients = currClients;
                }
            })
        })
    }

    renderEmptyList(){
        return (
            <View style={mainStyle.listArea}>
            <View
                style={mainStyle.emptyListArea}
            >
                <Image 
                    source={require('../../../assets/images/icons/empty-user-x2.png')}
                    style={mainStyle.emptyListImage}
                    resizeMode={'contain'}
                />
            </View>
            <View style={mainStyle.emptyListTextArea}>
                <Text style={mainStyle.emptyListTitle}>{I18n.t('empty.clients.title')}</Text>
                <Text style={mainStyle.emptyListSubtitle}>{I18n.t('empty.clients.subtitle')}</Text>
            </View>
            </View>
        )
    }

    renderItem({item}){
        leftIcon = item.avatar != null ? 
                    <ImageBase64 avatar style={{width:50,height:50}}  data={item.avatar} /> :
                    <Image style={{width:50,height:50}} source={require('../../../assets/images/icons/list-user-x2.png')} />
        return <AppListItem 
            leftIcon={leftIcon}
            title={item.name}
            chevronColor={'rgb(226,0,6)'}
            icon1={'calendar'}
            icon2={'check'}
            subtitle1={I18n.t('list.client.currentProjects',{qty:0})}
            subtitle2={I18n.t('list.client.doneProjects',{qty:0})}
        />
    }

    keyStractor(item,key){
        return key.toString();
    }

    renderContent(){
        return(
            <>
                {this.renderSearch()}
               
                    {this.state.items.length > 0 ? 
                     <View style={{flex:1}}>
                        <FlatList 
                            data={this.state.items}
                            renderItem={this.renderItem.bind(this)}
                            keyStractor={this.keyStractor}
                        />
                    </View> :
                    this.renderEmptyList()
                    }
                
            </>
        )
    }

    _renderContent(){
        return(
            <>
                {this.renderSearch()}
                <View style={mainStyle.listArea}>
                    {this.renderEmptyList()}
                </View>
            </>
        )
    }

}