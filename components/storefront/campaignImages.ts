/**
 * Photography used on the home page.
 *
 * These point at real model photos that already belong to the catalog. To use
 * dedicated campaign shots later, drop the files in public/campaign/ and change
 * the paths below; nothing else needs editing.
 */
const P = "/uploads/products";

export const CAMPAIGN_IMAGES = {
  /** Hero diptych: one photo of a male model, one of a female model. */
  heroMen: `${P}/basic-hoodie/black/e93379af-3559-408b-bb32-e7366753e21e.png`,
  heroWomen: `${P}/basic-hoodie/burgundy/320d7fb0-fbf5-41ff-8e76-47f249409fb7.png`,
  /** Editorial pair, linking to the two categories. */
  editorialHoodies: `${P}/basic-hoodie/cream/fbfd754e-6780-4510-aada-c4db55b140c7.png`,
  editorialPants: `${P}/wide-leg-pants/charcoal/cab53955-c2b4-4472-bd15-be47655520d5.png`,
  /** "Make the silhouette yours" campaign: male and female model. */
  campaignMen: `${P}/basic-hoodie/brown/a461d7da-ff45-4b76-8f19-7a385c26e3e6.png`,
  campaignWomen: `${P}/basic-hoodie/green/5425c66a-a1fc-46da-9d06-251d9cc0dae4.png`,
} as const;
