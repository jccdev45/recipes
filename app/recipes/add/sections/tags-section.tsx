import { useRef, useState } from "react"
import {
  Check,
  PencilLine,
  Plus,
  Tag as TagIcon,
  X as XIcon,
} from "lucide-react"

import { genId } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EmptyStateDisplay } from "@/components/empty-state-display"
import { FormInfoAlert } from "@/components/form-info-alert"
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
} from "@/components/tags"

import {
  addRecipeDefaultValuesShape,
  getErrorId,
  getNameFromPath,
  withAddRecipeForm,
} from "../add-recipe-form.hook"
import type { AddRecipeFormValues } from "@/lib/zod/schema"

export type SuggestedTag = NonNullable<AddRecipeFormValues["tags"]>[number]

export const TagsSection = withAddRecipeForm({
  defaultValues: addRecipeDefaultValuesShape,
  props: {
    suggestedTags: [] as SuggestedTag[],
  },
  render: function Render({ form, suggestedTags }) {
    const [pendingTag, setPendingTag] = useState("")
    const [tagHelper, setTagHelper] = useState<string | null>(null)
    const [tagEditState, setTagEditState] = useState<{
      id: string
      index: number
      value: string
    } | null>(null)
    const [suggestedTagsOpen, setSuggestedTagsOpen] = useState(false)

    const tagInputRef = useRef<HTMLInputElement>(null)

    const FormField = form.Field

    return (
      <Card className="shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <TagIcon aria-hidden="true" className="text-primary h-5 w-5" />
            <CardTitle className="text-xl font-semibold">Tags</CardTitle>
          </div>
          <CardDescription>
            Help people discover your recipe by choosing relevant tags.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormInfoAlert
            type="info"
            title="Tagging tip"
            desc="Mix course types (breakfast, dessert) with key ingredients to improve search results."
          />

          <FormField name="tags">
            {(tagsField) => {
              const errorId = getErrorId(tagsField.name)

              const addTagFromValue = (tagText: string) => {
                const trimmedTag = tagText.trim()

                if (!trimmedTag) {
                  setTagHelper("Add a tag before continuing.")
                  return false
                }

                if (tagsField.state.value.length >= 5) {
                  setTagHelper("You can add up to five tags per recipe.")
                  return false
                }

                const normalized = trimmedTag.toLowerCase()
                const alreadyExists = tagsField.state.value.some(
                  (tag) => tag.tag.toLowerCase() === normalized
                )

                if (alreadyExists) {
                  setTagHelper("That tag is already added to this recipe.")
                  return false
                }

                tagsField.pushValue({ id: genId(), tag: trimmedTag })
                setTagHelper(null)
                return true
              }

              const handleAddTag = () => {
                if (addTagFromValue(pendingTag)) {
                  setPendingTag("")
                  tagInputRef.current?.focus()
                } else if (!pendingTag.trim()) {
                  tagInputRef.current?.focus()
                }
              }

              const handleSaveTag = () => {
                if (!tagEditState) return
                const trimmedTag = tagEditState.value.trim()

                if (!trimmedTag) {
                  setTagHelper("Tag text cannot be empty when editing.")
                  return
                }

                const normalized = trimmedTag.toLowerCase()
                const duplicate = tagsField.state.value.some((tag, idx) =>
                  idx !== tagEditState.index
                    ? tag.tag.toLowerCase() === normalized
                    : false
                )

                if (duplicate) {
                  setTagHelper("Another tag already uses that text.")
                  return
                }

                const current = tagsField.state.value[tagEditState.index]
                if (!current) return

                tagsField.replaceValue(tagEditState.index, {
                  ...current,
                  tag: trimmedTag,
                })

                setTagHelper(null)
                setTagEditState(null)
              }

              const openEditor = (id: string, index: number, value: string) => {
                setTagEditState({ id, index, value })
              }

              return (
                <FieldSet
                  className="space-y-5"
                  aria-describedby={
                    tagsField.state.meta.errors?.length ? errorId : undefined
                  }
                >
                  <FieldLegend className="sr-only">Tags</FieldLegend>
                  <FieldDescription>
                    Press Enter to add tags quickly. Tags appear as badges that
                    you can edit or remove later.
                  </FieldDescription>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Tags
                      className="sm:max-w-sm"
                      open={suggestedTagsOpen}
                      onOpenChange={setSuggestedTagsOpen}
                    >
                      <TagsTrigger
                        placeholder="Browse tags"
                        aria-label="Browse tags"
                      />
                      <TagsContent align="start">
                        <TagsInput placeholder="Search tags..." />
                        <TagsList>
                          <TagsEmpty>No suggested tags available.</TagsEmpty>
                          <TagsGroup>
                            {suggestedTags.map((tagOption) => {
                              const displayTag = tagOption.tag.trim()
                              const isAlreadyAdded = tagsField.state.value.some(
                                (tag) =>
                                  tag.tag.toLowerCase() ===
                                  displayTag.toLowerCase()
                              )

                              return (
                                <TagsItem
                                  key={tagOption.id}
                                  value={displayTag}
                                  onSelect={() => {
                                    const didAdd = addTagFromValue(displayTag)

                                    if (didAdd) {
                                      setPendingTag("")
                                      setSuggestedTagsOpen(false)
                                    }
                                  }}
                                  aria-disabled={isAlreadyAdded}
                                  aria-selected={isAlreadyAdded}
                                  aria-checked={isAlreadyAdded}
                                >
                                  <span>{displayTag}</span>
                                  {isAlreadyAdded ? (
                                    <Check
                                      aria-hidden="true"
                                      className="text-primary ml-2 h-4 w-4"
                                    />
                                  ) : null}
                                </TagsItem>
                              )
                            })}
                          </TagsGroup>
                        </TagsList>
                      </TagsContent>
                    </Tags>

                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="outline"
                    >
                      <Plus aria-hidden="true" className="h-4 w-4" />
                      Add tag
                    </Button>
                  </div>

                  {tagHelper && <FieldError>{tagHelper}</FieldError>}

                  {tagsField.state.meta.errors?.length ? (
                    <FieldError
                      id={errorId}
                      errors={tagsField.state.meta.errors}
                    />
                  ) : null}

                  {tagsField.state.value.length === 0 ? (
                    <EmptyStateDisplay
                      aria-live="polite"
                      className="border-border/50 bg-muted/30 border"
                      icon={<TagIcon aria-hidden="true" className="h-5 w-5" />}
                      title="No tags yet"
                      description={`Add tags using the field above, then choose "Add tag" so cooks can find your recipe faster.`}
                    >
                      <span className="text-muted-foreground text-sm">
                        Suggested tags stay available, and saved tags appear
                        here for quick inline editing or removal.
                      </span>
                    </EmptyStateDisplay>
                  ) : (
                    <div
                      className="flex flex-wrap gap-3"
                      role="list"
                      aria-live="polite"
                    >
                      {tagsField.state.value.map((tag, index) => {
                        if (!tag?.id) {
                          return null
                        }

                        const isEditing = tagEditState?.id === tag.id

                        return (
                          <div
                            key={tag.id}
                            role="listitem"
                            className="relative flex items-center gap-2"
                          >
                            <Popover
                              open={isEditing}
                              onOpenChange={(open) => {
                                if (open) {
                                  openEditor(tag.id, index, tag.tag)
                                } else {
                                  setTagEditState((previous) =>
                                    previous?.id === tag.id ? null : previous
                                  )
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Badge asChild variant="secondary">
                                  <button
                                    type="button"
                                    className="flex items-center gap-2"
                                    aria-label={`Edit tag ${tag.tag}`}
                                  >
                                    <span>{tag.tag}</span>
                                    <PencilLine
                                      aria-hidden="true"
                                      className="h-3.5 w-3.5"
                                    />
                                  </button>
                                </Badge>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-64 space-y-3"
                                align="start"
                              >
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-tag-${tag.id}`}>
                                    Update tag
                                  </Label>
                                  <Input
                                    id={`edit-tag-${tag.id}`}
                                    value={
                                      tagEditState?.id === tag.id
                                        ? tagEditState.value
                                        : tag.tag
                                    }
                                    onChange={(event) =>
                                      setTagEditState((previous) =>
                                        previous?.id === tag.id
                                          ? {
                                              ...previous,
                                              value: event.target.value,
                                            }
                                          : previous
                                      )
                                    }
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter") {
                                        event.preventDefault()
                                        handleSaveTag()
                                      }
                                    }}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleSaveTag}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setTagEditState(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => {
                                tagsField.removeValue(index)
                                if (tagEditState?.id === tag.id) {
                                  setTagEditState(null)
                                }
                              }}
                              aria-label={`Remove tag ${tag.tag}`}
                              className="absolute -top-1 -right-1 size-4"
                            >
                              <XIcon aria-hidden="true" className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </FieldSet>
              )
            }}
          </FormField>
        </CardContent>
      </Card>
    )
  },
})
