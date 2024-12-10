export const redisKeys = {
  posts() {
    return `posts`
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
    return `spaces:${uid}`
  },
}
