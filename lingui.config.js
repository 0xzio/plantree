/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'ja', 'ko', 'fr', 'ru', 'zh-CN', 'pseudo'],
  pseudoLocale: 'pseudo',
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: 'locales/{locale}',
      include: [
        'app/',
        'components/',
        'domains/',
        'hooks/',
        'lib/',
        'themes/',
        'store/',
      ],
    },
  ],
}
