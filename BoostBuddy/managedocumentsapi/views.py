from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from .serializers import DocumentSerializer , StudyPointsSerializer ,RatingSerializer
from .models import Document ,StudyPoints,ViewedDocument, DownloadedDocument,AddedDocument,UserTimeSpent,Rating
from rest_framework import status
from django.http import FileResponse
from django.contrib.auth.models import User
from signupapi.models import User
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authentication import TokenAuthentication
from django.db.models import Count

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def addDocument_view(request):
    if request.method == 'POST':
        # Directly use request.data without making a copy
        serializer = DocumentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Save the document
            document = serializer.save(user=request.user)  # Pass the user directly to save method
            print(request.user.id)

            return Response({'Success': True, 'Document': document.title, 'id': document.id})
        else:
            return Response(serializer.errors, status=400)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def viewdocument_view(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            documents = Document.objects.exclude(user=request.user)
            serializer = DocumentSerializer(documents, many=True)
            return Response(serializer.data)
        else:
            return JsonResponse({'status': 'User is not authenticated'}, status=400)
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def viewuserdocument(request):
    if request.user.is_authenticated:
        documents = Document.objects.filter(user=request.user)
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)
@api_view(['DELETE'])
def delete_document_view(request ,id):
    try:
            document = Document.objects.get(id=id)
    except Document.DoesNotExist:
        return Response({'Error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
    try :
        document.delete()
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'Success': True, 'Message': f'Document with id {id} has been deleted.'})

@api_view(['GET', 'PUT'])
def update_document_view(request,id):
    try:
            document = Document.objects.get(id=id)   
    except document.DoesNotExist:
        return Response({"error": "document not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':    
        serializer=DocumentSerializer(document)
        print(serializer.data)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = DocumentSerializer(document, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
@api_view(['GET'])
def serve_pdf_view(request, id):
    try:
        document = Document.objects.get(id=id)
    except Document.DoesNotExist:
        return Response({"error": "Document does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    # Open the PDF file in binary mode and return it as a response
    pdf = open(document.file.path, 'rb')
    return FileResponse(pdf, as_attachment=True)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_document_details(request, documentId):
    if request.user.is_authenticated:
        try:
            document = Document.objects.get(id=documentId)
            serializer = DocumentSerializer(document)
            return Response({
                'content': serializer.data['content'],
                'date_added': serializer.data['date_added']
            })
        except Document.DoesNotExist:
            return JsonResponse({'status': 'Document not found'}, status=404)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)
    
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def rate_document_view(request, document_id):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = request.data
            data['document'] = document_id  # Ensure the correct field is set to the document_id
            data['user'] = request.user.id
            serializer = RatingSerializer(data=data)
            if serializer.is_valid():
                serializer.save(user=request.user, value=data['value'])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({'status': 'User is not authenticated'}, status=400)



@api_view(['GET'])
def get_rating_counts_view(request, document_id):
    if request.method == 'GET':
        document = Document.objects.get(id=document_id)
        ratings = Rating.objects.filter(document=document).values('value').annotate(count=Count('value'))
        return Response(ratings)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def UpdateStudyPointsView(request, documentId):
    if request.user.is_authenticated:
        id = documentId
        if id:
            try:
                study_points = StudyPoints.objects.get(user=request.user)
            except ObjectDoesNotExist:
                study_points = StudyPoints.objects.create(user=request.user)
            
            study_points.DocumentsViewed += 1
            study_points.save()

            # Create a new ViewedDocument object for each viewed document
            ViewedDocument.objects.create(study_points=study_points, document_id=id)

            serializer = StudyPointsSerializer(study_points)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'status': 'documentId not provided'}, status=400)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)
    
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def UpdateDownloadPointsView(request, documentId):
    if request.user.is_authenticated:
        id = documentId
        if id:
            try:
                study_points = StudyPoints.objects.get(user=request.user)
            except ObjectDoesNotExist:
                study_points = StudyPoints.objects.create(user=request.user)
            
            study_points.DocumentsDownloaded += 1
            study_points.save()

            # Create a new DownloadedDocument object for each downloaded document
            DownloadedDocument.objects.create(study_points=study_points, document_id=id)

            serializer = StudyPointsSerializer(study_points)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'status': 'documentId not provided'}, status=400)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def UpdateADDPointsView(request, documentId):
    if request.user.is_authenticated:
        id = documentId
        if id:
            try:
                study_points = StudyPoints.objects.get(user=request.user)
            except ObjectDoesNotExist:
                study_points = StudyPoints.objects.create(user=request.user)
            
            study_points.DocumentsAdded += 1
            study_points.save()

            # Create a new DownloadedDocument object for each downloaded document
            AddedDocument.objects.create(study_points=study_points, document_id=id)

            serializer = StudyPointsSerializer(study_points)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'status': 'documentId not provided'}, status=400)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def update_time_spent(request, document_id):
    if request.method == 'POST':
        time_spent = float(request.data.get('timeSpent'))  # Make sure timeSpent is a float
        user = request.user
        print(f'user: {user}, document_id: {document_id},timeSpent:{time_spent}')
        record, created = UserTimeSpent.objects.get_or_create(user=user, document_id=document_id)
        record = UserTimeSpent.objects.get(user=user, document_id=document_id)
        time_spent_in_minutes = time_spent  # Convert timeSpent to minutes
        record.TimeSpent += time_spent_in_minutes
        record.save()
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'invalid request'})

"""

@api_view(['GET'])
def getdocument_view(request, id):
    if request.method == 'GET':
        document = Document.objects.get(id=id)
        serializer = DocumentSerializer(document, many=True)
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)

@api_view(['PUT']) #update view
def update_document_view(request, id):
    try:
        document = Document.objects.get(id=id)
    except Document.DoesNotExist:
        return Response({"error": "Document does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = DocumentSerializer(document, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)"""
'''
@api_view(['GET'])
def getSubjectBySpeciality(request, speciality):
    Subject_By_Speciality ={
            'informatique':[
                'Algorithmique et Structures de Données 1',  'Systèmes d’exploitation',
                'Systèmes Logiques et architecture des ordinateurs', 'Analyse', 'Statistiques et probabilité',
                'Principes de Gestion',  'Comptabilité Générale', 'Compétences numériques',
                'Business communication (en anglais)', 'Développement Personnel',
                'Travail collaboratif', 'Interface Homme machine', 'Fondements des réseaux',
                    'Introduction aux systèmes d’information',  'Logique mathématique',  'Algèbre',
                    'Le système d’information comptable', 'Gestion financière',
                'Business communication 2 (en anglais)',  'Droit de l’informatique',
                    'Erasmus : Digital Business Transformation',  'Erasmus : Entreprise Systems',],
            'science_gestion':[
                'Principes de Gestion 1', 'Comptabilité Financière 1',  'Microéconomie',
                'Mathématiques 1', 'Introduction au Droit', 'Mathématiques Financières',
                'Anglais 1', 'Comptabilité Financière 2', 'Mathématiques 2',
                'Statistique descriptive et calculs de probabilité',  'Macroéconomie',
                'Droit des sociétés Commerciales',  'Anglais 2', 'Fondamentaux du Management',
                'Comptabilité de gestion', 'Fondamentaux du Marketing',  'Cycle de conférences',
                'Anglais III', 'Techniques de communication interpersonnelle',
                'Fiscalité',  'Statistique Inférentielle', 'Fondamentaux de la GRH',
                'Diagnostic Financier',  'Gestion de la Production',  'Méthodologie d’Élaboration d’un Rapport de Stage',
                'Anglais IV', 'Coaching d’équipe et Leadership',
                'Transformation digitale de l’entreprise', 'Économie d’affaire',
                'Gestion Financière Internationale',  'Gestion des Institutions Financières',
                'Économétrie Appliquée à la Finance',  'Gestion de Portefeuille',
                'Études de cas en Finance', 'Compétences linguistiques',
                'Compétences entrepreneuriales', 'Gestion du fond de roulement',
                'Gestion de projet', 'Ingénierie Financière et Montages Financiers',
                'Politiques Financières de l’entreprise', 'Contrôle de Gestion',
                'Projet de fin d’études (PFE)', 'Français : rédaction professionnelle',
                'Logiciels appliqués à la finance', 'Gestion du risque de crédit',
                'Banques islamiques', 'Stratégie marketing',
                'Gestion des prix et des produits', 'Recherche marketing',
                'Analyse du comportement du consommateur', 'Études de cas en Marketing',
                'Anglais V', 'Négociation et gestion des conflits', 'Marketing digital',
                'Éthique du marketing et responsabilité sociétale de l’entreprise',
                'Stratégies de distribution', 'Communication marketing',
                    'Analyse des données marketing', 'Projet de fin d’études (PFE)',
                'Techniques d’expression française', 'Développement des sites Web',
                'Marketing de la relation client',  'Web Analytics et performance sur le Web'
            ],
            'economie':[
                'Principes d’économie', 'Principes de gestion',  'Comptabilité Financière 1',
                'Analyse', 'Statistiques descriptives et calculs des probabilités',
                'Anglais des affaires', 'Français des affaires', 'C2i1',
                'Microéconomie', 'Macroéconomie', 'Comptabilité Financière2',
                'Algèbre', 'Principes de droit',  'Conférences carrières',
                'Les métiers de l’économiste',  'Culture entrepreneuriale', 'Recherche Opérationnelle',
                'Comptabilité Nationale', 'Economie internationale', 'Economie industrielle',
                'Economie Monétaire',  'Statistique inférentielle',  'Méthodologie d’élaboration d’un rapport de stage',
                'Anglais des affaires', 'Business model', 'Macroéconomie Internationale',
                'Calcul économique', 'Initiation à l’économétrie', 'Economie de la banque et de l’assurance',
                'Droit des institutions financières', 'Macroéconomie monétaire',
                'Etude de cas en Economie', 'Business English', 'Développement personnel',
                'Gestion bancaire', 'Analyse de la conjoncture nationale',
                'Enquête et sondage', 'Finance internationale',  'Techniques financières actuarielles',
                'Elaboration et validation du PFE', 'Analyse et évaluation des projets',
                'Marchés financiers et gestion de portefeuille',  'Logiciels pour l’économie et la finance'
            ],
                }
    subjects = Subject_By_Speciality.get(speciality, [])
    return Response(subjects, status=status.HTTP_200_OK)'''