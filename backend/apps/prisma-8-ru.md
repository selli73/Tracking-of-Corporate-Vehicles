# Добро пожаловать в Prisma ORM!

Prisma ORM позволяет делать запросы к базе данных на простом и понятном TypeScript. Опишите, как выглядят ваши данные, и Prisma ORM даст вам полностью типизированный клиент — с автодополнением для каждой таблицы, колонки и связи.

Этот проект настроен для PostgreSQL. Prisma ORM поддерживает и другие базы данных.

## Требования

- **PostgreSQL 15 или новее.** Более старые версии сервера не поддерживаются. Чтобы проверить версию, выполните `SELECT version()` на своём сервере.
- CLI никогда не подключается к вашей базе данных без явного согласия. Если хотите, чтобы `init` сама проверила версию сервера, передайте флаг `--probe-db` команде `bun prisma orm init`.

## Ваш контракт данных

Контракт данных — это сердце вашего приложения. Он находится в файле [`src/prisma/contract.prisma`](src/prisma/contract.prisma) и описывает ваши модели:

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  username String?
  name     String?
}
```

Любую модель, описанную в контракте, можно запрашивать из приложения. Редактор будет автодополнять методы запросов и показывать тип каждого поля модели:

```typescript
import { db } from './src/prisma/db';

const user = await db.orm.public.User
  .where({ email: 'alice@example.com' })
  .first();

// Редактор покажет тип user как
// { id: number; email: string; username: string | null; name: string | null; createdAt: Date; posts: Post[] } | null
```

У контракта есть два сопутствующих файла в той же папке:

- **`contract.json`** — сообщает приложению, какие модели существуют, так же как `package-lock.json` сообщает менеджеру пакетов, какие зависимости есть у проекта
- **`contract.d.ts`** — обеспечивает автодополнение и проверку типов в редакторе

Коммитьте оба файла в git. После изменения контракта выполните `bun prisma contract emit`, чтобы обновить их.

Если вы используете фреймворк вроде Next.js или Vite, плагин Prisma ORM сделает это за вас автоматически.

## Конфигурация

Файл [`prisma.config.ts`](prisma.config.ts) сообщает CLI, где находится контракт и как подключаться к базе данных. Он автоматически загружает переменные окружения из `.env`:

```typescript
import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.prisma',
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});
```

Заметили `DATABASE_URL` выше? Эта переменная задана в файле [`.env`](./.env):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

Чтобы изменить способ загрузки переменных окружения, поменяйте или удалите строку `import 'dotenv/config'`.

## Краткий справочник

### Команды

```bash
bun prisma contract emit       # Обновить contract.json и contract.d.ts
bun prisma db init             # Создать таблицы в базе данных
bun prisma migration status    # Показать статус миграций
```

### Файлы

| Файл | Назначение |
|---|---|
| [`src/prisma/contract.prisma`](src/prisma/contract.prisma) | Контракт данных — здесь описываются модели |
| [`prisma.config.ts`](prisma.config.ts) | Конфигурация CLI |
| [`src/prisma/db.ts`](src/prisma/db.ts) | Клиент базы данных — `import { db } from './src/prisma/db'` |
| `src/prisma/contract.json` | Скомпилированный контракт (генерируется автоматически) |
| `src/prisma/contract.d.ts` | Типы контракта (генерируются автоматически) |

### Порядок работы

1. Отредактируйте [`src/prisma/contract.prisma`](src/prisma/contract.prisma), чтобы добавить или изменить модели.
2. Выполните `bun prisma contract emit`, чтобы пересобрать контракт.
3. Делайте запросы к моделям — IDE подскажет всё через автодополнение.

## Заметки про монорепозиторий (pnpm workspaces)

Если проект находится внутри pnpm workspace, полезно знать несколько вещей:

- **Каталоги (catalogs).** Если в `pnpm-workspace.yaml` задан раздел `catalogs` для `prisma` или `@prisma/orm-postgres`, pnpm везде использует версию из каталога — и `init` тоже. Если вам нужна опубликованная версия `latest`, обновите или удалите запись в каталоге, а затем снова выполните `pnpm install`.
- **`pnpm dlx`.** Команда `pnpm dlx prisma@latest orm init …` работает в любой папке. Но внутри workspace pnpm всё равно подбирает зависимости через каталог и overrides workspace, а не напрямую из реестра. Поэтому установленные пакеты Prisma ORM будут соответствовать каталогу workspace, а не `latest`.
- **Запасной вариант: `npm` вместо `pnpm`.** Если `pnpm` не сможет установить Prisma ORM из-за ошибки разрешения зависимостей вида `workspace:*` или `catalog:` (такая ссылка по ошибке попала в опубликованный пакет), `init` переключится на `npm install` и покажет предупреждение. Когда проблемный пакет выпустит исправленную версию, можно вернуться к `pnpm install`.