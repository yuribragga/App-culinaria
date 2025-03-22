import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';




export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.user || {}; // Supondo que o ID do usuário esteja disponível no token JWT
  if (!id) {
    res.status(400).json({ message: 'ID do usuário não fornecido' });
    return;
  }
  const { name, email, phoneNumber } = req.body;
  

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Atualiza os campos do usuário
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    // Atualiza a imagem de perfil, se enviada
    if (req.file) {
      user.profileImage = req.file.buffer; // Salva a imagem como BLOB
    }

    await userRepository.save(user);

    res.status(200).json({ message: 'Perfil atualizado com sucesso', user });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};