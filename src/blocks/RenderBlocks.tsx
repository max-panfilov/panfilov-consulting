import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactFormBlock } from '@/blocks/ContactForm/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { ExpertiseHighlightBlock } from '@/blocks/ExpertiseHighlight/Component'
import { FeaturedCasesBlock } from '@/blocks/FeaturedCases/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HeroHomeBlock } from '@/blocks/HeroHome/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SolutionApproachBlock } from '@/blocks/SolutionApproach/Component'
import { TargetAudienceBlock } from '@/blocks/TargetAudience/Component'

const blockComponents = {
  archive: ArchiveBlock,
  contactForm: ContactFormBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  expertiseHighlight: ExpertiseHighlightBlock,
  featuredCases: FeaturedCasesBlock,
  formBlock: FormBlock,
  heroHome: HeroHomeBlock,
  mediaBlock: MediaBlock,
  solutionApproach: SolutionApproachBlock,
  targetAudience: TargetAudienceBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-4 md:my-8" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
