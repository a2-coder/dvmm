# Project Management Example: Projects with Tasks (Deeply Nested Mapping)

This example demonstrates mapping a project with an array of tasks, where each task has an assignee (user). This showcases deep/nested mapping with multiple mappers.

## 1. Define Domain Models

```ts [domain/models/UserDomainModel.ts]
export interface UserDomainModel {
    id: string;
    name: string;
}
```

```ts [domain/models/TaskDomainModel.ts]
import type { UserDomainModel } from './UserDomainModel';

export interface TaskDomainModel {
    id: string;
    title: string;
    completed: boolean;
    assignee: UserDomainModel;
}
```

```ts [domain/models/ProjectDomainModel.ts]
import type { TaskDomainModel } from './TaskDomainModel';

export interface ProjectDomainModel {
    id: string;
    name: string;
    tasks: TaskDomainModel[];
}
```

## 2. Define View Models

```ts [view/models/UserViewModel.ts]
export interface UserViewModel {
    id: string;
    displayName: string;
}
```

```ts [view/models/TaskViewModel.ts]
import type { UserViewModel } from './UserViewModel';

export interface TaskViewModel {
    id: string;
    title: string;
    isDone: boolean;
    assignee: UserViewModel;
}
```

```ts [view/models/ProjectViewModel.ts]
import type { TaskViewModel } from './TaskViewModel';

export interface ProjectViewModel {
    id: string;
    name: string;
    tasks: TaskViewModel[];
}
```

## 3. Define Mappers (Deeply Nested)

```ts [view/mappers/UserMapper.ts]
import type { UserDomainModel } from '@/data/domain/models';
import type { UserViewModel } from '../models';
import type { ModelMapper } from './base';

export class UserMapper implements ModelMapper<UserDomainModel, UserViewModel> {
    toViewModel(domain: UserDomainModel): UserViewModel {
        return {
            id: domain.id,
            displayName: domain.name,
        };
    }
    toDomainModel(view: UserViewModel): UserDomainModel {
        return {
            id: view.id,
            name: view.displayName,
        };
    }
}
```

```ts [view/mappers/TaskMapper.ts]
import type { TaskDomainModel } from '@/data/domain/models';
import type { TaskViewModel } from '../models';
import { UserMapper } from './UserMapper';
import type { ModelMapper } from './base';

const userMapper = new UserMapper();

export class TaskMapper implements ModelMapper<TaskDomainModel, TaskViewModel> {
    toViewModel(domain: TaskDomainModel): TaskViewModel {
        return {
            id: domain.id,
            title: domain.title,
            isDone: domain.completed,
            assignee: userMapper.toViewModel(domain.assignee),
        };
    }
    toDomainModel(view: TaskViewModel): TaskDomainModel {
        return {
            id: view.id,
            title: view.title,
            completed: view.isDone,
            assignee: userMapper.toDomainModel(view.assignee),
        };
    }
}
```

```ts [view/mappers/ProjectMapper.ts]
import type { ProjectDomainModel } from '@/data/domain/models';
import type { ProjectViewModel } from '../models';
import { TaskMapper } from './TaskMapper';
import type { ModelMapper } from './base';

const taskMapper = new TaskMapper();

export class ProjectMapper implements ModelMapper<ProjectDomainModel, ProjectViewModel> {
    toViewModel(domain: ProjectDomainModel): ProjectViewModel {
        return {
            id: domain.id,
            name: domain.name,
            tasks: domain.tasks.map(task => taskMapper.toViewModel(task)),
        };
    }
    toDomainModel(view: ProjectViewModel): ProjectDomainModel {
        return {
            id: view.id,
            name: view.name,
            tasks: view.tasks.map(task => taskMapper.toDomainModel(task)),
        };
    }
}
```

## 4. Usage Example

```ts [usage-example.ts]
import { ProjectMapper } from '@/data/view/mappers/ProjectMapper';

const projectMapper = new ProjectMapper();
const domainProject = {
    id: 'p1',
    name: 'Website Redesign',
    tasks: [
        {
            id: 't1',
            title: 'Design homepage',
            completed: false,
            assignee: { id: 'u1', name: 'Alice' },
        },
    ],
};
const viewProject = projectMapper.toViewModel(domainProject);
// viewProject.tasks[0].assignee.displayName === 'Alice'
```

---

This approach is ideal for any scenario with deeply nested or hierarchical data.
