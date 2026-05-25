import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Nivel } from '../../niveles/entities/nivel.entity';

@Entity('reto')
export class Reto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nivel_id: string;

  // @ManyToOne(() => Nivel) se agregará en la Fase 3
  @ManyToOne(() => Nivel)
  @JoinColumn({ name: 'nivel_id' })
  nivel: Nivel;

  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ['quiz', 'codigo', 'proyecto'],
    default: 'quiz',
  })
  tipo: string;

  @Column({ type: 'int', default: 1 })
  intentos_max: number;

  @Column({ type: 'int', default: 0 })
  puntaje_base: number;
}
