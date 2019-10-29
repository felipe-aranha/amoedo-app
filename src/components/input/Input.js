import React from 'react';
import { accountStyle, mainStyle } from '../../style';
import { Input as InputElement } from 'react-native-elements';
import { View, TextInput, Platform, DatePickerIOS, DatePickerAndroid, TimePickerAndroid, Keyboard } from 'react-native';
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
                    underlineColorAndroid={'transparent'}
                />
                <Text style={[accountStyle.inputError,accountStyle.maskedInputError]}>{props.errorMessage}</Text>

            </View>
        )
    }
}

export class DatePicker extends React.PureComponent{

    constructor(props, state){
        super(props, state);
        this.state = {
            date: ''
        }
    }

    async handleInputFocus(){
        const { value, withTime, maxDate, minDate } = this.props;
        Keyboard.dismiss();
        try {
            let dateTime = value && value != '' ? value.split(' ') : [];
            let date = dateTime[0] ? dateTime[0].split('/') : false;
            
            if(date && date.length < 3) 
                date = false;
            const {action, year, month, day} = await DatePickerAndroid.open({
              date: date ? new Date(date[2],date[1] - 1 ,date[0]) : new Date(),
              mode: 'spinner',
              maxDate,
              minDate
            });
            const _month = month + 1;
            if (action !== DatePickerAndroid.dismissedAction) {
                if(withTime){
                    let time = dateTime[1] ? dateTime[1].split(':') : [];
                    let h = !time[0] ?  new Date().getHours() : time[0] < 10 ? time[0][1] : time[0];
                    let m = !time[1] ?  new Date().getMinutes() : time[1] < 10 ? time[1][1] : time[1];
                    const timer = await TimePickerAndroid.open({
                        hour: parseInt(h),
                        minute: parseInt(m),
                        mode: 'spinner',
                        is24Hour: true
                    })
                    if(timer.action != TimePickerAndroid.dismissedAction){
                        const hour = timer.hour < 10 ? `0${timer.hour}` : timer.hour;
                        const minute = timer.minute < 10 ? `0${timer.minute}` : timer.minute;
                        this.props.onChangeText(`${day < 10 ? `0${day}` : day}/${_month < 10 ? `0${_month}` : _month}/${year} ${hour}:${minute}`)
                    }
                } else {
                    this.props.onChangeText(`${day < 10 ? `0${day}` : day}/${_month < 10 ? `0${_month}` : _month}/${year}`)
                }
                
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    renderInputIOS(){
        const props = this.props;
        return(
            <></>
        )
    }

    renderInputAndroid(){
        const props = this.props;
        return(
            <TextInputMask 
                style={accountStyle.maskedInputText}
                {...props}
                ref={props.inputRef}
                onFocus={this.handleInputFocus.bind(this)}
            />
        )
    }

    renderOther(){
        const props = this.props;
        return(
            <TextInputMask 
                style={accountStyle.maskedInputText}
                {...props}
                ref={props.inputRef}
            />
        )
    }

    render(){
        const props = this.props;
        return(
            <View style={accountStyle.maskedInputArea}>
                <Text numberOfLines={props.numberOfLines} style={mainStyle.inputLabel}>{props.label}</Text>
                {Platform.OS == 'ios' ? this.renderInputIOS() : Platform.OS == 'android' ? this.renderInputAndroid() : this.renderOther()}
                <Text style={[accountStyle.inputError,accountStyle.maskedInputError]}>{props.errorMessage}</Text>

            </View>
        )
    }
}

export class SizeInput extends React.PureComponent{
    render(){
        const props = this.props;
        return(
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}
            >
                <TextInput 
                    style={[accountStyle.maskedInputText,{
                        borderWidth: 1,
                        borderColor: 'rgb(98,98,98)',
                        borderRadius: 8,
                        minWidth: 60,
                        marginVertical: 10,
                        textAlign: 'center'
                    }]}                    
                    {...props}
                    ref={props.inputRef}
                    keyboardType={'decimal-pad'}
                />
                <Text>{' M'}</Text>
            </View>
        )
    }
}