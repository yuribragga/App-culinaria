import multer from 'multer';


const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos.'));
    }
  },
});


export const recipeImageMiddleware = upload.single('image');

export const userImageMiddleware = upload.single('profileImage'); 


export const multipleImagesMiddleware = upload.array('images', 5);