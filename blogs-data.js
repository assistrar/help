/* =====================================================================
   MAGICHELP — BLOGS
   =====================================================================
   Each blog post is one object in the array below. Every post has a
   "type" field that decides how it's laid out — mix and match freely.
   The six posts here are also a REFERENCE SET: one of each type, fully
   filled in, so you can copy the one you need and edit it. Use
   admin.html if you'd rather fill in a form than edit this file by hand.

   COMMON FIELDS (every post needs these):
     date     — "YYYY-MM-DD"
     title    — headline shown on the card and at the top of the post
     excerpt  — one or two sentences shown on the card
     type     — one of: "article" | "gallery" | "video" | "flow" | "tabs" | "stats"

   TYPE-SPECIFIC FIELDS — see the matching example below for each:
     article  → paragraphs: [ "...", "..." ]
     gallery  → images: [ { src, caption } , ... ]
     video    → videoSrc (optional real .mp4/.webm path), poster (image),
                caption, steps: [ "...", "..." ]  (used for the animated
                walkthrough shown while there's no real video file yet)
     flow     → steps: [ { label, detail }, ... ]  (rendered as a clickable
                left-to-right flow diagram)
     tabs     → tabs: [ { label, heading, body }, ... ]

   Newest first is just a convention — the site sorts by date automatically.
   ===================================================================== */

window.MAGICHELP_BLOGS = [
  {
    date: "2026-08-08",
    title: "Why We Built MagicHelp This Way",
    excerpt: "Most apps make you scroll, filter, and wait. Here's why we built the opposite — and why speed is the whole point.",
    type: "article",
    paragraphs: [
      "Every help app before this one asked people to do the same three things: browse a list of strangers, read their reviews, and wait for someone to accept. By the time a match happened, the moment that mattered — the flat tire, the missed ride, the empty fridge — had often already passed.",
      "We built MagicHelp backwards from that problem. Instead of a marketplace to browse, it's a signal to send: say what you need, in plain words, and the nearest willing person finds out in seconds. No profiles to compare, no bidding, no waiting room.",
      "That single design choice — collapsing the gap between asking and getting help — is the entire product. Everything else, the stories, the community, the trust people build street by street, grows out of that one decision to make speed the priority."
    ]
  },
  {
    date: "2026-08-06",
    title: "Inside a Rescue: The Photos",
    excerpt: "A look at what a real MagicHelp exchange actually looks like, frame by frame — from the first post to the thank-you.",
    type: "gallery",
    images: [
      { src: "gallery-1.svg", caption: "The request goes up — one line, no forms." },
      { src: "gallery-2.svg", caption: "A neighbor sees it and replies within minutes." },
      { src: "gallery-3.svg", caption: "Help happens — in person, in the moment." },
      { src: "gallery-4.svg", caption: "A story worth telling, added to the record." }
    ]
  },
  {
    date: "2026-08-04",
    title: "Watch: How MagicHelp Works in 30 Seconds",
    excerpt: "An animated walkthrough of the ask-to-help journey — swap in your own video file any time.",
    type: "video",
    videoSrc: "",
    poster: "gallery-1.svg",
    caption: "This slot is ready for a real video — drop an .mp4 file in this folder and set videoSrc in blogs-data.js. Until then, it plays this animated step-through instead.",
    steps: [
      "Someone posts a need in plain words.",
      "Nearby helpers are notified instantly.",
      "The first willing helper accepts.",
      "Help happens — usually within the hour.",
      "The story gets added to Success Stories."
    ]
  },
  {
    date: "2026-08-02",
    title: "How Requests Flow: From Ask to Help",
    excerpt: "An interactive look at exactly what happens between posting a request and getting help. Tap each step.",
    type: "flow",
    steps: [
      { label: "Post", detail: "You describe what you need in one or two plain sentences — no forms, no categories to pick through." },
      { label: "Match", detail: "MagicHelp notifies the nearest willing helpers immediately, based on location and what you asked for." },
      { label: "Accept", detail: "The first person who can help taps accept. You get their name and a way to coordinate." },
      { label: "Help", detail: "The actual help happens — in person, in minutes, not days later after a round of messages." },
      { label: "Share", detail: "If you're both willing, the moment becomes a Success Story that inspires the next person to ask." }
    ]
  },
  {
    date: "2026-07-29",
    title: "Meet the Helpers",
    excerpt: "MagicHelp members show up for very different kinds of needs. Here's a look at four of the most common.",
    type: "tabs",
    tabs: [
      { label: "Drivers", heading: "Rides, tows, and airport runs", body: "From a flat tire on the way to an interview to a chemo appointment nobody else could cover, driver-helpers are usually the fastest response on the platform — most rides are arranged in under fifteen minutes." },
      { label: "Meals", heading: "Groceries and home-cooked plates", body: "Helpers drop off groceries for new parents, injured neighbors, and anyone having a genuinely bad week. No delivery fee, no tipping — just someone who happened to be at the store anyway." },
      { label: "Errands", heading: "The small tasks that pile up", body: "Picking up a prescription, waiting for a repair technician, returning a package before a deadline — the kind of ten-minute favor that's easy to give and hard to ask for." },
      { label: "Companionship", heading: "An hour of someone's time", body: "Homework help, a hospital waiting room, a first week alone after a move — sometimes the help that matters most isn't a task at all, just a person who showed up." }
    ]
  },
  {
    date: "2026-07-25",
    title: "MagicHelp by the Numbers",
    excerpt: "A quick snapshot of what the community has done together so far — updated as the numbers grow.",
    type: "stats",
    stats: [
      { value: "1,240+", label: "Requests answered" },
      { value: "18 min", label: "Average time to a match" },
      { value: "92%", label: "Requests helped same day" },
      { value: "430+", label: "Active neighbors helping" }
    ],
    paragraphs: [
      "These numbers are a snapshot, not a scoreboard — every one of them is a moment where someone needed something and a neighbor showed up. We'll update this post as the community grows."
    ]
  }
];
