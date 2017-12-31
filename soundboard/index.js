/* Soundboard - Trigger stream events from your browser */

/* Individual groups go here */
let overlays = {
  title: "Overlays",
  items: [
    {
      name: "!House Test",
      event: "house:test"
    },
    {
      name: "Buyback",
      event: "overlay:buyback:show"
    },
    {
      name: "Cheese Fight",
      event: "overlay:cheese:show"
    },
    {
      name: "First Blood",
      event: "overlay:first:show"
    },
    {
      name: "Gift",
      event: "overlay:gift:show"
    },
    {
      name: "HPC Wins",
      event: "overlay:hpcwins:show"
    },
    {
      name: "Muggle?",
      event: "overlay:muggle:show"
    },
    {
      name: "Power Move",
      event: "overlay:powermove:show"
    },
    {
      name: "Sacrifice",
      event: "overlay:sacrifice:show"
    },
    {
      name: "Smoke Gank",
      event: "overlay:smoke:show"
    },
    {
      name: "Two Rax",
      event: "overlay:tworax:show"
    },
    {
      name: "3 Runes",
      event: "overlay:3runes:show"
    },
    {
      name: "Quality Picks",
      event: "overlay:picks:show"
    }
  ]
}

let xmas = {
  title: "Xmas",
  items: [
    {
      name: "Naughty or Nice",
      event: "xmas:start"
    }
  ]
}

let sponsors = {
  title: "Sponsors",
  items: [
    {
      name: "Kia",
      event: "overlay:kia:show"
    },
    {
      name: "Monster",
      event: "overlay:monster:show"
    },
    {
      name: "Polo",
      event: "overlay:polo:show"
    }
  ]
}

let quidditch = {
  title: "Quidditch",
  items: [
    {
      name: "Start!",
      event: "overlay:quidditch:show"
    }
  ]
}

let openclose = {
  title: "Open/Close",
  items: [
    {
      name: "Opening",
      event: "overlay:opening:show"
    },
    {
      name: "Closing",
      event: "overlay:closing:show"
    }
  ]
}


let housecup = {
  title: "House Cup",
  items: [
    {
      title: "Gryffindor",
      items: [
        {
          name: "+5",
          event: "cup:add",
          parameters: [
            "Dumbledore",
            "g 5"
          ]
        },
        {
          name: "+10",
          event: "cup:add",
          parameters: [
            "Dumbledore",
            "g 10"
          ]
        },
        {
          name: "-5",
          event: "cup:remove",
          parameters: [
            "Dumbledore",
            "g 5"
          ]
        },
        {
          name: "-10",
          event: "cup:remove",
          parameters: [
            "Dumbledore",
            "g 10"
          ]
        }
      ]
    },
    {
      title: "Hufflepuff",
      items: [
        {
          name: "+5",
          event: "cup:add",
          parameters: [
            "Dumbledore",
            "h 5"
          ]
        },
        {
          name: "+10",
          event: "cup:add",
          parameters: [
            "Dumbledore",
            "h 10"
          ]
        },
        {
          name: "-5",
          event: "cup:remove",
          parameters: [
            "Dumbledore",
            "h 5"
          ]
        },
        {
          name: "-10",
          event: "cup:remove",
          parameters: [
            "Dumbledore",
            "h 10"
          ]
        }
      ]
    },
    {
      title: "Ravenclaw",
      items: [
        {
          name: "+5",
          event: "cup:add",
          parameters: [
            "Dumbledore",
            "r 5"
          ]
        },
        {
          name: "+10",
          event: "cup:add",
          parameters: [
            "Dumbledore",
            "r 10"
          ]
        },
        {
          name: "-5",
          event: "cup:remove",
          parameters: [
            "Dumbledore",
            "r 5"
          ]
        },
        {
          name: "-10",
          event: "cup:remove",
          parameters: [
            "Dumbledore",
            "r 10"
          ]
        }
      ]
    },
    {
      title: "Slytherin",
      items: [
        {
          name: "+5",
          event: "cup:add",
          parameters: [
            "Dumbledore",
            "s 5"
          ]
        },
        {
          name: "+10",
          event: "cup:add",
          parameters: [
            "Dumbledore",
            "s 10"
          ]
        },
        {
          name: "-5",
          event: "cup:remove",
          parameters: [
            "Dumbledore",
            "s 5"
          ]
        },
        {
          name: "-10",
          event: "cup:remove",
          parameters: [
            "Dumbledore",
            "s 10"
          ]
        }
      ]
    },
    {
      title: "Winner",
      items: [
        {
          name: "Gryffindor",
          event: ""
        },
        {
          name: "Hufflepuff",
          event: ""
        },
        {
          name: "Ravenclaw",
          event: ""
        },
        {
          name: "Slytherin",
          event: ""
        }
      ]
    }
  ]
}

let halloween = {
  title: "Halloween",
  items: [
    {
      name: "Trick or Treat",
      event: "halloween:spook"
    }
  ]
}

// List of groups of events to display
module.exports = soundboard = [
  overlays,
  xmas,
  sponsors,
  quidditch,
  openclose,
  housecup,
  halloween
]
