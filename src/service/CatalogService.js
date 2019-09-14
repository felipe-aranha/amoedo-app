import { HttpClient } from './HttpClient';

export class CatalogService extends HttpClient {

    basePath = 'rest/V1/';


    getCategories(){
        const query = `searchCriteria[pageSize]=100`
        const url = `${this.basePath}categories/list?${query}`;
        return this.getAsync(url);
    }

    getSubCategories(parent=2){
        const query = `searchCriteria[pageSize]=100&searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=${parent}`
        const url = `${this.basePath}categories/list?${query}`;
        return this.getAsync(url);
    }

    getProductsByCategory(category,pageSize=10,pageIndex=1){
        const query = `searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${pageIndex}&searchCriteria[filterGroups][0][filters][0][field]=visibility&searchCriteria[filterGroups][0][filters][0][value]=4&searchCriteria[filterGroups][1][filters][1][conditionType]=in&searchCriteria[filterGroups][1][filters][1][field]=category_id&searchCriteria[filterGroups][1][filters][1][value]=${category}&searchCriteria[filterGroups][2][filters][0][conditionType]=eq&searchCriteria[filterGroups][2][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=status`
        const url = `${this.basePath}products?${query}`;
        return this.getAsync(url);
    }

    searchForProducts(term='', pageSize=10, pageIndex=1){
        term = `%${term.trim()}%`;
        const query = `searchCriteria[pageSize]=${pageSize}&searchCriteria[currentPage]=${pageIndex}&searchCriteria[filterGroups][0][filters][0][field]=visibility&searchCriteria[filterGroups][0][filters][0][value]=4&searchCriteria[filterGroups][1][filters][1][conditionType]=like&searchCriteria[filterGroups][1][filters][1][field]=name&searchCriteria[filterGroups][1][filters][1][value]=${term}&searchCriteria[filterGroups][2][filters][0][conditionType]=eq&searchCriteria[filterGroups][2][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][field]=status`
        const url = `${this.basePath}products?${query}`;
        return this.getAsync(url);
    }

    getProductBySku(sku){
        const url = `${this.basePath}products/${sku}`;
        return this.getAsync(url);
    }

}