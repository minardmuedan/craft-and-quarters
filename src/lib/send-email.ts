export async function sendEmail(to: string, tokenId: string) {
  console.log(`${to} : http://localhost:3000/signup/${tokenId}`)
}
