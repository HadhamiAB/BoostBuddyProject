from django.db import models
from signupapi.models import User
from django.conf import settings

TYPE_CHOICES = [
    ('exam', 'Exam'),
    ('summary', 'Summary'),
    ('course', 'Course'),
    ('other', 'Other'),
]
speciality_choices =[
    ('informatique', 'Informatique De Gestion'),
    ('science_gestion', 'Science De Gestion'),
    ('economie', 'Economie'),
    ('master_pro', 'Master Professionnels'),
    ('master_recherche', 'Master De Recherche'),
]

class Document(models.Model):
    title = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    content = models.TextField()
    date_added = models.DateField(auto_now_add=True)
    speciality = models.CharField(max_length=60, choices=speciality_choices)
    #subject_name = models.CharField(max_length=200, choices=[(subject, subject) for subject in Subject_By_Speciality.get('default', [])])
    subject_name = models.CharField(max_length=200)
    year = models.PositiveIntegerField()
    file = models.FileField(upload_to='documents/') 
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.title 
class Rating(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    value = models.FloatField()

class StudyPoints(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
        DocumentsViewed = models.PositiveIntegerField(default=0)
        DocumentsDownloaded = models.PositiveIntegerField(default=0)
        DocumentsAdded = models.PositiveIntegerField(default=0)

@property
def total(self):
        return self.DocumentsViewed + self.DocumentsDownloaded + self.DocumentsAdded

class ViewedDocument(models.Model):
    study_points = models.ForeignKey(StudyPoints, on_delete=models.CASCADE)
    document_id = models.PositiveIntegerField()

class DownloadedDocument(models.Model):
    study_points = models.ForeignKey(StudyPoints, on_delete=models.CASCADE)
    document_id = models.PositiveIntegerField()

class AddedDocument(models.Model):
    study_points = models.ForeignKey(StudyPoints, on_delete=models.CASCADE)
    document_id = models.PositiveIntegerField()

class UserTimeSpent(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    TimeSpent=models.FloatField(default=0.00) 
    document_id = models.PositiveIntegerField(default=0)
    class Meta:
        unique_together = ('user', 'document_id')
class UserTimeSpent3D(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    TimeSpent = models.FloatField(default=0.00)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, null=True)

'''
    def get_subject(self):
        return self.Subject_By_Speciality.get('default', [])
'''
'''
    Subject_By_Speciality ={
    'informatique':[
        'Algorithmique et Structures de Données 1',
        'Systèmes d’exploitation',
        'Systèmes Logiques et architecture des ordinateurs',
        'Analyse',
        'Statistiques et probabilité',
        'Principes de Gestion',
        'Comptabilité Générale',
        'Compétences numériques',
        'Business communication (en anglais)',
        'Développement Personnel',
        'Travail collaboratif',
        'Interface Homme machine',
        'Fondements des réseaux',
        'Introduction aux systèmes d’information',
        'Logique mathématique',
        'Algèbre',
        'Le système d’information comptable',
        'Gestion financière',
        'Business communication 2 (en anglais)',
        'Droit de l’informatique',
        'Erasmus : Digital Business Transformation',
        'Erasmus : Entreprise Systems',
        ],
    'science_gestion':[
        'Principes de Gestion 1',
        'Comptabilité Financière 1',
        'Microéconomie',
        'Mathématiques 1',
        'Introduction au Droit',
        'Mathématiques Financières',
        'Anglais 1',
        'Comptabilité Financière 2',
        'Mathématiques 2',
        'Statistique descriptive et calculs de probabilité',
        'Macroéconomie',
        'Droit des sociétés Commerciales',
        'Anglais 2',
        'Fondamentaux du Management',
        'Comptabilité de gestion',
        'Fondamentaux du Marketing',
        'Cycle de conférences',
        'Anglais III',
        'Techniques de communication interpersonnelle',
        'Fiscalité',
        'Statistique Inférentielle',
        'Fondamentaux de la GRH',
        'Diagnostic Financier',
        'Gestion de la Production',
        'Méthodologie d’Élaboration d’un Rapport de Stage',
        'Anglais IV',
        'Coaching d’équipe et Leadership',
        'Transformation digitale de l’entreprise',
        'Économie d’affaire',
        'Gestion Financière Internationale',
        'Gestion des Institutions Financières',
        'Économétrie Appliquée à la Finance',
        'Gestion de Portefeuille',
        'Études de cas en Finance',
        'Compétences linguistiques',
        'Compétences entrepreneuriales',
        'Gestion du fond de roulement',
        'Gestion de projet',
        'Ingénierie Financière et Montages Financiers',
        'Politiques Financières de l’entreprise',
        'Contrôle de Gestion',
        'Projet de fin d’études (PFE)',
        'Français : rédaction professionnelle',
        'Logiciels appliqués à la finance',
        'Gestion du risque de crédit',
        'Banques islamiques',
        'Stratégie marketing',
        'Gestion des prix et des produits',
        'Recherche marketing',
        'Analyse du comportement du consommateur',
        'Études de cas en Marketing',
        'Anglais V',
        'Négociation et gestion des conflits',
        'Marketing digital',
        'Éthique du marketing et responsabilité sociétale de l’entreprise',
        'Stratégies de distribution',
        'Communication marketing',
        'Analyse des données marketing',
        'Projet de fin d’études (PFE)',
        'Techniques d’expression française',
        'Développement des sites Web',
        'Marketing de la relation client',
        'Web Analytics et performance sur le Web'
    ],
    'economie':[
        'Principes d’économie',
        'Principes de gestion',
        'Comptabilité Financière 1',
        'Analyse',
        'Statistiques descriptives et calculs des probabilités',
        'Anglais des affaires',
        'Français des affaires',
        'C2i1',
        'Microéconomie',
        'Macroéconomie',
        'Comptabilité Financière2',
        'Algèbre',
        'Principes de droit',
        'Conférences carrières',
        'Les métiers de l’économiste',
        'Culture entrepreneuriale',
        'Recherche Opérationnelle',
        'Comptabilité Nationale',
        'Economie internationale',
        'Economie industrielle',
        'Economie Monétaire',
        'Statistique inférentielle',
        'Méthodologie d’élaboration d’un rapport de stage',
        'Anglais des affaires',
        'Business model',
        'Macroéconomie Internationale',
        'Calcul économique',
        'Initiation à l’économétrie',
        'Economie de la banque et de l’assurance',
        'Droit des institutions financières',
        'Macroéconomie monétaire',
        'Etude de cas en Economie',
        'Business English',
        'Développement personnel',
        'Gestion bancaire',
        'Analyse de la conjoncture nationale',
        'Enquête et sondage',
        'Finance internationale',
        'Techniques financières actuarielles',
        'Elaboration et validation du PFE',
        'Analyse et évaluation des projets',
        'Marchés financiers et gestion de portefeuille',
        'Logiciels pour l’économie et la finance'

    ],
}'''
    
