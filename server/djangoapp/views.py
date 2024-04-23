from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel
from .populate import initiate
from .restapis import get_request, analyze_review_sentiments, post_review, searchcars_request # noqa
import logging
import json

# Get an instance of a logger
logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    try:
        data = json.loads(request.body)
        username = data['userName']
        password = data['password']
        user = authenticate(username=username, password=password)
        data = {"userName": username}
        if user is not None:
            login(request, user)
            data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return JsonResponse(
            {"error": "An error occurred during login"},
            status=500
        )


def logout_request(request):
    try:
        data = {"userName": ""}
        return JsonResponse(data)
    except Exception as e:
        logger.error(f"Error during logout: {e}")
        return JsonResponse(
            {"error": "An error occurred during logout"},
            status=500
        )


@csrf_exempt
def registration(request):
    try:
        data = json.loads(request.body)
        username = data['userName']
        password = data['password']
        first_name = data['firstName']
        last_name = data['lastName']
        email = data['email']
        username_exist = User.objects.filter(username=username).exists()
        if not username_exist:
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            login(request, user)
            data = {"userName": username, "status": "Authenticated"}
            return JsonResponse(data)
        else:
            data = {"userName": username, "error": "Already Registred"}
            return JsonResponse(data)
    except Exception as e:
        logger.error(f"Error during registration: {e}")
        return JsonResponse(
            {"error": "An error occurred during registration"},
            status=500
        )


@csrf_exempt
def get_cars(request):
    try:
        count = CarMake.objects.count()
        if count == 0:
            initiate()
        car_models = CarModel.objects.select_related('car_make')
        cars = [
            {
                "CarModel": car_model.name,
                "CarMake": car_model.car_make.name
            }
            for car_model in car_models
        ]
        return JsonResponse({"CarModels": cars})
    except Exception as e:
        logger.error(f"Error while fetching cars: {e}")
        return JsonResponse(
            {"error": "An error occurred while fetching cars"},
            status=500
        )


def get_dealerships(request, state="All"):
    try:
        if state == "All":
            endpoint = "/fetchDealers"
        else:
            endpoint = f"/fetchDealers/{state}"
        dealerships = get_request(endpoint)
        return JsonResponse({"status": 200, "dealers": dealerships})
    except Exception as e:
        logger.error(f"Error while fetching dealerships: {e}")
        return JsonResponse(
            {"error": "An error occurred while fetching dealerships"},
            status=500
        )


@csrf_exempt
def get_dealer_details(request, dealer_id):
    try:
        if dealer_id:
            endpoint = f"/fetchDealer/{dealer_id}"
            dealership = get_request(endpoint)
            return JsonResponse({"status": 200, "dealer": dealership})
        else:
            return JsonResponse({"status": 400, "message": "Bad Request"})
    except Exception as e:
        logger.error(f"Error while fetching dealer details: {e}")
        return JsonResponse(
            {"error": "An error occurred while fetching dealer details"},
            status=500
        )


@csrf_exempt
def get_dealer_reviews(request, dealer_id):
    try:
        if dealer_id:
            endpoint = f"/fetchReviews/dealer/{dealer_id}"
            reviews = get_request(endpoint)
            if reviews:
                for review_detail in reviews:
                    response = analyze_review_sentiments(
                        review_detail['review']
                    )
                    if response:
                        review_detail['sentiment'] = response.get('sentiment')
                    else:
                        review_detail['sentiment'] = None
                return JsonResponse({"status": 200, "reviews": reviews})
            else:
                return JsonResponse({
                    "status": 404,
                    "message": "No reviews found"
                })
        else:
            return JsonResponse({"status": 400, "message": "Bad Request"})
    except Exception as e:
        logger.error(f"Error while fetching dealer reviews: {e}")
        return JsonResponse(
            {"error": "An error occurred while fetching dealer reviews"},
            status=500
        )


@csrf_exempt
def add_review(request):
    try:
        if not request.user.is_anonymous:
            data = json.loads(request.body)
            response = post_review(data) # noqa
            return JsonResponse({"status": 200})
        else:
            return JsonResponse({"status": 403, "message": "Unauthorized"})
    except Exception as e:
        logger.error(f"Error while adding review: {e}")
        return JsonResponse(
            {"error": "An error occurred while adding review"},
            status=500
        )


def get_inventory(request, dealer_id):
    data = request.GET
    if (dealer_id):
        if 'year' in data:
            endpoint = "/carsbyyear/" + str(dealer_id) + "/" + data['year']
        elif 'make' in data:
            endpoint = "/carsbymake/" + str(dealer_id) + "/" + data['make']
        elif 'model' in data:
            endpoint = "/carsbymodel/" + str(dealer_id) + "/" + data['model']
        elif 'mileage' in data:
            endpoint = "/carsbymaxmileage/" + str(dealer_id) + "/" + data["mileage"] # noqa
        elif 'price' in data:
            endpoint = "/carsbyprice/" + str(dealer_id) + "/" + data["price"]
        else:
            endpoint = "/cars/" + str(dealer_id)

        cars = searchcars_request(endpoint)
        return JsonResponse({"status": 200, "cars": cars})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})
    return JsonResponse({"status": 400, "message": "Bad Request"})
