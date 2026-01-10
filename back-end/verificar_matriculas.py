#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from escola.models import Matricula, Curso

print(f"Total de matrículas: {Matricula.objects.count()}")
print(f"Total de cursos: {Curso.objects.count()}")

# Verificar se há matrículas órfãs (referenciando cursos deletados)
print("\nMatrículas por curso:")
for curso in Curso.objects.all():
    count = Matricula.objects.filter(curso=curso).count()
    print(f"  Curso {curso.id} ({curso.descricao}): {count} matrículas")
