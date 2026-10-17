import * as mysql from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

async function runSeed() {
  console.log('🌱 Iniciando semillero de datos (Seed)...');

  const host = process.env.DB_HOST || 'localhost';
  const isRemote = host !== 'localhost' && host !== '127.0.0.1';

  const connection = await mysql.createConnection({
    host: host,
    port: +(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'unicor_db',
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  });

  try {
    // 1. Crear o actualizar Usuarios
    console.log('👤 Creando usuarios iniciales...');
    const hashedProfesor = await bcrypt.hash('profesor123', 10);
    const hashedAlumno = await bcrypt.hash('alumno123', 10);
    const hashedAdmin = await bcrypt.hash('admin123', 10);

    const [profesores]: any = await connection.query(
      'SELECT id FROM usuario WHERE email = ?',
      ['profesor@focuz.com']
    );

    let profesorId: string;
    if (profesores.length === 0) {
      profesorId = randomUUID();
      await connection.query(
        'INSERT INTO usuario (id, nombre, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
        [profesorId, 'Prof. Alexander Toscano', 'profesor@focuz.com', hashedProfesor, 'profesor']
      );
      console.log('  ✓ Creado: profesor@focuz.com / profesor123');
    } else {
      profesorId = profesores[0].id;
      console.log('  ✓ Ya existe: profesor@focuz.com');
    }

    const [alumnos]: any = await connection.query(
      'SELECT id FROM usuario WHERE email = ?',
      ['alumno@focuz.com']
    );

    let alumnoId: string;
    if (alumnos.length === 0) {
      alumnoId = randomUUID();
      await connection.query(
        'INSERT INTO usuario (id, nombre, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
        [alumnoId, 'Juan Diego Estudiante', 'alumno@focuz.com', hashedAlumno, 'alumno']
      );
      console.log('  ✓ Creado: alumno@focuz.com / alumno123');
    } else {
      alumnoId = alumnos[0].id;
      console.log('  ✓ Ya existe: alumno@focuz.com');
    }

    const [admins]: any = await connection.query(
      'SELECT id FROM usuario WHERE email = ?',
      ['admin@focuz.com']
    );

    if (admins.length === 0) {
      const adminId = randomUUID();
      await connection.query(
        'INSERT INTO usuario (id, nombre, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
        [adminId, 'Administrador Focuz', 'admin@focuz.com', hashedAdmin, 'admin']
      );
      console.log('  ✓ Creado: admin@focuz.com / admin123');
    } else {
      console.log('  ✓ Ya existe: admin@focuz.com');
    }

    // 2. Crear Cursos
    console.log('📚 Creando cursos formativos...');
    const cursosData = [
      {
        titulo: 'Introducción a la Algoritmia y Lógica',
        descripcion: 'Aprende los fundamentos del pensamiento computacional, estructuras de control secuenciales y diagramas de flujo mediante el marco MODESEC.',
        estado: 'publicado',
        niveles: [
          {
            orden: 1,
            titulo: 'Nivel 1: Conceptos Básicos y Sintaxis',
            descripcion: 'Fundamentos de variables, operadores aritméticos y lógicos.',
            retos: [
              {
                titulo: 'Reto 1: Declaración de Variables',
                descripcion: 'Identifica la sintaxis correcta para declarar constantes y variables en programación estructurada.',
                tipo: 'quiz',
                puntaje: 50,
              },
            ],
          },
          {
            orden: 2,
            titulo: 'Nivel 2: Estructuras Condicionales',
            descripcion: 'Evaluación de decisiones booleanas if-else y switch.',
            retos: [
              {
                titulo: 'Reto 2: Condicionales Anidados',
                descripcion: 'Determina la salida esperada al evaluar condiciones múltiples.',
                tipo: 'quiz',
                puntaje: 75,
              },
            ],
          },
          {
            orden: 3,
            titulo: 'Nivel 3: Bucles y Repeticiones',
            descripcion: 'Ciclos for, while y buenas prácticas para evitar bucles infinitos.',
            retos: [
              {
                titulo: 'Reto 3: Algoritmo de Acumulación',
                descripcion: 'Calcula la sumatoria de elementos en una serie numérica usando un bucle.',
                tipo: 'codigo',
                puntaje: 100,
              },
            ],
          },
        ],
        logros: [
          { nombre: 'Primeros Pasos', descripcion: 'Inscribirse y completar el primer reto de lógica', tipo: 'constancia', umbral: 1 },
          { nombre: 'Pensador Algorítmico', descripcion: 'Completar los 3 niveles del curso de Algoritmia', tipo: 'precision', umbral: 3 },
        ],
      },
      {
        titulo: 'Estructuras de Datos y Complejidad',
        descripcion: 'Domina arreglos, listas enlazadas, pilas, colas, árboles y grafos optimizando recursos de memoria y tiempo computacional.',
        estado: 'publicado',
        niveles: [
          {
            orden: 1,
            titulo: 'Nivel 1: Arreglos y Matrices Dinámicas',
            descripcion: 'Indexación, recorrido e inserción en estructuras lineales.',
            retos: [
              {
                titulo: 'Reto 1: Complejidad en Arreglos',
                descripcion: '¿Cuál es la complejidad temporal de una búsqueda binaria en un arreglo ordenado?',
                tipo: 'quiz',
                puntaje: 60,
              },
            ],
          },
          {
            orden: 2,
            titulo: 'Nivel 2: Pilas y Colas (LIFO / FIFO)',
            descripcion: 'Implementación de colas de prioridad y pilas para evaluación sintáctica.',
            retos: [
              {
                titulo: 'Reto 2: Verificación de Paréntesis Balanceados',
                descripcion: 'Aplica una pila para verificar si los símbolos de agrupación coinciden.',
                tipo: 'codigo',
                puntaje: 90,
              },
            ],
          },
        ],
        logros: [
          { nombre: 'Estructurador Junior', descripcion: 'Superar los retos de arreglos y matrices', tipo: 'velocidad', umbral: 1 },
        ],
      },
    ];

    for (const cData of cursosData) {
      const [existing]: any = await connection.query(
        'SELECT id FROM curso WHERE titulo = ?',
        [cData.titulo]
      );

      let cursoId: string;
      if (existing.length === 0) {
        cursoId = randomUUID();
        await connection.query(
          'INSERT INTO curso (id, titulo, descripcion, profesor_id, estado) VALUES (?, ?, ?, ?, ?)',
          [cursoId, cData.titulo, cData.descripcion, profesorId, cData.estado]
        );
        console.log(`  ✓ Creado curso: "${cData.titulo}"`);
      } else {
        cursoId = existing[0].id;
        console.log(`  ✓ Ya existe curso: "${cData.titulo}"`);
      }

      // Niveles y Retos
      for (const nData of cData.niveles) {
        const [existingNivel]: any = await connection.query(
          'SELECT id FROM nivel WHERE curso_id = ? AND orden = ?',
          [cursoId, nData.orden]
        );

        let nivelId: string;
        if (existingNivel.length === 0) {
          nivelId = randomUUID();
          await connection.query(
            'INSERT INTO nivel (id, curso_id, orden, titulo, descripcion, es_obligatorio) VALUES (?, ?, ?, ?, ?, ?)',
            [nivelId, cursoId, nData.orden, nData.titulo, nData.descripcion, true]
          );
          console.log(`    - Nivel ${nData.orden}: "${nData.titulo}" creado`);
        } else {
          nivelId = existingNivel[0].id;
        }

        // Retos
        for (const rData of nData.retos) {
          const [existingReto]: any = await connection.query(
            'SELECT id FROM reto WHERE nivel_id = ? AND titulo = ?',
            [nivelId, rData.titulo]
          );

          if (existingReto.length === 0) {
            const retoId = randomUUID();
            await connection.query(
              'INSERT INTO reto (id, nivel_id, titulo, descripcion, tipo, intentos_max, puntaje_base) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [retoId, nivelId, rData.titulo, rData.descripcion, rData.tipo, 3, rData.puntaje]
            );
            console.log(`      • Reto: "${rData.titulo}" creado`);
          }
        }
      }

      // Logros
      for (const lData of cData.logros) {
        const [existingLogro]: any = await connection.query(
          'SELECT id FROM logro WHERE curso_id = ? AND nombre = ?',
          [cursoId, lData.nombre]
        );

        if (existingLogro.length === 0) {
          const logroId = randomUUID();
          await connection.query(
            'INSERT INTO logro (id, curso_id, nombre, descripcion, tipo, umbral) VALUES (?, ?, ?, ?, ?, ?)',
            [logroId, cursoId, lData.nombre, lData.descripcion, lData.tipo, lData.umbral]
          );
          console.log(`    🏆 Logro: "${lData.nombre}" creado`);
        }
      }

      // Inscripción de prueba para el alumno
      const [existingInscripcion]: any = await connection.query(
        'SELECT id FROM inscripcion WHERE usuario_id = ? AND curso_id = ?',
        [alumnoId, cursoId]
      );

      if (existingInscripcion.length === 0) {
        const inscripcionId = randomUUID();
        await connection.query(
          'INSERT INTO inscripcion (id, usuario_id, curso_id, estado) VALUES (?, ?, ?, ?)',
          [inscripcionId, alumnoId, cursoId, 'activo']
        );
        console.log(`    🎓 Inscripción creada para alumno@focuz.com en "${cData.titulo}"`);
      }
    }

    console.log('\n✅ Semillero de datos completado exitosamente.');
    console.log('\n🔑 Credenciales generadas:');
    console.log('   Profesor : profesor@focuz.com / profesor123');
    console.log('   Alumno   : alumno@focuz.com   / alumno123');
    console.log('   Admin    : admin@focuz.com    / admin123\n');
  } catch (err) {
    console.error('❌ Error durante la ejecución del seed:', err);
  } finally {
    await connection.end();
  }
}

runSeed();

