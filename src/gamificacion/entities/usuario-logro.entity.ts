import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GamificacionCurso } from './gamificacion-curso.entity';
import { Logro } from './logro.entity';

@Entity('usuario_logro')
export class UsuarioLogro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  gamificacion_curso_id: string;

  @ManyToOne(() => GamificacionCurso)
  @JoinColumn({ name: 'gamificacion_curso_id' })
  gamificacion_curso: GamificacionCurso;

  @Column({ nullable: false })
  logro_id: string;

  @ManyToOne(() => Logro)
  @JoinColumn({ name: 'logro_id' })
  logro: Logro;

  @CreateDateColumn({ type: 'timestamp' })
  obtenido_en: Date;
}
