import React from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import { CustomerService } from '../service';
import { Input as InputElement } from 'react-native-elements';
import * as Utils from '../utils';
import { AntDesign } from '@expo/vector-icons';
import { secondaryColor, accountStyle } from '../style';
import I18n from '../i18n';
import { Text, AppIcon } from '../components';

export default class Form extends React.PureComponent{

    constructor(props,context){
        super(props,context);
        this.state = this.getInitialState();
        this.customerService = new CustomerService();
    }

    getInitialState(){
        return this.props.initialState || {
            showPassword: false,
            showPasswordConfirmation: false,
            password: '',
            confirmPassword: '',
            cau: '',
            email: '',
            cpf: '',
            rg: '',
            name: '',
            dob: '',
            linkedin: '',
            phone: '',
            cell: '',
            zipCode: '',
            address: '',
            number: '',
            complement: '',
            city:'',
            state: '',
            neighborhood: '',
            emailErrorMessage: '',
            instagram: '',
            cnpj: '',
            companyName: '',
            monthlyProjects: '',
            cpfValid: null,
            emailValid: null
        }
    }

    handlePasswordChange(text){
        this.setState({
            password: text
        })
    }

    handleCnpjChange(text){
        this.setState({
            cnpj: text
        })
    }

    handleCompanyNameChange(text){
        this.setState({
            companyName: text
        })
    }

    handleMonthlyProjectsChange(text){
        this.setState({
            monthlyProjects: text
        })
    }

    handlePasswordConfirmationChange(text){
        this.setState({
            confirmPassword: text
        })
    }
    handleCauChange(text){
        this.setState({
            cau: text
        })
    }
    handleEmailChange(text){
        this.setState({
            email: text
        })
    } 
    handleCpfChange(text){
        this.setState({
            cpf: newText
        })
    }
    handleRgChange(text){
        this.setState({
            rg: text
        })
    }
    handleNameChange(text){
        this.setState({
            name: text
        })
    }
    handleDobChange(text){
        this.setState({
            dob: text
        })
    }
    handleLinkedinChange(text){
        this.setState({
            linkedin: text
        })
    }
    handleInstagramChange(text){
        this.setState({
            instagram: text
        })
    }
    handleNeighborhoodChange(text){
        this.setState({
            neighborhood: text
        })
    }
    handlePhoneChange(text){
        this.setState({
            phone: text
        })
    }
    handleCellChange(text){
        this.setState({
            cell: text
        })
    }
    handleZipCodeChange(text){
        this.setState({
            zipCode: text
        })
    }
    handleAddressChange(text){
        this.setState({
            address: text
        })
    }
    handleNumberChange(text){
        this.setState({
            number: text
        })
    }
    handleComplementChange(text){
        this.setState({
            complement: text
        })
    }
    handleCityChange(text){
        this.setState({
            city: text
        })
    }
    handleStateChange(text){
        this.setState({
            state: text
        })
    }

    togglePasswordField(){
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    toggleConfirmPasswordField(){
        this.setState({
            showPasswordConfirmation: !this.state.showPasswordConfirmation
        })
    }

    validateCpf(cpf){
        isValid = Utils.isCpfValid(cpf);
        this.setState({
            cpfValid: isValid
        })
    }

    keyboardNumber(){
        return 'number-pad';
    }

    async checkEmail(isNew=true){
        if(!Utils.isEmailValid(this.state.email)){
            this.setState({
                emailErrorMessage: I18n.t('account.errorMessage.invalidEmail'),
                emailValid: false,
            });
            return false;
        }
        this.setState({
            emailErrorMessage: '',
        });
        if(!isNew) return true;
        this.customerService.isEmailAvailable(this.state.email).then( result => {
            if(!result)
                this.setState({
                    emailErrorMessage: I18n.t('account.errorMessage.emailRegistered'),
                    emailValid: false
                }, () => { return false })
            else
                this.setState({
                    emailValid: true
                },() => { return true })

        }).catch( e => { return false })
        
    }

    fillAddress(){
        if(this.state.zipCode.length < 8){
            return;
        }
        fetch(`https://viacep.com.br/ws/${this.state.zipCode}/json/`).then( result => {
            return result.json();
        }).then(result => {
            if(result.error){
                return;
            }
            this.setState({
                address: result.logradouro || this.state.address,
                neighborhood: result.bairro || this.state.neighborhood,
                city: result.localidade || this.state.city,
                state: result.uf || this.state.state
            })
        }).catch(e => {
            console.log(e);
        })
    }

    // inputs

    renderAvatar(){
        return(
            <TouchableOpacity style={accountStyle.formAvatarArea}>
                <AppIcon style={accountStyle.formAvatarIcon} name='camera' />
                <AntDesign 
                    name={'pluscircle'}
                    size={25}
                    style={accountStyle.formAvatarBadge}
                />
            </TouchableOpacity>
        )
    }

    renderPassword(){
        return (
            <Input 
                onChangeText={this.handlePasswordChange.bind(this)}
                value={this.state.password}
                label={I18n.t('form.password')}
                secureTextEntry={!this.state.showPassword}
                rightIcon={{
                    name: this.state.showPassword ? 'eye' : 'eye-slash',
                    type:'font-awesome',
                    color: 'rgb(77,77,77)',
                    size: 18,
                    onPress: this.togglePasswordField.bind(this)
                }}
                errorMessage={this.state.password.length < 6 ? I18n.t('account.errorMessage.password') : ''}
            />
        )
    }

    renderPasswordConfirmation(){
        return(
            <Input 
                onChangeText={this.handlePasswordConfirmationChange.bind(this)}
                value={this.state.confirmPassword}
                label={I18n.t('form.confirmPassword')}
                secureTextEntry={!this.state.showPasswordConfirmation}
                rightIcon={{
                    name: this.state.showPasswordConfirmation ? 'eye' : 'eye-slash',
                    type:'font-awesome',
                    color: 'rgb(77,77,77)',
                    size: 18,
                    onPress: this.toggleConfirmPasswordField.bind(this)
                }}
                errorMessage={
                    this.state.password != this.state.confirmPassword && this.state.confirmPassword.length > 0 ? 
                        I18n.t('account.errorMessage.confirmPassword') : ''
                }
            />
        )
    }

    renderCau(){
        return(
            <Input 
                label={I18n.t('form.cau')}
                value={this.state.cau}
                onChangeText={this.handleCauChange.bind(this)}
            />
        )
    }

    renderCnpj(){
        return(
            <Input 
                label={I18n.t('form.cnpj')}
                value={this.state.cnpj}
                onChangeText={this.handleCnpjChange.bind(this)}
            />
        )
    }

    renderMonthlyProjects(){
        return(
            <Input 
                label={I18n.t('form.projects')}
                value={this.state.monthlyProjects}
                onChangeText={this.handleMonthlyProjectsChange.bind(this)}
            />
        )
    }

    renderCompanyName(){
        return(
            <Input 
                label={I18n.t('form.companyName')}
                value={this.state.companyName}
                onChangeText={this.handleCompanyNameChange.bind(this)}
            />
        )
    }

    renderEmail(){
        return(
            <Input 
                label={I18n.t('form.email')}
                value={this.state.email}
                onChangeText={this.handleEmailChange.bind(this)}
                onBlur={this.checkEmail.bind(this)}
                errorMessage={this.state.emailErrorMessage}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
            />
        )
    }

    renderCpf(){
        return(
            <Input 
                label={I18n.t('form.cpf')}
                value={this.state.cpf}
                onChangeText={this.handleCpfChange.bind(this)}
                onBlur={this.validateCpf.bind(this)}
                keyboardType={this.keyboardNumber()}
                errorMessage={this.state.cpfValid == false ? I18n.t('account.errorMessage.invalidCpf') : ''}
            />
        )
    }

    renderRg(){
        return(
            <Input 
                label={I18n.t('form.rg')}
                keyboardType={this.keyboardNumber()}
                value={this.state.rg}
                onChangeText={this.handleRgChange.bind(this)}
            />
        )
    }

    renderName(){
        return(
            <Input 
                label={I18n.t('form.name')}
                autoCapitalize={'words'}
                value={this.state.name}
                onChangeText={this.handleNameChange.bind(this)}
            />
        )
    }

    renderDOB(){
        return(
            <Input 
                label={I18n.t('form.birthDate')}
                value={this.state.dob}
                onChangeText={this.handleDobChange.bind(this)}
                keyboardType={this.keyboardNumber()}
            />
        )
    }

    renderLinkedin(){
        return(
            <Input 
                label={I18n.t('form.linkedin')}
                value={this.state.linkedin}
                onChangeText={this.handleLinkedinChange.bind(this)}
            />
        )
    }

    renderInstagram(){
        return(
            <Input 
                label={I18n.t('form.instagram')}
                value={this.state.instagram}
                onChangeText={this.handleInstagramChange.bind(this)}
            />
        )
    }

    renderPhone(){
        return(
            <Input 
                label={I18n.t('form.phone')}
                value={this.state.phone}
                onChangeText={this.handlePhoneChange.bind(this)}
                keyboardType={this.keyboardNumber()}
            />
        )
    }

    renderNeighborhood(){
        return(
            <Input  
                label={I18n.t('form.neighborhood')}
                value={this.state.neighborhood}
                onChangeText={this.handleNeighborhoodChange.bind(this)}
            />
        )
    }

    renderCellPhone(){
        return(
            <Input 
                label={I18n.t('form.cellphone')}
                value={this.state.cell}
                onChangeText={this.handleCellChange.bind(this)}
                keyboardType={this.keyboardNumber()}
            />
        )
    }

    renderCep(){
        return(
            <Input 
                label={I18n.t('form.zipCode')}
                value={this.state.zipCode}
                onChangeText={this.handleZipCodeChange.bind(this)}
                onBlur={this.fillAddress.bind(this)}
                keyboardType={this.keyboardNumber()}
            />
        )
    }

    renderAddress(){
        return(
            <Input 
                label={I18n.t('form.address')}
                value={this.state.address}
                onChangeText={this.handleAddressChange.bind(this)}
            />
        )
    }

    renderAddressNumber(){
        return(
            <Input 
                label={I18n.t('form.number')}
                value={this.state.number}
                onChangeText={this.handleNumberChange.bind(this)}
                keyboardType={this.keyboardNumber()}
            />
        )
    }

    renderAddressComplement(){
        return(
            <Input 
                label={I18n.t('form.complement')}
                value={this.state.complement}
                onChangeText={this.handleComplementChange.bind(this)}
            />
        )
    }

    renderCity(){
        return(
            <Input 
                label={I18n.t('form.city')}
                value={this.state.city}
                onChangeText={this.handleCityChange.bind(this)}
            />
        )
    }

    renderState(){
        return(
            <Input 
                label={I18n.t('form.state')}
                value={this.state.state}
                onChangeText={this.handleStateChange.bind(this)}
            />
        )
    }

    submitText = I18n.t('common.continue').toUpperCase();
    submitStyle = {}

    renderFormSubmit(){
        return(
            <TouchableOpacity
                    onPress={this.handleFormSubmit.bind(this)}
                    style={[accountStyle.formSubmit, this.submitStyle]}
                >
                <Text weight={'medium'} style={accountStyle.formSubmitText}>{this.submitText}</Text>
            </TouchableOpacity>
        )
    }

    render(){
        return(
            <></>
        )
    }

}

class Input extends React.PureComponent{
    render(){
        return <InputElement 
            {...this.props}
            containerStyle={{flex:1}}
            labelStyle={accountStyle.inputLabel}
            inputContainerStyle={accountStyle.inputContainter}
            inputStyle={accountStyle.input}
            errorStyle={accountStyle.inputError}
            errorProps={{
                numberOfLines: 1
            }}
        />
    }
}

