import {
  DefaultNodeTypes,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import { cn } from '@/utilities/ui'
import { ContentLayoutComponent } from '@/blocks/ContentLayout/Component'
import { ImageBlockComponent } from '@/blocks/ImageBlock/Component'

type NodeTypes = DefaultNodeTypes

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  text: ({ node, nodesToJSX }) => {
    const textNode = typeof defaultConverters.text === 'function' ? defaultConverters.text({ node, nodesToJSX } as any) : node.text
    if (node.style) {
      const styleObj: React.CSSProperties = {}
      node.style.split(';').forEach((styleStr: string) => {
        if (!styleStr.trim()) return
        const [key, ...valueParts] = styleStr.split(':')
        const value = valueParts.join(':').trim()
        if (key && value) {
          const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          styleObj[camelKey as keyof React.CSSProperties] = value as any
        }
      })
      if (Object.keys(styleObj).length > 0) {
        return <span style={styleObj}>{textNode}</span>
      }
    }
    return textNode
  },
  blocks: {
    contentLayout: ({ node }: { node: any }) => <ContentLayoutComponent {...(node.fields as any)} />,
    imageBlock: ({ node }: { node: any }) => <ImageBlockComponent {...(node.fields as any)} />,
  },
})

type Props = {
  data: any
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
