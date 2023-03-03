"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
  $favoriteList.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $favoriteList.hide();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user clicks on the submit in nav bar, show new story form */
function navSubmitFormOnClick(evt) {
  console.log("hello");
  evt.preventDefault();
  hidePageComponents();
  $submitForm.show();
  $favoriteList.hide();
}

$navSubmit.on("click", navSubmitFormOnClick);

/** When a user clicks on the submit in nav bar, show new story form */
function navFavoritesOnClick(evt) {
  evt.preventDefault();
  hidePageComponents();
  $favoriteList.show();
  putFavoritesListOnPage();
}

$navFavoriteStories.on("click", navFavoritesOnClick);
