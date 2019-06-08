import React from 'react';
import { MainView } from '../../MainView';
import { RegisterContext } from './Register';
import { PersonalData } from './PersonalData';
import I18n from '../../../i18n';

export class Documents extends PersonalData {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
    }
    
    title = I18n.t('account.register.documentsTitle');
    titleHighlight = null;

    submitText = I18n.t('account.register.register');
    submitStyle = {
        backgroundColor: 'rgb(243,164,51)'
    }

    renderForm(){
        return(
            <>
            </>
        )
    }
}