import { HttpClient } from './HttpClient';

export class CatalogService extends HttpClient {

    basePath = 'rest/V1/';


    getCategories(parent=2){
        const query = `searchCriteria[pageSize]=100&searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=${parent}`
        const url = `${this.basePath}categories/list?${query}`;
        return this.getAsync(url);
    }

    getProductsByCategory(category,pageSize=10,pageIndex=1){
        const query = `searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${pageIndex}&searchCriteria[filterGroups][0][filters][0][field]=visibility&searchCriteria[filterGroups][0][filters][0][value]=4&searchCriteria[filterGroups][1][filters][1][conditionType]=in&searchCriteria[filterGroups][1][filters][1][field]=category_id&searchCriteria[filterGroups][1][filters][1][value]=${category}`
        const url = `${this.basePath}products?${query}`;
        return this.getAsync(url);
    }

    getProductBySku(sku){
        const url = `${this.basePath}products/${sku}`;
        return this.getAsync(url);
    }

}