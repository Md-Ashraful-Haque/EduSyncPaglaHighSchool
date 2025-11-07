# pagination.py
from rest_framework.pagination import PageNumberPagination

class NoticePagination(PageNumberPagination):
    page_size = 10  # Change this if you want more/less per page
    page_size_query_param = 'page_size'
