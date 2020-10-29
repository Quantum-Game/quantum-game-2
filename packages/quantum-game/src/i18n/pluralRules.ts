/**
 * Choose the right pluralization for slavic languages.
 * Based on https://kazupon.github.io/vue-i18n/guide/pluralization.html#custom-pluralization
 *
 * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
 * @param choicesLength {number} an overall amount of available choices (substrings separated by `|`)
 * @returns a final choice index to select plural word by
 */
function slavicPluralization(choice: number, choicesLength: number): number {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1

  if (choicesLength < 4) {
    return !teen && endsWithOne ? 1 : 2
  }

  if (!teen && endsWithOne) {
    return 1
  }

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}
export default {
  // english rules are handled by default
  'pl-PL': slavicPluralization,
}
