import fs from 'fs/promises'
import path from 'path'

// Скрипт для замены URL изображений в экспортированных кейсах на локальные пути
async function fixImageUrls() {
  const exportDir = path.join(process.cwd(), 'exported-cases')
  
  console.log('🔍 Ищем markdown файлы с кейсами...')
  
  // Получаем список всех markdown файлов (кроме INDEX.md)
  const files = await fs.readdir(exportDir)
  const markdownFiles = files.filter(f => f.endsWith('.md') && f !== 'INDEX.md')
  
  console.log(`📄 Найдено файлов: ${markdownFiles.length}\n`)
  
  let totalReplacements = 0
  
  for (const fileName of markdownFiles) {
    const filePath = path.join(exportDir, fileName)
    let content = await fs.readFile(filePath, 'utf-8')
    let replacements = 0
    
    // Заменяем все ссылки вида /api/media/file/filename.png на /media/filename.png
    const regex = /!\[([^\]]*)\]\(\/api\/media\/file\/([^)]+)\)/g
    
    const newContent = content.replace(regex, (match, alt, filename) => {
      replacements++
      return `![${alt}](/media/${filename})`
    })
    
    if (replacements > 0) {
      await fs.writeFile(filePath, newContent, 'utf-8')
      console.log(`✅ ${fileName}: заменено ${replacements} ссылок`)
      totalReplacements += replacements
    } else {
      console.log(`⏭️  ${fileName}: замен не требуется`)
    }
  }
  
  console.log(`\n🎉 Готово! Всего заменено ссылок: ${totalReplacements}`)
}

fixImageUrls().catch((error) => {
  console.error('❌ Ошибка:', error)
  process.exit(1)
})
