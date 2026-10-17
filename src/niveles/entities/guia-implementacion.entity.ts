import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Nivel } from './nivel.entity';

@Entity('guia_implementacion')
export class GuiaImplementacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nivel_id: string;

  @OneToOne(() => Nivel, (nivel) => nivel.guia)
  @JoinColumn({ name: 'nivel_id' })
  nivel: Nivel;

  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  contenido: string;

  @Column({ type: 'varchar', nullable: true })
  url_recurso: string;
}
