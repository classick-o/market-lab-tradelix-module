import { DecisionDemo } from "../sections/DecisionDemo";
import { Climb } from "../sections/Climb";
import { Faq, FinalCta } from "../sections/Closing";
import { Hero } from "../sections/Hero";
import { Principle, Stats } from "../sections/Principle";
import { Rivals } from "../sections/Rivals";
import { Rooms } from "../sections/Rooms";
import { Toolkit } from "../sections/Toolkit";

/** The homepage: the hook (a call you make yourself), the principle, the rooms, then the details. */
export function HomePage() {
  return (
    <>
      <Hero />
      <DecisionDemo />
      <Stats />
      <Principle />
      <Rooms />
      <Rivals />
      <Toolkit />
      <Climb />
      <Faq />
      <FinalCta />
    </>
  );
}
