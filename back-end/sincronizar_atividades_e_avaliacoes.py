import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from escola.models import Curso, Matricula, AtividadeAvaliativa, Avaliacao

"""
Script de sincronização:
- Garante para cada matrícula de cada curso a existência de duas provas: 'Prova 1' (nota1) e 'Prova 2' (nota2).
- Garante a existência de um conjunto padrão de atividades (Atividade 1..5) iguais para todos do curso.
- Calcula nota3 como média das atividades (tipo 'A').
- Atualiza/cria Avaliacao com nota1, nota2, nota3; a média final será ponderada via propriedade do modelo.
"""

DEFAULT_ATIVIDADES = [
	('Atividade 1', 'Atividade padronizada do curso'),
	('Atividade 2', 'Atividade padronizada do curso'),
	('Atividade 3', 'Atividade padronizada do curso'),
	('Atividade 4', 'Atividade padronizada do curso'),
	('Atividade 5', 'Atividade padronizada do curso'),
]

PROVAS = [
	('Prova 1', 'Primeira prova do curso'),
	('Prova 2', 'Segunda prova do curso'),
]


def ensure_atividades_para_matricula(matricula):
	# Garantir provas
	for (titulo, descricao) in PROVAS:
		atividade, created = AtividadeAvaliativa.objects.get_or_create(
			matricula=matricula,
			tipo='P',
			titulo=titulo,
			defaults={
				'descricao': descricao,
				'data_entrega': None,
				'entregue': False,
			}
		)
		if created:
			print(f"[+] Criada {titulo} para matrícula {matricula.id}")

	# Garantir atividades padrão
	for (titulo, descricao) in DEFAULT_ATIVIDADES:
		atividade, created = AtividadeAvaliativa.objects.get_or_create(
			matricula=matricula,
			tipo='A',
			titulo=titulo,
			defaults={
				'descricao': descricao,
				'data_entrega': None,
				'entregue': False,
			}
		)
		if created:
			print(f"[+] Criada {titulo} para matrícula {matricula.id}")


def calcular_e_atualizar_avaliacao(matricula):
	# Nota das provas
	prova1 = AtividadeAvaliativa.objects.filter(matricula=matricula, tipo='P', titulo='Prova 1').first()
	prova2 = AtividadeAvaliativa.objects.filter(matricula=matricula, tipo='P', titulo='Prova 2').first()
	nota1 = float(prova1.nota) if (prova1 and prova1.nota is not None) else 0.0
	nota2 = float(prova2.nota) if (prova2 and prova2.nota is not None) else 0.0

	# Média das atividades (tipo 'A')
	atividades = AtividadeAvaliativa.objects.filter(matricula=matricula, tipo='A', nota__isnull=False)
	if atividades.exists():
		soma = sum(float(a.nota) for a in atividades)
		nota3 = round(soma / atividades.count(), 2)
	else:
		nota3 = 0.0

	avaliacao, created = Avaliacao.objects.get_or_create(
		matricula=matricula,
		defaults={
			'nota1': nota1,
			'nota2': nota2,
			'nota3': nota3,
		}
	)
	if not created:
		avaliacao.nota1 = nota1
		avaliacao.nota2 = nota2
		avaliacao.nota3 = nota3
		avaliacao.save()

	print(f"[✓] Matrícula {matricula.id}: n1={nota1} n2={nota2} n3={nota3} média={avaliacao.media} situação={avaliacao.situacao}")


def main():
	cursos = Curso.objects.all()
	total_matriculas = 0
	for curso in cursos:
		matriculas = Matricula.objects.filter(curso=curso)
		for matricula in matriculas:
			total_matriculas += 1
			ensure_atividades_para_matricula(matricula)
			calcular_e_atualizar_avaliacao(matricula)
	print(f"Concluído. Matrículas processadas: {total_matriculas}")


if __name__ == '__main__':
	main()
