import React from 'react';
import { MainView } from '../../MainView';
import { Header, Text, Select, AppIcon, KeyboardSpacer } from '../../../components';
import { View, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { secondaryColor } from '../../../style';
import { PersonalData } from './PersonalData';
import { Documents } from './Documents';
import { ProfessionalData } from './ProfessionalData';
import { CustomerService } from '../../../service';

const initialState = {
    activeSection: 'personal-data',
    personalData: undefined,
    userRegistered: false
}

export const RegisterContext = React.createContext(initialState);

export default class Register extends MainView{

    barStyle = 'light-content';

    constructor(props,context){
        super(props,context);
        console.log(this.props.profile);
        this.profile = this.props.profile || {
            code: "Arquiteto Profissional",
            id: 9,
            name: "Arquiteto",
            tax_class_id: 3,
            tax_class_name: "Retail Customer",
          };
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
        this.customerService = new CustomerService();
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

    handlePersonalDataContinue(state){
        this.setState({
            personalData: state
        });
        if(!this.state.userRegistered){
            fullName = state.name.split(" ");
            firstname = fullName[0];
            fullName.shift();
            lastname = fullName.length > 0 ? fullName.join(" ") : "";
            data = {
                customer: {
                    email: state.email,
                    firstname,
                    lastname,
                    taxvat: state.cpf,
                    group_id: this.profile.id
                },
                password: state.password
            } 
            this.customerService.register(data.customer,data.password).then(response => {
                if(response.id){
                    this.setState({
                        userRegistered: true
                    })
                }
            }).catch(e => {
                
            })
        }
        this.goToProfessionalData();
    }

    renderSteps(){
        switch(this.state.activeSection){
            case 'professional-data':
                return <ProfessionalData />
            case 'upload-files':
                return <Documents />
            default: 
                return <PersonalData initialState={this.state.personalData} onContinue={this.handlePersonalDataContinue.bind(this)} />
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
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}
                >
                    {this.sections.map((section,key) =>{
                        const isActive = this.state.activeSection == section.name;
                        return(
                            <TouchableOpacity 
                                key={key}
                                onPress={this.changeSection.bind(this,section)}
                                style={{
                                    backgroundColor: isActive ? 'rgb(242,242,242)' : 'rgb(50,0,14)',
                                    marginHorizontal: 2,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4
                                }}
                            >
                                <AppIcon 
                                    key={key}
                                    name={section.name}
                                    style={{
                                        tintColor: isActive ? undefined : '#fff',
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