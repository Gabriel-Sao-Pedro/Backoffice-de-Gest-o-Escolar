import { Link, useParams } from 'react-router-dom';
import { useMemo, useState, Fragment, useEffect } from 'react';
import { getCourses, getMateriaisByCourse, addMaterial, removeMaterial, getEnrollments, getStudents, getGradesByStudentCourse, getSubmissionsByStudentCourse, getActivitiesByCourse } from '../../services/db';

export function CourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);
  const course = getCourses().find((c) => c.id === courseId);
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<'PDF' | 'LINK'>('LINK');
  const [url, setUrl] = useState('');
  const materiais = useMemo(() => getMateriaisByCourse(courseId), [courseId]);
  const allEnrollments = getEnrollments();
  const students = getStudents();
  const anosDisponiveis = useMemo(() => {
    const set = new Set<number>();
    for (const e of allEnrollments) {
      if (e.courseId === courseId && e.status !== 'Cancelada') {
        set.add(new Date(e.dataMatricula).getFullYear());
      }
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [allEnrollments, courseId]);
  const [ano, setAno] = useState<number>(anosDisponiveis[0] ?? new Date().getFullYear());
  useEffect(() => {
    if (anosDisponiveis.length && !anosDisponiveis.includes(ano)) {
      setAno(anosDisponiveis[0]);
    }
  }, [anosDisponiveis, ano]);
  const alunos = useMemo(() => {
    const byStudent = new Map(students.map((s) => [s.id, s] as const));
    const relevant = allEnrollments.filter((e) => e.courseId === courseId && e.status !== 'Cancelada' && new Date(e.dataMatricula).getFullYear() === ano);
    const uniqueIds = Array.from(new Set(relevant.map((e) => e.studentId)));
    return uniqueIds.map((id) => byStudent.get(id)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [allEnrollments, students, courseId, ano]);
  const acts = useMemo(() => getActivitiesByCourse(courseId), [courseId]);
  const [openStudentId, setOpenStudentId] = useState<number | null>(null);

  if (!course) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Curso não encontrado</h1>
        <Link to="/cursos" className="text-blue-600 hover:underline">Voltar</Link>
      </section>
    );
  }

  const onAdd = () => {
    if (!titulo || !url) return;
    addMaterial({ courseId, titulo, url, tipo });
    setTitulo('');
    setUrl('');
  };

  return (
    <section className="space-y-6" aria-labelledby="course-detail-heading">
      <div className="flex items-center justify-between">
        <div>
          <h1 id="course-detail-heading" className="text-3xl font-bold text-gray-900">{course.nome}</h1>
          <p className="text-gray-600">Código: {course.codigo} • Carga horária: {course.cargaHoraria}h • Status: {course.status}</p>
        </div>
        <Link to="/cursos" className="text-blue-600 hover:underline">Voltar</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold">Alunos do curso</h2>
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-700">Ano</label>
            <select className="px-2 py-1 border border-gray-300 rounded" value={ano} onChange={(e) => setAno(Number(e.target.value))}>
              {anosDisponiveis.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
              {anosDisponiveis.length === 0 && <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>}
            </select>
            <span className="text-gray-600">Total: {alunos.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média (0–10)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atividades</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alunos.map((s) => {
                const grades = getGradesByStudentCourse(s.id, courseId);
                const subs = getSubmissionsByStudentCourse(s.id, courseId);
                const done = subs.filter((x) => x.entregue).length;
                // Regra: provas (0..7) + atividades (0..3) = 0..10
                const avgPercent = grades.length ? grades.reduce((a, g) => a + g.valor, 0) / grades.length : null; // 0..100
                const provas7 = avgPercent !== null ? (avgPercent / 100) * 7 : 0; // 0..7
                const atividades3 = acts.length > 0 ? (done / acts.length) * 3 : 0; // 0..3
                const media10 = provas7 + atividades3; // 0..10
                return (
                  <Fragment key={s.id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setOpenStudentId(openStudentId === s.id ? null : s.id)}>
                      <td className="px-6 py-4 text-sm">
                        <Link to={`/alunos/${s.id}/progresso/${courseId}`} className="text-blue-700 hover:underline">{s.nome}</Link>
                      </td>
                      <td className="px-6 py-4 text-sm">{media10.toFixed(1).replace('.', ',')}</td>
                      <td className="px-6 py-4 text-sm">{done}/{acts.length}</td>
                    </tr>
                    {openStudentId === s.id && (
                      <tr>
                        <td colSpan={3} className="bg-gray-50 px-6 py-4">
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
                    )}
          </Fragment>
                );
              })}
              {alunos.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>Nenhum aluno encontrado para este ano.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold">Materiais</h2>
          <span className="text-sm text-gray-600">Total: {materiais.length}</span>
        </div>
        <div className="px-6 py-4 space-y-3">
          <ul className="list-disc pl-6 text-sm">
            {getMateriaisByCourse(courseId).map((m) => (
              <li key={m.id} className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-200 mr-2">{m.tipo}</span>
                  <a href={m.url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">{m.titulo}</a>
                  <span className="ml-2 text-gray-500">{new Date(m.criadoEm).toLocaleDateString('pt-BR')}</span>
                </div>
                <button className="text-red-600 hover:underline" onClick={() => removeMaterial(m.id)}>Remover</button>
              </li>
            ))}
            {getMateriaisByCourse(courseId).length === 0 && (
              <li className="text-gray-500">Nenhum material adicionado.</li>
            )}
          </ul>

          <div className="flex flex-wrap items-center gap-2">
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" className="px-2 py-1 border border-gray-300 rounded" />
            <select value={tipo} onChange={(e) => setTipo(e.target.value as 'PDF' | 'LINK')} className="px-2 py-1 border border-gray-300 rounded">
              <option value="LINK">Link</option>
              <option value="PDF">PDF</option>
            </select>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={tipo === 'PDF' ? 'URL do PDF' : 'URL'} className="flex-1 min-w-[200px] px-2 py-1 border border-gray-300 rounded" />
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={onAdd}>Adicionar</button>
          </div>
          <p className="text-xs text-gray-500">MVP: usamos uma URL (PDF/Link). Upload real de arquivo não está incluso.</p>
        </div>
      </div>
    </section>
  );
}
