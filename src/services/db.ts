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
  descricao?: string;
};

export type Enrollment = {
  id: number;
  studentId: number;
  courseId: number;
  dataMatricula: string; // ISO ou dd/mm/aaaa
  status: 'Ativa' | 'Cancelada' | 'Concluída';
};

// Turmas (agrupamento de alunos)
export type Turma = {
  id: number;
  nome: string; // ex: Turma A - 2024
  ano: number; // ex: 2024
  courseId?: number; // opcional: turma associada a um curso principal
};

// Materiais de estudo (MVP): PDF ou Link externo, associados a um curso
export type Material = {
  id: number;
  courseId: number;
  tipo: 'PDF' | 'LINK';
  titulo: string;
  url: string; // para PDF, usar URL do arquivo; para LINK, a URL externa
  criadoEm: string; // ISO date
};

// Notas (avaliações) por aluno/curso
export type Grade = {
  id: number;
  studentId: number;
  courseId: number;
  valor: number; // 0..100
  data: string; // ISO
};

// Atividades por curso (definição)
export type Activity = {
  id: number;
  courseId: number;
  titulo: string;
  prazo: string; // ISO
};

// Entregas de atividade (progresso do aluno)
export type ActivitySubmission = {
  id: number;
  activityId: number;
  studentId: number;
  entregue: boolean;
  entregueEm?: string; // ISO
};

type DB = {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  turmas?: Turma[];
  materiais?: Material[];
  grades?: Grade[];
  activities?: Activity[];
  submissions?: ActivitySubmission[];
  seeded?: boolean;
};

const STORAGE_KEY = 'school-db-v2';

function pad(n: number, size: number) {
  let s = String(n);
  while (s.length < size) s = '0' + s;
  return s;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Ruído determinístico em [-5, 5) baseado em seed e índice
function dnoise(seed: number, idx: number) {
  const x = Math.sin(seed * 9301 + idx * 49297) * 43758.5453;
  const frac = x - Math.floor(x);
  return frac * 10 - 5;
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
  descricao: '',
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

  // Turmas iniciais
  const turmas: Turma[] = [
    { id: 1, nome: 'Turma A - 2024', ano: 2024, courseId: 1 },
    { id: 2, nome: 'Turma B - 2024', ano: 2024, courseId: 2 },
  ];

  // Materiais iniciais (exemplo)
  const materiais: Material[] = [
    { id: 1, courseId: 1, tipo: 'LINK', titulo: 'Plano de ensino', url: 'https://exemplo.com/plano', criadoEm: new Date().toISOString() },
  ];

  // Atividades (3 por curso)
  const activities: Activity[] = [];
  let actId = 1;
  for (const c of courses) {
    activities.push(
      { id: actId++, courseId: c.id, titulo: `Lista 1 - ${c.codigo}`, prazo: `2024-04-01` },
      { id: actId++, courseId: c.id, titulo: `Trabalho - ${c.codigo}`, prazo: `2024-05-01` },
      { id: actId++, courseId: c.id, titulo: `Projeto - ${c.codigo}`, prazo: `2024-06-01` },
    );
  }

  // Submissões e notas por matrícula (determinístico)
  const submissions: ActivitySubmission[] = [];
  const grades: Grade[] = [];
  let subId = 1;
  let gradeId = 1;
  for (const e of enrollments) {
    // Submissões: entregue alternando por activityId/studentId
    const acts = activities.filter((a) => a.courseId === e.courseId);
    let deliveredCount = 0;
    for (const a of acts) {
      const entregue = ((a.id + e.studentId) % 2 === 0);
      if (entregue) deliveredCount++;
      submissions.push({
        id: subId++,
        activityId: a.id,
        studentId: e.studentId,
        entregue,
        entregueEm: entregue ? `2024-0${(a.id % 6) + 1}-0${(e.studentId % 9) + 1}` : undefined,
      });
    }
  // Notas (0..100) correlacionadas à conclusão de atividades; 2 avaliações por matrícula
  // Para a regra (provas até 7), mantemos 0..100 aqui, mas centramos em 50..90 para coerência ao converter para 0..7 na UI
  const ratio = acts.length ? deliveredCount / acts.length : 0; // 0..1
    const seed = e.studentId * 1000 + e.courseId;
    const base = 55 + 35 * ratio; // 55..90
    const v1 = clamp(Math.round(base + dnoise(seed, 1)), 40, 100);
    const v2 = clamp(Math.round(base + dnoise(seed, 2) + 3), 40, 100);
    grades.push(
      { id: gradeId++, studentId: e.studentId, courseId: e.courseId, valor: v1, data: `2024-04-15` },
      { id: gradeId++, studentId: e.studentId, courseId: e.courseId, valor: v2, data: `2024-06-15` },
    );
  }

  return { students, courses, enrollments, turmas, materiais, activities, submissions, grades, seeded: true };
}

function readDb(): DB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDb();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
  const db = JSON.parse(raw) as DB;
    // Migração: garantir turmas presentes em bancos antigos
    if (!db.turmas || db.turmas.length === 0) {
      const defaultTurmas: Turma[] = [
        { id: 1, nome: 'Turma A - 2024', ano: 2024, courseId: 1 },
        { id: 2, nome: 'Turma B - 2024', ano: 2024, courseId: 2 },
      ];
      db.turmas = defaultTurmas;
      writeDb(db);
    }
  // Migração: garantir estruturas de LMS (materiais, activities, submissions, grades)
  if (!db.materiais) db.materiais = [];
  if (!db.activities) db.activities = [];
  if (!db.submissions) db.submissions = [];
  if (!db.grades) db.grades = [];

    // Migração: popular progresso (atividades, submissões, notas) caso não existam
    let changed = false;

    // Garantir 3 atividades por curso se o curso não tiver nenhuma
    let nextActivityId = Math.max(0, ...db.activities.map(a => a.id)) + 1;
    for (const c of db.courses) {
      const hasActs = db.activities.some(a => a.courseId === c.id);
      if (!hasActs) {
        db.activities.push(
          { id: nextActivityId++, courseId: c.id, titulo: `Lista 1 - ${c.codigo}`, prazo: `2024-04-01` },
          { id: nextActivityId++, courseId: c.id, titulo: `Trabalho - ${c.codigo}`, prazo: `2024-05-01` },
          { id: nextActivityId++, courseId: c.id, titulo: `Projeto - ${c.codigo}`, prazo: `2024-06-01` },
        );
        changed = true;
      }
    }

    // Garantir notas e submissões por matrícula ausentes
    let nextSubmissionId = Math.max(0, ...db.submissions.map(s => s.id)) + 1;
    let nextGradeId = Math.max(0, ...db.grades.map(g => g.id)) + 1;
    for (const e of db.enrollments) {
      // Submissões: uma por atividade do curso
      const acts = db.activities.filter(a => a.courseId === e.courseId);
      for (const a of acts) {
        const exists = db.submissions.some(s => s.activityId === a.id && s.studentId === e.studentId);
        if (!exists) {
          const entregue = ((a.id + e.studentId) % 2 === 0);
          db.submissions.push({
            id: nextSubmissionId++,
            activityId: a.id,
            studentId: e.studentId,
            entregue,
            entregueEm: entregue ? `2024-0${(a.id % 6) + 1}-0${(e.studentId % 9) + 1}` : undefined,
          });
          changed = true;
        }
      }

  // Notas: alinhar valores às atividades concluídas (0..100, 2 avaliações)
      const actIds = new Set(acts.map(a => a.id));
      const subs = db.submissions.filter(s => s.studentId === e.studentId && actIds.has(s.activityId));
      const done = subs.filter(s => s.entregue).length;
      const ratio = acts.length ? done / acts.length : 0;
      const seed = e.studentId * 1000 + e.courseId;
  const base = 55 + 35 * ratio; // 55..90
      const v1 = clamp(Math.round(base + dnoise(seed, 1)), 40, 100);
      const v2 = clamp(Math.round(base + dnoise(seed, 2) + 3), 40, 100);
      const existing = db.grades.filter(g => g.studentId === e.studentId && g.courseId === e.courseId);
      if (existing.length >= 2) {
        if (existing[0].valor !== v1) { existing[0].valor = v1; changed = true; }
        if (existing[1].valor !== v2) { existing[1].valor = v2; changed = true; }
        existing[0].data = `2024-04-15`;
        existing[1].data = `2024-06-15`;
      } else if (existing.length === 1) {
        if (existing[0].valor !== v1) { existing[0].valor = v1; changed = true; }
        db.grades.push({ id: nextGradeId++, studentId: e.studentId, courseId: e.courseId, valor: v2, data: `2024-06-15` });
        changed = true;
      } else {
        db.grades.push(
          { id: nextGradeId++, studentId: e.studentId, courseId: e.courseId, valor: v1, data: `2024-04-15` },
          { id: nextGradeId++, studentId: e.studentId, courseId: e.courseId, valor: v2, data: `2024-06-15` },
        );
        changed = true;
      }
    }

    if (changed) writeDb(db);
    return db;
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

export function getTurmas(): Turma[] {
  return readDb().turmas ?? [];
}

export function getMateriaisByCourse(courseId: number): Material[] {
  const db = readDb();
  return (db.materiais ?? []).filter((m) => m.courseId === courseId);
}

export function getActivitiesByCourse(courseId: number): Activity[] {
  const db = readDb();
  return (db.activities ?? []).filter((a) => a.courseId === courseId);
}

export function getSubmissionsByStudentCourse(studentId: number, courseId: number): ActivitySubmission[] {
  const db = readDb();
  const acts = (db.activities ?? []).filter((a) => a.courseId === courseId).map((a) => a.id);
  const set = new Set(acts);
  return (db.submissions ?? []).filter((s) => s.studentId === studentId && set.has(s.activityId));
}

export function getGradesByStudentCourse(studentId: number, courseId: number): Grade[] {
  const db = readDb();
  return (db.grades ?? []).filter((g) => g.studentId === studentId && g.courseId === courseId);
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

export function updateCourse(id: number, changes: Partial<Omit<Course, 'id'>>): Course | undefined {
  const db = readDb();
  const idx = db.courses.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  const updated: Course = { ...db.courses[idx], ...changes, id };
  db.courses[idx] = updated;
  writeDb(db);
  return updated;
}

export function addEnrollment(enrollment: Omit<Enrollment, 'id'>): Enrollment {
  const db = readDb();
  const id = Math.max(0, ...db.enrollments.map((e) => e.id)) + 1;
  const e: Enrollment = { id, ...enrollment };
  db.enrollments.push(e);
  writeDb(db);
  return e;
}

export function removeEnrollmentByStudentCourse(studentId: number, courseId: number): void {
  const db = readDb();
  db.enrollments = db.enrollments.filter((e) => !(e.studentId === studentId && e.courseId === courseId));
  writeDb(db);
}

export function addTurma(turma: Omit<Turma, 'id'>): Turma {
  const db = readDb();
  const id = Math.max(0, ...((db.turmas ?? []).map((t) => t.id))) + 1;
  const t: Turma = { id, ...turma };
  db.turmas = db.turmas ?? [];
  db.turmas.push(t);
  writeDb(db);
  return t;
}

export function addMaterial(material: Omit<Material, 'id' | 'criadoEm'>): Material {
  const db = readDb();
  const list = db.materiais ?? [];
  const id = Math.max(0, ...list.map((m) => m.id)) + 1;
  const m: Material = { id, criadoEm: new Date().toISOString(), ...material };
  db.materiais = list.concat(m);
  writeDb(db);
  return m;
}

export function removeMaterial(id: number): void {
  const db = readDb();
  db.materiais = (db.materiais ?? []).filter((m) => m.id !== id);
  writeDb(db);
}
