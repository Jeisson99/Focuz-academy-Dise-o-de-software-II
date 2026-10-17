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
import { Nivel } from '../../niveles/entities/nivel.entity';
import { Inscripcion } from './inscripcion.entity';
import { Logro } from '../../gamificacion/entities/logro.entity';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  url_video_intro: string;

  @Column({ nullable: false })
  profesor_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'profesor_id' })
  profesor: User;

  @Column({
    type: 'enum',
    enum: ['borrador', 'publicado', 'archivado'],
    default: 'borrador',
  })
  estado: string;

  @CreateDateColumn({ type: 'timestamp' })
  creado_en: Date;

  @OneToMany(() => Nivel, (nivel) => nivel.curso)
  niveles: Nivel[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.curso)
  inscripciones: Inscripcion[];

  @OneToMany(() => Logro, (logro) => logro.curso)
  logros: Logro[];
}
