import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inscripcion } from '../../cursos/entities/inscripcion.entity';

@Entity('gamificacion_curso')
export class GamificacionCurso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  inscripcion_id: string;

  @ManyToOne(() => Inscripcion)
  @JoinColumn({ name: 'inscripcion_id' })
  inscripcion: Inscripcion;

  @Column({ type: 'int', default: 0 })
  puntos_acumulados: number;

  @Column({ type: 'int', default: 1 })
  nivel_xp: number;

  @Column({ type: 'int', default: 0 })
  racha_actual_dias: number;

  @Column({ type: 'int', default: 0 })
  racha_maxima_dias: number;

  @Column({ type: 'int', default: 0 })
  total_retos_aprobados: number;

  @Column({ type: 'int', default: 0 })
  tiempo_total_plataforma_seg: number;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizado_en: Date;
}
