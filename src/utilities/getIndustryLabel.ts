/**
 * Справочник индустрий с русскими названиями
 * Соответствует опциям в коллекции Cases (src/collections/Cases.ts)
 */
export const INDUSTRY_LABELS: Record<string, string> = {
  electronics: 'Электротехника',
  legal: 'Юридические услуги',
  finance: 'Финансы',
  retail: 'Ритейл',
  logistics: 'Логистика',
  industry: 'Промышленность',
  healthcare: 'Медицина',
  other: 'Другое',
  // Дополнительные варианты для совместимости
  metallurgy: 'Металлопрокат',
  manufacturing: 'Производство',
}

/**
 * Получает русское название индустрии по её коду
 * @param industry - Код индустрии из коллекции Cases
 * @returns Русское название индустрии или исходный код, если перевод не найден
 */
export function getIndustryLabel(industry: string): string {
  return INDUSTRY_LABELS[industry] || industry
}
