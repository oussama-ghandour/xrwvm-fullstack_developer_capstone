import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Box from '@mui/material/Box';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';
import Sidebar from '../SideBar/SideBar';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);
  let navigate = useNavigate();
  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("dealer"));
  let params = useParams();
  let id = params.id;
  let dealer_url = `${root_url}djangoapp/dealer/${id}`;
  let reviews_url = `${root_url}djangoapp/reviews/dealer/${id}`;
  let post_review = root_url+`postreview/${id}`;

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      if (!res.ok) throw new Error('Failed to fetch dealer');
      const retobj = await res.json();
      if (retobj?.status === 200 && retobj.dealer?.length > 0) {
        setDealer(retobj.dealer[0]);
      } else {
        console.error('Invalid response format:', retobj);
      }
    } catch (error) {
      console.error('Error fetching dealer:', error);
    }
  }

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, { method: "GET" });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const retobj = await res.json();
      if (retobj?.status === 404 && retobj.message === "No reviews found") {
        setUnreviewed(true);
      } else if (retobj?.status === 200) {
        setReviews(retobj.reviews || []);
      } else {
        console.error('Invalid response format:', retobj);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  const senti_icon = (sentiment) => {
    return sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
  }

useEffect(() => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review}><Button variant="contained">Leave a review</Button></a>) 
    }
  },[]);  

  return (
    <div>
        <Header />
        <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <div style={{ marginTop: "50px", marginLeft: "30%", width:"30%"}}>
            <Accordion>
            <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Typography style={{marginLeft:"100px"}} value="bold" aria-label="bold">{dealer.full_name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{display: "flex", width: "80%",marginLeft: "50px",justifyContent: "space-around"}}>
                <FmdGoodIcon style={{color:"#2196f3"}}/>
                <Typography>
                    {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
                </Typography>
                </div>
            </AccordionDetails>
            </Accordion>
        </div>
        <div style={{display: "flex",alignItems: "center",justifyContent:"space-evenly", marginLeft:"33%", width:"25%"}}>
            <Button onClick={() => navigate(`/searchcars/${id}`)} variant="contained" style={{marginTop:"8px"}}>View Cars</Button>
            <h1 style={{ color: "grey", marginTop:"5px" }}>{postReview}</h1>
        </div>

        <div className="reviews_panel">
            {reviews.length === 0 && !unreviewed ? (
            <p>Loading Reviews....</p>
            ) : unreviewed ? (
            <div>No reviews yet!</div>
            ) : (
            reviews.map(review => (
                <div className='review_panel' key={review.id}>
                <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
                <div className='review'>{review.review}</div>
                <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
                </div>
            ))
            )}
        </div>
        </Box>
    </Box>
    </div>
    
  )
}

export default Dealer;

