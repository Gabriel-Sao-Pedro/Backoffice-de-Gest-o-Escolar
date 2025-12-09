import { Link, useParams } from 'react-router-dom';
import { useMemo, useState, Fragment } from 'react';
import { getStudents, getEnrollments, getCourses, getActivitiesByCourse, getSubmissionsByStudentCourse, getGradesByStudentCourse } from '../../services/db';

export function StudentProgress() {
  const { id, courseId } = useParams();
  const studentId = Number(id);
  const cId = Number(courseId);
  const student = getStudents().find((s) => s.id === studentId);
  const allEnrollments = getEnrollments();
  const enrollments = allEnrollments.filter((e) => e.studentId === studentId && e.courseId === cId && e.status !== 'Cancelada');
  const courses = getCourses();
  const course = courses.find((c) => c.id === cId);
  const [ano, setAno] = useState<number | 'todos'>('todos');

  const enriched = useMemo(() => {
    return enrollments
      .filter((e) => (ano === 'todos' ? true : new Date(e.dataMatricula).getFullYear() === ano))
      .map((e) => {
        const acts = getActivitiesByCourse(e.courseId);
        const subs = getSubmissionsByStudentCourse(studentId, e.courseId);
  const grades = getGradesByStudentCourse(studentId, e.courseId);
  const done = subs.filter((s) => s.entregue).length;
  const avgPercent = grades.length ? grades.reduce((a, g) => a + g.valor, 0) / grades.length : null; // 0..100
  const provas7 = avgPercent !== null ? (avgPercent / 100) * 7 : 0; // 0..7
  const atividades3 = acts.length > 0 ? (done / acts.length) * 3 : 0; // 0..3
  const media10 = provas7 + atividades3; // 0..10
  return { e, acts, subs, grades, done, media10, provas7, atividades3 };
      });
  }, [enrollments, studentId, ano]);

  const anosDisponiveis = useMemo(() => {
    const set = new Set<number>();
    for (const e of enrollments) set.add(new Date(e.dataMatricula).getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [enrollments]);

  if (!student) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Aluno não encontrado</h1>
        <Link to="/alunos" className="text-blue-600 hover:underline">Voltar</Link>
      </section>
    );
  }
  if (!course) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Curso não encontrado</h1>
        <Link to="/cursos" className="text-blue-600 hover:underline">Voltar</Link>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="student-progress-heading">
      <div className="flex items-center justify-between">
        <div>
          <h1 id="student-progress-heading" className="text-3xl font-bold text-gray-900">Progresso — {student.nome}</h1>
          <p className="text-gray-600">Curso: {course.nome} • Código: {course.codigo}</p>
        </div>
        <Link to={`/cursos/${course.id}`} className="text-blue-600 hover:underline">Voltar ao curso</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold">Progresso no curso</h2>
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-700">Ano</label>
            <select className="px-2 py-1 border border-gray-300 rounded" value={ano} onChange={(e) => setAno(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}>
              <option value="todos">Todos</option>
              {anosDisponiveis.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="text-gray-600">Total: {enriched.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média (0–10)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atividades</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enriched.map(({ e, acts, subs, grades, media10, done, provas7, atividades3 }) => (
                <Fragment key={e.id}>
                  <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 text-sm">{media10.toFixed(1).replace('.', ',')}</td>
                    <td className="px-6 py-4 text-sm">{done}/{acts.length}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="bg-gray-50 px-6 py-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Notas</h4>
                          <p className="text-xs text-gray-600 mb-2">Provas: {provas7.toFixed(1).replace('.', ',')}/7,0 • Atividades: {atividades3.toFixed(1).replace('.', ',')}/3,0 • Final: {media10.toFixed(1).replace('.', ',')}/10</p>
                          <ul className="list-disc pl-6 text-sm">
                            {grades.map((g, idx) => (
                              <li key={idx}>Avaliação {idx + 1}: {g.valor} — {new Date(g.data).toLocaleDateString('pt-BR')}</li>
                            ))}
                            {grades.length === 0 && <li className="text-gray-500">Sem notas.</li>}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Atividades</h4>
                          <ul className="list-disc pl-6 text-sm">
                            {acts.map((a) => {
                              const sub = subs.find((s2) => s2.activityId === a.id);
                              const status = sub?.entregue ? 'Entregue' : 'Pendente';
                              return (
                                <li key={a.id}>
                                  {a.titulo} — {status} {sub?.entregueEm ? `(${new Date(sub.entregueEm).toLocaleDateString('pt-BR')})` : ''}
                                </li>
                              );
                            })}
                            {acts.length === 0 && <li className="text-gray-500">Sem atividades.</li>}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}
              {enriched.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={2}>Sem matrículas para o filtro selecionado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
