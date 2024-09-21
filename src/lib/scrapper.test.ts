import { describe, expect, it } from "vitest"

import { scrapper } from "./scrapper"

const html = `<div class="item"><p class="word"> <b>cat </b><i>noun </i> </p><p> <u> ADJ. </u><b> domestic, family, household, pet | big </b><i>She went to Africa to photograph big cats. </i><b>| feral, wild | alley, stray | pedigree | long-haired, short-haired | black, tabby, tortoiseshell, etc. | tom </b>(also <b>tomcat</b>) <b>| playful | sleek | Cheshire </b><i>He was grinning like a Cheshire cat. </i><b>| fat </b><i>(figurative) the fat cats of big business </i> </p><p> <u> VERB + CAT </u><b> have, keep, own </b><i>We have a pet cat called Archie. </i><b>| feed | stroke | neuter, spay </b><i>They didn't want kittens, so they had their cat spayed. </i><b>| worm </b><i>The stray cats are wormed and treated with flea powder. </i><b>| put down </b><i>The cat was in constant pain so they had it put down. </i> </p><p> <u> CAT + VERB </u><b> hiss, mew, miaow, purr, spit, yowl </b><i>The cat miaowed pitifully. There was a cat yowling outside my window last night. </i><b>| bite (sb), scratch (sb) | creep, pad, (be on the) prowl, slink </b><i>A cat padded silently past. The cat slunk away into the darkness. </i><b>| arch its back | cower, crouch | curl up | catch sth, hunt (sth), stalk sth | leap, pounce (on sth), spring | spray (sth) </b><i>Cats mark their territory by spraying. </i> </p><p> <u> CAT + NOUN </u><b> door, flap | food | litter | lover, owner | phobia | nap </b>(also <b>catnap) </b><i>A catnap at lunchtime can make you feel refreshed. </i> </p><p> <u> PHRASES </u><b> fight like cat and dog </b><i>In our childhood Irina and I fought like cat and dog. </i><b>| play (a game of) cat and mouse </b><i>Young car thieves enjoy playing cat and mouse with the police. </i> </p></div>`

describe("Scrapper", () => {
  it("should parse the html and return an object", () => {
    const result = scrapper(html)
    expect(result[0]).toMatchObject({
      title: expect.any(String),
      id: expect.any(String),
      items: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          definition: expect.any(String),
          totalCollocations: expect.any(Number),
          collocations: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              words: expect.any(Array),
              example: expect.any(String)
            })
          ])
        })
      ])
    })
  })
})
