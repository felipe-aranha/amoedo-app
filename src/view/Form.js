import React from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import { CustomerService } from '../service';
import { Input as InputElement } from 'react-native-elements';
import * as Utils from '../utils';
import { AntDesign } from '@expo/vector-icons';
import { secondaryColor, accountStyle } from '../style';
import I18n from '../i18n';
import { Text, AppIcon, ImageBase64 } from '../components';
import { TextInputMask } from 'react-native-masked-text';

export default class Form extends React.PureComponent{

    constructor(props,context){
        super(props,context);
        this.state = this.getInitialState();
        this.customerService = new CustomerService();
        this.dobRef = React.createRef();
    }

    getInitialState(){
        const initialState = Object.keys(this.props.initialState).length > 0 ? this.props.initialState : false;
        return initialState || {
            showPassword: false,
            showPasswordConfirmation: false,
            password: '',
            confirmPassword: '',
            cau: '',
            email: '',
            cpf: '',
            cpfDocument: '',
            rgDocument: '',
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
            emailValid: null,
            dobValid: null,
            hideSubmit: false,
            avatar: null,
            cauDocument: '',
            adbDocument: '',
            creaDocument: '',
            cnpjDocument: '',
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
            cpf: text
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

    validateCpf(e){
        const cpf = e.nativeEvent.text;
        cpfValid = Utils.isCpfValid(cpf);
        this.setState({
            cpfValid
        })
    }

    validateDOB(e){
        const dobValid = this.dobRef.current.isValid();
        this.setState({
            dobValid
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

    async handleAvatarPress(){
        const result = await Utils.UploadMedia.getFileAsync();
        this.setState({
            avatar: result ? result : null
        })
    }

    notEmpty(state,length=1){
        return this.state[state].trim().length >= length;
    }

    // inputs

    renderAvatar(s={}){
        return(
            <TouchableOpacity onPress={this.handleAvatarPress.bind(this)} style={accountStyle.formAvatarArea}>
                {this.state.avatar != null ?
                    <ImageBase64 avatar rounded data={this.state.avatar} style={{width:60,height:60}} resizeMode={'contain'} /> :
                    <AppIcon style={accountStyle.formAvatarIcon} name='camera' />
                }
                <AntDesign 
                    name={'pluscircle'}
                    size={25}
                    style={[accountStyle.formAvatarBadge,s]}
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
            <MaskedInput 
                label={I18n.t('form.cnpj')}
                value={this.state.cnpj}
                onChangeText={this.handleCnpjChange.bind(this)}
                type={'cnpj'}
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
                onEndEditing={this.checkEmail.bind(this)}
                errorMessage={this.state.emailErrorMessage}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
            />
        )
    }

    renderCpf(){
        return(
            <MaskedInput 
                value={this.state.cpf}
                onChangeText={this.handleCpfChange.bind(this)}
                type={'cpf'}
                label={I18n.t('form.cpf')}
                onEndEditing={this.validateCpf.bind(this)}
                maxLength={19}
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
            <MaskedInput 
                label={I18n.t('form.birthDate')}
                value={this.state.dob}
                onChangeText={this.handleDobChange.bind(this)}
                keyboardType={this.keyboardNumber()}
                onEndEditing={this.validateDOB.bind(this)}
                maxLength={10}
                type={'datetime'}
                options={{
                    format: 'DD/MM/YYYY'
                }}
                inputRef={this.dobRef}
                errorMessage={this.state.dobValid === false ? I18n.t('account.errorMessage.dob') : ''}
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
            <MaskedInput 
                label={I18n.t('form.phone')}
                value={this.state.phone}
                onChangeText={this.handlePhoneChange.bind(this)}
                keyboardType={this.keyboardNumber()}
                type={'cel-phone'}
                options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                }}
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
            <MaskedInput 
                label={I18n.t('form.cellphone')}
                value={this.state.cell}
                onChangeText={this.handleCellChange.bind(this)}
                keyboardType={this.keyboardNumber()}
                type={'cel-phone'}
                options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                }}
            />
        )
    }

    renderCep(){
        return(
            <Input 
                label={I18n.t('form.zipCode')}
                value={this.state.zipCode}
                onChangeText={this.handleZipCodeChange.bind(this)}
                onEndEditing={this.fillAddress.bind(this)}
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

    handleFormSubmit(){}

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


class MaskedInput extends React.PureComponent{
    render(){
        const props = this.props;
        return(
            <View style={accountStyle.maskedInputArea}>
                <Text style={accountStyle.maskedInputLabel}>{props.label}</Text>
                <TextInputMask 
                    style={accountStyle.maskedInputText}
                    {...props}
                    ref={props.inputRef}
                />
                <Text style={[accountStyle.inputError,accountStyle.maskedInputError]}>{props.errorMessage}</Text>

            </View>
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