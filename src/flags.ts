import { Plugin } from 'vue'
const params = new URL(window.location.href).searchParams

/**
 * An object with all feature flags. Those are meant as development and design aid.
 * Configure flags as either boolean or string, then use URL params to set their values.
 *
 * Important: supporting too many flags at once can be costly, as there potentially is a lot
 * of code doing the same thing in slightly different ways. It is important to never allow
 * too many flags being defined at once, and to make sure to remove them periodically.
 */
export const $flags = Object.freeze({
  /** display absorption "progress" as circular */
  circleAbsorptions: getBoolFlag('ca'),
  /** dim background when experiment mode is active */
  dimBackground: getBoolFlag('dim'),
  altMenu: getBoolFlag('altmenu'),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getBoolFlag(name: string): boolean {
  return params.get(name) != null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getStrFlag(name: string): string | null {
  const flag = params.get(name)
  if (flag != null && flag != '') return flag
  return null
}

export const flagsPlugin: Plugin = {
  install: (app) => {
    app.config.globalProperties.$flags = $flags
    for (const f in $flags) {
      if ($flags[f as keyof typeof $flags]) {
        document.body.classList.add(`flag-${f}`)
      }
    }
  },
}
