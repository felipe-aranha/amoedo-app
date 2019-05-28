import React from 'react';
import { MainView } from '../MainView';
import {
    ImageBackground,
} from 'react-native';
import { accountStyle } from '../../style';

export class AccountBase extends MainView{

    barStyle = 'light-content';

    constructor(props,context){
        super(props,context);
    }

    renderContent(){}

    imageBackground = require('../../../assets/images/account/account-bg-x2.jpg');

    renderCenter(){
        return(

                <ImageBackground
                    source={this.imageBackground}
                    style={accountStyle.mainBackground}
                    resizeMode={'cover'}
                >
                    {this.renderContent()}
                </ImageBackground>
        )
    }
}