# User Management Example: Users with Roles (Array Mapping)

This example demonstrates mapping a user with an array of roles, showing how to map arrays of nested models.

## 1. Define Domain Models

```ts [domain/models/RoleDomainModel.ts]
export interface RoleDomainModel {
    id: string;
    name: string;
}
```

```ts [domain/models/UserDomainModel.ts]
import type { RoleDomainModel } from './RoleDomainModel';

export interface UserDomainModel {
    id: string;
    email: string;
    display_name: string;
    roles: RoleDomainModel[];
}
```

## 2. Define View Models

```ts [view/models/RoleViewModel.ts]
export interface RoleViewModel {
    id: string;
    label: string;
}
```

```ts [view/models/UserViewModel.ts]
import type { RoleViewModel } from './RoleViewModel';

export interface UserViewModel {
    id: string;
    email: string;
    name: string;
    roles: RoleViewModel[];
}
```

## 3. Define Mappers (Array Mapping)

```ts [view/mappers/RoleMapper.ts]
import type { RoleDomainModel } from '@/data/domain/models';
import type { RoleViewModel } from '../models';
import type { ModelMapper } from './base';

export class RoleMapper implements ModelMapper<RoleDomainModel, RoleViewModel> {
    toViewModel(domain: RoleDomainModel): RoleViewModel {
        return {
            id: domain.id,
            label: domain.name,
        };
    }
    toDomainModel(view: RoleViewModel): RoleDomainModel {
        return {
            id: view.id,
            name: view.label,
        };
    }
}
```

```ts [view/mappers/UserMapper.ts]
import type { UserDomainModel } from '@/data/domain/models';
import type { UserViewModel } from '../models';
import { RoleMapper } from './RoleMapper';
import type { ModelMapper } from './base';

const roleMapper = new RoleMapper();

export class UserMapper implements ModelMapper<UserDomainModel, UserViewModel> {
    toViewModel(domain: UserDomainModel): UserViewModel {
        return {
            id: domain.id,
            email: domain.email,
            name: domain.display_name,
            roles: domain.roles.map(role => roleMapper.toViewModel(role)),
        };
    }
    toDomainModel(view: UserViewModel): UserDomainModel {
        return {
            id: view.id,
            email: view.email,
            display_name: view.name,
            roles: view.roles.map(role => roleMapper.toDomainModel(role)),
        };
    }
}
```

## 4. Usage Example

```ts [usage-example.ts]
import { UserMapper } from '@/data/view/mappers/UserMapper';

const userMapper = new UserMapper();
const domainUser = {
    id: 'u1',
    email: 'user@example.com',
    display_name: 'Jane Doe',
    roles: [
        { id: 'r1', name: 'admin' },
        { id: 'r2', name: 'editor' },
    ],
};
const viewUser = userMapper.toViewModel(domainUser);
// viewUser.roles[0].label === 'admin'
```

---

This approach is useful for any model with arrays of nested objects (e.g., tags, permissions, etc.).
