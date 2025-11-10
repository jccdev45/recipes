import { Tagline } from "@/components/landing/tagline"
import { UserAvatar } from "@/components/user-avatar"

type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
  initials: string
  avatarSrc?: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "jordan-1",
    name: "Jordan",
    role: "Recipe Explorer",
    quote:
      "The recipe cards make it easy to share recipes without misplacing the scribbled notes we used before.",
    initials: "J",
  },
  {
    id: "nadroj",
    name: "Nadroj",
    role: "Flavor Archivist",
    quote:
      "I dropped in photos, stories, and timer hints so every cousin nails pernil night. It's like we are cooking together again.",
    initials: "N",
  },
  {
    id: "not-jordan",
    name: "Not Jordan",
    role: "Weekend Host",
    quote:
      "The search and tagging make it painless to plan brunch. One tap and I have all the favorites ready.",
    initials: "NJ",
  },
  {
    id: "also-not-jordan",
    name: "Definitely Also Not Jordan",
    role: "Dessert Teller",
    quote:
      "Sharing with the family means so much. Seeing everyone leave comments keeps traditions glowing.",
    initials: "DN",
  },
]

export function TestimonialsSection() {
  const headingId = "testimonials-heading"

  return (
    <section
      className="container-padding-x section-padding-y bg-muted/40"
      aria-labelledby={headingId}
    >
      <div className="container mx-auto flex flex-col gap-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <Tagline>Community voices</Tagline>
          <h2 id={headingId} className="heading-lg text-foreground">
            What our Jordans are cooking up
          </h2>
          <p className="text-muted-foreground">
            Stories from the cooks preserving family classics and experimenting
            with new twists for every gathering.
          </p>
        </div>

        <div role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => {
            const nameParts = testimonial.name.trim().split(/\s+/)
            const firstName = nameParts[0] ?? undefined
            const lastName =
              nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined

            return (
              <article
                key={testimonial.id}
                role="listitem"
                className="bg-background/60 border-border/60 hover:border-border focus-within:border-border flex h-full flex-col gap-6 rounded-2xl border p-6 shadow-sm transition duration-200 focus-within:shadow-lg hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <UserAvatar
                    size="md"
                    className="rounded-xl"
                    firstName={firstName}
                    lastName={lastName}
                    src={testimonial.avatarSrc}
                    alt={`${testimonial.name}'s avatar`}
                  />
                  <div className="flex flex-col">
                    <p className="text-foreground text-sm font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <blockquote className="text-muted-foreground relative text-base leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="text-primary absolute top-0 -left-3 text-3xl"
                  >
                    “
                  </span>
                  {testimonial.quote}
                  <span aria-hidden="true" className="text-primary text-3xl">
                    ”
                  </span>
                </blockquote>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
