import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';

@Entity('logro')
export class Logro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  curso_id: string;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  icono_url: string;

  @Column({
    type: 'enum',
    enum: ['racha', 'velocidad', 'precision', 'constancia'],
    default: 'constancia',
  })
  tipo: string;

  @Column({ type: 'int', default: 0 })
  umbral: number;
}
