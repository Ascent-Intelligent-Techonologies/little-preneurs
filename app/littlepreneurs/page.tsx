import type { Metadata } from "next";
import Link from "next/link";
import SiteEffects from "@/components/SiteEffects";
import Snowfall from "@/components/Snowfall";
import { EVENT } from "@/utils/event";

export const metadata: Metadata = {
  title: "Littlepreneurs Season 02 · Christmas Special · T-Works Hyderabad",
  description:
    "A marketplace run by kids. Littlepreneurs Season 02 Christmas Special: 20 December, 12–5 PM at T-Works, Hyderabad. Ages 4–16. Register a stall for your little founder, or come along as a visitor.",
  openGraph: {
    title: "Littlepreneurs Season 02 · Christmas Special",
    description: "Big futures start little. 20 December · T-Works, Hyderabad · Ages 4–16.",
    images: ["/assets/img/hero-rana.webp"],
  },
};

export default function Home() {
  return (
    <>
      <SiteEffects />
      <Snowfall />
<div id="top" />
<header className="nav">
  <a className="nav__logo" href="#top" aria-label="Littlepreneurs home, by Late Checkout and Dolce Amore"><img src="/assets/img/logo.webp" alt="LittlePreneurs" width="150" height="50" /><span>By Late Checkout + Dolce Amore</span></a>
  <nav className="nav__links" id="navLinks" aria-label="Main">
    <a href="#story">Season 1</a>
    <a href="#gallery">Gallery</a>
    <a href="#circle">The circle</a>
    <a href="#table">Your table</a>
    <a href="#builders">Builders of Tomorrow</a>
    <a href="#watch">Watch</a>
    <a href="#partners">Partners</a>
    {EVENT.showRegisterButtons && <Link className="btn btn--small" href="/littlepreneurs/register">Register</Link>}
  </nav>
  <button className="nav__toggle" id="navToggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
</header>

<main>
{/* HERO */}
<section className="hero">
  <div className="wrap">
    <div className="hero__top">
      <div className="hero__brand">
        <img src="/assets/img/logo.webp" alt="LittlePreneurs" width="1500" height="500" />
        <p className="eyebrow">By Late Checkout + Dolce Amore</p>
      </div>
      <div className="hero__season">
        <span className="pill pill--dark">Season 02</span>
        <span className="eyebrow eyebrow--red">Christmas<br />Special</span>
      </div>
    </div>
    <div className="hero__head">
      <h1>Big futures<br />start little.</h1>
      <svg className="planet" viewBox="0 0 120 90" aria-hidden="true">
        <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#eef3f6"/><stop offset=".5" stopColor="#9fb4c0"/><stop offset="1" stopColor="#e3ebef"/></linearGradient></defs>
        <ellipse cx="60" cy="52" rx="56" ry="17" fill="none" stroke="#8aa5b4" strokeWidth="1.4" transform="rotate(-14 60 52)"/>
        <circle cx="60" cy="50" r="28" fill="url(#pg)"/>
        <path d="M104 8l2.6 7.4L114 18l-7.4 2.6L104 28l-2.6-7.4L94 18l7.4-2.6z" fill="#f2494a"/>
      </svg>
    </div>
    <p className="lede">A marketplace run by kids. A first step for tomorrow’s founders, leaders and original thinkers.</p>

    <figure className="hero__photo">
      <img src="/assets/img/hero-rana.webp" alt="A young founder smiling at his stall, with his book 'Lost in Hyderabad' on display" width="1400" height="933" fetchPriority="high" />
      <figcaption className="chip">Real ideas. Real customers. Real pride.</figcaption>
    </figure>

    <div className="datebar">
      <div className="datebar__a"><strong>20 December</strong><span>12–5 PM &nbsp;/&nbsp; Christmas Special</span></div>
      <div className="datebar__b"><strong>T-Works</strong><span>Hyderabad</span></div>
      <a className="pill pill--yellow" href="#book">Ages 4–16</a>
    </div>
    {EVENT.showRegisterButtons && (
      <div className="hero__cta">
        <Link className="btn" href="/littlepreneurs/register?type=stall">Register your stall</Link>
        <Link className="btn btn--ghost" href="/littlepreneurs/register?type=guest">Visiting? Get your pass</Link>
      </div>
    )}
  </div>
</section>

{/* SEASON 1 STORY */}
<section className="section" id="story">
  <div className="wrap">
    <p className="eyebrow">The feeling that started it all</p>
    <h2>Little ideas.<br />Unforgettable firsts.</h2>
    <p className="lede lede--dark">Season 1 at T-Works was a magical day of doing. Children set up shop, introduced their brands, met real customers and made real money.</p>

    <div className="stat">
      <div className="stat__num"><span data-count="1100">1,100</span><small>People walked in</small></div>
      <p>They discovered branding, marketing, sales and visibility by doing. They danced, moved and learnt the value of support, connection and community.</p>
    </div>

    <figure className="photo photo--wide">
      <img src="/assets/img/season1-crowd.webp" alt="Aerial view of the Season 1 marketplace at T-Works, full of families and stalls" width="1600" height="1066" loading="lazy" />
      <figcaption>A real marketplace. A community that showed up.</figcaption>
    </figure>

    <div className="quote">
      <p className="eyebrow eyebrow--red">The feeling matters.</p>
      <p className="quote__text">I made this. I can do this.</p>
      <svg className="spark" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 0l4.6 15.4L40 20l-15.4 4.6L20 40l-4.6-15.4L0 20l15.4-4.6z" fill="#ffd25a"/></svg>
    </div>
  </div>
</section>

{/* GALLERY */}
<section className="section" id="gallery">
  <div className="wrap">
    <p className="eyebrow">The Season 1 gallery</p>
    <h2>This is what<br />possibility looks like.</h2>
    <p className="lede">First pitches. New connections. A thousand little reasons to feel proud.</p>
    <p className="credit">Photography / DSLR Men · <a href="https://dslrmen.smugmug.com/Late-checkout/Twork/n-t2qJHX" target="_blank" rel="noopener">See the full album ↗</a></p>

    <div className="grid grid--2">
      <figure><img data-lb="true" src="/assets/img/gallery-1.webp" alt="Children and a parent choosing beads at a stall" width="800" height="533" loading="lazy" /><figcaption>Finding the words.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-2.webp" alt="A smiling toddler with family at a stall" width="800" height="533" loading="lazy" /><figcaption>Support, right beside them.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-3.webp" alt="A customer talking to a young stall owner" width="800" height="533" loading="lazy" /><figcaption>Ideas meet real customers.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-4.webp" alt="Mini canvas paintings of flowers on easels" width="800" height="533" loading="lazy" /><figcaption>Made with imagination.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-5.webp" alt="A girl and a woman playing with a stretchy fabric" width="800" height="533" loading="lazy" /><figcaption>Learning with their hands.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-6.webp" alt="Children crouching in a group movement activity" width="800" height="533" loading="lazy" /><figcaption>Moving together.</figcaption></figure>
    </div>
    <p className="quote__text quote__text--red">There is a founder in every little “what if?”.</p>
  </div>
</section>

<section className="section section--dark" id="dump">
  <div className="wrap">
    <p className="eyebrow eyebrow--light">The Season 1 photo dump</p>
    <h2>The joy. The hustle.<br />The little wins.</h2>
    <p className="lede lede--light">A few more moments worth keeping.</p>

    <div className="masonry">
      <figure className="m-wide"><img data-lb="true" src="/assets/img/gallery-7.webp" alt="A young seller pitching to a customer at a busy stall" width="900" height="600" loading="lazy" /><figcaption>The confidence to pitch.</figcaption></figure>
      <figure className="m-tall"><img data-lb="true" src="/assets/img/gallery-8.webp" alt="Three girls proudly holding up their participation certificates" width="584" height="876" loading="lazy" /><figcaption>The pride that follows.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-9.webp" alt="Two children presenting their products" width="900" height="600" loading="lazy" /><figcaption>Showing what they can do.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-10.webp" alt="A child shaping clay on a pottery wheel" width="900" height="600" loading="lazy" /><figcaption>Making something of their own.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-11.webp" alt="Children dancing together with a crowd watching" width="900" height="600" loading="lazy" /><figcaption>A little dance. A lot of joy.</figcaption></figure>
      <figure><img data-lb="true" src="/assets/img/gallery-12.webp" alt="A girl selling accessories to a customer" width="900" height="600" loading="lazy" /><figcaption>One customer at a time.</figcaption></figure>
    </div>
  </div>
</section>

{/* FULL CIRCLE */}
<section className="section" id="circle">
  <div className="wrap">
    <p className="eyebrow">More than a marketplace</p>
    <h2>The full circle<br />of entrepreneurship.</h2>
    <p className="lede">One big experience. So many ways to grow.</p>

    <div className="circle">
      <div className="circle__core">
        <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 0l4.6 15.4L40 20l-15.4 4.6L20 40l-4.6-15.4L0 20l15.4-4.6z" fill="#ffd25a"/></svg>
        <span>Your child</span><em>at the centre of</em><b>Big<br />possibilities</b>
      </div>
      <ul className="circle__items">
        <li className="c-yellow"><i>💡</i><h3>Create + sell</h3><p>Design thinking<br />Real sales + earnings</p></li>
        <li className="c-lav"><i>🏷️</i><h3>Build a brand</h3><p>Name + story + identity</p></li>
        <li className="c-blue"><i>📣</i><h3>Marketing + visibility</h3><p>Social + press + media</p></li>
        <li className="c-green"><i>🤝</i><h3>Find your people</h3><p>Networks + support</p></li>
        <li className="c-lav"><i>📖</i><h3>Keep upskilling</h3><p>Programmes + workshops</p></li>
        <li className="c-yellow"><i>🎶</i><h3>Explore hobbies</h3><p>Dance + food workshops</p></li>
        <li className="c-green"><i>🏋️</i><h3>Fitness for life</h3><p>Move + play + thrive</p></li>
        <li className="c-pink"><i>❤️</i><h3>Give back</h3><p>10% of every ticket goes to charity.</p></li>
      </ul>
    </div>
    <p className="tagline">Confidence. Curiosity. Community. Purpose.</p>
    <p className="muted center">A complete experience, with your child at the centre.</p>
  </div>
</section>

{/* THE TABLE */}
<section className="section" id="table">
  <div className="wrap">
    <p className="eyebrow">Season 02 / The Christmas Special</p>
    <h2>Their idea.<br />Their very own place.</h2>
    <p className="lede">For the parent who sees possibility. Give your child the space to take ownership, speak up and discover what they can build.</p>

    <div className="infocard">
      <div><strong>20 December</strong><span>T-Works &nbsp;/&nbsp; 12–5 PM</span></div>
      <div><strong className="yellow">Ages 4–16</strong><span>Parents welcome at the stall</span></div>
    </div>

    <h3 className="h3">A considered start for a little founder.</h3>
    <p className="eyebrow eyebrow--red">Every table booking includes</p>
    <ul className="includes">
      <li><i className="c-yellow">🪑</i><div><h4>A place to begin</h4><p>Table space + a chair.</p></div></li>
      <li><i className="c-lav">🪧</i><div><h4>Their name, on display</h4><p>A nameboard for their stall.</p></div></li>
      <li><i className="c-blue">📣</i><div><h4>A chance to be seen</h4><p>Visibility on social media.</p></div></li>
      <li><i className="c-green">🎓</i><div><h4>A moment to mark</h4><p>A participation certificate by Late Checkout, Dolce Amore and T-Works.</p></div></li>
      <li><i className="c-green">🥤</i><div><h4>Fuel for the day</h4><p>2 water bottles + 1 meal box.</p></div></li>
      <li><i className="c-yellow">📓</i><div><h4>Room for big ideas</h4><p>The Littlepreneurs Founders Journal.</p></div></li>
      <li><i className="c-lav">🎁</i><div><h4>Something to take home</h4><p>A founders hamper.</p></div></li>
      <li><i className="c-blue">↗️</i><div><h4>First access to what’s next</h4><p>Builders of Tomorrow programme and workshops. Limited take-ins.</p></div></li>
    </ul>
    <p className="muted">Parents may accompany their children and support them in running the stall.</p>
  </div>
</section>

{/* BUILDERS OF TOMORROW */}
<section className="section section--dark" id="builders">
  <div className="wrap">
    <p className="eyebrow eyebrow--light">The next chapter</p>
    <span className="pill pill--yellow">First access</span>
    <div className="hero__head">
      <h2 className="h2--xl">Builders of<br />Tomorrow.</h2>
      <svg className="planet planet--sm" viewBox="0 0 120 90" aria-hidden="true">
        <ellipse cx="60" cy="52" rx="56" ry="17" fill="none" stroke="#8aa5b4" strokeWidth="1.4" transform="rotate(-14 60 52)"/>
        <circle cx="60" cy="50" r="28" fill="#dfe8ec"/>
        <path d="M104 8l2.6 7.4L114 18l-7.4 2.6L104 28l-2.6-7.4L94 18l7.4-2.6z" fill="#ffd25a"/>
      </svg>
    </div>
    <p className="lede lede--light">Big questions. Fresh ideas. A place to begin.</p>
    <p className="lede lede--light lede--small">A programme and workshops in association with Late Checkout and T-Works, designed to train founders in the skills that turn ideas into action.</p>

    <ol className="steps">
      <li><b className="c-yellow">01</b><h3>Design thinking</h3><p>Start with a better question.</p></li>
      <li><b className="c-green">02</b><h3>Problem solving</h3><p>Try, test and find a way.</p></li>
      <li><b className="c-lav">03</b><h3>Branding</h3><p>Give an idea its identity.</p></li>
      <li><b className="c-blue">04</b><h3>Marketing</h3><p>Help the right people find it.</p></li>
      <li><b className="c-yellow">05</b><h3>Sales</h3><p>Turn interest into opportunity.</p></li>
    </ol>
    <p className="tag-out">Limited take-ins</p>
    <p className="eyebrow eyebrow--light">First access included with Littlepreneurs</p>
  </div>
</section>

{/* GIVE BACK */}
<section className="section" id="giveback">
  <div className="wrap">
    <p className="eyebrow">Learning to give back</p>
    <h2>Big ideas.<br />Bigger hearts.</h2>
    <p className="lede">Entrepreneurship is also about contributing to the society we share. The best founders learn early that success is something you share.</p>
    <figure className="photo photo--wide"><img src="/assets/img/give-back.webp" alt="Mothers helping young children at a stall" width="1400" height="933" loading="lazy" /></figure>
    <div className="bigstat">
      <strong>10%</strong>
      <p>of every ticket goes to a not-for-profit organisation.</p>
      <small>Teaching children the joy of giving</small>
    </div>
    <ul className="gstats">
      <li><b>1,100</b><span>people came to Season 1. The bigger the crowd, the bigger the gift.</span></li>
      <li><b>Every ticket</b><span>carries a little goodness, so every visitor gives back by simply showing up.</span></li>
      <li><b>Ages 4–16</b><span>Children see first-hand that earning and giving can go hand in hand.</span></li>
    </ul>
    <p className="quote__text">Earn a little. Give a little. Grow a lot.</p>
  </div>
</section>

{/* PRESS */}
<section className="section" id="press">
  <div className="wrap">
    <p className="eyebrow">A little marketplace. A growing conversation.</p>
    <h2>Small founders.<br />A bigger spotlight.</h2>
    <p className="eyebrow eyebrow--red">Headlines from Season 1</p>
    <div className="press">
      <a className="card press__card" href="https://www.thehindu.com/news/cities/Hyderabad/littlepreneurs-childrens-marketplace-to-be-held-at-t-works-on-aug-2/article71273568.ece" target="_blank" rel="noopener">
        <span className="press__pub press__pub--hindu">THE HINDU</span>
        <span className="press__title">‘Littlepreneurs’ children’s marketplace to be held at T-Works on Aug. 2</span>
        <span className="press__go">Read the article ↗</span>
      </a>
      <a className="card press__card" href="https://www.newindianexpress.com/states/telangana/2026/Aug/03/business-lessons-beyond-the-classroom" target="_blank" rel="noopener">
        <span className="press__pub press__pub--tnie">THE NEW INDIAN EXPRESS</span>
        <span className="press__title">Business lessons beyond the classroom</span>
        <span className="press__go">Read the article ↗</span>
      </a>
    </div>
  </div>
</section>

{/* PARTNERS */}
<section className="section section--partners" id="partners">
  <div className="wrap">
    <p className="eyebrow">Partner with Littlepreneurs</p>
    <h2>Be part of<br />what they build.</h2>
    <p className="lede">Season 1 brought 1,100 people through the doors: young founders, the parents who back them, and a community that came to cheer.</p>

    <div className="pgroup pgroup--school">
      <p className="eyebrow eyebrow--red">School partnerships</p>
      <h3 className="pgroup__title">Put your school where the target crowd is.</h3>
      <p className="muted">Children aged 4–16 and their families, together in one room. Show them what your school stands for.</p>
      <p className="eyebrow">Schools that partnered with us in Season 1</p>
      <ul className="logos">
        <li className="card logo logo--text">DPS Bachupally</li>
        <li className="card logo logo--dark"><img src="/assets/logos/orchids.webp" alt="Orchids International" width="190" height="56" loading="lazy" /></li>
      </ul>
    </div>

    <div className="pgroup pgroup--brand">
      <p className="eyebrow eyebrow--red">Brand partnerships</p>
      <h3 className="pgroup__title">Where families gather, brands become part of the story.</h3>
      <p className="muted">Meet parents and little founders in the warmest room in the city, and be remembered for being there.</p>
      <p className="eyebrow">Brands that partnered with us in Season 1</p>
      <ul className="logos logos--3">
        <li className="card logo"><img src="/assets/logos/aretto.png" alt="Aretto Shoes" width="63" height="40" loading="lazy" /></li>
        <li className="card logo"><img src="/assets/logos/koh.png" alt="Koh Foods" width="413" height="380" loading="lazy" /></li>
        <li className="card logo logo--red"><img src="/assets/logos/gamology.png" alt="Gamology" width="1024" height="390" loading="lazy" /></li>
      </ul>
    </div>

    <div className="pgroup pgroup--sponsor">
      <p className="eyebrow eyebrow--red">Sponsors</p>
      <h3 className="pgroup__title">Backing the founders of tomorrow.</h3>
      <p className="muted">Your support puts a table, a first customer and a lot of confidence in a child’s hands.</p>
      <p className="eyebrow">Sponsors who supported us in Season 1</p>
      <ul className="logos">
        <li className="card logo"><img src="/assets/logos/hdfc.svg" alt="HDFC Bank" width="178" height="35" loading="lazy" /></li>
        <li className="card logo"><img src="/assets/logos/kotak.svg" alt="Kotak Mahindra Bank" width="129" height="32" loading="lazy" /></li>
      </ul>
    </div>

    <div className="partner-cta">
      <p className="partner-cta__text">Want your school, brand or business on this list?</p>
      <a className="btn" href={`https://wa.me/${EVENT.contact.whatsapp}?text=${encodeURIComponent("Hi! I'd like to partner with Littlepreneurs Season 02 as a school / brand / sponsor.")}`} target="_blank" rel="noopener">Partner with us on WhatsApp</a>
    </div>
  </div>
</section>

{/* VIDEOS */}
<section className="section" id="watch">
  <div className="wrap">
    <p className="eyebrow">Littlepreneurs, in motion</p>
    <h2>See the spirit.<br />Feel the possibility.</h2>
    <p className="lede">Tap play to watch right here, or open on Instagram.</p>

    <div className="reels">
      <article className="card reel">
        <div className="reel__frame" data-embed="https://www.instagram.com/p/DfUG5nOprZf/embed/captioned">
          <img src="/assets/img/reel-1.webp" alt="Reel: Tomorrow’s founders start here" width="335" height="595" loading="lazy" />
          <button className="play" aria-label="Play: Tomorrow’s founders"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
        </div>
        <h3>Tomorrow’s founders</h3>
        <a className="link-red" href="https://www.instagram.com/p/DfUG5nOprZf/" target="_blank" rel="noopener">Watch on Instagram ↗</a>
      </article>
      <article className="card reel">
        <div className="reel__frame" data-embed="https://www.instagram.com/p/DfUR8vfpk7c/embed/captioned">
          <img src="/assets/img/reel-2.webp" alt="Reel: A look back at Season 1" width="335" height="595" loading="lazy" />
          <button className="play" aria-label="Play: A look back at Season 1"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
        </div>
        <h3>A look back at Season 1</h3>
        <a className="link-red" href="https://www.instagram.com/p/DfUR8vfpk7c/" target="_blank" rel="noopener">Watch on Instagram ↗</a>
      </article>
    </div>

    <p className="eyebrow">More from Littlepreneurs</p>
    <div className="yt card" data-embed="https://www.youtube-nocookie.com/embed/1iKFopr20U8?autoplay=1&rel=0">
      <img src="https://i.ytimg.com/vi/1iKFopr20U8/hqdefault.jpg" alt="Littlepreneurs on YouTube" width="480" height="360" loading="lazy" />
      <button className="play" aria-label="Play Littlepreneurs on YouTube"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
    </div>
    <a className="ytbar" href="https://www.youtube.com/watch?v=1iKFopr20U8" target="_blank" rel="noopener"><span>Littlepreneurs on YouTube</span><small>Tap to watch the video ↗</small></a>

    <a className="highlights" href="https://www.instagram.com/stories/highlights/18093480485619032/" target="_blank" rel="noopener">
      <span className="highlights__ring"></span>
      <span><strong>Story highlights</strong><small>Peek behind the stalls on Instagram ↗</small></span>
    </a>
  </div>
</section>

{/* BOOKING */}
<section className="section section--book" id="book">
  <div className="wrap">
    <span className="pill pill--dark">Season 02</span>
    <h2>A table for their ideas.<br />A moment they’ll own.</h2>

    <div className="book">
      <div className="book__prices">
        <p className="eyebrow">1 child / 1 table</p>
        <p className="price">₹8,000</p>
        <p className="muted">Per child, per table</p>
        <hr />
        <p className="eyebrow">2 children / 1 shared table</p>
        <p className="price">₹10,000</p>
        <p className="muted">Total for two children</p>
        <span className="pill pill--yellow">Same category only</span>
        <p className="muted small">Both children must be in the same category.</p>
        <p className="limited">Limited slots only</p>
      </div>
      <div className="book__qr">
        <p>Scan to book</p>
        <img src="/assets/img/booking-qr.webp" alt="PhonePe QR code to book a table. Payee: Vasundhara Holdings" width="440" height="440" loading="lazy" />
        <small>Payee</small>
        <strong>Vasundhara Holdings</strong>
      </div>
    </div>

    {EVENT.showRegisterButtons && (
      <div className="book__cta">
        <p className="eyebrow">Already paid, or visiting on the day?</p>
        <div className="hero__cta">
          <Link className="btn" href="/littlepreneurs/register?type=stall">Register your stall</Link>
          <Link className="btn btn--ghost" href="/littlepreneurs/register?type=guest">Get a visitor pass</Link>
        </div>
      </div>
    )}

    <div className="eventbar">
      <strong>20 December</strong><strong>T-Works</strong><strong>12–5 PM</strong>
      <span>Ages 4–16 &nbsp;/&nbsp; Parents welcome at the stall</span>
    </div>

    <div className="handles">
      <a href="https://www.instagram.com/latecheckout.hyd/" target="_blank" rel="noopener">@latecheckout.hyd</a>
      <a href="https://www.instagram.com/littlepreneurs.kids/" target="_blank" rel="noopener">@littlepreneurs.kids</a>
      <a href="https://www.instagram.com/shopdolceamore/" target="_blank" rel="noopener">@shopdolceamore</a>
    </div>
    <p className="quote__text">Tomorrow has<br />their name on it.</p>
  </div>
</section>
</main>

<footer className="footer">
  <div className="wrap footer__in">
    <span>Littlepreneurs / Season 02</span>
    <span>By <Link href="/">Late Checkout</Link> + Dolce Amore · T-Works, Hyderabad</span>
    <span><Link href="/littlepreneurs/login">Staff login</Link> · <a href="#top">Back to top ↑</a></span>
  </div>
</footer>

<div className="lightbox" id="lightbox" hidden>
  <button className="lightbox__close" aria-label="Close">×</button>
  <img alt="" />
  <p></p>
</div>
    </>
  );
}
