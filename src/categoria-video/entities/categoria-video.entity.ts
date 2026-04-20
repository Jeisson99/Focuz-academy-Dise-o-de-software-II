import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('categoria_video')
export class CategoriaVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true, default: '#FFFFFF' })
  color_hex: string | null;

  // URL pública de la imagen de Cloudinary
  @Column({ type: 'varchar', nullable: true })
  icono_url: string | null;

  // Guardamos el public_id de Cloudinary para poder eliminar/actualizar la imagen después
  @Column({ type: 'varchar', nullable: true })
  icono_public_id: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
