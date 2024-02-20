export const resizeImage = (file, maxWidth) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const width = maxWidth;
        const height = (width / img.width) * img.height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          1 // quality parameter, adjust as needed
        );
      };

      img.onerror = (error) => {
        reject(error);
      };
    };

    reader.readAsDataURL(file);
  });
};
