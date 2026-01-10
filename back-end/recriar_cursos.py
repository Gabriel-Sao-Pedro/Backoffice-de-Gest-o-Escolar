#!/usr/bin/env python
import os
import sys
import django
from random import randint, choice

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from escola.models import Aluno, Curso, Matricula

print("🔄 Recriando estrutura de cursos...")

# 1. Remover todas as matrículas e cursos existentes
print("❌ Removendo matrículas e cursos antigos...")
Matricula.objects.all().delete()
Curso.objects.all().delete()
print("✅ Dados antigos removidos")

# 2. Criar 5 cursos base com 3 níveis cada
cursos_base = [
    {'nome': 'Python', 'codigo': 'PY'},
    {'nome': 'JavaScript', 'codigo': 'JS'},
    {'nome': 'Java', 'codigo': 'JV'},
    {'nome': 'React', 'codigo': 'RC'},
    {'nome': 'Django', 'codigo': 'DJ'},
]

niveis = [
    {'nivel': 'B', 'descricao': 'Básico'},
    {'nivel': 'I', 'descricao': 'Intermediário'},
    {'nivel': 'A', 'descricao': 'Avançado'},
]

cursos_criados = []

print("\n📚 Criando 15 cursos (5 áreas × 3 níveis)...")
for curso_base in cursos_base:
    for nivel in niveis:
        codigo = f"{curso_base['codigo']}{nivel['nivel']}"
        descricao = f"{curso_base['nome']} - {nivel['descricao']}"
        
        curso = Curso.objects.create(
            codigo_curso=codigo,
            descricao=descricao,
            nivel=nivel['nivel']
        )
        cursos_criados.append(curso)
        print(f"  ✓ {codigo}: {descricao}")

print(f"\n✅ {len(cursos_criados)} cursos criados")

# 3. Rematricular todos os alunos
print("\n🎓 Matriculando alunos nos novos cursos...")
alunos = Aluno.objects.all()
matriculas_criadas = 0

periodos = ['M', 'V', 'N']

for aluno in alunos:
    # Cada aluno recebe entre 1 e 3 matrículas
    num_matriculas = randint(1, 3)
    cursos_escolhidos = []
    
    for _ in range(num_matriculas):
        # Escolher curso que ainda não foi matriculado
        cursos_disponiveis = [c for c in cursos_criados if c not in cursos_escolhidos]
        if cursos_disponiveis:
            curso = choice(cursos_disponiveis)
            cursos_escolhidos.append(curso)
            periodo = choice(periodos)
            
            Matricula.objects.create(
                aluno=aluno,
                curso=curso,
                periodo=periodo
            )
            matriculas_criadas += 1

print(f"✅ {matriculas_criadas} matrículas criadas")

# 4. Estatísticas finais
print("\n📊 Estatísticas finais:")
print(f"  • Total de cursos: {Curso.objects.count()}")
print(f"  • Total de alunos: {Aluno.objects.count()}")
print(f"  • Total de matrículas: {Matricula.objects.count()}")

# Estatísticas por nível
print("\n📈 Cursos por nível:")
for nivel_letra in ['B', 'I', 'A']:
    nivel_nome = {'B': 'Básico', 'I': 'Intermediário', 'A': 'Avançado'}[nivel_letra]
    count = Curso.objects.filter(nivel=nivel_letra).count()
    print(f"  • {nivel_nome}: {count} cursos")

# Estatísticas de matrículas por período
print("\n⏰ Matrículas por período:")
for periodo_letra, periodo_nome in [('M', 'Matutino'), ('V', 'Vespertino'), ('N', 'Noturno')]:
    count = Matricula.objects.filter(periodo=periodo_letra).count()
    print(f"  • {periodo_nome}: {count} matrículas")

print("\n🎉 Processo concluído com sucesso!")
