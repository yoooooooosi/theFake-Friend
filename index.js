const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const SHOW_URL = BASE_URL + "/api/v1/users/";

const users = [];
let fliterUserList = [];
const datapanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator");
const searchform = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const USER_PER_PAGE = 12;

function renderUserList(data) {
  let rawHTML = "";
  // 現在data中的值是陣列，因此需要將每個值拉出來
  // 利用foreach將陣列中每一個元素拉出來
  data.forEach((item) => {
    rawHTML += `
          <div class="col-sm-3">
          <div class="mb-2">
            <div class="card" style="width: 18rem">
              <img
                src="${item.avatar}"
                class="card-img-top"
                alt="user-poster"
                data-bs-toggle="modal"
                data-bs-target="#user-modal"
                data-id=${item.id}
              />
              <div class="card-body">
                <p class="card-text">${item.name} ${item.surname}</p>
              </div>
            </div>
          </div>
        </div>`;
  });

  datapanel.innerHTML = rawHTML;
}

function renderPaginatorList(amount) {
  //計算
  const numberOfPage = Math.ceil(amount / USER_PER_PAGE);
  let rawHTML = "";

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
}

//點擊後利用第二個axios來搜尋特定圖片的相關資料
function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title");
  const modalId = document.querySelector("#user-modal-id");
  const modalName = document.querySelector("#user-modal-name");
  const modalSurname = document.querySelector("#user-modal-surname");
  const modalEmail = document.querySelector("#user-modal-email");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalAge = document.querySelector("#user-modal-age");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalBirthday = document.querySelector("#user-modal-birthday");
  const modalAvatar = document.querySelector("#user-modal-avatar");

  axios.get(SHOW_URL + id).then((response) => {
    const data = response.data;

    modalTitle.innerHTML = data.name + data.surname;
    modalName.innerHTML = `name : ${data.name} `;
    modalSurname.innerHTML = `surname : ${data.surname}`;
    modalId.innerHTML = `id : ${data.id}`;
    modalEmail.innerHTML = `email : ${data.email} `;
    modalGender.innerHTML = `gender : ${data.gender}`;
    modalAge.innerHTML = `age : ${data.age} `;
    modalRegion.innerHTML = `region : ${data.region} `;
    modalBirthday.innerHTML = `birthday : ${data.birthday} `;
    modalAvatar.innerHTML = `avatar : ${data.avatar} `;
  });
}

//要了解每頁有哪些user
function getUserByPage(page) {
  //page 1 -> user 0 - 11
  //page 2 -> user 12 - 23
  //page 3 -> user 24 - 35
  //...

  const deta = fliterUserList.length ? fliterUserList : users;

  const startIndex = (page - 1) * USER_PER_PAGE;
  return deta.slice(startIndex, startIndex + USER_PER_PAGE);
}

//觸發點擊單個資料
datapanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".card-img-top")) {
    // console.log(event.target.dataset.id);
    console.log("ggggggg");
    showUserModal(Number(event.target.dataset.id));
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return; //點及不是<a></a>

  const page = Number(event.target.dataset.page);
  renderUserList(getUserByPage(page));
});

searchform.addEventListener("submit", function onSearchFormSubmitted(event) {
  //打入INPUT值時，要如何將值使USERS陣列去不斷地搜尋
  //使用filter
  event.preventDefault();

  const keyword = searchInput.value.trim().toLowerCase();

  console.log("hhhhh");

  fliterUserList = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  );

  if (fliterUserList.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的user`);
  }

  //將畫面重新渲染
  renderPaginatorList(fliterUserList.length);
  renderUserList(getUserByPage(1));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    // 將回應值(response)一個一個傳入users陣列中
    console.log(...response.data.results);
    users.push(...response.data.results);

    renderPaginatorList(users.length);
    renderUserList(getUserByPage(1));
  })
  .catch((err) => console.log(err));
