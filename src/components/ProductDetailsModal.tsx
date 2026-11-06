import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { ProductDetailsPage } from './ProductDetailsPage.js';
import { ResellerProductPreviewModal } from './reseller/ResellerProductPreviewModal.js';
import { Product } from '../types/index.js';
import { api } from '../services/api.js';

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    resellerPreviewProduct,
    setResellerPreviewProduct,
    activePortal,
  } = useApp();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const isReseller = activePortal === 'employee';

  useEffect(() => {
    if (selectedProduct || resellerPreviewProduct) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      api.getProducts()
        .then((res) => {
          if (res?.products) {
            setAllProducts(res.products);
          }
        })
        .catch(() => {});
    }
  }, [selectedProduct, resellerPreviewProduct]);

  if (isReseller && resellerPreviewProduct) {
    return (
      <ResellerProductPreviewModal
        product={resellerPreviewProduct}
        isOpen={true}
        onClose={() => setResellerPreviewProduct(null)}
        onTakeForSelling={() => {
          setResellerPreviewProduct(null);
        }}
      />
    );
  }

  if (selectedProduct) {
    return (
      <div className="fixed inset-0 z-[1100] bg-white dark:bg-slate-900 overflow-y-auto animate-in fade-in duration-200">
        <ProductDetailsPage
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          categoryProducts={allProducts}
          onSelectRelated={(prod) => {
            setSelectedProduct(prod);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return null;
};
