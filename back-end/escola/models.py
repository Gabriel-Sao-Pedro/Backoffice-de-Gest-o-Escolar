from django.db import models

class Aluno(models.Model):
    nome = models.CharField(max_length=30)
    rg = models.CharField(max_length=9)
    cpf = models.CharField(max_length=11)
    data_nascimento = models.DateField()
    celular = models.CharField(max_length=11, default="")
    foto = models.ImageField(blank=True)

    def __str__(self):
        return self.nome

class Curso(models.Model):
    NIVEL = (
        ('B', 'Básico'),
        ('I', 'Intermediário'),
        ('A', 'Avançado')
    )
    codigo_curso = models.CharField(max_length=10)
    descricao = models.CharField(max_length=100)
    nivel = models.CharField(max_length=1, choices=NIVEL, blank=False, null=False,default='B')

    def __str__(self):
        return self.descricao

class Matricula(models.Model):
    PERIODO = (
        ('M', 'Matutino'),
        ('V', 'Vespertino'),
        ('N', 'Noturno')
    )
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    periodo = models.CharField(max_length=1, choices=PERIODO, blank=False, null=False,default='M')

class Avaliacao(models.Model):
    matricula = models.ForeignKey(Matricula, on_delete=models.CASCADE)
    nota1 = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    nota2 = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    nota3 = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Avaliação de {self.matricula.aluno.nome} - {self.matricula.curso.descricao}"

    @property
    def media(self):
        # Média ponderada: provas (nota1 e nota2) peso 4 cada, atividades (nota3) peso 2
        pesos = {'nota1': 4, 'nota2': 4, 'nota3': 2}
        soma_pesos = sum(pesos.values())
        total = float(self.nota1) * pesos['nota1'] + float(self.nota2) * pesos['nota2'] + float(self.nota3) * pesos['nota3']
        return round(total / soma_pesos, 2)

    @property
    def situacao(self):
        media = self.media
        if media >= 7:
            return 'Aprovado'
        elif media > 4:
            return 'Prova Final'
        else:
            return 'Reprovado'

class AtividadeAvaliativa(models.Model):
    TIPO_CHOICES = (
        ('A', 'Atividade'),
        ('P', 'Prova'),
        ('T', 'Trabalho'),
    )
    
    matricula = models.ForeignKey(Matricula, on_delete=models.CASCADE, related_name='atividades')
    tipo = models.CharField(max_length=1, choices=TIPO_CHOICES, default='A')
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    nota = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    data_entrega = models.DateField(null=True, blank=True)
    entregue = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_tipo_display()} - {self.titulo} ({self.matricula.aluno.nome})"

    class Meta:
        ordering = ['-data_criacao']

