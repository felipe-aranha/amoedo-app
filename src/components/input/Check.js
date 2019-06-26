import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '../Text';
import { Feather } from '@expo/vector-icons';

export class Check extends React.PureComponent{
    render(){
        return(
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 25,
                    marginRight: 20
                }}
            >
                <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {this.props.checked && (
                        <Feather size={16} name={'check'} color={'rgb(226,0,6)'} />
                    )}
                </View>
                <Text style={{
                        fontFamily: 'system-medium',
                        color: 'rgb(163,163,163)',
                        marginLeft: 5   
                }}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}