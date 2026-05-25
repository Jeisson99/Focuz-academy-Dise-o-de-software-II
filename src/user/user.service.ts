import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    // Inyección del repositorio de User
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService, // Inyectado
  ) {}

  /**
   * Crear un nuevo usuario
   * Encripta la contraseña antes de guardarla
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear nueva instancia de usuario
    const user = this.userRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    // Guardar en la base de datos
    return await this.userRepository.save(user);
  }

  /**
   * Obtener todos los usuarios
   * No incluye las contraseñas
   */
  async findAll() {
    return await this.userRepository.find();
  }

  /**
   * Obtener un usuario por ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Buscar usuario por email
   * Incluye la contraseña (para autenticación)
   */
  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password_hash', 'nombre', 'rol'],
    });
  }

  /**
   * Actualizar un usuario
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se actualiza la contraseña, encriptarla
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      user.password_hash = updateUserDto.password;
    }

    // Actualizar los campos
    if (updateUserDto.nombre) user.nombre = updateUserDto.nombre;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.rol) user.rol = updateUserDto.rol;

    return await this.userRepository.save(user);
  }

  /**
   * Eliminar un usuario (soft delete)
   */
  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
