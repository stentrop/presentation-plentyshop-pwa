import { toRefs } from '@vueuse/shared';
import type { useStructuredDataReturn } from './types';
import { SingleItemMeta, UseStructuredDataState } from './types';
import { categoryTreeGetters, productGetters, reviewGetters } from '@plentymarkets/shop-sdk';
import type { CategoryTreeItem, Product } from '@plentymarkets/shop-api';
import { useProductReviews } from '../useProductReviews';
import { useProductReviewAverage } from '../useProductReviewAverage';

/**
 * @description Composable managing meta data
 * @returns useStructuredDataReturn
 * @example
 * ``` ts
 * const { data, loading, setStaticPageMeta } = useMeta();
 * ```
 */
export const useStructuredData: useStructuredDataReturn = () => {
  const state = useState<UseStructuredDataState>(`useMeta`, () => ({
    loading: false,
  }));

  /**
   * @description Function for Setting page Meta
   * @returns SingleItemMeta
   * @example
   * ``` ts
   * setSigleItemMeta()
   * ```
   */
  const setProductMetaData: SingleItemMeta = (product: Product, categoryTree: CategoryTreeItem) => {
    state.value.loading = true;
    const { data: productReviews } = useProductReviews(Number(productGetters.getItemId(product)));
    const { data: reviewAverage } = useProductReviewAverage(productGetters.getId(product).toString());

    const manufacturer = productGetters.getItemManufacturerExternalName(product);
    let reviews = null;
    if (reviewAverage.value) {
      reviews = [];
      reviewGetters.getItems(productReviews.value).forEach((reviewItem) => {
        reviews.push({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: reviewGetters.getReviewRating(reviewItem),
          },
          author: {
            '@type': 'Person',
            name: reviewGetters.getReviewAuthor(reviewItem),
          },
        });
      });
    }
    const metaObject = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      // sku: sku,
      name: productGetters.getName(product),
      category: categoryTreeGetters.getName(categoryTree),
      releaseDate: '',
      image: productGetters.getCoverImagePreview(product),
      identifier: productGetters.getId(product),
      description: product.texts.description,
      disambiguatingDescription: '',
      manufacturer: {
        '@type': 'Organization',
        name: manufacturer.name,
      },
      review: reviews,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: productGetters.getAverageRating(reviewAverage.value),
        reviewCount: productGetters.getTotalReviews(reviewAverage.value),
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: productGetters.getSpecialPriceCurrency(product),
        price: productGetters.getPrice(product).special,
        priceValidUntil: productGetters.getVariationAvailableUntil(product),
        url: null,
        priceSpecification: [
          {
            '@type': 'UnitPriceSpecification',
            price: productGetters.getPrice(product).special,
            priceCurrency: productGetters.getSpecialPriceCurrency(product),
            priceType: 'SalePrice',
            referenceQuantity: {
              '@type': 'QuantitativeValue',
            },
          },
        ],
        availability: productGetters.isSalable(product)
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        itemCondition: null,
      },
      depth: {
        '@type': 'QuantitativeValue',
        value: productGetters.getLengthMM(product),
      },
      width: {
        '@type': 'QuantitativeValue',
        value: productGetters.getWidthMM(product),
      },
      height: {
        '@type': 'QuantitativeValue',
        value: productGetters.getHeightMM(product),
      },
      weight: {
        '@type': 'QuantitativeValue',
        value: productGetters.getWeightG(product),
      },
    };

    if (product.prices?.rrp) {
      metaObject.offers.priceSpecification.push({
        '@type': 'UnitPriceSpecification',
        price: productGetters.getRegularPrice(product),
        priceCurrency: productGetters.getRegularPrice(product),
        priceType: 'ListPrice',
        referenceQuantity: {
          '@type': 'QuantitativeValue',
        },
      });
    }
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(metaObject),
        },
      ],
    });
    state.value.loading = false;
  };

  return {
    setProductMetaData,
    ...toRefs(state.value),
  };
};
