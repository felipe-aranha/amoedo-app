import React from 'react';
import { ListItem } from 'react-native-elements';
import { View } from 'react-native';
import { AppIcon, Text } from '.';

export class AppListItem extends React.PureComponent{
    render(){ 
        const {icon1, icon2, subtitle1, subtitle2, chevronColor, hideChevron, title } = this.props;
        return <ListItem
            {...this.props}
            title={title.replace(/(\r\n|\n|\r)/gm,"")}
            titleProps={{
                style: {
                    fontFamily: 'system-bold',
                    fontSize: 14,
                    color: 'rgb(77,77,77)' 
                },
                numberOfLines: 1
            }}
            chevron={hideChevron ? undefined : {
                color: chevronColor,
                type: 'entypo',
                name: 'chevron-right',
                size: 20
            }}
            containerStyle={{
                marginTop: 5,
                paddingHorizontal: 20
            }}
            subtitle={
                <View>
                    <View style={{
                        flexDirection: 'row', 
                        marginTop: 2,
                        alignItems: 'center'
                    }}>
                        <AppIcon medium name={icon1} />
                        <Text
                            numberOfLines={1}
                            style={{
                                fontFamily: 'system-medium',
                                color: 'rgb(77,77,77)',
                                fontSize: 12
                            }}
                        >{` ${subtitle1 || ''}`}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row', 
                        marginTop: 2,
                        alignItems: 'center'
                    }}>
                        <AppIcon medium name={icon2} />
                        <Text
                            style={{
                                fontFamily: 'system-medium',
                                color: 'rgb(77,77,77)',
                                fontSize: 12
                            }}
                            numberOfLines={1}
                        >{` ${subtitle2 || ''}`}</Text>
                    </View>
                </View>
            }
        />
    }
}