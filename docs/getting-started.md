# Getting Started

## Introduction

DVMM (Domain-View Model Mapper) is a frontend architecture pattern for TypeScript projects that enforces a clean separation between backend data models (domain models) and UI models (view models) using deterministic mappers. This approach improves maintainability, enables parallel backend/frontend development, and ensures type safety throughout your codebase.

## Folder structure

A typical DVMM project is organized as follows:

```
src
├── data
│   ├── domain
│   │   ├── models         # Domain models (backend API response structure)
│   │   ├── functions      # Functions to interact with backend APIs
│   │   ├── client.ts      # API client setup (e.g., Axios, Fetch, Ky)
│   │   └── index.ts       # Entry point for domain logic
│   ├── view
│   │   ├── models         # View models (data structure needed by the UI)
│   │   ├── mappers        # Mappers to convert between domain and view models
│   │   └── index.ts       # Entry point for view logic
├── components
└── pages
```

### Folder Structure Explanation

- **data/domain/models**: Contains TypeScript interfaces/types that mirror backend API responses. These should match the backend contract exactly.
- **data/domain/functions**: Functions for fetching or mutating data via the backend API.
- **data/domain/client.ts**: Sets up the API client (e.g., Axios instance or Fetch wrapper).
- **data/domain/index.ts**: Aggregates and exports domain logic for easy imports.

- **data/view/models**: Contains view model interfaces/types, shaped for UI needs (e.g., formatting, grouping, or flattening data).
- **data/view/mappers**: Contains pure functions or classes that convert between domain and view models.
- **data/view/index.ts**: Aggregates and exports view logic.

- **components**: UI components that consume view models.
- **pages**: Top-level pages or routes.

## Naming Conventions

When creating your models and mappers, follow these naming conventions to ensure clarity and consistency across your codebase:

| Concept      | Naming Pattern | Example           |
| ------------ | -------------- | ----------------- |
| Domain Model | `XDomainModel` | `UserDomainModel` |
| View Model   | `XViewModel`   | `UserViewModel`   |
| Mapper       | `XMapper`      | `UserMapper`      |

### ModelMapper interface

To ensure consistency in your mappers, define a common interface for them. This interface should include methods for converting between domain and view models.

```ts
export interface ModelMapper<DomainModel, ViewModel> {
    toViewModel(domainModel: DomainModel): ViewModel;
    toDomainModel(viewModel: ViewModel): DomainModel;
}
```

## Example Implementation

Let's take an example of a `Post` entity with typical read endpoints. In a RESTful API, these endpoints might look like:

| Endpoint      | Method | Description              |
| ------------- | ------ | ------------------------ |
| `/posts`      | GET    | Retrieve a list of posts |

These endpoints allow you to fetch either a collection of posts or the details of a specific post. We'll use this `Post` entity to demonstrate how DVMM structures domain and view models, as well as the mapping logic between them.

**Define the domain model for Post entity**

To get started, you'll first define the domain model, which should match the backend API's response structure exactly.

Create a file named `PostDomainModel.ts` in the `data/domain/models` directory:

::: code-group

```ts [data/domain/models/PostDomainModel.ts]
export interface PostDomainModel {
    id: string;
    title: string;
    description: string;
    stars: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}
```

```ts [data/domain/models/index.ts]
export { PostDomainModel } from './PostDomainModel'; // [!code ++]
```
:::

**Define the functions for api access**

Next, create a file named `posts.ts` in the `data/domain/functions` directory. This file will contain functions to interact with the backend API.

::: code-group

```ts [data/domain/functions/posts.ts]
import { PostDomainModel } from '../models/post';
import type { KyInstance } from 'ky';

// -- the ApiClient can be an Axios instance, Fetch wrapper, or any HTTP client you prefer
// for this example, we'll use a ky instance
// the client should be configured to point to your backend API base URL
export async function fetchPosts(client: KyInstance): Promise<PostDomainModel[]> {
    return await client.get('posts').json();
}
```

```ts [data/domain/functions/index.ts]
export * as posts from './posts'; // [!code ++]
```

:::

We can further organize our code by creating an `index.ts` file inside the `data/domain` directory to aggregate and export all domain logic:

```ts [data/domain/index.ts]
export * as models from './models'; // [!code ++]
export * as fn from './functions'; // [!code ++]
```

**Define the view model for Post entity**

Now, create the view model that will be used by the UI. This model may include additional formatting or derived properties that are not present in the domain model.

Create a file named `PostViewModel.ts` in the `data/view/models` directory:

::: code-group

```ts [data/view/models/PostViewModel.ts]
export interface PostViewModel {
    id: string;
    title: string;
    description: string;
    stars: number;
    createdAt: Date; // Converted to Date object for easier manipulation in UI
    updatedAt: Date; // Converted to Date object for easier manipulation in UI
}
```

```ts [data/view/models/index.ts]
export { PostViewModel } from './PostViewModel'; // [!code ++]
```

:::

**Define the mapper for Post entity**

Next, create a mapper that converts between the domain model and the view model. This mapper will handle any necessary transformations, such as converting date strings to Date objects.

Create a file named `PostMapper.ts` in the `data/view/mappers` directory:

::: code-group

```ts [data/view/mappers/PostMapper.ts]
import type { PostDomainModel } from '@/data/domain/models';
import type { PostViewModel } from '../models';
import type { ModelMapper } from './base';

export class PostMapper implements ModelMapper<PostDomainModel, PostViewModel> {
    toViewModel(domain: PostDomainModel): PostViewModel {
        return {
            id: domain.id,
            title: domain.title,
            description: domain.description,
            stars: domain.stars,
            createdAt: new Date(domain.created_at),
            updatedAt: new Date(domain.updated_at),
        };
    }

    toDomainModel(view: PostViewModel): PostDomainModel {
        return {
            id: view.id,
            title: view.title,
            description: view.description,
            stars: view.stars,
            created_at: view.createdAt.toISOString(),
            updated_at: view.updatedAt.toISOString(),
        };
    }
}
```

````ts [data/view/mappers/base.ts]
export interface ModelMapper<DomainModel, ViewModel> {
    toViewModel(domainModel: DomainModel): ViewModel;
    toDomainModel(viewModel: ViewModel): DomainModel;
}
````

```ts [data/view/mappers/index.ts]
export { PostMapper } from './PostMapper'; // [!code ++]
```

**Using the Mapper**

Here's how you can use `PostMapper` with React Query to fetch and map posts for your UI:

::: code-group

```ts [src/hooks/use-posts.ts]
import { useQuery } from '@tanstack/react-query';
import { fn } from '@/data/domain';
import { PostMapper } from '@/data/view/mappers';
import { useApiClient } from '@/data/domain/client';

const postMapper = new PostMapper();

export function usePosts() {
    const client = useApiClient(); // Assume this is a hook that provides your API client

    return useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const domainPosts = await fn.posts.fetchPosts(client);
            return domainPosts.map(post => postMapper.toViewModel(post));
        },
    });
}
```

```tsx [components/PostList.tsx]
import { usePosts } from '@/hooks/use-posts';
import { PostItem } from './PostItem';

function PostList() {
    const { data: posts, isLoading, error } = usePosts();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading posts</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts?.map(post => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    );
}
```

```tsx [components/PostItem.tsx]
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PostViewModel } from "@/data/view/models";

type PostItemProps = {
    post: PostViewModel;
};

export function PostItem({ post }: PostItemProps) {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-2">{post.description}</p>
                <Badge variant="secondary">⭐ {post.stars}</Badge>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <span>{post.updatedAt.toLocaleDateString()}</span>
            </CardFooter>
        </Card>
    );
}
```

:::

## Mapper Testing Example
To ensure your mappers work correctly, you can write unit tests for them. Here's an example of how to test the `PostMapper`:

```ts [tests/PostMapper.test.ts]
import { PostMapper } from '@/data/view/mappers';
import { PostDomainModel } from '@/data/domain/models';

const postMapper = new PostMapper();

const domainPost: PostDomainModel = {
    id: '1',
    title: 'Test Post',
    description: 'This is a test post.',
    stars: 5,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-02T10:00:00Z',
};

describe('PostMapper', () => {
    it('should convert domain model to view model', () => {
        const viewPost = postMapper.toViewModel(domainPost);
        expect(viewPost).toDeepEqual({
            id: '1',
            title: 'Test Post',
            description: 'This is a test post.',
            stars: 5,
            createdAt: new Date('2025-01-01T10:00:00Z'),
            updatedAt: new Date('2025-01-02T10:00:00Z'),
        });
    });

    it('should convert view model back to domain model', () => {
        const viewPost = postMapper.toViewModel(domainPost);
        const backToDomain = postMapper.toDomainModel(viewPost);
        expect(backToDomain).toDeepEqual(domainPost);
    });
});
```