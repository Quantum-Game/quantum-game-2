/* eslint-disable @typescript-eslint/no-var-requires */

import { createI18n, LocaleMessages } from 'vue-i18n'
import { watch, VNode } from 'vue'
import pluralizationRules from './pluralizationRules'

// Load all locales and remember context for hot reloading
function loadMessages() {
  const context = require.context('./locales', true, /[a-z0-9-_]+\.ts$/i)
  const messages = context.keys().reduce((messages, key) => {
    const locale = key.match(/[a-z0-9-_]+/i)?.[0]
    if (locale != null) {
      messages[locale] = context(key).default
    }
    return messages
  }, {} as LocaleMessages<string | VNode>)

  return { context, messages }
}

const { context, messages } = loadMessages()

const availableLanguages = Object.keys(messages)

function getBrowserLocale() {
  const langs = navigator.languages != null ? navigator.languages : [navigator.language]
  for (const lang of langs) {
    if (availableLanguages.includes(lang)) {
      return lang
    }
    const countryCode = lang.trim().split(/-|_/)[0]
    if (availableLanguages.includes(countryCode)) {
      return countryCode
    }
  }
  return 'en'
}

const LANG_STORAGE_KEY = 'lang'

function getSavedLocale() {
  const lang = localStorage.getItem(LANG_STORAGE_KEY)
  if (lang != null && availableLanguages.includes(lang)) {
    return lang
  }
  return null
}

function saveCurrentLocale() {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, i18n.global.locale.value)
  } catch (_) {
    // localStorage write failed, we can ignore that here
  }
}

export const i18n = createI18n({
  locale: getSavedLocale() || getBrowserLocale(),
  fallbackLocale: 'en',
  pluralizationRules,
  messages,
})

// in vue3, that should just be watch(..)
watch(() => i18n.global.locale, saveCurrentLocale)

// in-place localization hot reloading
if (module.hot) {
  module.hot.accept(context.id, () => {
    const { messages: newMessages } = loadMessages()

    Object.keys(newMessages)
      .filter((locale) => messages[locale] !== newMessages[locale])
      .forEach((locale) => {
        messages[locale] = newMessages[locale]
        i18n.global.setLocaleMessage(locale, messages[locale])
      })
  })
}
