import React from 'react';
import { View, Image } from 'react-native';
import { RegisterContext } from './Register';
import { PersonalData } from './PersonalData';
import I18n from '../../../i18n';
import { ListItem, Button } from 'react-native-elements';
import { secondaryColor, accountStyle } from '../../../style';
import { Text } from '../../../components';
import { UploadMedia } from '../../../utils';

export class Documents extends PersonalData {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);

        const documents = [
            { state: 'rgDocument', name: 'rg', required: false },
            { state: 'cpfDocument', name: 'cpf', required: false }
        ]

        if(!this.isStudent()){
            switch(this.props.profile.name.toLowerCase()){
                case 'arquiteto':
                    documents.push({state: 'cauDocument', name: 'cau', required: true});
                    break;
                case 'designer':
                    documents.push({state: 'abdDocument', name: 'abd', required: true});
                    break;
                case 'engenheiro':
                    documents.push({state: 'creaDocument', name: 'crea', required: true});
                    break;
                default:
                    documents.push({state: 'cnpjDocument', name: 'cnpj', required: true});
                    break;
            }
        }
        documents.push({state: 'proofDocument', name: 'proofOfAddress', required: false})
        this.state = { 
            ...super.getInitialState(),
            documents,
            modalOpened: false,
            documentSelected: null
        }
    }
    
    title = I18n.t('account.register.documentsTitle');
    titleHighlight = null;

    submitText = I18n.t('account.register.register');
    submitStyle = {
        backgroundColor: 'rgb(103,4,28)'
    }

    isFormValid(){
        valid = true;
        this.state.documents.forEach(document => {
            if (!this.notEmpty(document.state) && document.required){
                valid = false;
            }
        })
        return valid;
    }

    handleItemPress(document){
        this.setState({
            documentSelected: document,
            hideSubmit: true
        })
    }

    processMedia(media){
        if(media)
            this.state[this.state.documentSelected.state] = media.uri
        this.setState({
            documentSelected: null,
            hideSubmit: false
        })
    }

    async handleTakePhoto(){
        const result = await UploadMedia.takePhotoAsync();
        if(result){
            this.processMedia(result);
        }
    }

    async handleGetImage(){
        const result = await UploadMedia.getFileAsync();
        if(result){
            this.processMedia(result);
        }
    }

    renderDocumentUpload(){
        const { documentSelected } = this.state;
        const title = I18n.t(`account.document.${documentSelected.name}.title`);
        return(
            <View style={{marginHorizontal: 10}}>
                <Text weight={'bold'}>{title}</Text>
                <Text style={{marginVertical: 15, fontSize:13}}>{I18n.t('account.document.tutorial', {document: title})}</Text>
                <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 20}}>
                    <Image 
                        source={require('../../../../assets/images/account/document-icon.png')}
                        style={{
                            width: 120,
                            height: 120
                        }}
                    />
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Button
                        title={I18n.t('common.takePhoto')}
                        containerStyle={accountStyle.accountTypeButtonContainer}
                        buttonStyle={[accountStyle.accountTypeButton,accountStyle.accountTakePhotoButton]}
                        titleStyle={accountStyle.accountTypeButtonTitle}
                        onPress={this.handleTakePhoto.bind(this)}
                    />
                    <Button 
                        title={I18n.t('common.loadFromPhone')}
                        type={'outline'}
                        containerStyle={accountStyle.accountTypeButtonContainer}
                        buttonStyle={[accountStyle.accountTypeButton,accountStyle.accountLoadMediafromPhoneButton]}
                        titleStyle={[accountStyle.accountTypeButtonTitle,accountStyle.accountLoadMediafromPhoneButtonText]}
                        onPress={this.handleGetImage.bind(this)}
                    />
                </View>
            </View>
        )
    }

    renderDocumentsForm(){
        return this.state.documents.map( document => {
            return (
                <ListItem 
                    key={document.name}
                    title={I18n.t(`document.${document.name}`)}
                    titleStyle={{
                        color: 'rgb(77,77,77)',
                        textTransform: 'uppercase',
                        fontFamily: 'system-medium',
                        fontSize: 14,
                    }}
                    chevron={{
                        color: secondaryColor
                    }}
                    onPress={this.handleItemPress.bind(this, document)}
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
                {this.state.documentSelected != null ? this.renderDocumentUpload() : this.renderDocumentsForm()}
            </>
        )
    }
}