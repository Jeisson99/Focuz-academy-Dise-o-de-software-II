import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { Inscripcion } from '../../cursos/entities/inscripcion.entity';

// Decorador @Entity define que esta clase es una entidad de base de datos
@Entity('usuario')
export class User {
  // Clave primaria UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombre del usuario
  @Column({ nullable: false, length: 100 })
  nombre: string;

  // Columna de email única y no nula
  @Column({ unique: true, nullable: false, length: 150 })
  email: string;

  // Columna de contraseña
  @Column({ name: 'password_hash', nullable: false })
  password_hash: string;

  // Rol del usuario
  @Column({
    type: 'enum',
    enum: ['admin', 'profesor', 'alumno'],
    default: 'alumno',
  })
  rol: string;

  // Fecha de registro
  @CreateDateColumn({ type: 'timestamp' })
  fecha_registro: Date;

  // Último acceso
  @Column({ type: 'timestamp', nullable: true })
  ultimo_acceso: Date;

  @OneToMany(() => Curso, (curso) => curso.profesor)
  cursos_creados: Curso[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuario)
  inscripciones: Inscripcion[];
}
