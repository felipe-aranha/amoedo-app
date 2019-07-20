import React from 'react';
import { MainContext } from '../../reducer';
import { MainView } from '../MainView';
import I18n from '../../i18n';
import { accountStyle, secondaryColor, catalogStyle } from '../../style';
import { CatalogService } from '../../service/CatalogService';
import { Header } from '../../components';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import Products from './Products';

export default class Catalog extends MainView{

    static contextType = MainContext;

    barStyle = 'light-content';

    constructor(props,context){
        super(props,context);
        this.catalogService = new CatalogService()
        this.state = {
            loading: false,
            categoryTree: [2],
            categories: context.app.categories,
            cart: this.props.cart || []
        }
    }

    componentDidMount(){
        this.loadCategories();
    }

    handleCartChange(cart){
        this.setState({cart})
    }

    handleBack(){
        const { categoryTree } = this.state;
        if(categoryTree.length == 1)
            this.props.onBack(cart);
        else {
            const cats = categoryTree.slice(0);
            cats.pop();
            this.setState({
                categoryTree: cats
            })
        }
    }

    async loadCategories(){
        const { categories, loading} = this.state;
        if(loading) return;
        this.setState({
            loading: true
        }, async () => {
            if(categories.length == 0){
                _categories = [];
                result = await this.catalogService.getCategories();
                if(result.items){
                    const items = result.items.filter(item => item.is_active)
                    items.forEach(item => {
                        _categories[item.id] = item;
                    })
                    this.context.app.categories = _categories;
                    this.setState({
                        categories: _categories,
                        loading: false
                    })
                }
            } else {
                this.setState({
                    loading: false
                })
            }
        })
        
    }

    getCurrentCategoryId(){
        const { categoryTree } = this.state; 
        return categoryTree[categoryTree.length -1];
    }

    getCurrentCategory(){
        const { categories } = this.state; 
        const currentCategory = this.getCurrentCategoryId();
        return categories[currentCategory];
    }

    getCurrentTitle(){
        const category = this.getCurrentCategory();
        return category.name;
    }

    getCurrentData(){
        const { categories } = this.state; 
        const currentCategory = this.getCurrentCategoryId();
        const filtered = categories.filter(cat => cat.parent_id == currentCategory);
        return filtered;
    }

    keyStractor(item,key){
        return key.toString();
    }

    renderItem({item}){
        const hasChildren = item.children != '';      
        return <ListItem 
            title={item.name}
            titleStyle={catalogStyle.categoryListTitle}
            titleProps={{
                numberOfLines: 1
            }}
            bottomDivider
            chevron={{
                color: 'rgb(202,2,7)'
            }}
            containerStyle={catalogStyle.listContainer}
            onPress={() => {
                let categoryTree = this.state.categoryTree.slice(0);
                categoryTree.push(item.id);
                this.setState({
                    categoryTree
                })
            }}
        />
    }

    renderCenter(){
        const category = this.getCurrentCategory() || {};
        return(
            <View style={{flex:1}}>
                <Header 
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    title={this.getCurrentCategoryId() != 2 ? this.getCurrentTitle().toUpperCase() : I18n.t('section.products')}
                    handleBack={this.handleBack.bind(this)}
                    leftIconColor={'rgb(226,0,6)'}
                    titleStyle={accountStyle.registerHeaderText}
                    backgroundColor={'rgb(103,4,28)'}
                />
                <View style={{flex:1}}>
                    {category.children != '' ? 
                        <FlatList
                            style={catalogStyle.list}
                            onRefresh={this.loadCategories.bind(this)}
                            data={this.getCurrentData()}
                            renderItem={this.renderItem.bind(this)}
                            keyStractor={this.keyStractor}
                            refreshing={this.state.loading}
                        /> :
                        <Products 
                            category={category}
                            cart={this.state.cart}
                            onCartChange={this.handleCartChange.bind(this)}
                            onBack={this.handleBack.bind(this)}
                        />
                    }
                    
                </View>
            </View>
        )
    }
}