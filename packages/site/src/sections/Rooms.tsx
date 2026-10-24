/**
 * The six rooms of the lab. Desktop: cards scroll on the left while a sticky stage on the right
 * plays the scene of the card in the middle of the screen. Phones: each card carries its own scene.
 * Each card has a 3D object that sits in front of it and leans out further as the card tilts.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSite } from "../context";
import { Icon } from "../components/Icon";
import { APP_ROUTES, EXACT, FLOOR } from "../data/facts";
import { prefersReducedMotion, useInView, useMedia, useTilt } from "../motion/hooks";
import type { RoomId, RoomScene } from "../scenes";
import objArena from "../assets/obj-arena.webp";
import objDuels from "../assets/obj-duels.webp";
import objJournal from "../assets/obj-journal.webp";
import objLearn from "../assets/obj-learn.webp";
import objMissions from "../assets/obj-missions.webp";
import objProgress from "../assets/obj-progress.webp";

interface Room {
  id: RoomId;
  name: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  to: string;
  img: { src: string; w: number; h: number };
  rival?: boolean;
}

const money = EXACT.equity.toLocaleString("en-US");

export const ROOMS: Room[] = [
  {
    id: "learn",
    name: "Learn",
    title: "A course that climbs with you.",
    body: `${FLOOR.lessons}+ five-minute lessons across five levels, from how a price is born to how professionals execute. Animated scenes, hands-on widgets and a three-question check in every lesson.`,
    points: ["Spaced review brings back what you're about to forget", `${FLOOR.concepts}+ concepts and ${FLOOR.terms}+ glossary terms`, "Test out of what you already know"],
    cta: "Explore the course",
    to: APP_ROUTES.learn,
    img: { src: objLearn, w: 255, h: 560 },
  },
  {
    id: "missions",
    name: "Missions",
    title: "Decide at the edge of the chart.",
    body: "Each mission drops you into one market situation with one objective. The chart stops where your knowledge does. You commit, the future is revealed, and the debrief shows what a good process looked like.",
    points: ["Feedback judged only on what you could see", "Daily and weekly challenges", "Assessments that map your skills"],
    cta: "See the missions",
    to: APP_ROUTES.missions,
    img: { src: objMissions, w: 550, h: 560 },
  },
  {
    id: "arena",
    name: "Trading Arena",
    title: "An open market, without the open wallet.",
    body: `${EXACT.regimes} market regimes, from quiet trends to a sudden shock. Market and limit orders, stops and targets, SMA 20 and 50, on a ${money} vUSD virtual account.`,
    points: ["Virtual portfolio with exposure and open risk", "Risk calculator, free on every plan", "An optional journal note on every order"],
    cta: "Open the simulator",
    to: APP_ROUTES.arena,
    img: { src: objArena, w: 367, h: 560 },
  },
  {
    id: "duels",
    name: "Duels",
    title: "Same market. Same second. You or the bot.",
    body: `Real-time one-on-one on a shared chart: a candle every ${EXACT.candleSeconds} seconds, ${EXACT.duelCandles} candles, one winner. ${EXACT.processWeight * 100}% of the score is process and ${100 - EXACT.processWeight * 100}% is result, so the better decision-maker wins.`,
    points: [`${EXACT.bots} bots with real habits, plus Mirror`, "Elo rating and a daily duel", "Mirror plays your most frequent mistake against you"],
    cta: "Pick a rival",
    to: APP_ROUTES.duels,
    img: { src: objDuels, w: 495, h: 560 },
    rival: true,
  },
  {
    id: "journal",
    name: "Trade Journal",
    title: "Every trade replayed. Every alternative priced.",
    body: "Replay any session candle by candle. Then ask what if: half the size, double the size, a tighter stop, no trade at all. See which habit is actually costing you.",
    points: ["Process and outcome side by side, every session", "Decision journal: plan versus execution", "Analytics on risk consistency and stop adherence"],
    cta: "Open the journal",
    to: APP_ROUTES.journal,
    img: { src: objJournal, w: 394, h: 560 },
  },
  {
    id: "progress",
    name: "Achievements",
    title: "Progress you can't buy, and can't luck into.",
    body: `XP comes only from learning, never from simulated profit. ${EXACT.skills} skills on a radar, levels and ranks, ${EXACT.achievements} achievements and a streak that rewards showing up.`,
    points: ["A skill profile built from how you decide", `${EXACT.streakPausesPerWeek} pause days a week, so one busy day doesn't break a streak`, "Milestones and monthly summaries"],
    cta: "See the achievements",
    to: APP_ROUTES.progress,
    img: { src: objProgress, w: 560, h: 513 },
  },
];

/** Tall objects use the full height; wider ones shrink so every object covers about the same area. */
const objectFit = ({ w, h }: { w: number; h: number }) => Math.min(1, Math.sqrt(0.5 / (w / h))).toFixed(3);

/** Mounts one scene when it comes near the screen; plays it only while it's the active room and visible. */
function SceneHost({ id, active }: { id: RoomId; active: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<RoomScene | null>(null);
  const wasActive = useRef(false);
  const near = useInView(host, { margin: "700px 0px", once: true });
  const visible = useInView(host);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!near) return;
    let alive = true;
    void import("../scenes").then(({ ROOM_SCENES }) => {
      if (!alive || !host.current) return;
      scene.current = ROOM_SCENES[id](host.current);
      wasActive.current = false;
      setReady(true);
    });
    return () => {
      alive = false;
      scene.current?.destroy();
      scene.current = null;
      setReady(false);
    };
  }, [near, id]);

  useEffect(() => {
    const s = scene.current;
    if (!s) return;
    if (prefersReducedMotion()) {
      // Jump to the finished frame; events stay on so counters and painted values land too.
      s.timeline.pause();
      s.timeline.seek(s.hold, false);
      return;
    }
    if (active && !wasActive.current) s.timeline.restart();
    wasActive.current = active;
    if (active && visible) s.timeline.play();
    else s.timeline.pause();
  }, [active, visible, ready]);

  return <div ref={host} className="tx-scene-host" data-ready={ready} />;
}

function RoomCard({ room, index, active, inlineScene }: { room: Room; index: number; active: boolean; inlineScene: boolean }) {
  const { appHref } = useSite();
  const tilt = useTilt<HTMLElement>(6);
  const self = useRef<HTMLLIElement>(null);
  const inView = useInView(self, { margin: "-20% 0px -20% 0px" });
  return (
    <li ref={self} id={room.id} className="tx-room" data-active={inlineScene ? inView : active} data-rival={room.rival || undefined}>
      <article ref={tilt} className="tx-room-card" aria-labelledby={`tx-room-${room.id}`}>
        <div className="tx-room-bg" aria-hidden="true" />
        <div className="tx-room-glow" aria-hidden="true" />
        <span className="tx-room-obj" aria-hidden="true" style={{ "--fit": objectFit(room.img) } as CSSProperties}>
          <img src={room.img.src} width={room.img.w} height={room.img.h} alt="" loading="lazy" decoding="async" />
        </span>
        <span className="tx-mono tx-kicker tx-room-kicker">
          {String(index + 1).padStart(2, "0")} — {room.name}
        </span>
        <h3 id={`tx-room-${room.id}`} className="tx-room-title">
          {room.title}
        </h3>
        <p className="tx-room-body">{room.body}</p>
        <ul className="tx-checks">
          {room.points.map((p) => (
            <li key={p}>
              <Icon name="check" size={16} />
              {p}
            </li>
          ))}
        </ul>
        <a className="tx-arrow-link" href={appHref(room.to)}>
          {room.cta}
          <Icon name="arrow-right" size={16} />
        </a>
        {inlineScene && (
          <div className="tx-room-scene">
            <SceneHost id={room.id} active={inView} />
          </div>
        )}
      </article>
    </li>
  );
}

export function Rooms() {
  const { scrollTo } = useSite();
  const wide = useMedia("(min-width: 1024px)");
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  // The active room is the card crossing the middle of the screen.
  useEffect(() => {
    const el = list.current;
    if (!el || !wide) return;
    const items = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(items.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-46% 0px -46% 0px" },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [wide]);

  return (
    <section className="tx-section tx-rooms" aria-labelledby="tx-rooms-title">
      <div className="tx-wrap">
        <header className="tx-head" data-reveal>
          <span className="tx-eyebrow">Inside Tradelix</span>
          <h2 id="tx-rooms-title" className="tx-h2">
            Six rooms. <span className="tx-grad">One habit: deciding well.</span>
          </h2>
          <p className="tx-lead">Learn the idea, use it on a chart, test it against a rival, then study what you did. Every room feeds the next, and all of it runs on virtual money.</p>
        </header>
        <div className="tx-rooms-grid">
          <ol ref={list} className="tx-rooms-list">
            {ROOMS.map((r, i) => (
              <RoomCard key={r.id} room={r} index={i} active={active === i} inlineScene={!wide} />
            ))}
          </ol>
          {wide && (
            <div className="tx-rooms-stage">
              <div className="tx-device" data-rival={ROOMS[active].rival || undefined}>
                <div className="tx-device-bar">
                  <span className="tx-demo-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <div className="tx-device-tabs" role="group" aria-label="Jump to a room">
                    {ROOMS.map((r, i) => (
                      <button key={r.id} type="button" aria-current={active === i ? "true" : undefined} className="tx-device-tab" onClick={() => scrollTo(r.id)}>
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="tx-device-body">
                  {ROOMS.map((r, i) => (
                    <div key={r.id} className="tx-device-scene" data-on={active === i}>
                      <SceneHost id={r.id} active={active === i} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
