import { Commit, define, latest, User } from '#src'

export default define({
  url: import.meta.url,
  badges: [
    'midnight-commits',
    'morning-commits',
    'evening-commits',
    'sleepy-coder',
  ] as const,
  present(data, grant) {
    const morningCommits: Commit[] = []
    const eveningCommits: Commit[] = []
    const midnightCommits: Commit[] = []
    const sleepycoderCommits: Commit[] = []

    const timezoneOffset = guessTimezone(data.user)

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        const date = new Date(commit.committedDate)

        date.setUTCHours(date.getUTCHours() + timezoneOffset)

        if (date.getUTCHours() >= 4 && date.getUTCHours() < 6) {
          sleepycoderCommits.push(commit)
        }
        if (date.getUTCHours() >= 6 && date.getUTCHours() < 8) {
          morningCommits.push(commit)
        }
        if (date.getUTCHours() >= 21) {
          eveningCommits.push(commit)
        }
        if (date.getUTCHours() == 0 && date.getUTCMinutes() < 5) {
          midnightCommits.push(commit)
        }
      }
    }

    if (sleepycoderCommits.length > 0) {
      grant('sleepy-coder', 'I am a sleepy coder.').evidenceCommits(
        ...sleepycoderCommits.sort(latest).slice(0, 6),
      )
    }
    if (morningCommits.length > 0) {
      grant('morning-commits', 'I commit in the morning.').evidenceCommits(
        ...morningCommits.sort(latest).slice(0, 6),
      )
    }
    if (eveningCommits.length > 0) {
      grant('evening-commits', 'I commit in the evening.').evidenceCommits(
        ...eveningCommits.sort(latest).slice(0, 6),
      )
    }
    if (midnightCommits.length > 0) {
      grant('midnight-commits', 'I commit at midnight.').evidenceCommits(
        ...midnightCommits.sort(latest).slice(0, 6),
      )
    }
  },
})

function guessTimezone(user: User) {
  const location = user.location ? user.location.toLowerCase() : ''
  const regexMapping = [
    { pattern: /\bamsterdam\b|\bnetherlands\b/, offset: 2 },
    { pattern: /\bantwerp\b|\bghent\b/, offset: 2 },
    { pattern: /\bargentina\b|\bbuenos aires\b/, offset: -3 },
    { pattern: /\bathens\b|\bgreece\b/, offset: 3 },
    { pattern: /\bbangkok\b|\bthailand\b/, offset: 7 },
    { pattern: /\bbarcelona\b|\bvalencia\b|\bseville\b/, offset: 2 },
    { pattern: /\bbeijing\b|\bchina\b/, offset: 8 },
    { pattern: /\bbelgrade\b|\bserbia\b/, offset: 2 },
    { pattern: /\bberlin\b|\bgermany\b/, offset: 2 },
    { pattern: /\bbilbao\b|\bzaragoza\b/, offset: 2 },
    { pattern: /\bbordeaux\b|\bmarseille\b|\blyon\b/, offset: 2 },
    { pattern: /\bbratislava\b|\bslovakia\b/, offset: 2 },
    { pattern: /\bbrazil\b|\bsao paulo\b|\brio de janeiro\b/, offset: -3 },
    { pattern: /\bbrussels\b|\bbelgium\b/, offset: 2 },
    { pattern: /\bbucharest\b|\bromania\b/, offset: 3 },
    { pattern: /\bbudapest\b|\bhungary\b/, offset: 2 },
    { pattern: /\bcairo\b|\begypt\b/, offset: 2 },
    { pattern: /\bcasablanca\b|\bmorocco\b/, offset: 1 },
    { pattern: /\bchicago\b|\billinois\b|\bil\b/, offset: -5 },
    { pattern: /\bchile\b|\bsantiago\b/, offset: -3 },
    { pattern: /\bchisinau\b|\bmoldova\b/, offset: 3 },
    { pattern: /\bcolombia\b|\bbogota\b/, offset: -5 },
    { pattern: /\bcopenhagen\b|\bdenmark\b/, offset: 2 },
    { pattern: /\bcosta rica\b|\bsan jose\b/, offset: -6 },
    { pattern: /\bcrete\b|\bthessaloniki\b/, offset: 3 },
    { pattern: /\bdhaka\b|\bbangladesh\b/, offset: 6 },
    { pattern: /\bdubai\b|\buae\b|\babu dhabi\b/, offset: 4 },
    { pattern: /\bdublin\b|\bireland\b/, offset: 1 },
    { pattern: /\becuador\b|\bquito\b/, offset: -5 },
    { pattern: /\bfaro\b|\bevora\b/, offset: 1 },
    { pattern: /\bfiji\b/, offset: 12 },
    { pattern: /\bflorence\b|\bpalermo\b/, offset: 2 },
    { pattern: /\bflorida\b|\bmiami\b/, offset: -4 },
    { pattern: /\bgdansk\b|\bwroclaw\b/, offset: 2 },
    { pattern: /\bgeneva\b|\bbern\b/, offset: 2 },
    { pattern: /\bgenoa\b|\bturin\b/, offset: 2 },
    { pattern: /\bglasgow\b|\bliverpool\b|\bmanchester\b/, offset: 0 },
    { pattern: /\bgothenburg\b|\bmalmo\b/, offset: 2 },
    { pattern: /\bhamburg\b|\bmunich\b|\bfrankfurt\b/, offset: 2 },
    { pattern: /\bhawaii\b/, offset: -10 },
    { pattern: /\bhelsinki\b|\bfinland\b/, offset: 3 },
    { pattern: /\biraq\b|\bbaghdad\b/, offset: 3 },
    { pattern: /\bisrael\b|\btel aviv\b/, offset: 3 },
    { pattern: /\bjakarta\b|\bindonesia\b/, offset: 7 },
    { pattern: /\bjohannesburg\b|\bsouth africa\b/, offset: 2 },
    { pattern: /\bjordan\b|\bamman\b/, offset: 3 },
    { pattern: /\bkathmandu\b|\bnepal\b/, offset: 5.75 },
    { pattern: /\bkiev\b|\bukraine\b/, offset: 3 },
    { pattern: /\bkuala lumpur\b|\bmalaysia\b/, offset: 8 },
    { pattern: /\blagos\b|\bnigeria\b/, offset: 1 },
    { pattern: /\bled\b|\bslovenia\b/, offset: 2 },
    { pattern: /\bledz\b|\bkrakow\b/, offset: 2 },
    { pattern: /\blisbon\b|\bportugal\b/, offset: 1 },
    { pattern: /\bljubljana\b|\bslovenia\b/, offset: 2 },
    { pattern: /\blondon\b|\buk\b/, offset: 0 },
    { pattern: /\blos angeles\b|\bcalifornia\b|\bca\b/, offset: -7 },
    { pattern: /\bluxembourg\b/, offset: 2 },
    { pattern: /\blyon\b|\bnantes\b/, offset: 2 },
    { pattern: /\bmadrid\b|\bspain\b/, offset: 2 },
    { pattern: /\bmalta\b|\bvalletta\b/, offset: 2 },
    { pattern: /\bmelbourne\b/, offset: 11 },
    { pattern: /\bmexico\b|\bmexico city\b/, offset: -5 },
    { pattern: /\bminsk\b|\bbelarus\b/, offset: 3 },
    { pattern: /\bmonaco\b/, offset: 2 },
    { pattern: /\bmontreal\b|\bquebec\b/, offset: -4 },
    { pattern: /\bmoscow\b|\brussia\b/, offset: 3 },
    { pattern: /\bmumbai\b|\bindia\b/, offset: 5.5 },
    { pattern: /\bnairobi\b|\bkenya\b/, offset: 3 },
    { pattern: /\bnaples\b|\bmilan\b|\bvenice\b/, offset: 2 },
    { pattern: /\bnew delhi\b/, offset: 5.5 },
    { pattern: /\bnew york\b|\bny\b/, offset: -4 },
    { pattern: /\bnew zealand\b|\bauckland\b/, offset: 13 },
    { pattern: /\bnice\b|\btoulouse\b/, offset: 2 },
    { pattern: /\bnicosia\b|\bcyprus\b/, offset: 3 },
    { pattern: /\bodessa\b|\blviv\b/, offset: 3 },
    { pattern: /\boslo\b|\bnorway\b/, offset: 2 },
    { pattern: /\bpakistan\b|\blahore\b|\bkarachi\b/, offset: 5 },
    { pattern: /\bpanama\b|\bpanama city\b/, offset: -5 },
    { pattern: /\bpapua new guinea\b|\bport moresby\b/, offset: 10 },
    { pattern: /\bparis\b|\bfrance\b/, offset: 2 },
    { pattern: /\bperu\b|\blima\b/, offset: -5 },
    { pattern: /\bpodgorica\b|\bmontenegro\b/, offset: 2 },
    { pattern: /\bporto\b|\bbraga\b/, offset: 1 },
    { pattern: /\bprague\b|\bczech republic\b|\bczechia\b/, offset: 2 },
    { pattern: /\breykjavik\b|\biceland\b/, offset: 0 },
    { pattern: /\briga\b|\blatvia\b/, offset: 3 },
    { pattern: /\brome\b|\bitaly\b/, offset: 2 },
    { pattern: /\brotterdam\b|\butrecht\b/, offset: 2 },
    { pattern: /\bsalzburg\b|\bgraz\b/, offset: 2 },
    { pattern: /\bsarajevo\b|\bbosnia and herzegovina\b/, offset: 2 },
    { pattern: /\bsaudi arabia\b|\briyadh\b/, offset: 3 },
    { pattern: /\bseoul\b|\bsouth korea\b/, offset: 9 },
    { pattern: /\bshanghai\b/, offset: 8 },
    { pattern: /\bsheffield\b|\bleeds\b/, offset: 0 },
    { pattern: /\bsingapore\b/, offset: 8 },
    { pattern: /\bskopje\b|\bnorth macedonia\b/, offset: 2 },
    { pattern: /\bsofia\b|\bbulgaria\b/, offset: 3 },
    { pattern: /\bstockholm\b|\bsweden\b/, offset: 2 },
    { pattern: /\bstuttgart\b|\bdusseldorf\b/, offset: 2 },
    { pattern: /\bsydney\b|\baustralia\b/, offset: 11 },
    { pattern: /\btallinn\b|\bestonia\b/, offset: 3 },
    { pattern: /\btehran\b|\biran\b/, offset: 3.5 },
    { pattern: /\btexas\b|\bhouston\b|\bdallas\b/, offset: -5 },
    { pattern: /\btirana\b|\balbania\b/, offset: 2 },
    { pattern: /\btokyo\b|\bjapan\b/, offset: 9 },
    { pattern: /\btoronto\b|\bontario\b/, offset: -4 },
    { pattern: /\btunisia\b|\btunis\b/, offset: 1 },
    { pattern: /\bvalencia\b|\bmalaga\b/, offset: 2 },
    { pattern: /\bvancouver\b|\bbritish columbia\b/, offset: -7 },
    { pattern: /\bvenezuela\b|\bcaracas\b/, offset: -4 },
    { pattern: /\bvienna\b|\baustria\b/, offset: 2 },
    { pattern: /\bvilnius\b|\blithuania\b/, offset: 3 },
    { pattern: /\bwarsaw\b|\bpoland\b/, offset: 2 },
    { pattern: /\bzagreb\b|\bcroatia\b/, offset: 2 },
    { pattern: /\bzurich\b|\bswitzerland\b/, offset: 2 },
    { pattern: /\bturkey\b|\bistanbul\b|\bankara\b/, offset: 3 }
  ]

  for (const mapping of regexMapping) {
    if (mapping.pattern.test(location)) {
      return mapping.offset
    }
  }

  return 0
}
