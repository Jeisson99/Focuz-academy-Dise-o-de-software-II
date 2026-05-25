import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Inscripcion } from '../../cursos/entities/inscripcion.entity';
import { Nivel } from '../../niveles/entities/nivel.entity';

@Entity('progreso_nivel')
export class ProgresoNivel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  inscripcion_id: string;

  @ManyToOne(() => Inscripcion)
  @JoinColumn({ name: 'inscripcion_id' })
  inscripcion: Inscripcion;

  @Column({ nullable: false })
  nivel_id: string;

  @ManyToOne(() => Nivel)
  @JoinColumn({ name: 'nivel_id' })
  nivel: Nivel;

  @Column({ default: false })
  completado: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date;

  @Column({ type: 'int', default: 0 })
  tiempo_total_seg: number;

  @Column({ type: 'int', default: 0 })
  veces_visto_video: number;
}
