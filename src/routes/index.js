import React from 'react';
import {
    Router, 
    Scene, 
    Drawer, 
    Modal,
    Tabs,
    Stack
} from 'react-native-router-flux';
import { View, StyleSheet } from 'react-native';
import { 
    Wizard,
    AccountType,
    Login,
    ProfileSelection,
    Register
} from '../view';
import Toast from 'react-native-easy-toast';

export class Routes extends React.Component{

    constructor(props,state){
        super(props,state);
        this._toast = React.createRef();
    }

    message(message, time = DURATION, callback){
		if(this._toast != null)
			this._toast.show(message,time, () => {
				if(callback) callback
			});
	}

    removeMessage(){
		this._toast.close(1);
	}

    render(){
        return(
            <View style={StyleSheet.absoluteFill}>
                <Router>
                    <Modal key='main'>
                        <Stack hideNavBar key='account'>
                            <Scene initial hideNavBar key='accountType' component={AccountType} />
                            <Scene hideNavBar key='login' component={Login} />
                            <Scene hideNavBar key='profileSelection' component={ProfileSelection} />
                            <Scene key='register' component={Register} />
                        </Stack>
                    </Modal>
                </Router>   
                <Toast position={'center'} ref={this.toast} />
            </View>         
        );
    }
}