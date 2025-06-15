# Todo App Example: Simple Flat Model

This example demonstrates a basic todo app with a flat model and simple mapping (no nesting).

## 1. Define Domain Model

```ts [domain/models/TodoDomainModel.ts]
export interface TodoDomainModel {
    id: string;
    text: string;
    completed: boolean;
    due_date: string | null; // ISO string or null
}
```

## 2. Define View Model

```ts [view/models/TodoViewModel.ts]
export interface TodoViewModel {
    id: string;
    text: string;
    isDone: boolean;
    dueDate: Date | null;
}
```

## 3. Define Mapper

```ts [view/mappers/TodoMapper.ts]
import type { TodoDomainModel } from '@/data/domain/models';
import type { TodoViewModel } from '../models';
import type { ModelMapper } from './base';

export class TodoMapper implements ModelMapper<TodoDomainModel, TodoViewModel> {
    toViewModel(domain: TodoDomainModel): TodoViewModel {
        return {
            id: domain.id,
            text: domain.text,
            isDone: domain.completed,
            dueDate: domain.due_date ? new Date(domain.due_date) : null,
        };
    }
    toDomainModel(view: TodoViewModel): TodoDomainModel {
        return {
            id: view.id,
            text: view.text,
            completed: view.isDone,
            due_date: view.dueDate ? view.dueDate.toISOString() : null,
        };
    }
}
```

## 4. Usage Example

```ts [usage-example.ts]
import { TodoMapper } from '@/data/view/mappers/TodoMapper';

const todoMapper = new TodoMapper();
const domainTodo = {
    id: 't1',
    text: 'Buy milk',
    completed: false,
    due_date: '2025-06-20T12:00:00Z',
};
const viewTodo = todoMapper.toViewModel(domainTodo);
// viewTodo.isDone === false
// viewTodo.dueDate instanceof Date
```

---

This pattern is ideal for simple lists and can be extended for more complex todo apps (e.g., with nested subtasks).

