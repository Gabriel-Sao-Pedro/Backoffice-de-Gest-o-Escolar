from django import http
from django.utils import decorators
from rest_framework import serializers, status, viewsets, generics
from rest_framework import response
from escola.models import Aluno, Curso, Matricula, Avaliacao, AtividadeAvaliativa
from escola.serializer import AlunoSerializer, AlunoSerializerV2, CursoSerializer, MatriculaSerializer, ListaMatriculasAlunoSerializer, ListaAlunosMatriculadosSerializer, AvaliacaoSerializer, AtividadeAvaliativaSerializer
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class AlunosViewSet(viewsets.ModelViewSet):
    """Exibindo todos os alunos e alunas"""
    queryset = Aluno.objects.all()
    def get_serializer_class(self):
        if self.request.version =='v2':
            return AlunoSerializerV2
        else:
            return AlunoSerializer    

class CursosViewSet(viewsets.ModelViewSet):
    """Exibindo todos os cursos"""
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = Response(serializer.data, status=status.HTTP_201_CREATED)
            id = str(serializer.data['id'])
            response['Location'] = request.build_absolute_uri() + id
            return response


class MatriculaViewSet(viewsets.ModelViewSet):
    """Listando todas as matrículas"""
    queryset = Matricula.objects.all()
    serializer_class = MatriculaSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    @method_decorator(cache_page(20))
    def dispatch(self, *args, **kwargs):
        return super(MatriculaViewSet, self).dispatch(*args, **kwargs)

class ListaMatriculasAluno(generics.ListAPIView):
    """Listando as matrículas de um aluno ou aluna"""
    def get_queryset(self):
        queryset = Matricula.objects.filter(aluno_id=self.kwargs['pk'])
        return queryset
    serializer_class = ListaMatriculasAlunoSerializer

class ListaAlunosMatriculados(generics.ListAPIView):
    """Listando alunos e alunas matriculados em um curso"""
    def get_queryset(self):
        queryset = Matricula.objects.filter(curso_id=self.kwargs['pk'])
        return queryset
    serializer_class = ListaAlunosMatriculadosSerializer

class AvaliacaoViewSet(viewsets.ModelViewSet):
    """CRUD de Avaliações"""
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class AtividadeAvaliativaViewSet(viewsets.ModelViewSet):
    """CRUD de Atividades Avaliativas"""
    queryset = AtividadeAvaliativa.objects.all()
    serializer_class = AtividadeAvaliativaSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']