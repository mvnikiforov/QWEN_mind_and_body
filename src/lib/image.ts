/* Сжатие загружаемых изображений: канвас, наибольшая сторона maxSide, JPEG 85%.
   Используется админ-панелью при загрузке фото витрины/публикаций. */
export function compressImage(file: File, maxSide = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * k);
        canvas.height = Math.round(img.height * k);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
