import React from 'react';
import { Image } from 'react-native';
import Professional from "../Professional";
import I18n from '../../i18n';
import { primaryColor, deviceWidth } from '../../style';
import { Input } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { MainContext } from '../../reducer';

export default class Clients extends Professional{

    static contextType = MainContext;

    barStyle = 'dark-content';
    barColor=primaryColor;
    titleStyle = {
        color: 'rgb(57,57,57)'
    }
    title = I18n.t('section.client');
    showFloatingButton = true;
    floatingButtonTitle = 'Novo Cliente';
    floatButtonTextStyle = {
        textAlign: 'center',
        fontFamily: 'system-semibold',
        fontSize: 12,
        marginTop: 5,
        color: '#fff'
    }

    icon = (
        <Image 
            source={require('../../../assets/images/icons/user-add-x2.png')}
            style={{
                height:22,
                width:22
            }}
            resizeMode={'contain'}
        />
    )

    componentDidMount(){
        console.log(Actions.currentScene);
    }

    renderContent(){
        return(
            <>
                {this.renderSearch()}
                
            </>
        )
    }

}