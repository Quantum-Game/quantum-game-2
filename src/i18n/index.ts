/* eslint-disable @typescript-eslint/no-var-requires */

import VueI18n, { LocaleMessageObject } from 'vue-i18n'

// Load all locales and remember context for hot reloading
function loadMessages() {
  const context = require.context('./locales', true, /[a-z0-9-_]+\.ts$/i)
  const messages = context.keys().reduce((messages, key) => {
    const locale = key.match(/[a-z0-9-_]+/i)?.[0]
    if (locale != null) {
      messages[locale] = context(key).default
    }
    return messages
  }, {} as Record<string, LocaleMessageObject>)

  return { context, messages }
}

const { context, messages } = loadMessages()

function getBrowserLocale() {
  const langs = navigator.languages != null ? navigator.languages : [navigator.language]
  const countryCodes = langs.map((lang) => lang.trim().split(/-|_/)[0])
  const available = Object.keys(messages)
  return countryCodes.find((c) => available.includes(c)) || 'en'
}

export const i18n: VueI18n = new VueI18n({
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  messages,
})

// in-place localization hot reloading
if (module.hot) {
  module.hot.accept(context.id, () => {
    const { messages: newMessages } = loadMessages()

    Object.keys(newMessages)
      .filter((locale) => messages[locale] !== newMessages[locale])
      .forEach((locale) => {
        messages[locale] = newMessages[locale]
        i18n.setLocaleMessage(locale, messages[locale])
      })
  })
}
