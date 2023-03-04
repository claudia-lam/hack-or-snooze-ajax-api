"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const star = getStar(story);
//todo: if there is no currentUser, add 28-30 to get star
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="bi ${star}"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/**checks if storyId is in currentUser's favorites 
 * returns bootstrap string element
 */
function getStar(story){

  if(currentUser.favorites.some((favStory)=>favStory.storyId == story.storyId)){
    return "bi-star-fill";
  }
  else{
    return "bi-star";
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//update name to something with create story and edit doctring
/** Gets data from submit form and put story on page*/

async function getFormDataAndCreateStory(evt) {
  evt.preventDefault();

  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();

  const user = currentUser;
  const storyInput = { title, author, url };

  const story = await storyList.addStory(user, storyInput);

  //pass story to function and prepend to allstorieslist
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $submitForm.hide();
  $allStoriesList.show();
}

$submitForm.on("submit", getFormDataAndCreateStory);
/** gets list of currentUser's favorites,
 * generates html stories and puts on page
*/
function putFavoritesListOnPage() {
  $favoriteList.empty();

  // loop through all of our stories and generate HTML for them
  for (let favorite of currentUser.favorites) {
    const $favorite = generateStoryMarkup(favorite);
    $favoriteList.append($favorite);
  }

  $favoriteList.show();
}
/** lets user favorite and unfavorite story
 * requests storyId and creates new Story object
 * adds or removes new Story object 
 */
async function toggleStoryFavorite(evt) {
  //todo: closest instead of parent
  const $starParent = $(evt.target).parent().parent();
  const storyId = $starParent.attr("id");

  const storyResponse = await axios.get(`${BASE_URL}/stories/${storyId}`);

  const story = new Story(storyResponse.data.story);

  //user favorites as "source of truth" rather than html element - use favorite list
  if ($(evt.target).hasClass("bi-star-fill")) {
     await currentUser.deleteFavorite(story);
    $(evt.target).removeClass("bi-star-fill").addClass("bi-star");
  }
  else {
    $(evt.target).removeClass("bi-star").addClass("bi-star-fill");
    await currentUser.addFavorite(story);
  }

}

$body.on("click", ".star", toggleStoryFavorite);

