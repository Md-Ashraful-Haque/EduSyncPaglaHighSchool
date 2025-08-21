# from django.db import connection, reset_queries

# reset_queries()
# students = Student.objects.all()  # or .prefetch_related('subjects')
# for student in students:
#     print(f"Student: {student.name}")
#     for subject in student.subjects.all():
#         print(f"  Subject: {subject.name}")
# print(f"Total queries: {len(connection.queries)}")
# print(f"Memory Size of Queryset: {sys.getsizeof(results)} bytes (excludes object data)")