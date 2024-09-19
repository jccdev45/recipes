"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState<string | null>()
  const [lastName, setLastName] = useState<string | null>()
  const [avatarUrl, setAvatarUrl] = useState<string | null>()

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`first_name, last_name, avatar_url`)
        .eq("id", user?.id!)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      return toast.error("There was an error loading user info")
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    first_name,
    last_name,
    avatar_url,
  }: {
    first_name?: string | null
    last_name?: string | null
    avatar_url?: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        first_name,
        last_name,
        avatar_url,
        last_updated: new Date().toISOString(),
      })

      if (error) throw error
      toast.success("Profile updated")
    } catch (error) {
      toast.error("Error updating data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-background p-12 text-foreground">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          value={firstName || ""}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          value={lastName || ""}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      {/* <div>
        <Label htmlFor="avatarUrl">avatarUrl</Label>
        <Input
          id="avatarUrl"
          type="url"
          value={avatarUrl || ""}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
      </div> */}

      <div>
        <Button
          onClick={() =>
            updateProfile({
              first_name: firstName,
              last_name: lastName,
              avatar_url: avatarUrl,
            })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </Button>
      </div>
    </div>
  )
}
