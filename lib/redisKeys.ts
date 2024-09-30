export const redisKeys = {
  space(id: string) {
    return `space:${id}`
  },

  mySpaces(address: string) {
    return `spaces:${address}`
  },
}
