import * as mysql from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

async function runSeed() {
  console.log('🌱 Iniciando semillero de datos (Seed)...');

  const host = process.env.DB_HOST || 'localhost';
  const dbSsl = process.env.DB_SSL;
  const useSsl = dbSsl === 'true' || dbSsl === '1';

  const connection = await mysql.createConnection({
    host: host,
    port: +(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'unicor_db',
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
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
        titulo: 'Python para Ciencia de Datos',
        descripcion: 'Aprende análisis exploratorio de datos, manipulación con Pandas, cálculo numérico con NumPy y visualización avanzada con Matplotlib y Seaborn.',
        estado: 'publicado',
        niveles: [
          {
            orden: 1,
            titulo: 'Nivel 1: Fundamentos de NumPy y Matrices',
            descripcion: 'Creación de ndarrays, indexación booleana y operaciones vectorizadas.',
            retos: [
              {
                titulo: 'Reto 1: Operaciones Vectorizadas',
                descripcion: '¿Cómo sumar dos arrays de NumPy elemento a elemento sin usar bucles for?',
                tipo: 'quiz',
                puntaje: 60,
              },
            ],
          },
          {
            orden: 2,
            titulo: 'Nivel 2: Limpieza y Manipulación con Pandas',
            descripcion: 'DataFrames, manejo de valores nulos, filtrado y agregaciones con groupby.',
            retos: [
              {
                titulo: 'Reto 2: Filtrado de DataFrames',
                descripcion: 'Escribe la consulta para filtrar filas donde la columna "edad" sea mayor a 25 y "salario" no sea nulo.',
                tipo: 'codigo',
                puntaje: 80,
              },
            ],
          },
          {
            orden: 3,
            titulo: 'Nivel 3: Visualización y Análisis Exploratorio (EDA)',
            descripcion: 'Gráficos de dispersión, histogramas, mapas de calor de correlación y detección de outliers.',
            retos: [
              {
                titulo: 'Reto 3: Mapa de Correlación',
                descripcion: 'Interpreta una matriz de correlación de Pearson y selecciona la variable con mayor correlación positiva.',
                tipo: 'quiz',
                puntaje: 100,
              },
            ],
          },
        ],
        logros: [
          { nombre: 'Científico Novato', descripcion: 'Completar el primer reto de manipulación de arrays', tipo: 'constancia', umbral: 1 },
          { nombre: 'Maestro de Datos', descripcion: 'Completar todos los niveles del curso de Python para Datos', tipo: 'precision', umbral: 3 },
        ],
      },
      {
        titulo: 'Git y GitHub Profesional',
        descripcion: 'Domina el control de versiones moderno: ramas, merge, rebase interactivo, resolución de conflictos, pull requests y flujos de trabajo colaborativos.',
        estado: 'publicado',
        niveles: [
          {
            orden: 1,
            titulo: 'Nivel 1: Flujo Local y Estados de Git',
            descripcion: 'Working Directory, Staging Area, Commits atómicos e inspección con git log y git diff.',
            retos: [
              {
                titulo: 'Reto 1: El Área de Preparación (Staging)',
                descripcion: '¿Qué comando agrega cambios únicamente en archivos específicos antes del commit?',
                tipo: 'quiz',
                puntaje: 50,
              },
            ],
          },
          {
            orden: 2,
            titulo: 'Nivel 2: Ramas, Fusiones y Conflictos',
            descripcion: 'Estrategias de ramificación (feature branches), git merge vs git rebase y resolución de marcas de conflicto.',
            retos: [
              {
                titulo: 'Reto 2: Resolución de Conflicto en Merge',
                descripcion: 'Identifica la sección que debe conservarse al resolver un conflicto entre HEAD y la rama entrante.',
                tipo: 'codigo',
                puntaje: 85,
              },
            ],
          },
          {
            orden: 3,
            titulo: 'Nivel 3: GitHub, Pull Requests y Code Review',
            descripcion: 'Forks, Pull Requests, protección de ramas principales, GitHub Actions y buenas prácticas de colaboración.',
            retos: [
              {
                titulo: 'Reto 3: Creación de Pull Request',
                descripcion: 'Describe los pasos para abrir un Pull Request limpio con commits ordenados hacia la rama main.',
                tipo: 'quiz',
                puntaje: 90,
              },
            ],
          },
        ],
        logros: [
          { nombre: 'Controlador de Versiones', descripcion: 'Aprobar el reto del flujo local de Git', tipo: 'velocidad', umbral: 1 },
          { nombre: 'Colaborador Open Source', descripcion: 'Completar el nivel avanzado de GitHub y PRs', tipo: 'precision', umbral: 3 },
        ],
      },
      {
        titulo: 'Desarrollo Web con Vue 3',
        descripcion: 'Construye aplicaciones web interactivas y reactivas utilizando Vue 3, Composition API, Script Setup, Pinia para estado global y Vue Router.',
        estado: 'publicado',
        niveles: [
          {
            orden: 1,
            titulo: 'Nivel 1: Reactividad y Composition API',
            descripcion: 'Uso de ref, reactive, computed y directivas esenciales (v-if, v-for, v-model).',
            retos: [
              {
                titulo: 'Reto 1: Variables Reactivas con ref()',
                descripcion: '¿Cómo se accede y modifica el valor de una variable creada con ref() en la sección script?',
                tipo: 'quiz',
                puntaje: 55,
              },
            ],
          },
          {
            orden: 2,
            titulo: 'Nivel 2: Componentes y Comunicación',
            descripcion: 'Props tipadas, emits de eventos personalizados, slots y ciclo de vida de componentes.',
            retos: [
              {
                titulo: 'Reto 2: Emisión de Eventos (defineEmits)',
                descripcion: 'Escribe el código para emitir un evento personalizado "updateUser" con un payload de datos.',
                tipo: 'codigo',
                puntaje: 80,
              },
            ],
          },
          {
            orden: 3,
            titulo: 'Nivel 3: Manejo de Estado con Pinia',
            descripcion: 'Stores modulares, state reactivo, getters derivados y actions asíncronas para conectar con APIs REST.',
            retos: [
              {
                titulo: 'Reto 3: Store de Autenticación',
                descripcion: 'Diseña una action en Pinia para autenticar un usuario y guardar el JWT recibido.',
                tipo: 'codigo',
                puntaje: 95,
              },
            ],
          },
        ],
        logros: [
          { nombre: 'Vue Developer', descripcion: 'Primer reto de reactividad completado', tipo: 'constancia', umbral: 1 },
          { nombre: 'Frontend Architect', descripcion: 'Dominar Vue 3 y gestión de estado con Pinia', tipo: 'precision', umbral: 3 },
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

