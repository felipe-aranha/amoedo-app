import React from 'react';
import Professional from '../Professional';
import I18n from '../../i18n';
import { MainContext } from '../../reducer';
import { ListItem, Divider, Button } from 'react-native-elements';
import { tertiaryColor, secondaryColor, chatStyle } from '../../style';
import { View } from 'react-native';
import { UserService } from '../../service/firebase/UserService';
import { CustomerService } from '../../service';
import { Actions } from 'react-native-router-flux';

export default class ChatView extends Professional {

    static contextType = MainContext;
    title = I18n.t('section.chat');

    constructor(props,context){
        super(props,context);
        this.state = {
            loading: !this.isProfessional(),
            items: this.isProfessional() ? context.user.clients : []
        }
        this.customerService = new CustomerService();
    }

    componentDidMount(){
        if(!this.isProfessional())
            this.getProfessionals();
    }

    async getProfessionals(){
        if(this.context.user.myProfessionals){
            this.setState({
                items: this.context.user.myProfessionals
            })
            return;
        }            
        const myId = this.context.user.magento.email;
        const professionals = await UserService.getCustomerProfessionals(myId).then(async response => {
            let pp = [];
            return await Promise.all(response.map(async(p, i) => {
                    if(pp.includes(p.id)) return undefined;
                    pp.push(p.id);
                    const customer = await this.customerService.getCustomer(p.id)
                    return {
                        ...p,
                        name: `${customer.firstname} ${customer.lastname}`
                    }
                })
            )
        });
        const myProfessionals = []
        professionals.forEach(p => {
            if(p)   
                myProfessionals.push(p);
        });
        this.context.user.myProfessionals = myProfessionals;
        this.setState({
            items: myProfessionals
        })
    }

    goToRoom(item){
        Actions.push('chatRoom',{
            roommate: item,
        })
    }

    renderItem({item}){
        return(
            <View style={{marginHorizontal: 20}}>
                <ListItem 
                    title={item.name}
                    subtitle={item.email}
                    titleProps={{
                        numberOfLines: 1,
                        style: chatStyle.listItemTitle
                    }}
                    subtitleProps={{
                        numberOfLines: 1,
                        style: chatStyle.listItemSubtitle
                    }}
                    leftAvatar={{ source: { uri: item.avatar || null }}}
                    containerStyle={chatStyle.listItemArea}
                    rightElement={(
                        <Button 
                            buttonStyle={chatStyle.beginButtonArea}
                            title={I18n.t('chat.begin')}
                            titleStyle={chatStyle.beginButtonText}
                            onPress={this.goToRoom.bind(this,item)}
                        />
                    )}
                    onPress={this.goToRoom.bind(this,item)}
                />
                <Divider />
            </View>
        )
    }

}