import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from escola.models import Matricula, AtividadeAvaliativa

# Limpar atividades anteriores
AtividadeAvaliativa.objects.all().delete()

# Pegar todas as matrículas
matriculas = Matricula.objects.all()

titulos_atividades = [
    "Lista de Exercícios 1",
    "Lista de Exercícios 2",
    "Trabalho Prático",
    "Projeto Final",
    "Estudo de Caso"
]

titulos_provas = [
    "Prova 1 - Conceitos Básicos",
    "Prova 2 - Conceitos Intermediários",
    "Prova Final"
]

titulos_trabalhos = [
    "Trabalho em Grupo",
    "Pesquisa Bibliográfica",
    "Desenvolvimento de Projeto"
]

for matricula in matriculas:
    # Gerar 2-3 atividades
    num_atividades = random.randint(2, 3)
    for i in range(num_atividades):
        dias_atras = random.randint(1, 30)
        data_entrega = datetime.now().date() - timedelta(days=dias_atras)
        entregue = random.choice([True, True, False])  # 66% chance de ter sido entregue
        
        AtividadeAvaliativa.objects.create(
            matricula=matricula,
            tipo='A',
            titulo=random.choice(titulos_atividades),
            descricao=f"Descrição da atividade para {matricula.aluno.nome}",
            nota=round(random.uniform(6.0, 10.0), 2) if entregue else None,
            data_entrega=data_entrega,
            entregue=entregue
        )
    
    # Gerar 1-2 provas
    num_provas = random.randint(1, 2)
    for i in range(num_provas):
        dias_atras = random.randint(5, 40)
        data_entrega = datetime.now().date() - timedelta(days=dias_atras)
        
        AtividadeAvaliativa.objects.create(
            matricula=matricula,
            tipo='P',
            titulo=random.choice(titulos_provas),
            descricao=f"Prova aplicada no curso {matricula.curso.descricao}",
            nota=round(random.uniform(5.0, 10.0), 2),
            data_entrega=data_entrega,
            entregue=True
        )
    
    # Gerar 0-1 trabalho
    if random.choice([True, False]):
        dias_atras = random.randint(10, 60)
        data_entrega = datetime.now().date() - timedelta(days=dias_atras)
        entregue = random.choice([True, False])
        
        AtividadeAvaliativa.objects.create(
            matricula=matricula,
            tipo='T',
            titulo=random.choice(titulos_trabalhos),
            descricao=f"Trabalho para {matricula.aluno.nome}",
            nota=round(random.uniform(7.0, 10.0), 2) if entregue else None,
            data_entrega=data_entrega,
            entregue=entregue
        )

print(f"✅ {AtividadeAvaliativa.objects.count()} atividades criadas com sucesso!")
