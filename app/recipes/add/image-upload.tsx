import { ChangeEvent, useRef, useState } from "react"
import { Pizza, UserCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonLoading } from "@/components/ui/button-loading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileInputProps {
  className?: string
  isUploading?: boolean
  onFileChange: (file: File | null) => void
  type?: string
}

export function FileInput({
  className,
  isUploading,
  onFileChange,
  type,
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]

    if (file) {
      setFileName(file.name)
      onFileChange(file)
    } else {
      setFileName("")
      onFileChange(null)
    }
  }

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={cn(``, className)}>
      <Label className="sr-only">
        {type === "recipe"
          ? `Upload/change image for recipe`
          : `Upload/change profile picture`}
      </Label>
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload image"
      />
      {isUploading ? (
        <ButtonLoading className="mx-auto w-1/3" />
      ) : (
        <Button
          variant="secondary"
          className="text-sm"
          onClick={handleChooseFile}
        >
          {type === "recipe" ? (
            <Pizza className="m-0.5" />
          ) : (
            <UserCircle2 className="m-0.5" />
          )}
          <span className="mx-1">Upload Image</span>
        </Button>
      )}
      <span className="ml-2 w-full truncate">{fileName}</span>
    </div>
  )
}
