import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'

type SidebarLayoutProps = {
  sidebarPosition: 'left' | 'right'
  sidebarWidth: '1/4' | '1/3'
  mainContent: any[]
  sidebarContent: any[]
}

export const SidebarLayoutComponent: React.FC<SidebarLayoutProps> = (props) => {
  const { sidebarPosition, sidebarWidth, mainContent, sidebarContent } = props

  const sidebarGridCol = sidebarWidth === '1/4' ? 'lg:col-span-3' : 'lg:col-span-4'
  const mainGridCol = sidebarWidth === '1/4' ? 'lg:col-span-9' : 'lg:col-span-8'

  const Sidebar = (
    <div className={`w-full ${sidebarGridCol}`}>
      <div className="sticky top-24 flex flex-col gap-8">
        <RenderBlocks blocks={sidebarContent} />
      </div>
    </div>
  )

  const Main = (
    <div className={`w-full ${mainGridCol}`}>
      <div className="flex flex-col gap-8">
        <RenderBlocks blocks={mainContent} />
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {sidebarPosition === 'left' ? (
          <>
            {Sidebar}
            {Main}
          </>
        ) : (
          <>
            {Main}
            {Sidebar}
          </>
        )}
      </div>
    </div>
  )
}
