import { getPayload } from "payload"
import fs from "fs"
import path from "path"

// Simple robust custom env loader to avoid external dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local")
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8")
    envConfig.split(/\r?\n/).forEach((line) => {
      const parts = line.split("=")
      if (parts.length >= 2) {
        const key = parts[0].trim()
        let value = parts.slice(1).join("=").trim()
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1)
        }
        process.env[key] = value
      }
    })
    console.log("Loaded environment variables from .env.local")
  }
}

// Execute environment loader immediately before any other imports
loadEnv()

async function seed() {
  console.log("Dynamically importing payload.config...")
  const configModule = await import("../payload.config")
  const configPromise = configModule.default

  console.log("Initializing Payload...")
  const payload = await getPayload({ config: configPromise })
  console.log("Payload initialized successfully!")

  console.log("Checking for existing blog posts...")
  const existingPosts = await payload.find({
    collection: "blog-posts",
    limit: 1,
  })

  if (existingPosts.docs.length > 0) {
    console.log("Blog posts already exist in Payload CMS. Skipping seed.")
    process.exit(0)
  }

  console.log("Fetching categories to associate blog posts...")
  const categories = await payload.find({
    collection: "categories",
    limit: 3,
  })

  const categoryId = categories.docs?.[0]?.id || null

  const blogPosts = [
    {
      title: "Wprowadzenie do Tradycyjnej Medycyny Chińskiej (TCM)",
      slug: "wprowadzenie-do-tcm",
      excerpt: "Dowiedz się, czym jest Tradycyjna Medycyna Chińska, jak działa koncepcja Qi, Yin i Yang oraz jak możesz zastosować te starożytne zasady w codziennym dbaniu o zdrowie i witalność.",
      content: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              children: [
                {
                  type: "text",
                  text: "Tradycyjna Medycyna Chińska (TCM) to system medyczny o historii sięgającej ponad 2500 lat. W przeciwieństwie do zachodniej medycyny alopatycznej, która często skupia się na leczeniu objawowym, TCM traktuje organizm ludzki jako zintegrowaną całość, w której zdrowie zależy od zachowania dynamicznej równowagi pomiędzy przeciwstawnymi siłami Yin i Yang.",
                  version: 1
                }
              ]
            },
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              children: [
                {
                  type: "text",
                  text: "Kluczowym pojęciem w TCM jest energia życiowa Qi, która przepływa przez organizm siecią kanałów energetycznych zwanych meridianami. Kiedy przepływ Qi jest zablokowany lub zakłócony, pojawia się choroba. Poprzez zastosowanie akupunktury, ziół, diety oraz ćwiczeń fizycznych (takich jak Qigong czy Tai Chi), medycyna chińska dąży do przywrócenia swobodnego krążenia energii i naturalnej harmonii organizmu.",
                  version: 1
                }
              ]
            }
          ]
        }
      },
      category: categoryId,
      status: "published",
      publishedAt: new Date().toISOString(),
      seo: {
        meta_title: "Wprowadzenie do Tradycyjnej Medycyny Chińskiej (TCM)",
        meta_description: "Poznaj podstawy Tradycyjnej Medycyny Chińskiej. Czym są Qi, Yin i Yang oraz jak wpływają na Twoje codzienne samopoczucie.",
      }
    },
    {
      title: "Jak wspierać odporność na wiosnę z ziołami TCM",
      slug: "odpornosc-na-wiosne-tcm",
      excerpt: "Wiosna to czas odrodzenia natury, ale też duże wyzwanie dla naszego układu odpornościowego. Poznaj najlepsze receptury ziołowe i praktyki TCM na wiosenne przesilenie.",
      content: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              children: [
                {
                  type: "text",
                  text: "Zgodnie z zegarem narządów w Tradycyjnej Medycynie Chińskiej, wiosna jest porą roku przypisaną do elementu Drewna oraz energii Wątroby i Woreczka Żółciowego. To czas intensywnego oczyszczania, wzrostu i odnowy. W tym okresie nasz organizm dostosowuje się do cieplejszych dni, co może osłabić układ odpornościowy i prowadzić do tzw. przesilenia wiosennego.",
                  version: 1
                }
              ]
            },
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              children: [
                {
                  type: "text",
                  text: "Aby wspomóc organizm w tej transformacji, warto sięgnąć po naturalne zioła wspierające odporność i harmonizujące wątrobę. TCM poleca w tym okresie łagodne herbaty ziołowe, np. z dodatkiem chryzantemy, jagód goji, korzenia astragalusa (Traganek) czy lukrecji. Pomogą one wzmocnić obronne Qi (Wei Qi) i zabezpieczyć nas przed nagłymi zmianami pogody oraz infekcjami.",
                  version: 1
                }
              ]
            }
          ]
        }
      },
      category: categoryId,
      status: "published",
      publishedAt: new Date().toISOString(),
      seo: {
        meta_title: "Odporność na wiosnę z ziołami TCM | Poradnik",
        meta_description: "Dowiedz się, jak dbać o odporność wiosną. Poznaj przepisy i zioła TCM wspomagające układ immunologiczny i wątrobę.",
      }
    },
    {
      title: "Zalety regularnej praktyki Qigong i Akupresury",
      slug: "zalety-qigong-i-akupresury",
      excerpt: "Odkryj proste ćwiczenia oddechowe i techniki uciskania punktów akupresurowych, które pomogą Ci skutecznie zredukować stres i przywrócić naturalną równowagę.",
      content: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              children: [
                {
                  type: "text",
                  text: "W dzisiejszym zabieganym świecie stres stał się powszechnym problemem, który negatywnie odbija się na naszym zdrowiu psychicznym i fizycznym. Tradycyjna Medycyna Chińska oferuje dwa niezwykle skuteczne i w pełni naturalne narzędzia do walki ze stresem: Qigong oraz Akupresurę, które każdy z nas może praktykować we własnym domu.",
                  version: 1
                }
              ]
            },
            {
              type: "paragraph",
              format: "",
              indent: 0,
              version: 1,
              children: [
                {
                  type: "text",
                  text: "Qigong to starożytna sztuka ćwiczeń ruchowo-oddechowych, która łączy płynne, powolne ruchy ciała z głębokim oddechem i medytacją. Pomaga rozluźnić napięcia mięśniowe, poprawić krążenie krwi i wyciszyć układ nerwowy. Z kolei akupresura polega na delikatnym uciskaniu określonych punktów na ciele (takich jak punkt Yintang między brwiami czy punkt Neiguan na nadgarstku), co natychmiastowo łagodzi niepokój, redukuje bóle głowy i poprawia jakość snu.",
                  version: 1
                }
              ]
            }
          ]
        }
      },
      category: categoryId,
      status: "published",
      publishedAt: new Date().toISOString(),
      seo: {
        meta_title: "Praktyka Qigong i Akupresura na stres - TCM",
        meta_description: "Poznaj proste techniki akupresury i Qigong, które pomogą Ci złagodzić stres, poprawić samopoczucie i wyciszyć umysł w codziennym życiu.",
      }
    }
  ]

  console.log("Seeding blog posts...")
  for (const post of blogPosts) {
    const created = await payload.create({
      collection: "blog-posts",
      data: post,
    })
    console.log(`Created blog post: "${created.title}" (slug: ${created.slug})`)
  }

  console.log("Seeding completed successfully!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("Error seeding blog posts:", err)
  process.exit(1)
})
