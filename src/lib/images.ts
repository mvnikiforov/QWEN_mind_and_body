/* ============================================================
   Работа с изображениями (низкоуровневый утилита-модуль)
   Используется админ-панелью: загружаемые фото сжимаются на лету
   и сохраняются в базе сайта в виде data-URL.
   ============================================================ */

/**
 * Читает файл как data-URL, вписывает изображение в квадрат `maxSide`
 * и перекодирует в JPEG с качеством `quality`.
 * @param file   выбранный пользователем файл изображения
 * @param maxSide максимальная сторона (px), уменьшение без увеличения
 * @param quality качество JPEG (0…1)
 */
export function compressImage(
  file: File,
  maxSide = 1000,
  quality = 0.85
): Promise<string> {
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
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
