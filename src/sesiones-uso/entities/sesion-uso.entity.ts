import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inscripcion } from '../../cursos/entities/inscripcion.entity';

@Entity('sesion_uso')
export class SesionUso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  inscripcion_id: string;

  @ManyToOne(() => Inscripcion)
  @JoinColumn({ name: 'inscripcion_id' })
  inscripcion: Inscripcion;

  @Column({ type: 'timestamp', nullable: true })
  inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fin: Date;

  @Column({ type: 'int', default: 0 })
  duracion_seg: number;

  @Column({ type: 'date', nullable: true })
  fecha: Date;
}
