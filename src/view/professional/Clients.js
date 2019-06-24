import React from 'react';
import Professional from "../Professional";
import I18n from '../../i18n';
import { primaryColor } from '../../style';

export default class Clients extends Professional{

    barStyle = 'dark-content';
    barColor=primaryColor;
    titleStyle = {
        color: 'rgb(57,57,57)'
    }
    title = I18n.t('section.client')

    componentDidMount(){

    }

}