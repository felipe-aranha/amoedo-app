import I18n from '../i18n';
import variables from '../../assets/variables';

export const baseURL = `${variables.magento.baseURL}/pub/media/catalog/product`;

export const getAttributeValue = (item,attribute) => {
    const attr = item.custom_attributes.find(attr => attr.attribute_code == attribute);
    return attr ? attr.value : undefined;
}

export const getProductImage = (item) => {
    const image = getAttributeValue(item,'image');
    return image ? `${baseURL}${image}` : null;
}

export const getProductPrices = (item) => {
    let prices = {
        regular: value2Currency(item.price),
        regularPrice: item.price,
        special: null,
        specialPrice: null
    }
    const specialPrice = getAttributeValue(item,'special_price');
    if(specialPrice){
        if(Number(specialPrice) < Number(item.price)){
            prices.special = value2Currency(specialPrice)
            prices.specialPrice = specialPrice
        }
    }
    return prices;
}

export const getQtyMultiplier = (item) => {
    const value = getAttributeValue(item,'revestimento_m2_caixa');
    if(!value)
        return {
            unity: '',
            x: 1
        }
    else 
        return {
            unity: 'm²',
            x: Number(value) > 0 ? Number(value) : 1
        }
}

export const value2Currency = (value) => {
    return `${I18n.t('catalog.currency')}${parseFloat(value).toFixed(2)}`;
}

export const getStock = (item) => {
    let stock = getAttributeValue(item,'quantity_and_stock_status');
    if(Array.isArray(stock) && stock[0]){
        return stock[1] || -1
    }
    return -1;
}