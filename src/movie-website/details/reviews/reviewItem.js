import React from "react";
import { useState, useEffect } from 'react'
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { deleteReviewThunk } from "../../services/reviews-thunks";
import { likeReviewThunk, dislikeReviewThunk } from "../../services/likes-thunks";
import { NavLink } from 'react-router-dom';
import DeleteBtn from "../../../ui-styling/buttons/icons/deleteBtn";
import ReportBtn from "../../../ui-styling/buttons/icons/reportBtn";
import ReportReview from "./reportReview";
import LikeBtn from "../../../ui-styling/buttons/icons/likeBtn";
import DislikeBtn from "../../../ui-styling/buttons/icons/dislikeBtn";

const ReviewItem = ({ review }) => {
  const dispatch = useDispatch();

  const[liked, setLiked] = useState(false)
  const[disliked, setDisliked] = useState(false)
  const[reporting, setReporting] = useState(false)

  const { currentUser } = useSelector((state) => state.user);
  const username = currentUser ? currentUser.username : null
  const { rev_id } = review

  useEffect(() => {
    if (currentUser && currentUser.roles.includes('Viewer')) {
      setLiked(review.likes.includes(username))
      setDisliked(review.dislikes.includes(username))
    }
}, [liked, disliked, currentUser, review, username])

  const deleteReviewHandler = (event, id) => {
    event.preventDefault(); // prevents the default action
    event.stopPropagation(); // stops the event from bubbling up
    dispatch(deleteReviewThunk(id));
  }

  const toggleReporting = () => {
    setReporting(!reporting)
  }

  const onLikeClick = () => {
    dispatch(likeReviewThunk({liked, disliked, rev_id, username}));
    setLiked(!liked)
    if (disliked) {
      setDisliked(false)
    }
  }

  const onDislikeClick = () => {
    dispatch(dislikeReviewThunk({ disliked, liked, rev_id, username }));
    setDisliked(!disliked)
    if (liked) {
      setLiked(false)
    }
  }

  const forceLogin = () => {
    alert("Create an account to proceed");
  };

  const reviewedByCurrentUser = review.critic_id === currentUser?.username;

  return (
  <>
    {
      reporting &&
      <ReportReview reporting={reporting} 
                    toggleReporting={toggleReporting}
                    rev_id={review.rev_id}/>
    }
    <div>
      {currentUser ? (
        <div className="list-group-item list-group-item-action flex-column align-items-start wd-movie-list-item 
                        position-relative">
          <ReportBtn fn={toggleReporting} additional_classes='position-absolute pl-0 top-0 end-0'/> 
          <NavLink
            to={`/profile${reviewedByCurrentUser ? "" : "/" + review.critic_id}`}
            state={{ review }}
            className="wd-movie-list-item text-decoration-none"
          >
            <div>
              {currentUser && currentUser.roles[0] === "ADMIN" && (
                <DeleteBtn
                  fn={(event) => deleteReviewHandler(event, review.rev_id)}
                  className={"float-end"}
                />

              )}
              <h3>
               {review.critic_id} {reviewedByCurrentUser && " (You)"} 
              </h3>

              <h4>{review.title}</h4>
              <Rating name="read-only" value={review.rating} readOnly />
              <h5>Description: {review.review_text}</h5>
            </div>
          </NavLink>
          {currentUser.roles.includes('Viewer') &&
          <>
            <LikeBtn fn={onLikeClick} liked={liked}/> 
            <DislikeBtn fn={onDislikeClick} disliked={disliked}/>
          </>
          }
           <span className='fs-5 ms-3'>
              {currentUser.roles.includes('Viewer') ? '' : 'Viewer Score: '}
              {review.likes.length - review.dislikes.length}
          </span>
         </div>
      ) : (
        <NavLink
          to={"/login"}
          state={{ review }}
          className="list-group-item list-group-item-action flex-column align-items-start wd-movie-list-item"
          onClick={forceLogin}
        >
          <div>
            <h3>{review.critic_id}</h3>
            <h4>{review.title}</h4>
            <Rating name="read-only" value={review.rating} readOnly />
            <h5>Description: {review.review_text}</h5>
          </div>
        </NavLink>
      )}
    </div>
    </>
  );
}
export default ReviewItem;