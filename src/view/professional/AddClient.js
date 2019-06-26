import React from 'react';
import Clients from './Clients'
import I18n from '../../i18n';

export default class addClient extends Clients{

    icon = require('../../../assets/images/icons/user-search-x2.png');
    title = I18n.t('section.addClient');
    floatingButtonTitle = I18n.t('floatButton.clients');

}