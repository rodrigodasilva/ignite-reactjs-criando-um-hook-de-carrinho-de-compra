import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const LOCAL_STORAGE_KEY = '@RocketShoes:cart';

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const cartProduct = cart.find(product => product.id === productId);
      
      const { data: stock } = await api.get<Product[]>('/stock');
      const stockProduct = stock.find(product => product.id === productId)

      if (!stockProduct) {
        throw new Error('Erro na adição do produto')
      }

      let updatedCart: Product[] = [];

      if (!cartProduct) {
        updatedCart = [...cart, {...stockProduct, amount: 1 }];
      } else {
        updatedCart = cart.map(product => {
          if (product.id !== productId) {
            return product
          }

          const newAmount = product.amount + 1;
          const hasStockAmount = stockProduct.amount >= newAmount;

          if (!hasStockAmount) {
            throw new Error('Quantidade solicitada fora de estoque')
          }

          return ({...product, amount: newAmount })       
        });
      }      

      setCart(updatedCart)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart))

    } catch (err) {
      toast.error(err.message)
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
