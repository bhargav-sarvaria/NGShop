import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());
  constructor() { }

  initCartLocalStorage(){
    const cart = this.getCart();
    if(!cart){
      const initialCart = { items:[] };
      const initialCartJson = JSON.stringify(initialCart);   
      localStorage.setItem(CART_KEY, initialCartJson);
    }
  }

  getCart() : Cart {
    const cartJsonString = localStorage.getItem(CART_KEY);
    const cart: Cart = JSON.parse(cartJsonString);
    return cart;
  }

  // setCart()

  emptyCart() {
    const intialCart = {
      items: []
    };
    const intialCartJson = JSON.stringify(intialCart);
    localStorage.setItem(CART_KEY, intialCartJson);
    this.cart$.next(intialCart);
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean) : Cart {
    const cart = this.getCart();
    const cartItemExist = cart.items.find((item) => item.productId == cartItem.productId);
    if(cartItemExist){
       cart.items.map( (item) => {
        if(item.productId == cartItem.productId){
          if(updateCartItem){
            item.quantity = cartItem.quantity;
          } else {
            item.quantity = item.quantity + cartItem.quantity;
          }
          return;
        }
      });
    } else {
      cart.items.push(cartItem);
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string){
    const cart = this.getCart();
    const newCart = cart.items.filter(item => item.productId!= productId);
    cart.items = newCart;
    const cartJSONString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJSONString); 
    this.cart$.next(cart);
  }
}
