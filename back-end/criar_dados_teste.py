#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from escola.models import Aluno, Curso, Matricula
from datetime import date

# Limpar dados existentes
Matricula.objects.all().delete()
Aluno.objects.all().delete()
Curso.objects.all().delete()

# Criar cursos
curso1 = Curso.objects.create(
    codigo_curso='PROG001',
    descricao='Python Avançado',
    nivel='A'
)

curso2 = Curso.objects.create(
    codigo_curso='WEB001',
    descricao='Desenvolvimento Web com Django',
    nivel='I'
)

curso3 = Curso.objects.create(
    codigo_curso='PYTHON101',
    descricao='Introdução a Python',
    nivel='B'
)

print(f"✓ {Curso.objects.count()} cursos criados")

# Criar alunos
aluno1 = Aluno.objects.create(
    nome='João Silva Santos',
    rg='123456789',
    cpf='12345678900',
    data_nascimento=date(2000, 5, 15),
    celular='11987654321'
)

aluno2 = Aluno.objects.create(
    nome='Maria Oliveira Costa',
    rg='987654321',
    cpf='98765432100',
    data_nascimento=date(2001, 3, 22),
    celular='11991234567'
)

aluno3 = Aluno.objects.create(
    nome='Carlos Ferreira Lima',
    rg='456789123',
    cpf='45678912300',
    data_nascimento=date(1999, 8, 10),
    celular='11995678901'
)

print(f"✓ {Aluno.objects.count()} alunos criados")

# Criar matrículas
matricula1 = Matricula.objects.create(
    aluno=aluno1,
    curso=curso1,
    periodo='M'
)

matricula2 = Matricula.objects.create(
    aluno=aluno2,
    curso=curso2,
    periodo='V'
)

matricula3 = Matricula.objects.create(
    aluno=aluno3,
    curso=curso3,
    periodo='N'
)

matricula4 = Matricula.objects.create(
    aluno=aluno1,
    curso=curso2,
    periodo='V'
)

print(f"✓ {Matricula.objects.count()} matrículas criadas")
print("\n✅ Dados de teste criados com sucesso!")
