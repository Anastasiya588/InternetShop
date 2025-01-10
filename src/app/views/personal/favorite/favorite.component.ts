import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart-type";
import {CartService} from "../../../shared/services/cart.service";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  // public count: number = 1;
  public products: FavoriteType[] = [];
  public serverStaticPath = environment.serverStaticPath;
  // public countInCart: number | undefined = 0;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error)
        }
        this.products = data as FavoriteType[];

        this.products.forEach(product => {
          this.cartService.getCart().subscribe((cartData: CartType | DefaultResponseType) => {
            if ((cartData as DefaultResponseType).error !== undefined) {
              throw new Error((cartData as DefaultResponseType).message);
            }
            const cartDataResponse = cartData as CartType;
            const productInCart = cartDataResponse.items.find(item => item.product.id === product.id);
            if (productInCart) {
              product.countInCart = productInCart.quantity; // Здесь предполагаем, что в FavoriteType есть поле countInCart
            }
          });
        });
      });

  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorites(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }


  addToCart(product:FavoriteType) {
    const count = product.countInCart || 1;
    this.cartService.updateCart(product.id, count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }

        product.countInCart = count;
      })
  }

  removeFromCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        product.countInCart = 0;
      })
  }

  updateCount(value: number, product: FavoriteType): void {
    product.countInCart = value;
    this.cartService.updateCart(product.id, value).subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
    });
  }
}
