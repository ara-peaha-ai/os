import { parse } from 'node-html-parser'

export const getCambiosChacoRates = async () => {
  const html = await $fetch('https://www.cambioschaco.com.py/', { responseType: 'text' })
  const root = parse(html)
  const rows = root.querySelectorAll('.cotiz-tabla tbody tr')
  return rows.flatMap((row) => {
    const anchors = row.querySelectorAll('td a[href*="currency="]')
    const purchases = row.querySelectorAll('.purchase')
    const sales = row.querySelectorAll('.sale')
    return anchors.map((anchor, i) => {
      const currency = new URL(anchor.getAttribute('href')).searchParams.get('currency').toUpperCase()
      const toNumber = (str) => parseFloat(str.replace(/\./g, '').replace(',', '.'))
      return { currency, purchase: toNumber(purchases[i]?.text ?? '0'), sale: toNumber(sales[i]?.text ?? '0') }
    })
  })
}
