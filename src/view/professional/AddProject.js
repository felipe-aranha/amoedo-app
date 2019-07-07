import React from 'react';
import { View, ScrollView } from 'react-native';
import Projects from './Projects';
import I18n from '../../i18n';
import { Actions } from 'react-native-router-flux';
import { MainView } from '../MainView';
import { accountStyle, secondaryColor, projectStyle } from '../../style';
import { Header, Select, Text } from '../../components';
import { getProjectTypes } from '../../utils';
import { MainContext } from '../../reducer';
import { Input, TextArea } from '../../components/input';

export default class AddProject extends MainView{

    barStyle = 'light-content';

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.projects = getProjectTypes();
        this.state = {
            projectType: null,
            room: null
        }
    }

    handleTypeSelect(projectType){
        this.setState({projectType})
    }

    renderForm(){
        return(
            <ScrollView style={projectStyle.formView}>
                <View style={accountStyle.formRow}>
                    <Input 
                        label={I18n.t('project.projectName')}
                    />
                </View>
                <View style={accountStyle.formRow}>
                    <TextArea 
                        label={I18n.t('project.summary')}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
            </ScrollView>
        )
    }

    renderCenter(){
        return(
            <View style={{flex:1}}>
                <Header 
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    title={ I18n.t('section.addProject')}
                    handleBack={this.handleBack.bind(this)}
                    leftIconColor={'rgb(226,0,6)'}
                    titleStyle={accountStyle.registerHeaderText}
                    backgroundColor={secondaryColor}
                />
                <View style={projectStyle.projectTypeArea}>
                    <Text weight={'bold'}>{I18n.t('project.projectType')}</Text>
                    <Select 
                        options={this.projects}
                        onOptionSelected={this.handleTypeSelect.bind(this)}
                        loading={this.state.loading}
                        arrowColor={'rgb(226,0,6)'}
                    />
                </View>
                {this.state.projectType != null &&
                    this.renderForm()
                }
            </View>
        )
    }
}