import { editorDefaultValue, ELEMENT_P } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { PostStatus, PostType } from '@prisma/client'

const aboutContent = `[{"children":[{"text":""}],"type":"p","id":"YNzsQ59ze4"},{"type":"p","id":"z3o1Hql3-8","children":[{"text":""}],"width":154},{"children":[{"text":""}],"type":"img","url":"/56e813da9280fdf3b068b9b6e3a35cc95a7211241340d014435ff0f641bf48b8","id":"16HHbLVZYS","mime":"image/jpeg","width":186,"align":"center"},{"children":[{"text":"Zio"}],"type":"h2","id":"JG2FDjWpv_","align":"center"},{"children":[{"text":"A developer, designer, husband and father"}],"type":"p","id":"8Q5qxu3H3P","align":"center","style":""},{"children":[{"text":""}],"type":"social-links","id":"4CEre-OJlB"},{"children":[{"text":""}],"type":"p","id":"gIztV3DUgC"}]`

export async function initPages(siteId: string, userId: string) {
  await prisma.post.createMany({
    data: [
      {
        userId,
        siteId,
        isPage: true,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'About',
        slug: 'about',
        type: PostType.ARTICLE,
        content: aboutContent,
      },
      {
        userId,
        siteId,
        isPage: true,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'Projects',
        slug: 'projects',
        type: PostType.ARTICLE,
        content: `[{"type":"h1","lineHeight":"3.5rem","align":"start","children":[{"text":"My projects"}],"id":"LxtEtBzoOm"},{"children":[{"text":"Some fun stuff I made, hope you like it!"}],"type":"p","id":"25W982NSZb"},{"children":[{"text":"","fontSize":"medium","backgroundColor":"rgb(250, 250, 250)","color":"rgb(39, 39, 42)"}],"type":"p","id":"vfFPtgQu0k"},{"children":[{"text":""}],"type":"projects","id":"DY87LZJE0O"},{"children":[{"text":""}],"type":"p","id":"IrDG67LpWt"}]`,
      },
      {
        userId,
        siteId,
        isPage: true,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'Friends',
        slug: 'friends',
        type: PostType.ARTICLE,
        content: `[{"type":"h1","children":[{"text":"Friends"}],"id":"9s2oAcc8Cf"},{"type":"p","id":"BJOICSFING","children":[{"text":"My friends' blogs are listed here; you're welcome to add yours too! "}]},{"type":"p","id":"D24AlR9Ijf","children":[{"text":""}]},{"children":[{"text":""}],"type":"friends","id":"FhTb0zwXdG"},{"type":"p","id":"LsKvOTcPDw","children":[{"text":""}]}]`,
      },
      {
        userId,
        siteId,
        isPage: true,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'Guestbook',
        slug: 'guestbook',
        type: PostType.ARTICLE,
        content:
          '[{"children":[{"text":"Welcome to my guestbook!"}],"type":"h1","id":"JvZ93TKri0"},{"children":[{"text":"Leave a message with your thoughts, suggestions, ideas, critiques, compliments, encouragement, or just a funny comment."}],"type":"p","id":"jrt2ZtjLwC"},{"type":"p","id":"6S-sMNxMxF","children":[{"text":""}]},{"children":[{"text":""}],"type":"comment-box","id":"e8bz6aUmFh"},{"children":[{"text":""}],"type":"p","id":"PaiLUxQDEg"}]',
      },
      {
        userId,
        siteId,
        isPage: true,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        title: 'AMA',
        slug: 'ama',
        type: PostType.ARTICLE,
        content:
          '[{"children":[{"text":"Ask Me Anything / One-on-One Consulting"}],"type":"h1","id":"asd85Q5mJp"},{"children":[{"text":"I offer one-on-one consulting services. With experience in front-end development, full-stack development, UI/UX design, and entrepreneurship, I can help answer your questions related to these areas."}],"type":"p","id":"1-GWJ52aqx"},{"type":"h2","id":"Bg26KXWSox","children":[{"text":"pricing"}]},{"type":"p","id":"0zA43m74R5","children":[{"text":"$50 / per hour"}]},{"type":"p","id":"qHMVkKeyjb","children":[{"text":""}]},{"children":[{"text":""}],"productId":"","type":"product","id":"PhOBNOltpc"},{"children":[{"text":""}],"type":"p","id":"qV6Vv0fK59"}]',
      },
    ],
  })
}

export async function initAboutPage(siteId: string, userId: string) {
  return await prisma.post.create({
    data: {
      userId,
      siteId,
      isPage: true,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      title: 'About',
      slug: 'about',
      type: PostType.ARTICLE,
      content: aboutContent,
    },
  })
}
