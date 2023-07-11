import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChangeEvent, useRef, useState } from "react";

interface FileInputProps {
  className: string;
  onFileChange: (file: File | null) => void;
}

export function FileInput({ className, onFileChange }: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName("");
      onFileChange(null);
    }
  };

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn(``, className)}>
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload file"
      />
      <Button
        type="button"
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={handleChooseFile}
      >
        Choose File
      </Button>
      <span className="ml-2">{fileName}</span>
    </div>
  );
}
