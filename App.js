import React from 'react';

import { Routes } from './src/routes';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { Font } from 'expo-font';
import { CustomerService } from './src/service';
import { AppContext, MainContext } from './src/reducer';

export default class App extends React.Component {

	constructor(props,state){
		super(props,state);
		this.state = AppContext;
		console.disableYellowBox = true;
		this.customerService = new CustomerService();
	}

	cacheImages(images) {
        return images.map(image => {
          if (typeof image === 'string') {
            return Image.prefetch(image);
          } else {
            return Asset.fromModule(image).downloadAsync();
          }
        });
    }


	_init(){
		p1 = Font.loadAsync({
			'system-semibold': require('./assets/fonts/system-semibold.ttf'),
			'system': require('./assets/fonts/system-regular.ttf'),
			'system-medium': require('./assets/fonts/system-medium.ttf'),
			'system-bold': require('./assets/fonts/system-bold.ttf'),
		});
		p2 = this.cacheImages([
			require('./assets/images/account/account-bg-x2.jpg'),
			require('./assets/images/account/login-bg-x2.png'),
			require('./assets/images/account/login-navbar-x2.png'),
			require('./assets/images/brand-logo-x2.png'),
			require('./assets/images/icons/camera-x2.png'),
			require('./assets/images/icons/email-x2.png'),
			require('./assets/images/icons/password-x2.png'),
			require('./assets/images/icons/personal-data-x2.png'),
			require('./assets/images/icons/professional-data-x2.png'),
			require('./assets/images/icons/upload-files-x2.png'),
		]);

		p3 = this.customerService.getCustomerGroups().then(groups => {
			this.setState({
				app: {
					...this.state.app,
					groups
				}
			})
		})

		return Promise.all([p1,p2, p3]);
	}

	_finish(){
		setTimeout(() => {
			this.setState({
				isReady: true
			})
		},200)
	}

	_error(){

	}

	render() {
		return this.state.isReady ? 
			<MainContext.Provider value={this.state}>
				<Routes />
			</MainContext.Provider>
			:
				<AppLoading 
					startAsync={this._init.bind(this)}
					onFinish={this._finish.bind(this)}
					onError={this._error.bind(this)}
				/>
	}
}