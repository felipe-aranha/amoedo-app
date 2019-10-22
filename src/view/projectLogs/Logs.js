import React from 'react';
import Professional from '../Professional';
import I18n from '../../i18n';
import { Actions } from 'react-native-router-flux';
import { getProjectLogs } from '../../utils';
import { View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { secondaryColor } from '../../style';
import { MainContext } from '../../reducer';

export default class Logs extends Professional{

    static contextType = MainContext;

    title = I18n.t('section.logs');
    icon = require('../../../assets/images/icons/log-add-x2.png');
    showFloatingButton = true;
    floatingButtonTitle = I18n.t('floatButton.newLog');
    logs = getProjectLogs();

    constructor(props,context){
        super(props, context);
        this.state = {
            activeLog: props.log || 0,
            items:  [],
            refreshList: 0,
        }
    }

    onFloatButtonPress(){
        Actions.push('projectLog', { type: this.state.activeLog });
    }

    getLogTitle(i=-1){
        i = i > -1 ? i : this.state.activeLog;
        return I18n.t(`project.logs.${this.logs[i]}`);
    }

    renderEmptyList(){
        image = require('../../../assets/images/icons/x-x2.png');
        title = I18n.t('empty.log.title', { type: this.getLogTitle().toLowerCase() });
        subtitle = '';
        return super.renderEmptyList(image,title,subtitle);
    }

    renderSearch(){
        return(
            <>
            {super.renderSearch()}
            <View style={{marginHorizontal:40, marginTop: 20}}>
                <ButtonGroup 
                    onPress={activeLog => { this.setState({ activeLog }) }}
                    selectedIndex={this.state.activeLog}
                    buttons={Object.keys(this.logs).map( i => this.getLogTitle(i) )}
                    containerStyle={{
                        borderRadius: 10
                    }}
                    selectedButtonStyle={{
                        backgroundColor: secondaryColor
                    }}
                    selectedTextStyle={{
                        color: '#fff',
                        fontSize: 12,
                        fontFamily: 'system-medium'
                    }}
                    textStyle={{
                        color: secondaryColor,
                        fontSize: 12,
                        fontFamily: 'system-medium'
                    }}
                />
            </View>
            </>
        );
    }

}