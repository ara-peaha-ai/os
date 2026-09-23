// "compra" side: what an exchange house pays us for our USD — the realistic
// rate for converting our (already-received) USD into an ARS cash payout.
export const getBlueUsdArsRate = async () => {
  const { compra } = await $fetch('https://dolarapi.com/v1/dolares/blue')
  return compra
}
