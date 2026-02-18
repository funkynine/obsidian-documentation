# Перевірка скіла subagent-orchestration

Як переконатися, що пайплайн planner → programmer → tester → code-reviewer → programmer → tester працює.

## Перед тестом

- [ ] Сабагенти є в **`.cursor/agents/`**: `planner.md`, `programmer.md`, `tester.md`, `code-reviewer.md`
- [ ] Скіл є в **`.cursor/skills/subagent-orchestration/SKILL.md`** (Cursor підхоплює саме звідти)
- [ ] Дублікати в `agents/` та `skills/subagent-orchestration/` — для людей; Cursor використовує `.cursor/`

## Мінімальний тест (одна задача)

Скопіюй у чат і запусти:

```
Запусти повний пайплайн subagent-orchestration для такої задачі:

Додай у проєкт утилітну функцію add(a, b), яка повертає суму двох чисел. 
План: 1) визначити де в проєкті класти утиліти, 2) додати функцію та експорт, 3) перевірити що вона працює.

Виконуй кроки по черзі: planner → programmer → tester → code-reviewer → programmer (якщо є critical) → tester знову. Після кожного кроку коротко напиши, що зроблено і що передаєш далі.
```

Що очікувати:

1. **Planner** — план з 1–3 задач, handoff programmer.
2. **Programmer** — додає `add`, експорт, можливо тест.
3. **Tester** — перевіряє (запуск тесту або вручну); якщо ок — handoff code-reviewer.
4. **Code-reviewer** — дає feedback (critical / warnings / suggestions).
5. Якщо є **critical** — **Programmer** править, потім знову **Tester**; якщо critical немає — tester все одно може пробігтися для впевненості.

## Що перевірити

| Крок              | Очікування |
|-------------------|------------|
| Скіл застосовано  | Агент посилається на pipeline або кроки з SKILL.md. |
| Planner викликано | З’явився план і список задач. |
| Programmer викликано | З’явився код (файл з `add`). |
| Tester викликано  | Є висновок «працює» або коментар для programmer. |
| Code-reviewer викликано | Є блоки Critical / Warnings / Suggestions. |
| Другий Programmer (якщо critical) | Критичні пункти виправлені. |
| Другий Tester     | Підтвердження, що після правок все ще працює. |

## Якщо щось не працює

- **Скіл не застосовується** — переконайся, що в описі є «task», «bug», «feature» або «run the pipeline»; перезавантаж Cursor / проєкт; перевір шлях `.cursor/skills/subagent-orchestration/SKILL.md`.
- **Subagent not found** — файли мають бути в `.cursor/agents/` з іменами `planner.md`, `programmer.md`, `tester.md`, `code-reviewer.md`.
- **Пайплайн обривається** — явно напиши: «Далі за скілом subagent-orchestration передай результат tester / code-reviewer / programmer і виконай наступний крок.»

## Швидкий тест без коду

Можна перевірити лише порядок кроків:

```
Запусти пайплайн subagent-orchestration для бага: "на кнопці Submit має бути текст Submit, а не Send". Не пиши код — тільки пройди всі кроки по черзі і напиши, що би передав planner → programmer → tester → code-reviewer → programmer → tester.
```

Перевір, що агент перелічує всі 6 кроків і handoff між ними узгоджені з SKILL.md.
