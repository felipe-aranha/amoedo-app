import React from 'react';
import Professional from '../Professional';
import I18n from '../../i18n';
import { Actions } from 'react-native-router-flux';

export default class Projects extends Professional{

    constructor(props,context){
        super(props,context);
        this.state = {
            items: []
        }
    }

    title = I18n.t('section.projects');
    icon = require('../../../assets/images/icons/project-add-x2.png');
    showFloatingButton = true;
    floatingButtonTitle = I18n.t('floatButton.newProject');

    componentDidMount(){}

    onFloatButtonPress(){
        Actions.push('_addProject');
    }

    renderEmptyList(){
        image = require('../../../assets/images/icons/x-x2.png');
        title = I18n.t('empty.projects.title');
        subtitle = I18n.t('empty.projects.subtitle');
        return super.renderEmptyList(image,title,subtitle);
    }
}