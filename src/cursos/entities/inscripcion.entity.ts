import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Curso } from './curso.entity';
import { ProgresoNivel } from '../../progreso/entities/progreso-nivel.entity';
import { GamificacionCurso } from '../../gamificacion/entities/gamificacion-curso.entity';
import { SesionUso } from '../../sesiones-uso/entities/sesion-uso.entity';

@Entity('inscripcion')
export class Inscripcion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  usuario_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ nullable: false })
  curso_id: string;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_inscripcion: Date;

  @Column({
    type: 'enum',
    enum: ['activo', 'completado', 'abandonado'],
    default: 'activo',
  })
  estado: string;

  @OneToMany(() => ProgresoNivel, (progreso) => progreso.inscripcion)
  progresos: ProgresoNivel[];

  @OneToMany(
    () => GamificacionCurso,
    (gamificacion) => gamificacion.inscripcion,
  )
  gamificaciones: GamificacionCurso[];

  @OneToMany(() => SesionUso, (sesion) => sesion.inscripcion)
  sesiones: SesionUso[];
}
