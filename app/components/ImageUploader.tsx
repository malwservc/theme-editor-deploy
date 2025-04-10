import { useRef } from 'react'

export function ImageUploader({
  value,
  onChange,
  label = 'Imagem',
}: {
  value?: string
  onChange: (val: string) => void
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>

      <div
        className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="mx-auto max-h-40 object-contain rounded"
          />
        ) : (
          <div className="text-sm text-gray-500">Clique para selecionar imagem</div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
