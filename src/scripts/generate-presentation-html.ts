import fs from 'fs/promises'
import path from 'path'

// Интерфейсы для типизации данных
interface HomepageData {
  title: string
  slug: string
  publishedAt: string
  blocks: any[]
}

interface CaseForPresentation {
  slug: string
  title: string
  challenge: string
  solution: string
  results: string
  technologies?: string
  images: string[]
}

interface AdditionalCaseSection {
  title: string
  body: string
  clients?: string[]
  listItems?: string[]
}

// Функция для чтения данных главной страницы
async function readHomepageData(): Promise<HomepageData> {
  const jsonPath = path.join(process.cwd(), 'exported-homepage', 'homepage-data.json')
  const content = await fs.readFile(jsonPath, 'utf-8')
  return JSON.parse(content)
}

// Функция для чтения подготовленных кейсов
async function readCases(): Promise<CaseForPresentation[]> {
  const jsonPath = path.join(process.cwd(), 'exported-cases', 'cases-for-presentation.json')
  
  try {
    const content = await fs.readFile(jsonPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('❌ Файл cases-for-presentation.json не найден!')
    console.error('Запустите сначала: pnpm prepare:cases')
    throw error
  }
}

// Функция для чтения SVG логотипа
async function readLogo(): Promise<string> {
  const logoPath = path.join(process.cwd(), 'public', 'logo.svg')
  return await fs.readFile(logoPath, 'utf-8')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function readAdditionalCasesMarkdown(): Promise<string | null> {
  const mdPath = path.join(process.cwd(), 'exported-cases', 'additional-cases.md')
  try {
    return await fs.readFile(mdPath, 'utf-8')
  } catch {
    return null
  }
}

function parseAdditionalCasesMarkdown(markdown: string): AdditionalCaseSection[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')

  const sections: AdditionalCaseSection[] = []
  let current: { title: string; lines: string[] } | null = null

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+(.*)\s*$/)
    if (headingMatch) {
      if (current) sections.push(materializeAdditionalSection(current.title, current.lines))
      current = { title: headingMatch[1].trim(), lines: [] }
      continue
    }

    if (!current) continue
    current.lines.push(line)
  }

  if (current) sections.push(materializeAdditionalSection(current.title, current.lines))

  return sections.filter(s => s.title && (s.body || (s.listItems && s.listItems.length > 0)))
}

function materializeAdditionalSection(title: string, rawLines: string[]): AdditionalCaseSection {
  const section: AdditionalCaseSection = { title, body: '' }

  const nonEmptyLines = rawLines.map(l => l.trimEnd())
  const contentLines: string[] = []
  const listItems: string[] = []

  for (const line of nonEmptyLines) {
    const trimmed = line.trim()
    if (!trimmed) {
      contentLines.push('')
      continue
    }

    const clientsMatch = trimmed.match(/^Клиенты?:\s*(.*)$/i)
    if (clientsMatch) {
      const raw = clientsMatch[1] || ''
      section.clients = raw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      continue
    }

    const listMatch = trimmed.match(/^\d+\.\s+(.*)$/)
    if (listMatch) {
      listItems.push(listMatch[1].trim())
      continue
    }

    contentLines.push(trimmed)
  }

  if (listItems.length > 0) section.listItems = listItems

  let body = contentLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  body = body.replace(/^Суть\s*задачи\s*[:—-]\s*/i, '')

  section.body = body
  return section
}

// Генерация HTML презентации
async function generatePresentation() {
  console.log('📊 Начинаем генерацию HTML презентации...')
  
  // Читаем данные
  const homepage = await readHomepageData()
  const cases = await readCases()
  const logoSvg = await readLogo()
  const additionalCasesMarkdown = await readAdditionalCasesMarkdown()
  const additionalSections = additionalCasesMarkdown ? parseAdditionalCasesMarkdown(additionalCasesMarkdown) : []
  
  console.log(`✓ Загружено ${cases.length} кейсов`)
  if (additionalSections.length > 0) {
    console.log(`✓ Загружено ${additionalSections.length} дополнительных секций`)
  }
  
  // Находим нужные блоки на главной странице
  const heroBlock = homepage.blocks.find(b => b.blockType === 'heroHome')
  const audienceBlock = homepage.blocks.find(b => b.blockType === 'targetAudience')
  const solutionBlock = homepage.blocks.find(b => b.blockType === 'solutionApproach')
  
  // Получаем абсолютные пути к изображениям
  const publicDir = path.join(process.cwd(), 'public')
  const getImagePath = (imgPath: string) => {
    const cleanPath = imgPath.replace(/^\/media\//, '')
    return `file://${path.join(publicDir, 'media', cleanPath)}`
  }
  
  // Путь к изображению нейросети
  const neuronetImagePath = `file://${path.join(process.cwd(), 'exported-homepage', 'neuronet.png')}`
  
  // Генерируем HTML
  const additionalSlidesHtml = additionalSections
    .map(section => {
      if (section.listItems && section.listItems.length > 0) {
        return `
    <div class="slide">
      <div class="case-badge">Кейсы</div>
      <h2>${escapeHtml(section.title)}</h2>
      <div class="content" style="margin-top: 10px;">
        ${section.body ? `<p class="subtitle" style="max-width: 1200px; white-space: pre-line;">${escapeHtml(section.body)}</p>` : ''}
        <div class="content" style="margin-top: 20px; gap: 10px;">
          ${section.listItems
            .map((item, index) => `
            <div class="list-item" style="margin-bottom: 8px;">
              <div class="list-number">${index + 1}</div>
              <div class="list-content">
                <p style="font-size: 18px; line-height: 1.5; color: hsl(215.4 16.3% 46.9%);">${escapeHtml(item)}</p>
              </div>
            </div>
          `)
            .join('')}
        </div>
      </div>
    </div>`
      }

      const clientsHtml = section.clients && section.clients.length > 0
        ? `
        <div class="case-tags" style="margin-top: 18px;">
          ${section.clients.map(c => `<span class="case-tag">${escapeHtml(c)}</span>`).join('')}
        </div>`
        : ''

      return `
    <div class="slide">
      <div class="case-badge">Кейсы</div>
      <h2>${escapeHtml(section.title)}</h2>
      <div class="content">
        <p class="case-text" style="white-space: pre-line;">${escapeHtml(section.body || '')}</p>
        ${clientsHtml ? `<div style="margin-top: 22px;"><h3>Клиенты</h3>${clientsHtml}</div>` : ''}
      </div>
    </div>`
    })
    .join('')

  const html = `<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panfilov Consulting - Презентация</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: hsl(0 0% 100%);
      color: hsl(222.2 84% 4.9%);
    }
    
    .slide {
      width: 297mm;
      height: 210mm;
      padding: 50px 70px;
      page-break-after: always;
      page-break-inside: avoid;
      background: hsl(0 0% 100%);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .slide:last-child {
      page-break-after: auto;
    }
    
    /* Титульный слайд */
    .slide.title {
      justify-content: space-between;
      background: hsl(0 0% 100%);
      position: relative;
    }
    
    .title-image {
      position: absolute;
      bottom: 30px;
      right: 50px;
      width: 420px;
      height: 420px;
      pointer-events: none;
    }
    
    .title-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .logo {
      width: 380px;
      margin-bottom: 35px;
    }
    
    .logo svg {
      width: 100%;
      height: auto;
    }
    
    h1 {
      font-size: 52px;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 22px;
      color: hsl(222.2 84% 4.9%);
    }
    
    .subtitle {
      font-size: 26px;
      color: hsl(215.4 16.3% 46.9%);
      line-height: 1.4;
      max-width: 900px;
    }
    
    .contact {
      font-size: 22px;
      color: hsl(215.4 16.3% 46.9%);
      margin-top: 35px;
    }
    
    .contact a {
      color: hsl(222.2 84% 4.9%);
      text-decoration: none;
      border-bottom: 1px solid hsl(240 6% 80%);
      transition: border-color 0.3s;
    }
    
    /* Обычные слайды */
    h2 {
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 28px;
      color: hsl(222.2 84% 4.9%);
    }
    
    h3 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 20px;
      color: hsl(215.4 16.3% 46.9%);
    }
    
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .grid {
      display: grid;
      gap: 20px;
    }
    
    .grid-2 {
      grid-template-columns: 1fr 1fr;
    }
    
    .card {
      background: hsl(240 5% 96%);
      border: 1px solid hsl(240 6% 80%);
      border-radius: 8px;
      padding: 28px;
    }
    
    .card h3 {
      font-size: 24px;
      margin-bottom: 14px;
      color: hsl(222.2 84% 4.9%);
    }
    
    .card p {
      font-size: 17px;
      line-height: 1.6;
      color: hsl(215.4 16.3% 46.9%);
    }
    
    .card-small {
      padding: 22px;
    }
    
    .card-small h3 {
      font-size: 21px;
    }
    
    .card-small p {
      font-size: 16px;
    }
    
    /* Слайды с кейсами */
    .case-badge {
      display: inline-block;
      background: hsl(222.2 47.4% 11.2%);
      color: hsl(0 0% 100%);
      font-size: 14px;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .case-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .case-link {
      font-size: 14px;
      color: hsl(222.2 84% 4.9%);
      text-decoration: none;
      border-bottom: 1px solid hsl(240 6% 80%);
      transition: border-color 0.3s;
    }
    
    .case-link:hover {
      border-bottom-color: hsl(222.2 84% 4.9%);
    }
    
    .case-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .case-tag {
      font-size: 12px;
      color: hsl(215.4 16.3% 46.9%);
      background: hsl(240 5% 96%);
      border: 1px solid hsl(240 6% 80%);
      padding: 4px 10px;
      border-radius: 12px;
    }
    
    .case-text {
      font-size: 16px;
      line-height: 1.6;
      color: hsl(215.4 16.3% 46.9%);
    }
    
    .case-section {
      margin-bottom: 24px;
    }
    
    .case-section h3 {
      font-size: 24px;
      margin-bottom: 12px;
      color: hsl(222.2 84% 4.9%);
    }
    
    .case-section p {
      font-size: 16px;
      line-height: 1.5;
      white-space: pre-line;
    }
    
    .case-images-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .case-images {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      max-height: 100%;
      width: 100%;
    }
    
    .case-images.single {
      grid-template-columns: 1fr;
      max-height: 600px;
    }
    
    .case-image {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .case-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .list-item {
      display: flex;
      gap: 14px;
      margin-bottom: 16px;
    }
    
    .list-number {
      font-size: 28px;
      font-weight: 700;
      color: hsl(215.4 16.3% 46.9%);
      min-width: 42px;
    }
    
    .list-content h4 {
      font-size: 21px;
      font-weight: 600;
      margin-bottom: 7px;
      color: hsl(222.2 84% 4.9%);
    }
    
    .list-content p {
      font-size: 17px;
      line-height: 1.5;
      color: hsl(215.4 16.3% 46.9%);
    }
    
    /* Печать */
    @media print {
      body {
        background: hsl(0 0% 100%);
      }
      
      .slide {
        page-break-after: always;
        page-break-inside: avoid;
      }
      
      @page {
        size: A4 landscape;
        margin: 0;
      }
    }
  </style>
</head>
<body>

  <!-- Слайд 1: Титульный -->
  <div class="slide title">
    <div>
      <div class="logo">${logoSvg}</div>
      <h1>${heroBlock?.heading || 'Panfilov Consulting'}</h1>
      <p class="subtitle">${heroBlock?.subheading || ''}</p>
    </div>
    <div class="contact">
      Контакты: <a href="https://panfilov.consulting">panfilov.consulting</a> • <a href="mailto:contact@panfilov.consulting">contact@panfilov.consulting</a>
    </div>
    <div class="title-image">
      <img src="${neuronetImagePath}" alt="Neural Network" />
    </div>
  </div>

  <!-- Слайд 2: Целевая аудитория -->
  <div class="slide">
    <h2>${audienceBlock?.heading || 'Для кого наши решения'}</h2>
    <div class="content">
      <div class="grid grid-2">
        ${audienceBlock?.audiences?.slice(0, 4).map((audience: any) => `
          <div class="card card-small">
            <h3>${audience.title}</h3>
            <p>${audience.description}</p>
          </div>
        `).join('') || ''}
      </div>
    </div>
  </div>

  <!-- Слайды с кейсами -->
  ${cases.map(caseItem => `
    <!-- Слайд: ${caseItem.title} - Описание -->
    <div class="slide">
      <div class="case-badge">Кейс</div>
      <h2>${caseItem.title}</h2>
      <div class="case-meta">
        <a href="https://panfilov.consulting/cases/${caseItem.slug}" class="case-link" target="_blank">panfilov.consulting/cases/${caseItem.slug}</a>
        ${caseItem.technologies ? `
        <div class="case-tags">
          ${caseItem.technologies.split(',').map((tech: string) => `<span class="case-tag">${tech.trim()}</span>`).join('')}
        </div>
        ` : ''}
      </div>
      <div class="content case-text">
        ${caseItem.challenge ? `
          <div class="case-section">
            <h3>Задача</h3>
            <p>${caseItem.challenge}</p>
          </div>
        ` : ''}
        ${caseItem.solution ? `
          <div class="case-section">
            <h3>Решение</h3>
            <p>${caseItem.solution}</p>
          </div>
        ` : ''}
        ${caseItem.results ? `
          <div class="case-section">
            <h3>Результаты</h3>
            <p>${caseItem.results}</p>
          </div>
        ` : ''}
      </div>
    </div>

    ${caseItem.images && caseItem.images.length >= 1 ? `
      <!-- Слайд: ${caseItem.title} - Скриншоты -->
      <div class="slide">
        <div class="case-badge">Кейс</div>
        <h2>${caseItem.title}</h2>
        <div class="case-images-container">
          <div class="case-images ${caseItem.images.length === 1 ? 'single' : ''}">
            <div class="case-image">
              <img src="${getImagePath(caseItem.images[0])}" alt="Скриншот 1" />
            </div>
            ${caseItem.images.length >= 2 ? `
            <div class="case-image">
              <img src="${getImagePath(caseItem.images[1])}" alt="Скриншот 2" />
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    ` : ''}
  `).join('')}

  ${additionalSlidesHtml}

  <!-- Слайд: Услуги -->
  <div class="slide">
    <h2>${solutionBlock?.heading || 'Наш подход'}</h2>
    <p class="subtitle">${solutionBlock?.subheading || ''}</p>
    <div class="content" style="margin-top: 35px;">
      ${solutionBlock?.steps?.map((step: any, index: number) => `
        <div class="list-item">
          <div class="list-number">${index + 1}</div>
          <div class="list-content">
            <h4>${step.title}</h4>
            <p>${step.description}</p>
          </div>
        </div>
      `).join('') || ''}
    </div>
  </div>

  <!-- Слайд: Итоговый -->
  <div class="slide title">
    <div>
      <div class="logo">${logoSvg}</div>
      <h1>Готовы обсудить ваш проект?</h1>
      <p class="subtitle">Свяжитесь с нами для бесплатной консультации</p>
    </div>
    <div class="contact">
      <a href="https://panfilov.consulting">panfilov.consulting</a> • <a href="mailto:contact@panfilov.consulting">contact@panfilov.consulting</a>
    </div>
    <div class="title-image">
      <img src="${neuronetImagePath}" alt="Neural Network" />
    </div>
  </div>

</body>
</html>`
  
  // Сохраняем HTML файл
  const outputPath = path.join(process.cwd(), 'presentation.html')
  await fs.writeFile(outputPath, html, 'utf-8')
  
  console.log(`\n✅ HTML презентация сгенерирована: ${outputPath}`)
  console.log(`\n📝 Инструкция:`)
  console.log(`1. Откройте файл presentation.html в браузере`)
  console.log(`2. Нажмите Cmd+P (или Ctrl+P на Windows)`)
  console.log(`3. Выберите "Сохранить как PDF"`)
  console.log(`4. В настройках выберите:`)
  console.log(`   - Ориентация: Альбомная (Landscape)`)
  console.log(`   - Размер: A4`)
  console.log(`   - Поля: Без полей`)
  console.log(`   - Фон: Включить фоновую графику`)
  console.log(`\n🎉 Готово!`)
}

// Запуск
generatePresentation().catch((error) => {
  console.error('❌ Ошибка при генерации:', error)
  process.exit(1)
})
