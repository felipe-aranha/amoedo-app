import React from 'react';
import { accountStyle, mainStyle } from '../../style';
import { Input as InputElement } from 'react-native-elements';
import { View, TextInput } from 'react-native';
import { Text } from '../';
import { TextInputMask } from 'react-native-masked-text';

export class Input extends React.PureComponent{
    render(){
        return <InputElement 
            {...this.props}
            containerStyle={{flex:1}}
            labelStyle={mainStyle.inputLabel}
            inputContainerStyle={mainStyle.inputContainter}
            inputStyle={mainStyle.input}
            errorStyle={mainStyle.inputError}
            errorProps={{
                numberOfLines: 1
            }}
        />
    }
}

export class MaskedInput extends React.PureComponent{
    render(){
        const props = this.props;
        return(
            <View style={accountStyle.maskedInputArea}>
                <Text style={mainStyle.inputLabel}>{props.label}</Text>
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

export class TextArea extends React.PureComponent{
    render(){
        const props = this.props;
        return(
            <View style={mainStyle.textAreaContainer}>
                <Text style={mainStyle.inputLabel}>{props.label}</Text>
                <TextInput
                    multiline
                    style={mainStyle.textArea}
                    {...props}
                    ref={props.inputRef}
                />
                <Text style={[accountStyle.inputError,accountStyle.maskedInputError]}>{props.errorMessage}</Text>

            </View>
        )
    }
}

export class DatePicker extends React.PureComponent{
    render(){
        const props = this.props;
        return(
            <View style={accountStyle.maskedInputArea}>
                <Text style={mainStyle.inputLabel}>{props.label}</Text>
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