import React from 'react';

import { Routes } from './src/routes';
import { AppLoading, Font , Asset } from 'expo';

export default class App extends React.Component {

	constructor(props,state){
		super(props,state);
		this.state = {
			isReady: false
		}
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
		p2 = this.cacheImages([require('./assets/images/account/account-bg-x2.jpg')])
		return Promise.all([p1,p2]);
	}

	_finish(){
		this.setState({
			isReady: true
		})
	}

	_error(){

	}

	render() {
		return this.state.isReady ? 
				<Routes />
			:
				<AppLoading 
					startAsync={this._init.bind(this)}
					onFinish={this._finish.bind(this)}
					onError={this._error.bind(this)}
				/>
	}
}