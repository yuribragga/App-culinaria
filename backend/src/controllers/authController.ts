import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'seu_segredo_super_secreto';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nationality, phoneNumber, name, socialName, profileImage } = req.body; 

    if (!email || !password || !nationality || !phoneNumber || !name) {
      res.status(400).json({ message: 'Email, senha, nacionalidade, número de celular e nome são obrigatórios' });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: 'Email já cadastrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      email,
      password: hashedPassword,
      nationality,
      phoneNumber,
      name,
      socialName,
      profileImage,
    });

    await userRepository.save(newUser);

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: newUser.id,
        email: newUser.email,
        nationality: newUser.nationality,
        phoneNumber: newUser.phoneNumber,
        name: newUser.name,
        socialName: newUser.socialName,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email e senha são obrigatórios' });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(400).json({ message: 'Credenciais inválidas' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { email, nationality, phoneNumber, name, socialName, password, profileImage } = req.body;

    const userRepository = AppDataSource.getRepository(User);

 
    const user = await userRepository.findOne({ where: { id: Number(userId) } });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    user.email = email || user.email;
    user.nationality = nationality || user.nationality;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.name = name || user.name;
    user.socialName = socialName || user.socialName;
    user.profileImage = profileImage || user.profileImage;

 
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await userRepository.save(user);

    res.status(200).json({
      message: 'Usuário atualizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        nationality: user.nationality,
        phoneNumber: user.phoneNumber,
        name: user.name,
        socialName: user.socialName,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};