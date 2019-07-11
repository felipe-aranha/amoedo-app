import React from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, View, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { default as Text } from './Text';
import I18n from '../i18n';
import { Ionicons } from '@expo/vector-icons';
import { secondaryColor, deviceWidth, deviceHeight } from '../style';

export default class Select extends React.PureComponent{

    constructor(props,state){
        super(props,state);
        console.log(props.initial);
        this.state = {
            selected: props.initial ? props.initial.label : null,
            modalOpened: false
        }
    }

    toggleModal(){
        this.setState({
            modalOpened: !this.state.modalOpened
        })
    }

    handleOptionSelect(option){
        this.setState({
            selected: option.label
        })
        if(this.props.onOptionSelected)
            this.props.onOptionSelected(option)
        this.toggleModal();
        
    }

    renderOptions(){
        const { options } = this.props;
        return(
            <View style={{
                paddingHorizontal: 30,
                backgroundColor: '#fff',
                maxHeight: deviceHeight/1.5
            }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                {options.map((option,i) => {
                    return (
                        <TouchableOpacity
                            onPress={this.handleOptionSelect.bind(this,option)}
                            key={i}
                            style={{
                                paddingVertical: 20,
                                width: '100%',
                                justifyContent: 'center',
                                borderTopWidth: i == 0 ? 0 : 0.5,
                                borderTopColor: 'rgb(77,77,77)'
                            }}
                        >
                            <Text weight={'medium'} style={{
                                fontSize: 14,
                                color: 'rgb(77,77,77)'
                            }}>{option.label}</Text>
                        </TouchableOpacity>
                    )
                })}
                </ScrollView>
            </View>
        )
    }

    renderModal(){
        return(
                <Modal 
                    transparent={true} 
                    onRequestClose={this.toggleModal.bind(this)}
                    visible={this.state.modalOpened}
                    animationType={'slide'}
                >
                    <TouchableWithoutFeedback onPress={this.toggleModal.bind(this)}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-end'
                        }}>
                            <TouchableWithoutFeedback>
                                <View>
                                    <View style={{
                                        width: deviceWidth,
                                        height: 50,
                                        backgroundColor: secondaryColor,
                                        alignItems: 'flex-end',
                                        justifyContent: 'center'
                                    }}>
                                        <TouchableOpacity onPress={this.toggleModal.bind(this)}>
                                            <Text weight='semibold' style={{
                                                fontSize: 14,
                                                color: '#fff',
                                                marginRight: 20
                                            }}>{I18n.t('common.cancel')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {this.renderOptions()}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            
        )
    }

    render(){
        const { selected } = this.state;
        const { options, loading, arrowColor,fullWidth } = this.props;
        if(loading)
            return <ActivityIndicator color={secondaryColor} />
        return(
            <>
            <TouchableOpacity 
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginVertical: 10
                }}
                onPress={this.toggleModal.bind(this)}
            >
                {this.props.children ? 
                    this.props.children : (
                    <>
                        <Text weight='semibold'style={{
                            minWidth: fullWidth ? '95%' : 120,
                            fontSize: 14,
                            color: secondaryColor
                        }}>{selected == null ? I18n.t('common.select') : selected}</Text>
                        <Ionicons name='ios-arrow-down' style={{
                            color: arrowColor || 'rgb(74,74,74)',
                            fontSize: 20,
                            top: 4,
                            position: 'relative'
                        }} />
                    </>
                )}
            </TouchableOpacity>
            {this.renderModal()}
            </>
        )
    }
}