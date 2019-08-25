import React from 'react';
import ActionSheet from "react-native-actionsheet";
import { TouchableOpacity } from 'react-native';
import { UploadMedia } from '../../utils/UploadMedia';
import I18n from '../../i18n';

const TAKE = I18n.t('mediaSelect.take');
const CHOOSE = I18n.t('mediaSelect.choose');
const CANCEL = I18n.t('mediaSelect.cancel');

export class MediaSelect extends React.PureComponent{

    constructor(props,state){
        super(props,state);
        this.actionSheet = React.createRef();
        this.options = [CANCEL,TAKE,CHOOSE];
        this.allowsEditing = !this.props.denyEdit;
    }

    async handleTakePicture(){
        const result = await UploadMedia.takePhotoAsync(this.allowsEditing );
        if(result && this.props.onMediaSelected)
            this.props.onMediaSelected(result);
    }

    async handleChooseFromLibrary(){
        const result = await UploadMedia.getFileAsync(this.allowsEditing );
        if(result && this.props.onMediaSelected)
            this.props.onMediaSelected(result);
    }

    handleOptionSelect(i){
        const option = this.options[i];
        switch(option){
            case TAKE:
                this.handleTakePicture();
                break;
            case CHOOSE:
                this.handleChooseFromLibrary();
                break;
        }
    }

    handlePress(){
        if(this.actionSheet.current != null)
            this.actionSheet.current.show();
    }

    render(){
        return(
            <TouchableOpacity style={{justifyContent: 'center', alignItems:'center'}} onPress={this.handlePress.bind(this)}>
                {this.props.children}
                <ActionSheet 
                    ref={this.actionSheet}
                    options={this.options}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={0}
                    onPress={this.handleOptionSelect.bind(this)}
                />
            </TouchableOpacity>
        )
    }
}