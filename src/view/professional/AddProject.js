import React from 'react';
import Projects from './Projects';
import I18n from '../../i18n';
import { Actions } from 'react-native-router-flux';

export default class AddProject extends Projects{

    floatingButtonTitle = I18n.t('floatButton.projects');
    title = I18n.t('section.addProject');

    onFloatButtonPress(){
        Actions.pop();
    }
}