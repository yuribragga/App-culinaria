import multer from 'multer';

// Configuração genérica para uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB para o tamanho do arquivo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Aceita apenas arquivos de imagem
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos.'));
    }
  },
});

// Middleware para upload de imagens de receitas
export const recipeImageMiddleware = upload.single('image'); // Campo 'image' para receitas

// Middleware para upload de imagens de perfil de usuários
export const userImageMiddleware = upload.single('profileImage'); // Campo 'profileImage' para usuários

// Middleware para upload de múltiplas imagens (se necessário)
export const multipleImagesMiddleware = upload.array('images', 5); // Permite até 5 arquivos no campo 'images'