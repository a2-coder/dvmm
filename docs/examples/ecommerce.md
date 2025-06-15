# E-Commerce Example: Products and Categories

This example shows how to model an e-commerce product with a nested category, and how to set up mappers for both.

## 1. Define Domain Models

```ts [domain/models/CategoryDomainModel.ts]
export interface CategoryDomainModel {
    id: string;
    name: string;
}
```

```ts [domain/models/ProductDomainModel.ts]
import type { CategoryDomainModel } from './CategoryDomainModel';

export interface ProductDomainModel {
    id: string;
    name: string;
    price_cents: number;
    category: CategoryDomainModel;
    image_url: string;
}
```

## 2. Define View Models

```ts [view/models/CategoryViewModel.ts]
export interface CategoryViewModel {
    id: string;
    label: string;
}
```

```ts [view/models/ProductViewModel.ts]
import type { CategoryViewModel } from './CategoryViewModel';

export interface ProductViewModel {
    id: string;
    name: string;
    price: string; // formatted, e.g. "$19.99"
    category: CategoryViewModel;
    imageUrl: string;
}
```

## 3. Define Mappers (Nested Mapping)

```ts [view/mappers/CategoryMapper.ts]
import type { CategoryDomainModel } from '@/data/domain/models';
import type { CategoryViewModel } from '../models';
import type { ModelMapper } from './base';

export class CategoryMapper implements ModelMapper<CategoryDomainModel, CategoryViewModel> {
    toViewModel(domain: CategoryDomainModel): CategoryViewModel {
        return {
            id: domain.id,
            label: domain.name,
        };
    }
    toDomainModel(view: CategoryViewModel): CategoryDomainModel {
        return {
            id: view.id,
            name: view.label,
        };
    }
}
```

```ts [view/mappers/ProductMapper.ts]
import type { ProductDomainModel } from '@/data/domain/models';
import type { ProductViewModel } from '../models';
import { CategoryMapper } from './CategoryMapper';
import type { ModelMapper } from './base';

const categoryMapper = new CategoryMapper();

export class ProductMapper implements ModelMapper<ProductDomainModel, ProductViewModel> {
    toViewModel(domain: ProductDomainModel): ProductViewModel {
        return {
            id: domain.id,
            name: domain.name,
            price: `$${(domain.price_cents / 100).toFixed(2)}`,
            category: categoryMapper.toViewModel(domain.category),
            imageUrl: domain.image_url,
        };
    }
    toDomainModel(view: ProductViewModel): ProductDomainModel {
        return {
            id: view.id,
            name: view.name,
            price_cents: Math.round(parseFloat(view.price.replace('$', '')) * 100),
            category: categoryMapper.toDomainModel(view.category),
            image_url: view.imageUrl,
        };
    }
}
```

## 4. Usage Example

```ts [usage-example.ts]
import { ProductMapper } from '@/data/view/mappers/ProductMapper';

const productMapper = new ProductMapper();
const domainProduct = {
    id: 'p1',
    name: 'T-Shirt',
    price_cents: 1999,
    category: { id: 'c1', name: 'Apparel' },
    image_url: '/tshirt.png',
};
const viewProduct = productMapper.toViewModel(domainProduct);
// viewProduct.price === "$19.99"
// viewProduct.category.label === 'Apparel'
```

---

This approach can be extended to include more nested models, such as product variants, reviews, etc.
