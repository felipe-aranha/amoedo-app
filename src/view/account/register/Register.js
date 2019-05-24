import React from 'react';
import { MainView } from '../../MainView';
import { Header, Text, Select, AppIcon, KeyboardSpacer } from '../../../components';
import { View, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { secondaryColor } from '../../../style';
import { PersonalData } from './PersonalData';
import { Documents } from './Documents';
import { ProfessionalData } from './ProfessionalData';

const initialState = {
    activeSection: 'personal-data'
}

export const RegisterContext = React.createContext(initialState);

export default class Register extends MainView{

    constructor(props,context){
        super(props,context);
        StatusBar.setBarStyle("light-content",true);
        this.profile = {
            id: 9,
            name: 'Arquiteto'
        }
        this.sections = [
            {
                name: 'personal-data',

            },
            {
                name: 'professional-data',
            },
            {
                name: 'upload-files'
            }
        ],
        this.state = initialState;
    }

    changeSection(section){
        if(this.state.activeSection != section.name){
            this.setState({
                activeSection: section.name
            })
        }
    }

    goToProfessionalData(){
        this.setState({
            activeSection: 'professional-data'
        })
    }

    goToPersonalData(){
        this.setState({
            activeSection: 'personal-data'
        })
    }

    goToDocuments(){
        this.setState({
            activeSection: 'upload-files'
        })
    }

    renderSteps(){
        switch(this.state.activeSection){
            case 'professional-data':
                return <ProfessionalData />
            case 'upload-files':
                return <Documents />
            default: 
                return <PersonalData onContinue={this.goToProfessionalData.bind(this)} />
        }
    }

    handleBack(){
        switch(this.state.activeSection){
            case 'upload-files':
                this.goToProfessionalData();
                break;
            case 'professional-data':
                this.goToPersonalData();
                break;
            default:
                super.handleBack();
                break;
        }
    }

    renderCenter(){
        return (
            <View style={{
                flex:1
            }}>
                <Header 
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    title={this.profile.name}
                    handleBack={this.handleBack.bind(this)}
                    leftIconColor={'rgb(242,242,242)'}
                    titleStyle={{
                        fontFamily: 'system-medium',
                        color: 'rgb(242,242,242)',
                        fontSize: 15,
                        textTransform: 'uppercase'
                    }}
                    backgroundColor={secondaryColor}
                />
                <View
                    style={{
                        backgroundColor: secondaryColor,
                        width: '100%',
                        paddingBottom: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}
                >
                    {this.sections.map((section,key) =>{
                        return(
                            <TouchableOpacity 
                                key={key}
                                onPress={this.changeSection.bind(this,section)}
                            >
                                <AppIcon 
                                    name={section.name}
                                    style={{
                                        tintColor: this.state.activeSection == section.name ? '#fff' : undefined,
                                        marginHorizontal: 20,
                                        width: 30,
                                        height: 30
                                    }}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={{flex:1}}>
                    <ScrollView>
                        <RegisterContext.Provider value={this.state}>
                            {this.renderSteps()}
                        </RegisterContext.Provider>
                    </ScrollView>
                </View>
                <KeyboardSpacer />
            </View>
        )
    }
}