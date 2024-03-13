from django.contrib import admin
from .models import CarMake, CarModel


# CarModelInline class
class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1
# CarModelAdmin class
class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]
    list_display = ('name', 'description')
# CarMakeAdmin class with CarModelInline
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'id', 'car_type', 'year')
    list_filter = ['year']
    search_fields = ['name', 'car_type']
# Register models here
admin.site.register(CarMake)
admin.site.register(CarModel)





   

