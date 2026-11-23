export const queries = {
  select: {
    label: 'SELECT · Все темы',
    sql: 'SELECT id, title, platform, done\nFROM practice_topics\nORDER BY id;',
    description: 'SELECT выбирает столбцы, а ORDER BY задаёт порядок строк в результате.',
  },
  where: {
    label: 'WHERE · По платформе',
    sql: 'SELECT id, title, platform, done\nFROM practice_topics\nWHERE platform = ?\nORDER BY id;',
    description: 'WHERE отбирает строки по условию. Платформа передаётся отдельно как параметр вместо знака вопроса.',
  },
  group: {
    label: 'GROUP BY · Количество тем',
    sql: 'SELECT platform, COUNT(*) AS total\nFROM practice_topics\nGROUP BY platform\nORDER BY platform;',
    description: 'GROUP BY собирает строки с одинаковой платформой, а COUNT(*) считает строки в каждой группе.',
  },
};
