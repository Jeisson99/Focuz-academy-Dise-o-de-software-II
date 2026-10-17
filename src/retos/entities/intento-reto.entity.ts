import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reto } from './reto.entity';
import { ProgresoNivel } from '../../progreso/entities/progreso-nivel.entity';

@Entity('intento_reto')
export class IntentoReto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  progreso_nivel_id: string;

  // @ManyToOne(() => ProgresoNivel) se agregará en la Fase 3
  @ManyToOne(() => ProgresoNivel)
  @JoinColumn({ name: 'progreso_nivel_id' })
  progreso_nivel: ProgresoNivel;

  @Column({ nullable: false })
  reto_id: string;

  @ManyToOne(() => Reto)
  @JoinColumn({ name: 'reto_id' })
  reto: Reto;

  @Column({ type: 'int', default: 1 })
  numero_intento: number;

  @Column({ type: 'int', default: 0 })
  puntaje_obtenido: number;

  @Column({ default: false })
  aprobado: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  realizado_en: Date;

  @Column({ type: 'int', nullable: true })
  duracion_seg: number;
}
