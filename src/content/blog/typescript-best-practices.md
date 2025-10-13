---
title: "TypeScript 타입 안전성 극대화하기"
description: "실전 프로젝트에서 활용하는 TypeScript 모범 사례"
publishDate: 2024-05-12
tags: ["typescript", "best-practices", "type-safety"]
draft: false
---

# TypeScript를 제대로 사용하기

TypeScript의 진정한 가치는 타입 안전성에 있습니다. `any`를 남발하면 JavaScript와 다를 바 없습니다.

## 기본 원칙

### 1. strict 모드 활성화

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. any 대신 unknown 사용

```typescript
// 나쁜 예
function process(data: any) {
  return data.value; // 타입 체크 없음
}

// 좋은 예
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
}
```

### 3. 타입 가드 활용

```typescript
interface User {
  type: 'user';
  name: string;
}

interface Admin {
  type: 'admin';
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return user.type === 'admin';
}
```

## 고급 패턴

### 1. 유틸리티 타입

```typescript
type Partial<T> = { [P in keyof T]?: T[P] };
type Required<T> = { [P in keyof T]-?: T[P] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

### 2. 제네릭 제약

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### 3. 조건부 타입

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

## Zod와 함께 사용하기

```typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  age: z.number().min(0),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>;

// 런타임 검증 + 타입 추론
const user = userSchema.parse(data);
```

## 실수 방지

### 1. 타입 단언 남용 피하기

```typescript
// 위험
const user = data as User;

// 안전
const user = userSchema.parse(data);
```

### 2. 옵셔널 체이닝 활용

```typescript
const userName = user?.profile?.name ?? 'Guest';
```

## 결론

TypeScript는 도구일 뿐입니다. 올바르게 사용해야 가치를 발휘합니다.
