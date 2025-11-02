// Banco de dados local (localStorage) para cursos, alunos e matrículas

export type Student = {
  id: number;
  nome: string;
  cpf: string;
  dataNasc: string; // ISO ou dd/mm/aaaa
  celular: string;
  foto: string | null;
};

export type Course = {
  id: number;
  codigo: string;
  nome: string;
  cargaHoraria: number; // horas
  status: 'Ativo' | 'Inativo';
};

export type Enrollment = {
  id: number;
  studentId: number;
  courseId: number;
  dataMatricula: string; // ISO ou dd/mm/aaaa
  status: 'Ativa' | 'Cancelada' | 'Concluída';
};

type DB = {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  seeded?: boolean;
};

const STORAGE_KEY = 'school-db-v2';

function pad(n: number, size: number) {
  let s = String(n);
  while (s.length < size) s = '0' + s;
  return s;
}

function seedDb(): DB {
  // 100 alunos
  const students: Student[] = Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    const ano = 1990 + (id % 15); // 1991..2004
    const mes = ((id % 12) + 1).toString().padStart(2, '0');
    const dia = ((id % 28) + 1).toString().padStart(2, '0');
    return {
      id,
      nome: `Aluno ${pad(id, 3)}`,
      cpf: `${pad(id, 3)}.${pad((id * 7) % 1000, 3)}.${pad((id * 13) % 1000, 3)}-${pad((id * 17) % 100, 2)}`,
      dataNasc: `${ano}-${mes}-${dia}`,
      celular: `(31) 9${pad((8000 + (id % 1000)) % 10000, 4)}-${pad((7000 + (id % 1000)) % 10000, 4)}`,
      foto: null,
    };
  });

  // 10 cursos
  const courseDefs = [
    { codigo: 'MAT101', nome: 'Matemática Básica', cargaHoraria: 60 },
    { codigo: 'PORT101', nome: 'Português', cargaHoraria: 40 },
    { codigo: 'ING101', nome: 'Inglês', cargaHoraria: 80 },
    { codigo: 'CIEN101', nome: 'Ciências', cargaHoraria: 50 },
    { codigo: 'HIST101', nome: 'História', cargaHoraria: 40 },
    { codigo: 'GEO101', nome: 'Geografia', cargaHoraria: 40 },
    { codigo: 'FIS101', nome: 'Física', cargaHoraria: 60 },
    { codigo: 'QUI101', nome: 'Química', cargaHoraria: 60 },
    { codigo: 'BIO101', nome: 'Biologia', cargaHoraria: 60 },
    { codigo: 'RED101', nome: 'Redação', cargaHoraria: 30 },
  ];
  const courses: Course[] = courseDefs.map((c, idx) => ({
    id: idx + 1,
    codigo: c.codigo,
    nome: c.nome,
    cargaHoraria: c.cargaHoraria,
    status: (idx + 1) % 10 === 0 ? 'Inativo' : 'Ativo',
  }));

  // Matrículas: cada aluno em 1 a 3 cursos (determinístico)
  const enrollments: Enrollment[] = [];
  let eid = 1;
  for (let studentId = 1; studentId <= students.length; studentId++) {
    const qty = (studentId % 3) + 1; // 1..3
    for (let j = 0; j < qty; j++) {
      const courseId = ((studentId + j) % courses.length) + 1; // 1..10
      const day = pad(((studentId + j) % 28) + 1, 2);
      const month = pad(((studentId + j) % 12) + 1, 2);
      const status: Enrollment['status'] = ((studentId + courseId) % 10 === 0)
        ? 'Cancelada'
        : 'Ativa';
      enrollments.push({
        id: eid++,
        studentId,
        courseId,
        dataMatricula: `2024-${month}-${day}`,
        status,
      });
    }
  }

  return { students, courses, enrollments, seeded: true };
}

function readDb(): DB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDb();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as DB;
  } catch {
    const seeded = seedDb();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function writeDb(db: DB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function initDb(): void {
  readDb();
}

export function getStudents(): Student[] {
  return readDb().students;
}

export function getCourses(): Course[] {
  return readDb().courses;
}

export function getEnrollments(): Enrollment[] {
  return readDb().enrollments;
}

export function getCounts(): { totalStudents: number; totalCourses: number; activeEnrollments: number } {
  const db = readDb();
  const totalStudents = db.students.length;
  const totalCourses = db.courses.length;
  const activeEnrollments = db.enrollments.filter((e) => e.status === 'Ativa').length;
  return { totalStudents, totalCourses, activeEnrollments };
}

export function getStudentsPerCourse(): { curso: string; alunos: number }[] {
  const db = readDb();
  const counts = new Map<number, number>();
  for (const e of db.enrollments) {
    if (e.status !== 'Cancelada') {
      counts.set(e.courseId, (counts.get(e.courseId) ?? 0) + 1);
    }
  }
  return db.courses.map((c) => ({ curso: c.nome, alunos: counts.get(c.id) ?? 0 }));
}

export function getCourseStudentCount(courseId: number): number {
  const db = readDb();
  return db.enrollments.filter((e) => e.courseId === courseId && e.status !== 'Cancelada').length;
}

export function getEnrollmentsJoined(): Array<Enrollment & { aluno: string; curso: string }> {
  const db = readDb();
  const byStudent = new Map(db.students.map((s) => [s.id, s] as const));
  const byCourse = new Map(db.courses.map((c) => [c.id, c] as const));
  return db.enrollments.map((e) => ({
    ...e,
    aluno: byStudent.get(e.studentId)?.nome ?? '—',
    curso: byCourse.get(e.courseId)?.nome ?? '—',
  }));
}

// Exemplos de mutações simples (opcionalmente usados pelos formulários)
export function addStudent(student: Omit<Student, 'id'>): Student {
  const db = readDb();
  const id = Math.max(0, ...db.students.map((s) => s.id)) + 1;
  const s: Student = { id, ...student };
  db.students.push(s);
  writeDb(db);
  return s;
}

export function addCourse(course: Omit<Course, 'id'>): Course {
  const db = readDb();
  const id = Math.max(0, ...db.courses.map((c) => c.id)) + 1;
  const c: Course = { id, ...course };
  db.courses.push(c);
  writeDb(db);
  return c;
}

export function addEnrollment(enrollment: Omit<Enrollment, 'id'>): Enrollment {
  const db = readDb();
  const id = Math.max(0, ...db.enrollments.map((e) => e.id)) + 1;
  const e: Enrollment = { id, ...enrollment };
  db.enrollments.push(e);
  writeDb(db);
  return e;
}
