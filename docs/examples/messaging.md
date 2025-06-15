# Messaging Example: Chat Messages with Attachments (Optional/Nested)

This example demonstrates mapping a chat message that may have an optional attachment, showing how to handle optional nested models in mappers.

## 1. Define Domain Models

```ts [domain/models/AttachmentDomainModel.ts]
export interface AttachmentDomainModel {
    id: string;
    url: string;
    type: 'image' | 'file';
}
```

```ts [domain/models/MessageDomainModel.ts]
import type { AttachmentDomainModel } from './AttachmentDomainModel';

export interface MessageDomainModel {
    id: string;
    sender: string;
    text: string;
    sent_at: string;
    attachment?: AttachmentDomainModel | null;
}
```

## 2. Define View Models

```ts [view/models/AttachmentViewModel.ts]
export interface AttachmentViewModel {
    id: string;
    url: string;
    kind: 'image' | 'file';
}
```

```ts [view/models/MessageViewModel.ts]
import type { AttachmentViewModel } from './AttachmentViewModel';

export interface MessageViewModel {
    id: string;
    sender: string;
    text: string;
    sentAt: Date;
    attachment?: AttachmentViewModel | null;
}
```

## 3. Define Mappers (Optional/Nested)

```ts [view/mappers/AttachmentMapper.ts]
import type { AttachmentDomainModel } from '@/data/domain/models';
import type { AttachmentViewModel } from '../models';
import type { ModelMapper } from './base';

export class AttachmentMapper implements ModelMapper<AttachmentDomainModel, AttachmentViewModel> {
    toViewModel(domain: AttachmentDomainModel): AttachmentViewModel {
        return {
            id: domain.id,
            url: domain.url,
            kind: domain.type,
        };
    }
    toDomainModel(view: AttachmentViewModel): AttachmentDomainModel {
        return {
            id: view.id,
            url: view.url,
            type: view.kind,
        };
    }
}
```

```ts [view/mappers/MessageMapper.ts]
import type { MessageDomainModel } from '@/data/domain/models';
import type { MessageViewModel } from '../models';
import { AttachmentMapper } from './AttachmentMapper';
import type { ModelMapper } from './base';

const attachmentMapper = new AttachmentMapper();

export class MessageMapper implements ModelMapper<MessageDomainModel, MessageViewModel> {
    toViewModel(domain: MessageDomainModel): MessageViewModel {
        return {
            id: domain.id,
            sender: domain.sender,
            text: domain.text,
            sentAt: new Date(domain.sent_at),
            attachment: domain.attachment ? attachmentMapper.toViewModel(domain.attachment) : null,
        };
    }
    toDomainModel(view: MessageViewModel): MessageDomainModel {
        return {
            id: view.id,
            sender: view.sender,
            text: view.text,
            sent_at: view.sentAt.toISOString(),
            attachment: view.attachment ? attachmentMapper.toDomainModel(view.attachment) : null,
        };
    }
}
```

## 4. Usage Example

```ts [usage-example.ts]
import { MessageMapper } from '@/data/view/mappers/MessageMapper';

const messageMapper = new MessageMapper();
const domainMessage = {
    id: 'm1',
    sender: 'Bob',
    text: 'See attached',
    sent_at: '2025-06-15T12:00:00Z',
    attachment: { id: 'a1', url: '/img.png', type: 'image' },
};
const viewMessage = messageMapper.toViewModel(domainMessage);
// viewMessage.attachment?.kind === 'image'
```

---

This approach is useful for any model with optional or nullable nested objects (e.g., notifications with optional actions, etc.).
