const container = document.querySelector('.container')
const content = container.querySelector('.content__search')
const searchField = container.querySelector('.search')
const searchAutocompletion = container.querySelector('.search__autocom')

function debounce(callback, ms) {
  let DelayId = null
  return (...args) => {
    clearTimeout(DelayId)
    DelayId = setTimeout(() => callback(args), ms)
  }
}

function search() {
  let searchStr = searchField.value
  let dataArray = []
  searchAutocompletion.innerHTML = `<ul class="search__list"></ul>`
  const ul = searchAutocompletion.firstChild
  if (searchStr) {
    request(searchStr)
      .then((data) => {
        data.items.forEach((item, i) => {
          dataArray[i] = `<li class="search__item">${item.name}</li>`
        })
        ul.innerHTML = dataArray.join('')
        const allItems = ul.querySelectorAll('.search__item')
        select(allItems, data, repoList)
      })
      .catch((err) => console.log(err))
  } else {
    ul.remove()
  }
}

function select(collection, data, callback) {
  for (item of collection) {
    item.addEventListener('click', (e) => {
      callback(e.target.textContent, data)
      searchField.value = ''
    })
  }
}

function repoList(repoName, data) {
  const repos = document.createElement('div')
  const closeBtn = document.createElement('button')
  const wrapper = document.createElement('div')
  const img = document.createElement('img')
  wrapper.className = 'content__wrapper'
  closeBtn.className = 'close-button'
  img.className = 'close-button__image'
  img.setAttribute('src', './img/close-button.svg')
  repos.className = 'content__out'
  data.items.forEach((item) => {
    if (item.name === repoName) {
      wrapper.innerHTML = `<p>Name: ${item.name}</br>
                          Owner: ${item.owner.login}</br>
                          Stars: ${item.stargazers_count}</p>`
    }
  })
  repos.appendChild(wrapper)
  repos.appendChild(closeBtn)
  closeBtn.append(img)
  content.append(repos)
  closeBtn.addEventListener('click', (e) => {
    repos.remove()
  })
}

searchField.addEventListener('input', debounce(search, 500))

async function request(searchString) {
  const data = await fetch(
    `https://api.github.com/search/repositories?q=${searchString}&per_page=5`
  )
  if (data.ok) {
    return await data.json()
  } else {
    throw new Error('Error Http request ' + data.status)
  }
}
