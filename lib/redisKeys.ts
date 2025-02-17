export const redisKeys = {
  sitePosts(siteId: string) {
    return `site-posts:${siteId}`
  },

  sitePages(siteId: string) {
    return `site-pages:${siteId}`
  },

  post(postId: string) {
    return `post:${postId}`
  },

  publishedPosts() {
    return `publishedPosts`
  },

  site(siteId: string) {
    return `site:${siteId}`
  },

  spaceLogo(address: string) {
    return `space:logo:${address}`
  },

  mySites(uid: string) {
    return `sites:${uid}`
  },
}
