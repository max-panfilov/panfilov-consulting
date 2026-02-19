import type { Metadata } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'AI-агенты для бизнеса: OpenClaw и вайб-кодинг — саммари вебинара',
  description:
    'Саммари вебинара бизнес-клуба Атланты с Максимом Панфиловым и Сэмом Якушевым. OpenClaw, живые демо, Q&A.',
}

export default function WebinarPage() {
  return (
    <article className="pt-16 pb-24">
      <div className="container max-w-[860px] mx-auto px-4">
        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Саммари вебинара «AI-агенты для бизнеса: OpenClaw и вайб-кодинг»
          </h1>
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <Badge variant="secondary">19 февраля 2026</Badge>
            <Badge variant="outline">Онлайн</Badge>
            <Badge variant="outline">Бизнес-клуб «Атланты»</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Спикеры: Максим Панфилов, Сэм Якушев
          </p>
        </header>

        {/* TODO: video will go here */}

        {/* О вебинаре */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-foreground">О чём был вебинар</h2>
          <div className="space-y-4 text-foreground">
            <p>
              Максим Панфилов (panfilov.digital, panfilov.consulting) и Сэм Якушев
              (AIMintegrations.ru) рассказали о том, что сейчас происходит с AI-агентами для
              бизнеса: от теории к живым демо прямо во время эфира.
            </p>
            <p>
              Главный герой — <strong>OpenClaw</strong> (ex-ClawdBot), open-source агент, который
              OpenAI купил в начале этой недели. Разобрали, как он устроен, как его поставить и
              что с ним реально можно делать уже сегодня.
            </p>
          </div>
        </section>

        {/* Ключевые тезисы */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Ключевые тезисы</h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left">
                <h3 className="font-semibold text-foreground">
                  Вайб-кодинг умер. Здравствуй, агентная разработка
                </h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Андрей Карпатый (Tesla, xAI) год назад придумал термин «вайб-кодинг» — пишешь
                  в чат, оно собирается, кайфуешь. Сейчас он же объявил: эпоха вайб-кодинга
                  закончилась, пришла эпоха <strong>agentic engineering</strong> — системной
                  разработки с контролем архитектуры.
                </p>
                <p className="mt-2">
                  В вайб-кодинге ты не знаешь, что у тебя под капотом и насколько это
                  безопасно. В агентной разработке — контролируешь архитектуру, качество и то,
                  как создаётся продукт.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left">
                <h3 className="font-semibold text-foreground">Что такое OpenClaw</h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  OpenClaw — не гиперинновация. Это набор скриптов на TypeScript, который:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Устанавливается на ваш компьютер или облачный сервер</li>
                  <li>
                    Подключается к любой нейросети по вашим ключам (Claude, GPT, OpenRouter,
                    китайские)
                  </li>
                  <li>Живёт в привычном чате (Telegram, Discord, WhatsApp)</li>
                  <li>Имеет память, скиллы и интеграции с внешними сервисами</li>
                </ul>
                <p className="mt-2">
                  Инновация не в технологии — инновация в{' '}
                  <strong>интерфейсе и простоте</strong>. Из коробки базовые интеграции (почта,
                  Google Docs, Sheets, Drive), и его могут настраивать нетехнические люди.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left">
                <h3 className="font-semibold text-foreground">
                  Как устроена «личность» и «память»
                </h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Вся настройка агента — это обычные текстовые файлы:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">SOUL.md</code> —
                    принципы и характер агента
                  </li>
                  <li>
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">IDENTITY.md</code> —
                    имя, роль, как себя вести
                  </li>
                  <li>
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">memory/</code> —
                    история диалогов и контекст по проектам
                  </li>
                  <li>
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">skills/</code> —
                    «должностные инструкции» для конкретных задач (скиллы)
                  </li>
                </ul>
                <p className="mt-2">
                  Скилл — это ровно то же самое, что регламент сотрудника. И точно так же, как
                  с сотрудником, агента можно в процессе работы дообучать: «вот так нельзя, вот
                  так правильно» — он сам дописывает свои инструкции.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left">
                <h3 className="font-semibold text-foreground">
                  Что он умеет делать (из живых демо вебинара)
                </h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium text-foreground">Данные компании:</p>
                  <p>
                    «Посмотри, кто чем занимался на прошлой неделе» — агент подключается к
                    task-трекеру через API, выгружает задачи, показывает выработку по
                    сотрудникам, время по проектам.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Интеграция с нуля за 5 минут:</p>
                  <p>
                    Прямо на вебинаре — голосовым запросом — попросили создать скилл с API ЦБ
                    РФ для получения курсов валют. Агент сам нашёл документацию, написал
                    интеграцию, протестировал и сохранил.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Анализ конкурентов → таблица → дашборд:
                  </p>
                  <p>
                    Агент нашёл компании, собрал данные, создал Google таблицу. Следом
                    сгенерировал HTML-дашборд с фильтрами и интерактивной картой конкурентов.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">КП из записи звонка:</p>
                  <p>
                    Запись звонка из Fathom → КП со списком пилотов за полторы минуты. Раньше —
                    4 часа.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Задачи по расписанию:</p>
                  <p>
                    Следит за Telegram-каналом (подписчики, лайки, охваты) и раз в неделю
                    присылает отчёт: какой пост был самый популярный и что с этим делать.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left">
                <h3 className="font-semibold text-foreground">Про стоимость</h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Запустить OpenClaw можно на сервере TimeWeb Cloud в Германии за ~2120
                  руб/месяц — OpenClaw доступен там из коробки. Нейросеть (Claude) — от
                  $20/мес.
                </p>
                <p className="mt-2">
                  Максим: «200 долларов в месяц. Это 15 000 рублей. Сотрудника за такие деньги
                  не наймёшь».
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left">
                <h3 className="font-semibold text-foreground">
                  2026 — год агентов. SaaS умирает
                </h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <blockquote className="border-l-2 border-border pl-4 italic">
                  Сейчас мы видим зарождение того, что будет везде. Все привычные интерфейсы,
                  за которые мы платили, будут постепенно уходить. Вместо них — единое чатовое
                  окно, которое генерирует нужный интерфейс, аналитику, дашборд на лету по
                  вашему запросу.
                </blockquote>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left">
                <h3 className="font-semibold text-foreground">
                  Новый ключевой навык — постановка задач
                </h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Самый важный навык эпохи агентов — не технический. Это умение формулировать
                  задачи, декомпозировать их и прояснять требования.
                </p>
                <blockquote className="border-l-2 border-border pl-4 italic mt-2">
                  ИИ показал нам не только то, что некоторые из нас — плохие сотрудники. Но и
                  то, что многие — плохие руководители, потому что не умеют нормально поставить
                  задачу.
                </blockquote>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Q&A Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Вопросы и ответы</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Column 1: Вопросы озвученные на вебинаре */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Вопросы, которые задали на вебинаре
              </h3>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">
                  В России Claude Code недоступен. Как установить OpenClaw?
                </p>
                <p className="text-muted-foreground text-sm">
                  OpenClaw — open-source, устанавливается свободно куда угодно. Самый простой
                  путь для России: сервер TimeWeb Cloud в Германии (от 2120 руб/мес) — OpenClaw
                  из коробки. Нейронки через OpenRouter.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">
                  Можно использовать токены по подписке Claude, а не по API?
                </p>
                <p className="text-muted-foreground text-sm">
                  Технически да. Самый бюджетный вариант: подписка Claude Code от $20/мес. Более
                  надёжный путь — API через OpenRouter.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">Почему Discord, а не Telegram?</p>
                <p className="text-muted-foreground text-sm">
                  Личное предпочтение Максима — удобно иметь отдельный чат только с агентом. Для
                  большинства телеграм — самый простой вариант. OpenClaw поддерживает оба.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">Можно подключить Bitrix24 или 1С?</p>
                <p className="text-muted-foreground text-sm">
                  Да. Скиньте агенту ссылку на документацию и скажите «хочу работать с этим
                  сервисом» — он сам изучит и реализует интеграцию.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">Как OpenClaw самообучается?</p>
                <p className="text-muted-foreground text-sm">
                  Он может записывать новые инструкции в свои файлы-скиллы. Это не дообучение
                  нейросети — просто дополнение текстовых файлов. Всё хранится на сервере. Можно
                  подключить к GitHub для версионирования.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">
                  Несколько людей + агент — есть рабочие сценарии?
                </p>
                <p className="text-muted-foreground text-sm">
                  Да. Агент подключается в групповой чат (Telegram-группу, Discord-сервер).
                  Разные люди могут ему писать — он отвечает всем. Подробнее — на следующей
                  встрече.
                </p>
              </div>
            </div>

            {/* Column 2: Вопросы из чата */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Вопросы из чата, которые не успели озвучить
              </h3>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">
                  Что делать, когда у агента кончается контекст?
                </p>
                <ol className="text-muted-foreground text-sm list-decimal pl-5 space-y-1">
                  <li>
                    Команда <code className="bg-muted px-1 py-0.5 rounded">/new</code> — сброс
                    контекста (агент всё равно читает файлы памяти)
                  </li>
                  <li>
                    Правильная организация памяти: важное хранится в файлах, не только в истории
                    диалога
                  </li>
                  <li>Агент сам может сделать резюме диалога и записать в файл</li>
                  <li>Платный тариф с большим контекстным окном</li>
                </ol>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">
                  Можно ли проверить вайб-кодовое приложение перед продакшном?
                </p>
                <p className="text-muted-foreground text-sm">
                  Да. Claude Code / Cursor проводит аудит кода: уязвимости, архитектура,
                  масштабируемость. Для коммерческого продукта нужен человек-архитектор, который
                  подтвердит выводы. Максим и его студия оказывают такие услуги.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">
                  Cursor vs OpenClaw — когда что использовать?
                </p>
                <p className="text-muted-foreground text-sm">
                  Cursor/Windsurf — AI-редакторы кода, для разработки. OpenClaw — агент в чате:
                  аналитика, отчёты, таблицы, напоминания, сервисы. Внутри OpenClaw может
                  запускаться Claude Code.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-2">
                <p className="font-medium text-foreground">
                  Стоит ли подождать месяц, пока нейронки всё сделают сами?
                </p>
                <p className="text-muted-foreground text-sm">
                  Нет. Те, кто начинают сейчас, получают навык постановки задач агентам и опыт
                  работы с ними. Когда инструменты станут мощнее — они используют их в разы
                  эффективнее.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Инструменты */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Инструменты</h2>
          <div className="border rounded-lg overflow-hidden bg-card">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Инструмент</th>
                  <th className="text-left p-4 font-semibold text-foreground">Для чего</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4">
                    <a
                      href="https://openclaw.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline font-medium"
                    >
                      OpenClaw
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    Персональный AI-агент в Telegram/Discord — память, файлы, задачи, интеграции
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <a
                      href="https://timeweb.cloud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline font-medium"
                    >
                      TimeWeb Cloud
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    Хостинг для OpenClaw. Сервер в Германии от 2120 руб/мес, OpenClaw из коробки
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <a
                      href="https://openrouter.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline font-medium"
                    >
                      OpenRouter
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    Агрегатор доступа к любым LLM — один ключ для всех моделей
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <span className="text-foreground font-medium">Claude / Anthropic</span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    Самая мощная LLM для агентных задач
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <span className="text-foreground font-medium">Cursor / Windsurf</span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    AI-редакторы кода — работают со всем проектом целиком
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <a
                      href="https://fathom.video"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline font-medium"
                    >
                      Fathom
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    Запись и транскрипция звонков. Автоматически отдаёт резюме в агента
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <a
                      href="https://n8n.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline font-medium"
                    >
                      n8n
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    Автоматизации, боты, цепочки AI-обработки данных
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <a
                      href="https://gamma.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:underline font-medium"
                    >
                      Gamma
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    Презентации из структурированного контента через API
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <span className="text-foreground font-medium">Context7</span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    База актуальных документаций по технологиям — встраивается в агента
                  </td>
                </tr>
                <tr>
                  <td className="p-4">
                    <span className="text-foreground font-medium">Replit / Lovable</span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    Прототипы и MVP прямо в браузере без кода
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Цитаты из чата */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Из чата вебинара</h2>
          <div className="space-y-4">
            <blockquote className="border-l-4 border-border pl-4 py-2 bg-card rounded-r-lg">
              <p className="text-muted-foreground italic mb-2">
                «Да вы ахренели. Я только n8n освоил и ночами не спал. Чувствую что такая штука
                нужна. Давайте практическое занятие!»
              </p>
              <cite className="text-sm text-muted-foreground not-italic">— Ruslan Gatin</cite>
            </blockquote>

            <blockquote className="border-l-4 border-border pl-4 py-2 bg-card rounded-r-lg">
              <p className="text-muted-foreground italic mb-2">
                «Давайте отдельную встречу. Где мы какой-нибудь процесс сделаем и поженим всё в
                Discord — что-то практическое, что мы сделаем у себя.»
              </p>
              <cite className="text-sm text-muted-foreground not-italic">
                — Вячеслав Ширматов
              </cite>
            </blockquote>

            <blockquote className="border-l-4 border-border pl-4 py-2 bg-card rounded-r-lg">
              <p className="text-muted-foreground italic mb-2">
                «Если каждая нейронка так будет уметь — может не надо сейчас учиться, а подождать
                месяц? =)))»
              </p>
              <cite className="text-sm text-muted-foreground not-italic">— Ruslan Gatin</cite>
            </blockquote>

            <blockquote className="border-l-4 border-border pl-4 py-2 bg-card rounded-r-lg">
              <p className="text-muted-foreground italic mb-2">
                «Имитация компетентности. В сравнении с ИИ теперь сильнее это видно в некоторых
                сотрудниках и руководителях.»
              </p>
              <cite className="text-sm text-muted-foreground not-italic">
                — Andrey Kolesnikov
              </cite>
            </blockquote>
          </div>
        </section>

        {/* Главная мысль */}
        <section className="mb-12 bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">Главная мысль</h2>
          <blockquote className="text-muted-foreground italic text-lg leading-relaxed">
            В будущее возьмут не всех. Но те, кто сейчас приходят на подобные встречи —
            совершенно точно возьмут с большей вероятностью. Разговоры о том, что «это не
            работает» и «ещё рано» — уже в пользу бедных. 2026 — это год агентов. Правильный
            вопрос сейчас не «нужно ли», а «с чего начать».
          </blockquote>
        </section>

        {/* Следующие шаги */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Следующие шаги</h2>
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Хакатон в Доме Атлантов — офлайн, для нетехнарей:
              </h3>
              <p className="text-muted-foreground">
                Регаем сервер, разворачиваем OpenClaw, настраиваем интеграции, делаем пару
                скиллов
              </p>
            </div>
            <p className="text-muted-foreground">
              Следите за анонсами в чате <strong>Атланты ИИ</strong>
            </p>
            <div className="border-t pt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Связь с Максимом:{' '}
                <a
                  href="https://t.me/mpanfilov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  @mpanfilov
                </a>{' '}
                ·{' '}
                <a
                  href="https://panfilov.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  panfilov.online
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Сэм Якушев:{' '}
                <a
                  href="https://t.me/SamYakushev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  @SamYakushev
                </a>{' '}
                ·{' '}
                <a
                  href="https://yakushev.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  yakushev.me
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
