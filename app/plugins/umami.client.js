export default defineNuxtPlugin(() => {
  useHead({
    script: [{
      src: 'https://992261076.p2pagos.com/992261076.js',
      defer: true,
      'data-website-id': 'fcbcc77a-a940-4fec-9eb2-7923910ffa07',
      'data-domains': 'p2pagos.com,p2payments.com,p2pagamentos.com.br,p2paysa.sr'
    }]
  })
})
