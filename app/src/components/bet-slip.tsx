import { fetchCurrentLeagues, fetchGames } from '@/lib/fetch-data'
import BetSlipList from '@/components/bet-slip-list'
import { currentSeason } from '@/config/api'
import { Sport } from '@/types'

const BetSlip = async () => {
  //const leagueIds = (await fetchCurrentLeagues(Sport.Soccer)).map((l) => l.league.id)
  const leagueIds= [39]
  console.log(leagueIds)
  const games = (
    await Promise.all(
      leagueIds.map(async (leagueId) => {
        const games = await fetchGames(Sport.Soccer, leagueId, currentSeason)
        return games
      }),
    )
  ).flat()
  return (
    <>
      <BetSlipList games={games} />
    </>
  )
}

export default BetSlip
