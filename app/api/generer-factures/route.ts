import { genererFacturesPourMois } from '@/utils/facturation'

export async function POST() {
  try {
    const mois = new Date().getMonth() + 1 // avril = 4
    const annee = new Date().getFullYear()

    const resultat = await genererFacturesPourMois(mois, annee)

    return new Response(JSON.stringify({ succes: true, resultat }), {
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ succes: false, message: error.message }), {
      status: 500,
    })
  }
}
