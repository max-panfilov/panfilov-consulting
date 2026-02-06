/**
 * Single source of truth for industry options.
 * Used by both the Cases collection config and frontend label resolution.
 */
export const INDUSTRY_OPTIONS: { label: string; value: string }[] = [
  { label: 'Электротехника', value: 'electronics' },
  { label: 'Юридические услуги', value: 'legal' },
  { label: 'Финансы', value: 'finance' },
  { label: 'Ритейл', value: 'retail' },
  { label: 'Логистика', value: 'logistics' },
  { label: 'Промышленность', value: 'industry' },
  { label: 'Медицина', value: 'healthcare' },
  { label: 'Другое', value: 'other' },
]

const INDUSTRY_LABELS: Record<string, string> = Object.fromEntries(
  INDUSTRY_OPTIONS.map(({ value, label }) => [value, label]),
)

export function getIndustryLabel(industry: string): string {
  return INDUSTRY_LABELS[industry] || industry
}
