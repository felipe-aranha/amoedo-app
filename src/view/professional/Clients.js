import React from 'react';
import { Image, View } from 'react-native';
import Professional from "../Professional";
import I18n from '../../i18n';
import { primaryColor, deviceWidth, mainStyle } from '../../style';
import { Input } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { MainContext } from '../../reducer';
import { Text } from '../../components';

export default class Clients extends Professional{

    static contextType = MainContext;

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
    }

    renderEmptyList(){
        return (
            <>
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
            </>
        )
    }

    renderContent(){
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