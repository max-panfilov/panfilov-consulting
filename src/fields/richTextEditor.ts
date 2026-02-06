import {
  lexicalEditor,
  HeadingFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  ChecklistFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

/**
 * Shared rich text editor config with media block support.
 * Used in Cases collection for challenge, solution, results fields.
 */
export const caseRichTextEditor = lexicalEditor({
  features: () => [
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    InlineCodeFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    ChecklistFeature(),
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
    }),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    BlocksFeature({
      blocks: [
        {
          slug: 'mediaBlock',
          interfaceName: 'MediaBlock',
          fields: [
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Изображение',
            },
            {
              name: 'caption',
              type: 'text',
              label: 'Подпись',
            },
          ],
        },
      ],
    }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})
