import React from 'react';
import Professional from '../Professional';
import I18n from '../../i18n';
import { MainContext } from '../../reducer';
import { ListItem, Divider, Button } from 'react-native-elements';
import { tertiaryColor, secondaryColor, chatStyle } from '../../style';
import { View } from 'react-native';

export default class ChatView extends Professional {

    static contextType = MainContext;
    title = I18n.t('section.chat');

    constructor(props,context){
        super(props,context);
        this.state = {
            loading: !this.isProfessional(),
            items: this.isProfessional() ? context.user.clients : []
        }
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
                        />
                    )}
                />
                <Divider />
            </View>
        )
    }

}