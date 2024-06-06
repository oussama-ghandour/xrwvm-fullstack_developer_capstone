import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import "./Dealers.css";
import "./Review.css";
import "../assets/style.css";
import Header from '../Header/Header';
import Sidebar from '../SideBar/SideBar';
import Box from '@mui/material/Box';


const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState();
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("postreview"));
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let review_url = root_url+`djangoapp/add_review`;
  let carmodels_url = root_url+`djangoapp/get_cars`;
  let reviews_url = root_url+`djangoapp/reviews/dealer/${id}`;

  const postreview = async ()=>{
    let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
    //If the first and second name are stores as null, use the username
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if(!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory")
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    console.log(jsoninput);
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: jsoninput,
  });

  const json = await res.json();
  if (json.status === 200) {
      window.location.href = window.location.origin+"/dealer/"+id;
  }

  }
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      if(dealerobjs.length > 0)
        setDealer(dealerobjs[0])
    }
  }

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, {
        method: "GET"
      });
  
      console.log("GET Reviews Request:", res); // Log the request object
  
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
  
      const retobj = await res.json();
  
      console.log("GET Reviews Response:", retobj); // Log the response object
  
      if (retobj && retobj.status === 404 && retobj.message === "No reviews found") {
        setUnreviewed(true);
      } else if (retobj && retobj.status === 200) {
        if (retobj.reviews && retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      } else {
        console.error('Invalid response format:', retobj);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  const get_cars = async ()=>{
    const res = await fetch(carmodels_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    let carmodelsarr = Array.from(retobj.CarModels)
    setCarmodels(carmodelsarr)
  }
  useEffect(() => {
    get_dealer();
    get_cars();
    get_reviews();
  },[id]);


  return (
    <div>
    <Header />
    <Box sx={{ display: 'flex' }}>
    <Sidebar  />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
    <div className="review-form-container" style={{marginLeft:"20%"}}>
      <h1 className="dealer-name">{dealer.full_name}</h1>
      <div className="form-group">
        <textarea
          id="review"
          className="review-textarea"
          cols="50"
          rows="7"
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          required
        ></textarea>
      </div>
      <div className="form-group" style={{width:"30%"}}>
        <label htmlFor="purchase-date">Purchase Date:</label>
        <input
          type="date"
          id="purchase-date"
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <div className="form-group" style={{width:"30%"}}>
        <label htmlFor="car-make">Car Make:</label>
        <select
          id="car-make"
          onChange={(e) => setModel(e.target.value)}
          required
        >
          <option value="" disabled hidden>
            Choose Car Make and Model
          </option>
          {carmodels.map((carmodel) => (
            <option
              value={carmodel.CarMake + " " + carmodel.CarModel}
              key={carmodel.id}
            >
              {carmodel.CarMake} {carmodel.CarModel}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group" style={{width:"30%"}}>
        <label htmlFor="car-year">Car Year:</label>
        <input
          type="number"
          id="car-year"
          onChange={(e) => setYear(e.target.value)}
          max={new Date().getFullYear()}
          min={2015}
          required
        />
      </div>
      <div className="form-group">
        <button className="post-review-btn" onClick={postreview}>
          Post Review
        </button>
      </div>
    </div>
    </Box>
    </Box>
  </div>  
  )
}
export default PostReview