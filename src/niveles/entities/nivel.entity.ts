import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';
import { GuiaImplementacion } from './guia-implementacion.entity';

@Entity('nivel')
export class Nivel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  curso_id: string;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @Column({ type: 'int', default: 1 })
  orden: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  url_video: string;

  @Column({ default: true })
  es_obligatorio: boolean;

  @OneToOne(() => GuiaImplementacion, (guia) => guia.nivel)
  guia: GuiaImplementacion;
}
