let _appliedFilters = [];
let _filteredJson = [];
let _clickedFilters = [];
let _clickedPostId = undefined;
let _clickedPostSellerId = undefined;

//Needs to be here modules have issues with bindings
function appendAndGoPostDetails(postId, sellerId) {
  navigateTo("#/postDetials");
  _clickedPostId = postId;
  _clickedPostSellerId = sellerId;
  appendPostDetails(postId, sellerId);
}
async function fetchPosts() {
  const fetchData = await fetch("../../src/backend/json/posts.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return fetchData;
}
function appendPosts(posts) {
  document.querySelector("#posts-feed-container").innerHTML = "";
  let htnlTemplate = ``;
  for (let post of posts) {
    htnlTemplate = `
    <article onclick = "appendAndGoPostDetails(${post.post_id},${
      post.seller_id
    })" class="post-box border-2 mb-4 border-light-black rounded-3xl overflow-hidden">
    <img class="max-h-36 w-full object-cover" src="./src/media/posted/${
      post.image_name
    }" alt="image of sold food" />
    <div class="post-content-wrapper mx-3">
      <div class="flex justify-between mt-2">
        <span class="food-category-badge 
        ${
          post.category == "Fruits & Vegetables" ? "bg-light-green-custom" : ""
        } ${post.category == "Dish" ? "bg-light-blue" : ""}
        ${post.category == "Bread & Pastry" ? "bg-light-orange" : ""} ${
      post.category == "Dessert" ? "bg-light-violet" : ""
    }
        ${post.category == "Diary" ? "bg-light-red" : ""}">${
      post.category
    }</span>
        <div class="flex">
          <img class="pr-1 w-6 h-6 object-cover object-center rounded-full" src="./src/media/profile/${
            post.seller_image
          }" alt="" />
          <p>${post.seller_username}</p>
        </div>
      </div>
      <div class="flex justify-between font-bold mt-4">
        <p>${post.product_name}</p>
        <p>DKK ${post.price}</p>
      </div>
      <div class="flex justify-between mt-1 mb-2 opacity-50 text-xs">
        <p>Amount ${post.amount}</p>
        <p>Expires: ${post.expires_in}</p>
      </div>
    </div>
  </article>
    `;
    document.querySelector("#posts-feed-container").innerHTML += htnlTemplate;
  }
  // console.log("Appended posts", posts);
}
function appendCheckedFilter(filters) {
  document.querySelector("#selected-filters-wrapper").innerHTML = ``;
  let allCheckedFilters = filters;

  let htnlTemplate = ``;
  for (let filter of allCheckedFilters) {
    htnlTemplate = `
    <input
    onclick="removeFilterChecked(this.value, event)"
    id="checked_browse_${filter}"
    type="checkbox"
    value="${filter}"
    checked
    hidden
  />  
  <label  class="btn-tertiary inline-block mt12 mb-1 mr-1 transition-colors duration-200" for="checked_browse_${filter}">${filter} X</label>  
    `;
    document.querySelector("#selected-filters-wrapper").innerHTML +=
      htnlTemplate;
  }
  // console.log("appended filters", allCheckedFilters);
}
// end of block

function showFiltersPage() {
  document.querySelector("#filters-wrapper").classList.toggle("left-full");
  document.querySelector("#filters-wrapper").classList.toggle("left-0");
}
function removeDuplicates(array) {
  let arrayToValidate = array;
  for (let index = 0; index < arrayToValidate.length; index++) {
    const element = arrayToValidate[index];
    for (let i = 0; i < arrayToValidate.length; i++) {
      const elementInside = array[i];
      if (element.post_id === elementInside.post_id && index != i) {
        arrayToValidate.splice(i, 1);
      } else if (index === i) {
        // console.log("Removed post with id and position", "id:", element.post_id, "position:", i + 1);
      }
    }
  }
}
function removeFilterChecked(value, event) {
  // showFiltersPage();
  resetCheckedFilter(value);
  filterProduct(value, event);
  appendCheckedFilter(_appliedFilters);
  applyFilters();

  // console.log("filters", _appliedFilters);
}

function filterProduct(value, event) {
  let checkboxValue = value;
  if (event.target.checked === true) {
  }
  if (event.target.checked === true && _appliedFilters.length === 0) {
    //actual array
    _appliedFilters.push(checkboxValue);
    //check clicked ones targets
    _clickedFilters.push(event.target);
  }
  // when there is more elemnts in the return array then one do the check
  // of a clicked product if item is different from any other
  // already in the array add that element to the array
  if (event.target.checked === true && _appliedFilters.length >= 1) {
    for (let i = 0; i < _appliedFilters.length; i++) {
      if (checkboxValue !== _appliedFilters[i]) {
        _appliedFilters.push(checkboxValue);
        _clickedFilters.push(event.target);
        // console.log("added filters in if", _appliedFilters, "iterator:", i);
        break;
      } else {
        // console.log("else output", _appliedFilters, "iterator:", i);
      }
    }
  }
  // if the checkbox is unchecked false remove the elemnt form the array
  else if (event.target.checked === false) {
    for (let i = 0; i < _appliedFilters.length; i++) {
      if (checkboxValue === _appliedFilters[i]) {
        _appliedFilters.splice(i, 1);
      }
    }
  }
  // console.log("filters to apply", _appliedFilters);
}

function resetCheckedFilter(value) {
  let checkedFilterValue = value;
  for (const clickedFilter of _clickedFilters) {
    if (checkedFilterValue == clickedFilter.value) {
      clickedFilter.checked = false;
    }
  }
  _clickedFilters;
}

async function resetAllFilters() {
  let allPostsJson = await fetchPosts();
  _clickedFilters.forEach((checkbox) => (checkbox.checked = false));
  _appliedFilters = [];
  // console.log("reset filters", _appliedFilters);
  appendPosts(allPostsJson);
}
function resetAllFiltersAndClose() {
  resetAllFilters();
  _appliedFilters = [];
  appendCheckedFilter(_appliedFilters);
  setTimeout(() => {
    showFiltersPage();
  }, 150);
}
async function applyFilters() {
  let allPostsJson = await fetchPosts();
  _filteredJson = [];
  for (const filter of _appliedFilters) {
    for (const post of allPostsJson) {
      if (filter == post.category || filter == post.diet) {
        _filteredJson.push(post);
        removeDuplicates(_filteredJson);
      }
    }
  }
  // console.log("After all checks", _filteredJson);
  if (_filteredJson.length === 0 && _appliedFilters.length === 0) {
    appendPosts(allPostsJson);
  } else if (_filteredJson.length === 0 && _appliedFilters.length !== 0) {
    document.querySelector(
      "#posts-feed-container"
    ).innerHTML = ` <div class="w-full mt-20 flex flex-col justify-center items-center text-center">
    <img class=" w-2/3" src="./src/media/icons/no-results.svg" alt="No results icon" />
    <h3>No results to show</h3>
    <p>Please, check spelling or try different keyword</p>
   </div>`;
  } else {
    appendPosts(_filteredJson);
  }
}
function applyFiltersAndClose() {
  applyFilters();
  appendCheckedFilter(_appliedFilters);
  showFiltersPage();
}
