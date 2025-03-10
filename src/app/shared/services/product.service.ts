import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";
import {ProductType} from "../../../types/product.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getBestProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.api + 'products/best');
  }

  // getProducts(params: ActiveParamsType): Observable<{ totalCount: number, pages: number, items: ProductType[] }> {
  //   return this.http.get<{ totalCount: number, pages: number, items: ProductType[] }>(environment.api + 'products', {
  //     params: params
  //   });
  // }

  getProducts(params: ActiveParamsType): Observable<{ totalCount: number, pages: number, items: ProductType[] }> {
    // Преобразуем объект params в HttpParams
    let httpParams = new HttpParams();

    if (params.types) {
      params.types.forEach(type => {
        httpParams = httpParams.append('types', type);
      });
    }

    if (params.heightFrom) {
      httpParams = httpParams.append('heightFrom', params.heightFrom);
    }

    if (params.heightTo) {
      httpParams = httpParams.append('heightTo', params.heightTo);
    }

    if (params.diameterFrom) {
      httpParams = httpParams.append('diameterFrom', params.diameterFrom);
    }

    if (params.diameterTo) {
      httpParams = httpParams.append('diameterTo', params.diameterTo);
    }

    if (params.sort) {
      httpParams = httpParams.append('sort', params.sort);
    }

    if (params.page) {
      httpParams = httpParams.append('page', params.page.toString());
    }

    return this.http.get<{ totalCount: number, pages: number, items: ProductType[] }>(environment.api + 'products', {
      params: httpParams
    });
  }


  searchProducts(query: string): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.api + 'products/search?query=' + query);
  }

  getProduct(url: string): Observable<ProductType> {
    return this.http.get<ProductType>(environment.api + 'products/' + url);
  }
}
