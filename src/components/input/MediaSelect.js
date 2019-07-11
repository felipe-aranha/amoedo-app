import React from 'react';
import ActionSheet from "react-native-actionsheet";
import { TouchableOpacity } from 'react-native';
import { UploadMedia } from '../../utils/UploadMedia';

const TAKE = 'take picture';
const CHOOSE = 'choose from ';
const CANCEL = 'cancelar';

export class MediaSelect extends React.PureComponent{

    constructor(props,state){
        super(props,state);
        this.actionSheet = React.createRef();
        this.options = [CANCEL,TAKE,CHOOSE];
    }

    async handleTakePicture(){
        const result = await UploadMedia.takePhotoAsync();
        if(result && this.props.onMediaSelected)
            this.props.onMediaSelected(result);
    }

    async handleChooseFromLibrary(){
        const result = await UploadMedia.getFileAsync();
        if(result && this.props.onMediaSelected)
            this.props.onMediaSelected(result);
    }

    handleOptionSelect(i){
        const option = this.options[i];
        switch(option){
            case TAKE:
                this.handleTakePicture();
                break;
            default:
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
            <TouchableOpacity onPress={this.handlePress.bind(this)}>
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