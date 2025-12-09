import { Link, useParams } from 'react-router-dom';
import { getCourses, getEnrollments, getStudents, getTurmas } from '../../services/db';

export function ClassDetail() {
  const params = useParams();
  const id = Number(params.id);
  const turma = getTurmas().find((t) => t.id === id);
  const courses = getCourses();
  const students = getStudents();
  const enrollments = getEnrollments();

  if (!turma) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Turma não encontrada</h1>
        <Link to="/turmas" className="text-blue-600 hover:underline">Voltar</Link>
      </section>
    );
  }

  const courseName = turma.courseId ? (courses.find((c) => c.id === turma.courseId)?.nome ?? '—') : '—';
  const year = turma.ano;
  // Heurística MVP: alunos com matrícula no courseId da turma e ano da turma
  const relevantEnrollments = enrollments.filter((e) => {
    const eYear = new Date(e.dataMatricula).getFullYear();
    return (turma.courseId ? e.courseId === turma.courseId : true) && eYear === year && e.status !== 'Cancelada';
  });
  const byStudent = new Map(students.map((s) => [s.id, s] as const));
  const classStudents = Array.from(new Set(relevantEnrollments.map((e) => e.studentId)))
    .map((sid) => byStudent.get(sid))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <section className="space-y-4" aria-labelledby="turma-detail-heading">
      <div className="flex items-center justify-between">
        <div>
          <h1 id="turma-detail-heading" className="text-2xl font-bold text-gray-900">{turma.nome}</h1>
          <p className="text-gray-600">Curso: {courseName} • Ano: {year}</p>
        </div>
        <Link to="/turmas" className="text-blue-600 hover:underline">Voltar</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold">Alunos</h2>
          <p className="text-sm text-gray-600">Total: {classStudents.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{s.id}</td>
                  <td className="px-6 py-4 text-sm">{s.nome}</td>
                  <td className="px-6 py-4 text-sm">{s.cpf}</td>
                </tr>
              ))}
              {classStudents.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>Nenhum aluno encontrado para esta turma.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
