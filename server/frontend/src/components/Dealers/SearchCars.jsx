import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import './SearchCars.css';
import { Card, CardMedia } from '@mui/material';

function SearchCars() {
  const [cars, setCars] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [dealer, setDealer] = useState({ "full_name": "" });
  const [message, setMessage] = useState("Loading Cars....");
  const { id } = useParams();

  let dealer_url = `/djangoapp/get_inventory/${id}`;
  let fetch_url = `/djangoapp/dealer/${id}`;

  // Sample car data including the image URL for the Audi TT
  const sampleCar = {
    make: "Audi",
    model: "TT",
    bodyType: "Convertible",
    year: 2021,
    dealer_id: 25,
    mileage: 10000,
    price: 70000,
    image_url: "https://images.pexels.com/photos/14240209/pexels-photo-14240209.jpeg"
  };

  // Async func to extract the full name of dealer
  const fetchDealer = async () => {
    const res = await fetch(fetch_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if (retobj.status === 200) {
      let dealer = retobj.dealer;
      setDealer({ "full_name": dealer[0].full_name });
    }
  }

  const populateMakesAndModels = (cars) => {
    let tmpmakes = [];
    let tmpmodels = [];
    cars.forEach((car) => {
      tmpmakes.push(car.make);
      tmpmodels.push(car.model);
    });
    setMakes(Array.from(new Set(tmpmakes)));
    setModels(Array.from(new Set(tmpmodels)));
  }

  // Async func to cars make and model
  const fetchCars = async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();

    if (retobj.status === 200) {
      let cars = Array.from(retobj.cars);
      cars.push(sampleCar); // Add the sample car data to the cars array
      setCars(cars);
      populateMakesAndModels(cars);
    }
  }

  const setCarsmatchingCriteria = async (matching_cars) => {
    let cars = Array.from(matching_cars);
    console.log("Number of matching cars " + cars.length);

    let makeIdx = document.getElementById('make').selectedIndex;
    let modelIdx = document.getElementById('model').selectedIndex;
    let yearIdx = document.getElementById('year').selectedIndex;
    let mileageIdx = document.getElementById('mileage').selectedIndex;
    let priceIdx = document.getElementById('price').selectedIndex;

    if (makeIdx !== 0) {
      let currmake = document.getElementById('make').value;
      cars = cars.filter(car => car.make === currmake);
    }
    if (modelIdx !== 0) {
      let currmodel = document.getElementById('model').value;
      cars = cars.filter(car => car.model === currmodel);
      if (cars.length !== 0) {
        document.getElementById('make').value = cars[0].make;
      }
    }

    if (yearIdx !== 0) {
      let curryear = document.getElementById('year').value;
      cars = cars.filter(car => car.year >= curryear);
      if (cars.length !== 0) {
        document.getElementById('make').value = cars[0].make;
      }
    }

    if (mileageIdx !== 0) {
      let currmileage = parseInt(document.getElementById('mileage').value);
      cars = cars.filter(car =>
        currmileage === 50000 ? car.mileage <= currmileage :
          currmileage === 100000 ? (car.mileage <= currmileage && car.mileage > 50000) :
            currmileage === 150000 ? (car.mileage <= currmileage && car.mileage > 100000) :
              currmileage === 200000 ? (car.mileage <= currmileage && car.mileage > 150000) :
                car.mileage > 200000
      );
    }

    if (priceIdx !== 0) {
      let currprice = parseInt(document.getElementById('price').value);
      cars = cars.filter(car =>
        currprice === 20000 ? car.price <= currprice :
          currprice === 40000 ? (car.price <= currprice && car.price > 20000) :
            currprice === 60000 ? (car.price <= currprice && car.price > 40000) :
              currprice === 80000 ? (car.price <= currprice && car.price > 60000) :
                car.price > 80000
      );
    }

    if (cars.length === 0) {
      setMessage("No cars found matching criteria");
    }
    setCars(cars);
  }

  let SearchCarsByMake = async () => {
    let make = document.getElementById("make").value;
    dealer_url = dealer_url + "?make=" + make;

    const res = await fetch(dealer_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const retobj = await res.json();

    if (retobj.status === 200) {
      setCarsmatchingCriteria(retobj.cars);
    }
  }

  let SearchCarsByModel = async () => {
    let model = document.getElementById("model").value;
    dealer_url = dealer_url + "?model=" + model;

    const res = await fetch(dealer_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const retobj = await res.json();

    if (retobj.status === 200) {
      setCarsmatchingCriteria(retobj.cars);
    }
  }

  let SearchCarsByYear = async () => {
    let year = document.getElementById("year").value;
    if (year !== "all") {
      dealer_url = dealer_url + "?year=" + year;
    }

    const res = await fetch(dealer_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const retobj = await res.json();

    if (retobj.status === 200) {
      setCarsmatchingCriteria(retobj.cars);
    }
  }

  let SearchCarsByMileage = async () => {
    let mileage = document.getElementById("mileage").value;
    if (mileage !== "all") {
      dealer_url = dealer_url + "?mileage=" + mileage;
    }

    const res = await fetch(dealer_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const retobj = await res.json();

    if (retobj.status === 200) {
      setCarsmatchingCriteria(retobj.cars);
    }
  }

  let SearchCarsByPrice = async () => {
    let price = document.getElementById("price").value;
    if (price !== "all") {
      dealer_url = dealer_url + "?price=" + price;
    }

    const res = await fetch(dealer_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const retobj = await res.json();

    if (retobj.status === 200) {
      setCarsmatchingCriteria(retobj.cars);
    }
  }

  const reset = () => {
    const selectElements = document.querySelectorAll('select');

    selectElements.forEach((select) => {
      select.selectedIndex = 0;
    });
    fetchCars();
  }

  useEffect(() => {
    fetchCars();
    fetchDealer();
  }, []);

  return (
    <div>
      <Header />
      <h1 style={{ marginBottom: '20px', marginLeft: '60px', marginTop: '30px', fontSize: 'xx-large' }} className='gradient'>Welcome to {dealer.full_name}</h1>
      <h3 className='title-descr'>Here, you can find a way to select the right car based on your personal preferences</h3>
      <div>
        <div className='card-select'>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: '13px' }}>
            <div style={{ width: "21%" }}>
              <span style={{ marginLeft: '10px', paddingLeft: '10px' }}>Make</span>
              <select style={{ marginLeft: '10px', marginRight: '10px', paddingLeft: '10px', borderRadius: '10px' }} name="make" id="make" onChange={SearchCarsByMake}>
                {makes.length === 0 ? (
                  <option value=''>No data found</option>
                ) : (
                  <>
                    <option disabled defaultValue> -- All -- </option>
                    {makes.map((make, index) => (
                      <option key={index} value={make}>
                        {make}
                      </option>
                    ))}
                  </>
                )
                }
              </select>
            </div>
            <div style={{ width: "21%" }}>
              <span style={{ marginLeft: '10px', paddingLeft: '10px' }}>Model</span>
              <select style={{ marginLeft: '10px', marginRight: '10px', paddingLeft: '10px', borderRadius: '10px' }} name="model" id="model" onChange={SearchCarsByModel}>
                {models.length === 0 ? (
                  <option value=''>No data found</option>
                ) : (
                  <>
                    <option disabled defaultValue> -- All -- </option>
                    {models.map((model, index) => (
                      <option key={index} value={model}>
                        {model}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div style={{ width: "20%" }}>
              <span style={{ marginLeft: '10px', paddingLeft: '10px' }}>Year</span>
              <select style={{ marginLeft: '10px', marginRight: '10px', paddingLeft: '10px', borderRadius: '10px' }} name="year" id="year" onChange={SearchCarsByYear}>
                <option selected value='all'> -- All -- </option>
                <option value='2024'>2024 or newer</option>
                <option value='2023'>2023 or newer</option>
                <option value='2022'>2022 or newer</option>
                <option value='2021'>2021 or newer</option>
                <option value='2020'>2020 or newer</option>
              </select>
            </div>
            <div style={{ width: "15%" }}>
              <span style={{ marginLeft: '10px', paddingLeft: '10px' }}>Mileage</span>
              <select style={{ marginLeft: '10px', marginRight: '10px', paddingLeft: '10px', borderRadius: '10px' }} name="mileage" id="mileage" onChange={SearchCarsByMileage}>
                <option selected value='all'> -- All -- </option>
                <option value='50000'>Under 50000</option>
                <option value='100000'>50000 - 100000</option>
                <option value='150000'>100000 - 150000</option>
                <option value='200000'>150000 - 200000</option>
                <option value='200001'>Over 200000</option>
              </select>
            </div>
            <div style={{ width: "15%" }}>
              <span style={{ marginLeft: '10px', paddingLeft: '10px' }}>Price</span>
              <select style={{ marginLeft: '10px', marginRight: '10px', paddingLeft: '10px', borderRadius: '10px' }} name="price" id="price" onChange={SearchCarsByPrice}>
                <option selected value='all'> -- All -- </option>
                <option value='20000'>Under 20000</option>
                <option value='40000'>20000 - 40000</option>
                <option value='60000'>40000 - 60000</option>
                <option value='80000'>60000 - 80000</option>
                <option value='80001'>Over 80000</option>
              </select>
            </div>
            <button className="button-reset" style={{ marginLeft: '10px', paddingLeft: '10px' }} onClick={reset}>Reset</button>
          </div>
        </div>
      </div>

      <div style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }} >
        {cars.length === 0 ? (
          <p style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }}>{message}</p>
        ) : (
          <div>
            <hr />
            {cars.map((car) => (
              <div key={car._id} style={{ marginLeft: "70%" }}>
                <div>
                  <h3>{car.make} {car.model}</h3>
                  <p>Year: {car.year}</p>
                  <p>Mileage: {car.mileage}</p>
                  <p>Price: {car.price}</p>
                  <Card>
                    <CardMedia component="img" image={car.image_url} alt={`${car.make} ${car.model}`} />
                  </Card>
                </div>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCars;



