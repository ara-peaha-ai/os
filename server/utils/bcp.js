import { parse } from 'node-html-parser'

export const getBcpUsdPygRate = async () => {
  const html = await $fetch('https://www.bcp.gov.py/webapps/web/cotizacion/monedas', {
    responseType: 'text',
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })
  const root = parse(html)
  const usdRow = root.querySelectorAll('tr').find(tr =>
    tr.querySelectorAll('td').some(td => td.text.trim() === 'USD')
  )
  const rateTd = usdRow?.querySelectorAll('td[style*="text-align:right"]')[1]
  const rateText = rateTd?.text.trim().replace(/\./g, '').replace(',', '.')
  return parseFloat(rateText)
}
