"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { T } from "./data";

function Count({ n }) {
  const [v, setV] = useState(0);
  const r = useRef(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      let k = 0;
      const id = setInterval(() => {
        k++;
        setV(Math.round((n * k) / 30));
        if (k >= 30) clearInterval(id);
      }, 35);
    });
    o.observe(r.current);
    return () => o.disconnect();
  }, [n]);
  return <b ref={r}>{v}</b>;
}

const JOBS = [
  { k: "j1", y: "2025 – 2026", cur: true },
  { k: "j2" },
  { k: "j3", y: "2023" },
  { k: "j4", y: "2020" },
  { k: "j5", y: "2019" },
];
const EDU = [
  { k: "e1", y: "2022 – 2024" },
  { k: "e2", y: "2021" },
];
const LANGS = [
  ["ar", "native", 100],
  ["fr", "mid", 60],
  ["en", "mid", 60],
  ["de", "mid", 55],
];

function Item({ d, k, y, cur }) {
  return (
    <article className={"item rv" + (cur ? " cur" : "")}>
      <div className="row">
        <h3>{d[k]}</h3>
        <span className="dots" />
        <span className="year">{y || d[k + "d"]}</span>
      </div>
      <ul>
        {d[k + "l"].map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </article>
  );
}

export default function Page() {
  const [l, setL] = useState("fr");
  const d = T[l];
  const pg = useRef(null);

  useEffect(() => {
    let s = "fr";
    try {
      s = localStorage.getItem("cvlang") || (navigator.language || "fr").slice(0, 2);
    } catch (e) {}
    setL(s === "en" ? "en" : "fr");
  }, []);

  useEffect(() => {
    document.documentElement.lang = l;
    try {
      localStorage.setItem("cvlang", l);
    } catch (e) {}
  }, [l]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          e.target.querySelectorAll(".bar").forEach((b) => b.classList.add("go"));
          io.unobserve(e.target);
        }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".rv").forEach((e) => io.observe(e));
    const onScroll = () => {
      const h = document.documentElement;
      pg.current.style.transform = "scaleX(" + h.scrollTop / (h.scrollHeight - h.clientHeight || 1) + ")";
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div id="pg" ref={pg} />
      <nav>
        <div className="wrap">
          <b>O. DACH</b>
          <div className="links">
            <a href="#exp">{d.nExp}</a>
            <a href="#edu">{d.nEdu}</a>
            <a href="#skills">{d.nSk}</a>
            <a href="#contact">{d.nCt}</a>
          </div>
          <div className="lang" role="group" aria-label="Langue">
            {["fr", "en"].map((x) => (
              <button key={x} aria-pressed={l === x} onClick={() => setL(x)}>
                {x.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div>
            <span className="tag">{d.tag}</span>
            <h1 aria-label="Oussama Dach">
              {["Oussama", "Dach"].map((w, j) => (
                <Fragment key={w}>
                  {[...w].map((c, i) => (
                    <span className="ch" style={{ "--d": i + j * 7 }} key={i}>
                      {c}
                    </span>
                  ))}
                  {j === 0 && <br />}
                </Fragment>
              ))}
            </h1>
            <p className="role">{d.role}</p>
            <p className="sub">{d.sub}</p>
            <div className="cta">
              <a className="btn" href="#contact">{d.hire}</a>
              <a className="btn alt" href="#exp">{d.see}</a>
            </div>
          </div>
          <div className="stage">
            <div className="frame">
              <div className="pic">
                <img src="/photo.jpg" alt="Oussama Dach" />
              </div>
            </div>
            <span className="st s1">{d.stk1}</span>
            <span className="st s2">{d.stk2}</span>
            <div className="burger" aria-hidden="true">
              <i className="b1" /><i className="b2" /><i className="b3" /><i className="b4" /><i className="b5" />
            </div>
          </div>
        </div>
      </header>

      <div className="mq" aria-hidden="true">
        <div className="track">
          {[...d.mq, ...d.mq].map((x, i) => (
            <span key={i}>{x}</span>
          ))}
        </div>
      </div>

      <main>
        <section id="profile">
          <div className="wrap rv">
            <h2>{d.hProfile}</h2>
            <p style={{ maxWidth: "62ch", fontSize: 19 }}>{d.profile}</p>
            <div className="stats">
              <div><Count n={5} /><span>{d.st1}</span></div>
              <div><Count n={4} /><span>{d.st2}</span></div>
              <div><Count n={2} /><span>{d.st3}</span></div>
            </div>
          </div>
        </section>

        <section id="exp" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2 className="rv">{d.hExp}</h2>
            <div className="menu">
              {JOBS.map((j) => (
                <Item key={j.k} d={d} {...j} />
              ))}
            </div>
          </div>
        </section>

        <section id="edu" className="edu" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2 className="rv">{d.hEdu}</h2>
            <div className="menu">
              {EDU.map((e) => (
                <Item key={e.k} d={d} {...e} />
              ))}
            </div>
          </div>
        </section>

        <section id="skills" style={{ paddingTop: 0 }}>
          <div className="wrap grid2">
            <div className="rv">
              <h2>{d.hSk}</h2>
              <div className="chips">
                {d.sk.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            </div>
            <div className="rv">
              <h2>{d.hLg}</h2>
              <div className="lng">
                {LANGS.map(([n, lv, w]) => (
                  <div key={n}>
                    <div>
                      <span>{d[n]}</span>
                      <span>{d[lv]}</span>
                    </div>
                    <div className="bar"><u style={{ "--w": w + "%" }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="wrap">
          <h2>{d.hCt}</h2>
          <p style={{ marginBottom: 6 }}>{d.ctTxt}</p>
          <p className="place" style={{ color: "#e9d9c3" }}>{d.loc}</p>
          <div className="cta">
            <a className="btn" href="mailto:mrdachoussama@gmail.com">mrdachoussama@gmail.com</a>
            <a className="btn alt" href="tel:+212629426992">0629 42 69 92</a>
          </div>
          <p className="n">{d.foot}</p>
        </div>
      </footer>
    </>
  );
}
