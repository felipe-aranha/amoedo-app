import { HttpClient } from './HttpClient';

export class CheckoutService extends HttpClient {

    basePath = 'rest/V1/';

    async getCart(){
        // await this.deleteAsync(`${this.basePath}carts/mine`);
        return this.postAsync(`${this.basePath}carts/mine`);
    }

    async getCartItems(){
        return this.getAsync(`${this.basePath}carts/mine/items`);
    }

    async deleteCartItem(item){
        return this.deleteAsync(`${this.basePath}carts/mine/items/${item}`);
    }

    async addToCart(items,quoteId){
        return new Promise((resolve) => {
            items.forEach(async (item,i) => {
                const data = {
                    cartItem: {
                        ...item,
                        quote_id: quoteId
                    }
                }
                console.log(item);
                // await this.deleteAsync(`${this.basePath}carts/mine/items/item`);
                const response = await this.postAsync(`${this.basePath}carts/mine/items`, data);
                console.log(response);
                if(i == items.length - 1)
                    resolve(true);
            })
        });
    }

}