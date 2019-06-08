import React from 'react';
import { MainView } from '../../MainView';
import { RegisterContext } from './Register';
import { PersonalData } from './PersonalData';
import I18n from '../../../i18n';
import { ListItem } from 'react-native-elements';
import { secondaryColor } from '../../../style';

export class Documents extends PersonalData {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
        this.state = { 
            ...super.getInitialState(),
            documents: [
                { state: 'rgDocument', name: 'rg' },
                { state: 'cpfDocument', name: 'cpf' }
            ],
            modalOpened: false,
            documentSelected: null
        }
    }
    
    title = I18n.t('account.register.documentsTitle');
    titleHighlight = null;

    submitText = I18n.t('account.register.register');
    submitStyle = {
        backgroundColor: 'rgb(243,164,51)'
    }

    renderDocumentsForm(){
        return this.state.documents.map( document => {
            return (
                <ListItem 
                    key={document.name}
                    title={I18n.t(`form.${document.name}`)}
                    titleStyle={{
                        color: 'rgb(77,77,77)',
                        textTransform: 'uppercase',
                        fontFamily: 'system-medium',
                        fontSize: 14,
                    }}
                    chevron={{
                        color: secondaryColor
                    }}
                    chevronColor={secondaryColor}
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(163,163,163,0.5)',
                        paddingVertical: 20
                    }}
                    leftIcon={{
                        type: 'ionicon',
                        name: 'ios-checkmark',
                        color: this.state[document.state] != '' ? 'rgb(173,217,56)' : 'transparent'
                    }}
                />
            )
        })
    }

    renderForm(){
        return(
            <>
                {this.renderDocumentsForm()}
            </>
        )
    }
}