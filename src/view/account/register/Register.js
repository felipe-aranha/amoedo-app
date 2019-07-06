import React from 'react';
import { MainView } from '../../MainView';
import { Header, Text, Select, AppIcon, KeyboardSpacer } from '../../../components';
import { View, StatusBar, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { secondaryColor, accountStyle } from '../../../style';
import { PersonalData } from './PersonalData';
import { Documents } from './Documents';
import { ProfessionalData } from './ProfessionalData';
import { CustomerService } from '../../../service';
import { Address, Customer, CustomerRegister } from '../../../model/magento/';
import * as Utils from '../../../utils';
import { DocumentModel, User } from '../../../model/firebase';
import { UserService } from '../../../service/firebase/UserService';
import { Actions } from 'react-native-router-flux';
import I18n from '../../../i18n';
import { MainContext } from '../../../reducer';

const initialState = {
    activeSection: 'personal-data',
    professionalData: {},
    documents: {},
    personalData: {},
    userRegistered: false,
    loading: false
}

export const RegisterContext = React.createContext(initialState);

export default class Register extends MainView{

    static contextType = MainContext;

    barStyle = 'light-content';

    constructor(props,context){
        super(props,context);
        this.scrollRef = React.createRef();
        this.profile = this.props.profile || {
            code: "Arquiteto Profissional",
            id: 9,
            name: "Arquiteto",
            tax_class_id: 3,
            tax_class_name: "Retail Customer",
          };
        this.sections = [{name:'personal-data'}];
        if(!this.isStudent())
            this.sections.push({name:'professional-data'})
        this.sections.push({name:'upload-files'})
        this.state = initialState;
        this.customerService = new CustomerService();
    }

    isStudent(){
        return ~this.profile.code.toLowerCase().indexOf('estudante')
    }

    async changeSection(section){
        if(this.state.activeSection != section.name){
             await this.setState({
                activeSection: section.name
            },() => {
                this.scrollToTop(false);
            });
        } else this.scrollToTop();
        
    }

    scrollToTop(animated=false){
        this.scrollRef.current.scrollTo({
            x: 0,
            y: 0,
            animated
        });
    }

    goToProfessionalData(){
        this.changeSection({name: 'professional-data'});
    }

    goToPersonalData(){
        this.changeSection({name: 'personal-data'});
    }

    goToDocuments(){
        this.changeSection({name: 'upload-files'});
    }


    handlePersonalDataContinue(){
        this.isStudent() ?
            this.goToDocuments() :
            this.goToProfessionalData();
    }

    _handlePersonalDataContinue(state){
        this.setState({
            personalData: state
        });
        if(!this.state.userRegistered){
            
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

    updatePersonalDataState(personalData){
        this.setState({
            personalData
        })
    }

    updateProfessionalDataState(professionalData){
        this.setState({
            professionalData
        })
    }

    updateDocumentsState(documents){
        this.setState({
            documents
        })
    }

    handleProfessionalDataContinue(){
        this.goToDocuments()
    }

    user = null;
    docs = [];
    customer = null;
    isRegistered = false;
    avatar = '';

    fillAddress(){
        const { personalData, professionalData } = this.state;
        if(personalData.zipCode == '') return undefined;
        let address = new Address(personalData.address, personalData.number, personalData.complement, personalData.neighborhood);
        return {
            ...address,
            city: personalData.city,
            company: professionalData.companyName,
            fax: personalData.phone,
            firstname,
            lastname,
            postcode: personalData.zipCode,
            telephone: personalData.cell || personalData.phone,
        }
    }

    handleDocumentsContinue(){
        const { personalData, professionalData, documents, loading } = this.state;
        if(loading) return;
        this.openModalLoading();
        if(this.context.user.magento.id){
            this.updateUser();
            return;
        }
        const { firstname, lastname } = Utils.parseName(personalData.name);
        let address = this.fillAddress();
        let customer = new Customer(address, personalData.cell || personalData.phone);
        customer = {
            ...customer,
            dob: Utils.parseDate(personalData.dob),
            taxvat: personalData.cpf,
            firstname,
            lastname,
            group_id: this.profile.id,
            email: personalData.email
        }
        let customerRegister = new CustomerRegister(customer, personalData.password);
        this.customer = customerRegister;
        if(this.isRegistered && this.user != null){
            this.firebaseRegister();
            return;
        }
        this.customerService.register(customerRegister.customer,customerRegister.password).then(response => {
            if(response.message){
                Alert.alert(I18n.t('common.error'),response.message);
                this.closeModalLoading();
                this.setState({
                    loading: false
                })
            } else {
                this.firebaseRegister(response.id);
            }
        }).catch(e => {
            this.closeModalLoading();
            Alert.alert(I18n.t('common.error'),I18n.t('account.errorMessage.registerError'));
            this.setState({
                loading: false
            })
        })
    }

    updateUser(){
        const { magento } = this.context.user;
        if(this.isRegistered)
            this.firebaseRegister(magento.id);
        else {
            const { personalData, professionalData, documents, loading } = this.state;
            const customer = {
                dob: Utils.parseDate(personalData.dob),
                group_id: this.profile.id,
                id: magento.id
            }
            if(magento.addresses.length == 0){
                const address = this.fillAddress();
                if(address)
                    customer.addresses = [address];
            }
            this.customerService.updateCustomer(customer).then(response => {
                console.log(response);
            })
        }
    }



    firebaseRegister(customerId=null){
        const { personalData, professionalData, documents } = this.state;
        this.avatar = personalData.avatar;
        this.docs = documents.documents.map(document => {
            let d = new DocumentModel(document.name, documents[document.state]);
            return Object.assign({},d);
        });
        if(this.user == null){
            this.user = new User();
            this.user = {
                ...user,
                cau: personalData.cau,
                cellphone: personalData.cell,
                cnpj: professionalData.cnpj,
                email: personalData.email,
                id: customerId,
                instagram: personalData.instagram,
                monthlyProjects: professionalData.monthlyProjects,
                rg: personalData.rg,
                telephone: personalData.phone,
                type: this.profile.id
            }
        }
        this.isRegistered = true;
        this.context.message('Fazendo uploads dos arquivos. Aguarde!',0);
        UserService.insertOrUpdateProfessionalAsync(this.user,this.docs,this.avatar).then(result => {
            this.context.message('Entrando...',0);
            this.login(this.customer.customer.email,this.customer.password);
        }).catch(e => {
            console.log("catch",e);
            this.context.message(I18n.t('account.errorMessage.registerError'));
            this.closeModalLoading();
            this.setState({
                loading: false
            })
        })
    }

    renderSteps(){
        switch(this.state.activeSection){
            case 'professional-data':
                return <ProfessionalData 
                            onStateChange={this.updateProfessionalDataState.bind(this)} 
                            profile={this.profile}
                            initialState={this.state.professionalData} 
                            onContinue={this.handleProfessionalDataContinue.bind(this)}  
                        />
            case 'upload-files':
                return <Documents 
                            onStateChange={this.updateDocumentsState.bind(this)} 
                            initialState={this.state.documents} 
                            profile={this.profile}
                            onContinue={this.handleDocumentsContinue.bind(this)} 
                        />
            default: 
                return <PersonalData 
                            onStateChange={this.updatePersonalDataState.bind(this)} 
                            initialState={this.state.personalData} 
                            profile={this.profile}
                            onContinue={this.handlePersonalDataContinue.bind(this)} 
                        />
        }
    }

    handleBack(){
        switch(this.state.activeSection){
            case 'upload-files':
                !this.isStudent() ? this.goToProfessionalData() : this.goToPersonalData();
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
                    titleStyle={accountStyle.registerHeaderText}
                    backgroundColor={secondaryColor}
                />
                <View
                    style={accountStyle.registerContentArea}
                >
                    {this.sections.map((section,key) =>{
                        const isActive = this.state.activeSection == section.name;
                        return(
                            <TouchableOpacity 
                                key={key}
                                // onPress={this.changeSection.bind(this,section)}
                                style={[accountStyle.sectionHeaderArea, isActive ? accountStyle.sectionHeaderAreaActive : {}]}
                            >
                                <AppIcon 
                                    key={key}
                                    name={section.name}
                                    style={[accountStyle.sectionHeaderIcon, isActive ? {} : accountStyle.sectionHeaderIconInactive]}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={{flex:1}}>
                    <ScrollView ref={this.scrollRef}>
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