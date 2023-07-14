import { UserCircle2 } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
        aria-label="Upload image"
      />
      <Button type="button" className="text-sm" onClick={handleChooseFile}>
        <UserCircle2 />
        Select Image
      </Button>
      <span className="w-full ml-2 truncate">{fileName}</span>
    </div>
  );
}
