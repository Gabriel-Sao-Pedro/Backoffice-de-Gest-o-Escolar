#!/usr/bin/env python
import os
import sys
import django
from datetime import date
from random import randint, choice

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from escola.models import Aluno, Curso, Matricula
from faker import Faker

fake = Faker('pt_BR')

print("🔄 Gerando 100 alunos...")

# Buscar cursos existentes
cursos = list(Curso.objects.all())
if not cursos:
    print("⚠️ Nenhum curso encontrado. Criando cursos primeiro...")
    cursos = [
        Curso.objects.create(codigo_curso='PROG001', descricao='Python Avançado', nivel='A'),
        Curso.objects.create(codigo_curso='WEB001', descricao='Desenvolvimento Web', nivel='I'),
        Curso.objects.create(codigo_curso='PYTHON101', descricao='Introdução a Python', nivel='B'),
        Curso.objects.create(codigo_curso='JAVA001', descricao='Java para Iniciantes', nivel='B'),
        Curso.objects.create(codigo_curso='JS001', descricao='JavaScript Moderno', nivel='I'),
    ]
    print(f"✅ {len(cursos)} cursos criados")

alunos_criados = 0
matriculas_criadas = 0

for i in range(1, 101):
    # Gerar dados do aluno
    nome = fake.name()[:30]  # Limitar a 30 caracteres
    
    # Gerar CPF e RG únicos
    cpf = ''.join([str(randint(0, 9)) for _ in range(11)])
    rg = ''.join([str(randint(0, 9)) for _ in range(9)])
    
    # Data de nascimento entre 1990 e 2008
    data_nascimento = date(randint(1990, 2008), randint(1, 12), randint(1, 28))
    
    # Celular
    celular = f'11{randint(900000000, 999999999)}'
    
    try:
        # Criar aluno
        aluno = Aluno.objects.create(
            nome=nome,
            rg=rg,
            cpf=cpf,
            data_nascimento=data_nascimento,
            celular=celular
        )
        alunos_criados += 1
        
        # Criar entre 1 e 3 matrículas para cada aluno
        num_matriculas = randint(1, 3)
        cursos_selecionados = []
        
        for _ in range(num_matriculas):
            # Selecionar curso que ainda não foi usado para este aluno
            cursos_disponiveis = [c for c in cursos if c not in cursos_selecionados]
            if cursos_disponiveis:
                curso = choice(cursos_disponiveis)
                cursos_selecionados.append(curso)
                
                # Período aleatório
                periodo = choice(['M', 'V', 'N'])
                
                Matricula.objects.create(
                    aluno=aluno,
                    curso=curso,
                    periodo=periodo
                )
                matriculas_criadas += 1
        
        if i % 10 == 0:
            print(f"✓ {i} alunos criados...")
    
    except Exception as e:
        print(f"❌ Erro ao criar aluno {i}: {e}")

print(f"\n✅ Concluído!")
print(f"📊 Total de alunos criados: {alunos_criados}")
print(f"📊 Total de matrículas criadas: {matriculas_criadas}")
print(f"📊 Total de alunos no banco: {Aluno.objects.count()}")
print(f"📊 Total de matrículas no banco: {Matricula.objects.count()}")
