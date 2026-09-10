import { getLocale, getTranslations } from "next-intl/server";

export default async function StoryPage() {
  const locale = await getLocale();
  const t = await getTranslations("footer");

  if (locale === "ar") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
        <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
          الجانب الآخر
        </p>
        <h1 className="mt-5 font-display text-4xl italic leading-[1.1] text-warm-white md:text-5xl">
          شاهد الحقيقة
          <br />
          خلف الستار.
        </h1>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-warm-white/65">
          <p>
            تأسست OtherSide على يد بيدو وإشطا وعمرو، انطلاقًا من فكرة واحدة:
            ما تراه على السطح ليس القصة كاملة أبدًا.
          </p>
          <p>
            أنشأنا OtherSide لنعبّر عن الجوانب المختلفة لما نحن عليه — الجانب
            الذي يراه الناس، والجانب الذي لا يرونه، والجانب الذي لم يُكتشف
            بعد.
          </p>
          <p>
            نهجنا في الأزياء بسيط: بلا تصنيفات غير ضرورية، وبلا قواعد ثابتة،
            وبلا ضغط للانصهار في هوية واحدة. نصنع قطعًا فاخرة للجنسين، مبنية
            على سيلويت قوي، وراحة، وتفرد، وارتداء يومي.
          </p>
          <p>
            بعض التصاميم هادئة وبسيطة. وأخرى تكشف عن المزيد من خلال تفاصيلها،
            أو ألوانها، أو شكلها، أو ما يظهر على الجانب الآخر.
          </p>
          <p>
            عالمنا مبني على التباين — النور والظلام، المرئي وغير المرئي،
            المألوف والمجهول. وهذا التباين نفسه يمتد عبر كل ما نصنعه، من
            الهوديز الواسعة والبناطيل المريحة إلى الهوية البصرية للعلامة
            نفسها.
          </p>
          <p className="font-display text-xl italic text-warm-white">
            OtherSide ليست عن أن تصبح شخصًا آخر.
          </p>
          <p>
            بل هي عن النظر إلى ما هو أبعد من السطح، والتعبير عن الجانب منك
            الذي يشعرك بالحقيقة.
          </p>
        </div>

        <div className="mt-14 border-t border-warm-white/10 pt-10 text-center">
          <p className="font-display text-xl italic text-warm-white">
            بيدو. إشطا. عمرو.
          </p>
          <p className="mt-2 text-sm text-warm-white/45">
            ثلاثة مؤسسين. وجهات نظر مختلفة. رؤية واحدة.
          </p>

          <p className="mt-10 text-xs uppercase tracking-[0.25em] text-warm-white">
            OtherSide
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-warm-white/45">
            {t("tagline")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10 md:py-32">
      <p className="text-xs uppercase tracking-[0.25em] text-electric-violet">
        The OtherSide
      </p>
      <h1 className="mt-5 font-display text-4xl italic leading-[1.1] text-warm-white md:text-5xl">
        See the reality
        <br />
        behind the veil.
      </h1>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-warm-white/65">
        <p>
          OtherSide was founded by Bidu, Eshta, and Amr with one idea: what
          you see on the surface is never the whole story.
        </p>
        <p>
          We created OtherSide to represent the different sides of who we
          are — the side people see, the side they don&apos;t, and the side
          still waiting to be discovered.
        </p>
        <p>
          Our approach to fashion is simple: no unnecessary labels, no fixed
          rules, and no pressure to fit into one identity. We create premium
          unisex pieces built around strong silhouettes, comfort,
          individuality, and everyday wear.
        </p>
        <p>
          Some designs are quiet and minimal. Others reveal more through
          their details, colors, shape, or what appears on the other side.
        </p>
        <p>
          Our world is built around contrast — light and dark, seen and
          unseen, familiar and unknown. That same contrast runs through
          everything we create, from oversized hoodies and relaxed pants to
          the visual identity of the brand itself.
        </p>
        <p className="font-display text-xl italic text-warm-white">
          OtherSide is not about becoming someone else.
        </p>
        <p>
          It is about looking beyond the surface and expressing the side of
          you that feels real.
        </p>
      </div>

      <div className="mt-14 border-t border-warm-white/10 pt-10 text-center">
        <p className="font-display text-xl italic text-warm-white">
          Bidu. Eshta. Amr.
        </p>
        <p className="mt-2 text-sm text-warm-white/45">
          Three founders. Different perspectives. One vision.
        </p>

        <p className="mt-10 text-xs uppercase tracking-[0.25em] text-warm-white">
          OtherSide
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.15em] text-warm-white/45">
          {t("tagline")}
        </p>
      </div>
    </div>
  );
}
