from ManagerApp import views

from django.urls import path
from django.views.generic import TemplateView

from django.urls import re_path, include

urlpatterns = [
    re_path(r'^manager/inventory$', views.inventoryApi),
    re_path(r'^manager/inventory/([0-9]+)$', views.inventoryApi),
    re_path(r'^manager/menu$', views.menuApi),
    re_path(r'^manager/menu/([0-9]+)$', views.menuApi),
    re_path(r'^manager/lowinventory$', views.lowInventoryApi),
    re_path(r'^manager/lowinventory/([0-9]+)$', views.lowInventoryApi),
    re_path(r'^manager/comboreport$', views.comboReportApi),
    re_path(r'^manager/salesreport$', views.salesReportApi),
    re_path(r'^manager/excessreport$', views.excessReportApi),
    re_path(r'^manager/restockreport$', views.restockReportApi),
    re_path(r'^server/placeorder$', views.placeOrderApi),
    re_path(r'^login/user$', views.userApi),
    path('manager', TemplateView.as_view(template_name='index.html')),
    path('server', TemplateView.as_view(template_name='index.html')),
    path('customer', TemplateView.as_view(template_name='index.html')),
    path('manager/', TemplateView.as_view(template_name='index.html')),
    path('server/', TemplateView.as_view(template_name='index.html')),
    path('customer/', TemplateView.as_view(template_name='index.html')),
    # path('login/', TemplateView.as_view(template_name='index.html')),
]