from rest_framework import serializers
from escola.models import Aluno, Curso, Matricula, Avaliacao, AtividadeAvaliativa

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'rg', 'cpf', 'data_nascimento', 'foto']

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'

class MatriculaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matricula
        exclude = []

class ListaMatriculasAlunoSerializer(serializers.ModelSerializer):
    curso = serializers.ReadOnlyField(source='curso.descricao')
    periodo = serializers.SerializerMethodField()
    class Meta:
        model = Matricula
        fields = ['curso', 'periodo']
    def get_periodo(self, obj):
        return obj.get_periodo_display()

class ListaAlunosMatriculadosSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.ReadOnlyField(source='aluno.nome')
    class Meta:
        model = Matricula
        fields = ['aluno_nome']

class AlunoSerializerV2(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['id', 'nome','celular', 'rg', 'cpf', 'data_nascimento', 'foto']

class AvaliacaoSerializer(serializers.ModelSerializer):
    media = serializers.ReadOnlyField()
    situacao = serializers.ReadOnlyField()
    
    class Meta:
        model = Avaliacao
        fields = ['id', 'matricula', 'nota1', 'nota2', 'nota3', 'media', 'situacao', 'data_criacao']

class AtividadeAvaliativaSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    
    class Meta:
        model = AtividadeAvaliativa
        fields = ['id', 'matricula', 'tipo', 'tipo_display', 'titulo', 'descricao', 'nota', 'data_entrega', 'entregue', 'data_criacao']