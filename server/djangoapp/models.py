from django.db import models
# from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator


# Create a Car Make model
class CarMake(models.Model):
    # Name
    name = models.CharField(max_length=100)

    # Description
    description = models.TextField()

    # __str__ method to print a car make object
    def __str__(self):
        return self.name


# Create a Car Model model
class CarModel(models.Model):
    # Many-To-One relationship to Car Make model
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    # Name
    name = models.CharField(max_length=100)
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('MINIVAN', 'Minivan'),
        ('HATCHBACK', 'Hatchback'),
        ('WAGON', 'Wagon'),
        ('CONVERTIBLE', 'Convertible'),
        ('SUV', 'Suv'),
    ]
    # Type (CharField with a choices argument to provide limited choices
    type = models.CharField(max_length=12, choices=CAR_TYPES, default='SEDAN')
    # Year (IntegerField) with min value 2015 and max value 2023
    year = models.IntegerField(
        default=2023,
        validators=[
            MaxValueValidator(2023),
            MinValueValidator(2015),
        ]
    )

    # __str__ method to print a car make object
    def __str__(self):
        return self.name
