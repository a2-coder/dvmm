# Blog Example: Posts and Authors

This example demonstrates how to set up domain models, view models, and mappers for a blog application with nested mapping (a `Post` contains an `Author`).

## 1. Define Domain Models

```ts [domain/models/AuthorDomainModel.ts]
export interface AuthorDomainModel {
    id: string;
    name: string;
    avatar_url: string;
}
```

```ts [domain/models/PostDomainModel.ts]
import type { AuthorDomainModel } from './AuthorDomainModel';

export interface PostDomainModel {
    id: string;
    title: string;
    content: string;
    author: AuthorDomainModel;
    published_at: string;
}
```

## 2. Define View Models

```ts [view/models/AuthorViewModel.ts]
export interface AuthorViewModel {
    id: string;
    displayName: string;
    avatarUrl: string;
}
```

```ts [view/models/PostViewModel.ts]
import type { AuthorViewModel } from './AuthorViewModel';

export interface PostViewModel {
    id: string;
    title: string;
    content: string;
    author: AuthorViewModel;
    publishedAt: Date;
}
```

## 3. Define Mappers (Nested Mapping)

```ts [view/mappers/AuthorMapper.ts]
import type { AuthorDomainModel } from '@/data/domain/models';
import type { AuthorViewModel } from '../models';
import type { ModelMapper } from './base';

export class AuthorMapper implements ModelMapper<AuthorDomainModel, AuthorViewModel> {
    toViewModel(domain: AuthorDomainModel): AuthorViewModel {
        return {
            id: domain.id,
            displayName: domain.name,
            avatarUrl: domain.avatar_url,
        };
    }
    toDomainModel(view: AuthorViewModel): AuthorDomainModel {
        return {
            id: view.id,
            name: view.displayName,
            avatar_url: view.avatarUrl,
        };
    }
}
```

```ts [view/mappers/PostMapper.ts]
import type { PostDomainModel } from '@/data/domain/models';
import type { PostViewModel } from '../models';
import { AuthorMapper } from './AuthorMapper';
import type { ModelMapper } from './base';

const authorMapper = new AuthorMapper();

export class PostMapper implements ModelMapper<PostDomainModel, PostViewModel> {
    toViewModel(domain: PostDomainModel): PostViewModel {
        return {
            id: domain.id,
            title: domain.title,
            content: domain.content,
            author: authorMapper.toViewModel(domain.author),
            publishedAt: new Date(domain.published_at),
        };
    }
    toDomainModel(view: PostViewModel): PostDomainModel {
        return {
            id: view.id,
            title: view.title,
            content: view.content,
            author: authorMapper.toDomainModel(view.author),
            published_at: view.publishedAt.toISOString(),
        };
    }
}
```

## 4. Usage Example

```ts [usage-example.ts]
import { PostMapper } from '@/data/view/mappers/PostMapper';

const postMapper = new PostMapper();
const domainPost = {
    id: '1',
    title: 'Hello World',
    content: 'Welcome to the blog!',
    author: { id: 'a1', name: 'Alice', avatar_url: '/alice.png' },
    published_at: '2025-06-01T10:00:00Z',
};
const viewPost = postMapper.toViewModel(domainPost);
// viewPost.author.displayName === 'Alice'
```

---

This pattern can be extended for more complex nested models (e.g., comments with authors, etc.).
