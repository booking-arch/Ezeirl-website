import { IMG } from "@/lib/universe/content";

export default function About() {
  return (
    <section id="about" className="brand">
      <div className="brand__grid container">
        <div className="brand__copy reveal">
          <p className="section-label">ORIGIN</p>
          <h2 className="brand__title">THIS IS<br /><span>EZE IRL</span></h2>
          <p className="brand__lede">FITNESS. LIFESTYLE. DISCIPLINE.<br />A HIGHER STATE OF LIVING.</p>
          <p className="brand__body">
            EZE IRL is more than content and more than a brand — it&apos;s a standard. Built in Los Angeles for people who train with
            intention, live with clarity, and refuse to stay finished.
          </p>
          <a href="#content" className="btn btn-outline">LEARN MY STORY</a>
        </div>
        <div className="brand__mosaic reveal">
          {/* eslint-disable @next/next/no-img-element */}
          <figure className="brand__shot brand__shot--a"><img src={IMG.train1} alt="Training in the gym" loading="lazy" width={1200} height={1200} /></figure>
          <figure className="brand__shot brand__shot--b"><img src={IMG.lifestyle2} alt="Lifestyle moment" loading="lazy" width={1200} height={1200} /></figure>
          <figure className="brand__shot brand__shot--c"><img src={IMG.hero2} alt="Outdoor strength" loading="lazy" width={941} height={1672} /></figure>
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </div>
    </section>
  );
}
