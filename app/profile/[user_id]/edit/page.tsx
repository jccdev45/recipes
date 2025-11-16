import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { UserProfileForm } from "@/components/user-profile-form"
import { getUser } from "@/app/(auth)/actions"

import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: { user_id: string }
}): Promise<Metadata> {
  const { user_id } = params

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user_id)
      .single()

    const fullName = [data?.first_name, data?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim()
    const readableName = fullName.length > 0 ? fullName : null
    const title = readableName
      ? `Edit ${readableName}'s profile`
      : "Edit Profile"
    const description = readableName
      ? `Update ${readableName}'s Family Recipes profile information and preferences.`
      : "Update your Family Recipes profile information and preferences."

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
      twitter: {
        title,
        description,
        card: "summary",
      },
    }
  } catch (error) {
    console.error("Error generating profile edit metadata", error)
    return {
      title: "Edit Profile",
      description:
        "Update your Family Recipes profile information and preferences.",
    }
  }
}

const profileChecklist = [
  {
    title: "Add a friendly name",
    description:
      "Use the name friends and family know you by so they can find your recipes quickly.",
  },
  {
    title: "Share a welcoming photo",
    description:
      "An updated avatar helps everyone recognize who is sharing each dish.",
  },
  {
    title: "Keep information current",
    description:
      "Updating your details ensures notifications and invitations reach the right inbox.",
  },
]

export default async function EditProfilePage() {
  const { user } = await getUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = await createClient()
  const { data: profileData } = await supabase
    .from("profiles")
    .select("avatar_url, first_name, last_name")
    .eq("id", user.id)
    .single()

  const profileHref = `/profile/${user.id}`

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-8 xl:gap-12">
        <aside
          className="grid gap-6 lg:grid-cols-2"
          aria-labelledby="edit-profile-support-heading"
        >
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col gap-6 p-0">
              <figure className="bg-muted relative h-64 w-full">
                <Image
                  src="/images/AccountInfo.svg"
                  alt="Illustration of a person reviewing account settings on a large screen"
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
              </figure>
              <div className="space-y-3 px-6 pb-6">
                <Typography
                  variant="h3"
                  id="edit-profile-support-heading"
                  className="text-xl font-semibold"
                >
                  Preview your changes
                </Typography>
                <Typography variant="muted" className="text-base">
                  After saving, you can review exactly how your profile appears
                  to loved ones and adjust at any time.
                </Typography>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <Link href={profileHref}>View profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Typography variant="h3" className="text-xl font-semibold">
                Tips for a welcoming profile
              </Typography>
              <CardDescription>
                Small updates help everyone feel connected when browsing your
                recipes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-4">
                {profileChecklist.map(({ title, description }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="text-primary bg-primary/10 mt-1 flex size-6 items-center justify-center rounded-full">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="space-y-1">
                      <Typography
                        variant="small"
                        className="text-foreground font-semibold"
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="muted"
                        className="text-sm leading-relaxed"
                      >
                        {description}
                      </Typography>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        <article
          aria-labelledby="edit-profile-heading"
          className="bg-background space-y-6 rounded-3xl border p-8 shadow-lg ring-1 ring-black/5 sm:space-y-8 sm:p-10"
        >
          <div className="space-y-3">
            <Typography
              variant="h2"
              id="edit-profile-heading"
              className="text-3xl font-semibold sm:text-4xl"
            >
              Personalize your account
            </Typography>
            <Typography variant="muted" className="text-base leading-relaxed">
              Keep your contact details and password up to date so the Family
              Recipes community can stay in touch and celebrate your latest
              dishes.
            </Typography>
          </div>

          <UserProfileForm
            title="Edit Profile"
            formType="edit"
            userData={user}
            profileData={profileData ?? undefined}
            className="border-none bg-transparent p-0 shadow-none"
          />
        </article>
      </section>
    </main>
  )
}
